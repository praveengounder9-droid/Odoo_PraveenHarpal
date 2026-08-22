import type { Trip, TripStop, TripActivity } from '../../types';
import { INITIAL_TRIPS, INITIAL_CITIES } from '../mockData';
import { apiClient } from './apiClient';

const STORAGE_KEY_TRIPS = 'globetrotter_trips';

function getLocalTrips(): Trip[] {
  const str = localStorage.getItem(STORAGE_KEY_TRIPS);
  if (!str) {
    localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(INITIAL_TRIPS));
    return INITIAL_TRIPS;
  }
  return JSON.parse(str);
}

function saveLocalTrips(trips: Trip[]): void {
  localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(trips));
}

export const tripsService = {
  async getTrips(): Promise<Trip[]> {
    return apiClient.get('/trips', () => getLocalTrips());
  },

  async getTripById(id: string): Promise<Trip | null> {
    return apiClient.get(`/trips/${id}`, () => {
      const trips = getLocalTrips();
      return trips.find(t => t.id === id) || null;
    });
  },

  async createTrip(tripData: Omit<Trip, 'id' | 'createdAt' | 'stops' | 'shareToken'>): Promise<Trip> {
    return apiClient.post('/trips', tripData, () => {
      const trips = getLocalTrips();
      const newTrip: Trip = {
        ...tripData,
        id: `trp-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        stops: [],
        shareToken: `share-token-${Date.now()}`,
      };
      trips.unshift(newTrip);
      saveLocalTrips(trips);
      return newTrip;
    });
  },

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    return apiClient.put(`/trips/${id}`, updates, () => {
      const trips = getLocalTrips();
      const idx = trips.findIndex(t => t.id === id);
      if (idx === -1) throw new Error('Trip not found');
      trips[idx] = { ...trips[idx], ...updates };
      saveLocalTrips(trips);
      return trips[idx];
    });
  },

  async deleteTrip(id: string): Promise<boolean> {
    return apiClient.delete(`/trips/${id}`, () => {
      let trips = getLocalTrips();
      trips = trips.filter(t => t.id !== id);
      saveLocalTrips(trips);
      return true;
    });
  },

  // Stop Management
  async addStop(tripId: string, cityId: string, startDate: string, endDate: string): Promise<Trip> {
    return apiClient.post(`/trips/${tripId}/stops`, { cityId, startDate, endDate }, () => {
      const trips = getLocalTrips();
      const trip = trips.find(t => t.id === tripId);
      if (!trip) throw new Error('Trip not found');

      const city = INITIAL_CITIES.find(c => c.id === cityId);
      if (!city) throw new Error('City not found');

      const newStop: TripStop = {
        id: `stp-${Date.now()}`,
        tripId,
        cityId,
        cityName: city.name,
        country: city.country,
        coverImage: city.coverImage,
        startDate,
        endDate,
        orderIndex: trip.stops.length,
        activities: [],
        stayCost: city.averageDailyCost * 3,
        transportCost: 150,
      };

      trip.stops.push(newStop);
      saveLocalTrips(trips);
      return trip;
    });
  },

  async removeStop(tripId: string, stopId: string): Promise<Trip> {
    return apiClient.delete(`/trips/${tripId}/stops/${stopId}`, () => {
      const trips = getLocalTrips();
      const trip = trips.find(t => t.id === tripId);
      if (!trip) throw new Error('Trip not found');

      trip.stops = trip.stops.filter(s => s.id !== stopId);
      trip.stops.forEach((s, i) => s.orderIndex = i);
      saveLocalTrips(trips);
      return trip;
    });
  },

  async reorderStops(tripId: string, stopIdsInOrder: string[]): Promise<Trip> {
    return apiClient.put(`/trips/${tripId}/stops/reorder`, { stopIdsInOrder }, () => {
      const trips = getLocalTrips();
      const trip = trips.find(t => t.id === tripId);
      if (!trip) throw new Error('Trip not found');

      const stopMap = new Map(trip.stops.map(s => [s.id, s]));
      const newStops: TripStop[] = [];

      stopIdsInOrder.forEach((id, idx) => {
        const stop = stopMap.get(id);
        if (stop) {
          stop.orderIndex = idx;
          newStops.push(stop);
        }
      });

      trip.stops = newStops;
      saveLocalTrips(trips);
      return trip;
    });
  },

  // Activity Assignment
  async addActivityToStop(tripId: string, stopId: string, activityData: Omit<TripActivity, 'id' | 'stopId' | 'completed'>): Promise<Trip> {
    return apiClient.post(`/trips/${tripId}/stops/${stopId}/activities`, activityData, () => {
      const trips = getLocalTrips();
      const trip = trips.find(t => t.id === tripId);
      if (!trip) throw new Error('Trip not found');

      const stop = trip.stops.find(s => s.id === stopId);
      if (!stop) throw new Error('Stop not found');

      const newAct: TripActivity = {
        ...activityData,
        id: `tact-${Date.now()}`,
        stopId,
        completed: false,
      };

      stop.activities.push(newAct);
      saveLocalTrips(trips);
      return trip;
    });
  },

  async removeActivityFromStop(tripId: string, stopId: string, activityId: string): Promise<Trip> {
    return apiClient.delete(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`, () => {
      const trips = getLocalTrips();
      const trip = trips.find(t => t.id === tripId);
      if (!trip) throw new Error('Trip not found');

      const stop = trip.stops.find(s => s.id === stopId);
      if (!stop) throw new Error('Stop not found');

      stop.activities = stop.activities.filter(a => a.id !== activityId);
      saveLocalTrips(trips);
      return trip;
    });
  }
};
