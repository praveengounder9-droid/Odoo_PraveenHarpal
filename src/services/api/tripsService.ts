import type { Trip, TripStop, TripActivity } from '../../types';
import { INITIAL_CITIES } from '../mockData';
import { apiClient } from './apiClient';
import { getCurrentUserIdFromSession } from './authService';

const STORAGE_KEY_TRIPS_DB = 'globetrotter_trips_db';

export const PRESEEDED_TRIPS: Trip[] = [
  // User A (Rahul Kumar) Trips
  {
    id: 'trp-euro-2026',
    userId: 'usr-rahul',
    name: 'Grand European Escape',
    description: 'A two-week multi-city exploration of Paris romantic art scene and Rome’s ancient monuments.',
    startDate: '2026-09-10',
    endDate: '2026-09-24',
    estimatedBudget: 3500,
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    status: 'upcoming',
    createdAt: '2026-08-01',
    isPublic: true,
    shareToken: 'share-euro-2026-token',
    stops: [
      {
        id: 'stp-1',
        tripId: 'trp-euro-2026',
        cityId: 'cty-paris',
        cityName: 'Paris',
        country: 'France',
        coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
        startDate: '2026-09-10',
        endDate: '2026-09-16',
        orderIndex: 0,
        stayCost: 900,
        transportCost: 350,
        activities: [
          {
            id: 'tact-1',
            stopId: 'stp-1',
            activityId: 'act-5',
            name: 'Eiffel Tower Summit Access & Champagne',
            category: 'Sightseeing',
            startTime: '10:00 AM',
            durationHours: 2.5,
            cost: 55,
            description: 'Ascend to the summit for panoramic views',
            coverImage: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
            completed: false,
          },
          {
            id: 'tact-2',
            stopId: 'stp-1',
            activityId: 'act-6',
            name: 'Louvre Museum Timed Masterpiece Tour',
            category: 'Culture',
            startTime: '02:00 PM',
            durationHours: 3.0,
            cost: 45,
            description: 'Mona Lisa and classical statues',
            coverImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
            completed: false,
          }
        ]
      },
      {
        id: 'stp-2',
        tripId: 'trp-euro-2026',
        cityId: 'cty-rome',
        cityName: 'Rome',
        country: 'Italy',
        coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
        startDate: '2026-09-17',
        endDate: '2026-09-24',
        orderIndex: 1,
        stayCost: 800,
        transportCost: 180,
        activities: [
          {
            id: 'tact-4',
            stopId: 'stp-2',
            activityId: 'act-8',
            name: 'Colosseum & Roman Forum VIP Access',
            category: 'Sightseeing',
            startTime: '09:30 AM',
            durationHours: 3.0,
            cost: 50,
            description: 'Arena floor gladiator view',
            coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
            completed: false,
          }
        ]
      }
    ]
  },
  // User B (Priya Sharma) Trips
  {
    id: 'trp-japan-spring',
    userId: 'usr-priya',
    name: 'Japan Cherry Blossom Odyssey',
    description: 'Immersive dive into Tokyo night culture and Kyoto traditional serenity during spring blossom season.',
    startDate: '2026-04-01',
    endDate: '2026-04-12',
    estimatedBudget: 2800,
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    status: 'completed',
    createdAt: '2026-02-10',
    isPublic: true,
    shareToken: 'share-japan-spring-token',
    stops: [
      {
        id: 'stp-3',
        tripId: 'trp-japan-spring',
        cityId: 'cty-tokyo',
        cityName: 'Tokyo',
        country: 'Japan',
        coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
        startDate: '2026-04-01',
        endDate: '2026-04-06',
        orderIndex: 0,
        stayCost: 750,
        transportCost: 200,
        activities: [
          {
            id: 'tact-6',
            stopId: 'stp-3',
            activityId: 'act-1',
            name: 'Shinjuku Gyoen National Garden & Tea Ceremony',
            category: 'Culture',
            startTime: '10:00 AM',
            durationHours: 2.5,
            cost: 25,
            description: 'Cherry blossom viewing',
            coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
            completed: true,
          }
        ]
      }
    ]
  }
];

function getTripsDB(): Trip[] {
  const str = localStorage.getItem(STORAGE_KEY_TRIPS_DB);
  if (!str) {
    localStorage.setItem(STORAGE_KEY_TRIPS_DB, JSON.stringify(PRESEEDED_TRIPS));
    return PRESEEDED_TRIPS;
  }
  return JSON.parse(str);
}

function saveTripsDB(trips: Trip[]): void {
  localStorage.setItem(STORAGE_KEY_TRIPS_DB, JSON.stringify(trips));
}

export const tripsService = {
  // Returns ONLY trips belonging to the authenticated user
  async getTrips(): Promise<Trip[]> {
    return apiClient.get('/trips', () => {
      const currentUserId = getCurrentUserIdFromSession();
      const allTrips = getTripsDB();
      return allTrips.filter(t => t.userId === currentUserId);
    });
  },

  async getTripById(id: string): Promise<Trip | null> {
    return apiClient.get(`/trips/${id}`, () => {
      const currentUserId = getCurrentUserIdFromSession();
      const allTrips = getTripsDB();
      // Allow retrieval if owned by current user OR if public shared trip
      return allTrips.find(t => t.id === id && (t.userId === currentUserId || t.isPublic)) || null;
    });
  },

  async createTrip(tripData: Omit<Trip, 'id' | 'createdAt' | 'stops' | 'shareToken' | 'userId'>): Promise<Trip> {
    return apiClient.post('/trips', tripData, () => {
      const currentUserId = getCurrentUserIdFromSession();
      const allTrips = getTripsDB();
      const newTrip: Trip = {
        ...tripData,
        id: `trp-${Date.now()}`,
        userId: currentUserId,
        createdAt: new Date().toISOString().split('T')[0],
        stops: [],
        shareToken: `share-token-${Date.now()}`,
      };
      allTrips.unshift(newTrip);
      saveTripsDB(allTrips);
      return newTrip;
    });
  },

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    return apiClient.put(`/trips/${id}`, updates, () => {
      const currentUserId = getCurrentUserIdFromSession();
      const allTrips = getTripsDB();
      const idx = allTrips.findIndex(t => t.id === id);
      if (idx === -1) throw new Error('Trip not found');
      
      // Backend security ownership verification
      if (allTrips[idx].userId !== currentUserId) {
        throw new Error('Unauthorized: You do not own this trip');
      }

      allTrips[idx] = { ...allTrips[idx], ...updates };
      saveTripsDB(allTrips);
      return allTrips[idx];
    });
  },

  async deleteTrip(id: string): Promise<boolean> {
    return apiClient.delete(`/trips/${id}`, () => {
      const currentUserId = getCurrentUserIdFromSession();
      let allTrips = getTripsDB();
      const target = allTrips.find(t => t.id === id);
      if (target && target.userId !== currentUserId) {
        throw new Error('Unauthorized: You do not own this trip');
      }

      allTrips = allTrips.filter(t => t.id !== id);
      saveTripsDB(allTrips);
      return true;
    });
  },

  // Stop Management
  async addStop(
    tripId: string,
    cityIdOrName: string,
    startDate: string,
    endDate: string,
    geoData?: {
      lat?: number;
      lng?: number;
      country?: string;
      displayName?: string;
      category?: string;
      cityName?: string;
    }
  ): Promise<Trip> {
    return apiClient.post(`/trips/${tripId}/stops`, { cityIdOrName, startDate, endDate, geoData }, () => {
      const currentUserId = getCurrentUserIdFromSession();
      const allTrips = getTripsDB();
      const trip = allTrips.find(t => t.id === tripId);
      if (!trip) throw new Error('Trip not found');
      if (trip.userId !== currentUserId) throw new Error('Unauthorized');

      const knownCity = INITIAL_CITIES.find(c => c.id === cityIdOrName || c.name.toLowerCase() === cityIdOrName.toLowerCase());

      const cityName = geoData?.cityName || knownCity?.name || cityIdOrName;
      const country = geoData?.country || knownCity?.country || 'World';
      const coverImage = knownCity?.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

      const newStop: TripStop = {
        id: `stp-${Date.now()}`,
        tripId,
        cityId: knownCity?.id || `geo-${Date.now()}`,
        cityName,
        country,
        coverImage,
        startDate,
        endDate,
        orderIndex: trip.stops.length,
        lat: geoData?.lat,
        lng: geoData?.lng,
        displayName: geoData?.displayName,
        category: geoData?.category,
        activities: [],
        stayCost: knownCity ? knownCity.averageDailyCost * 3 : 300,
transportCost: 150,
      };

      trip.stops.push(newStop);
      saveTripsDB(allTrips);
      return trip;
    });
  },

  async removeStop(tripId: string, stopId: string): Promise<Trip> {
    return apiClient.delete(`/trips/${tripId}/stops/${stopId}`, () => {
      const currentUserId = getCurrentUserIdFromSession();
      const allTrips = getTripsDB();
      const trip = allTrips.find(t => t.id === tripId);
      if (!trip) throw new Error('Trip not found');
      if (trip.userId !== currentUserId) throw new Error('Unauthorized');

      trip.stops = trip.stops.filter(s => s.id !== stopId);
      trip.stops.forEach((s, i) => s.orderIndex = i);
      saveTripsDB(allTrips);
      return trip;
    });
  },

  async reorderStops(tripId: string, stopIdsInOrder: string[]): Promise<Trip> {
    return apiClient.put(`/trips/${tripId}/stops/reorder`, { stopIdsInOrder }, () => {
      const currentUserId = getCurrentUserIdFromSession();
      const allTrips = getTripsDB();
      const trip = allTrips.find(t => t.id === tripId);
      if (!trip) throw new Error('Trip not found');
      if (trip.userId !== currentUserId) throw new Error('Unauthorized');

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
      saveTripsDB(allTrips);
      return trip;
    });
  },

  // Activity Assignment
  async addActivityToStop(tripId: string, stopId: string, activityData: Omit<TripActivity, 'id' | 'stopId' | 'completed'>): Promise<Trip> {
    return apiClient.post(`/trips/${tripId}/stops/${stopId}/activities`, activityData, () => {
      const currentUserId = getCurrentUserIdFromSession();
      const allTrips = getTripsDB();
      const trip = allTrips.find(t => t.id === tripId);
      if (!trip) throw new Error('Trip not found');
      if (trip.userId !== currentUserId) throw new Error('Unauthorized');

      const stop = trip.stops.find(s => s.id === stopId);
      if (!stop) throw new Error('Stop not found');

      const newAct: TripActivity = {
        ...activityData,
        id: `tact-${Date.now()}`,
        stopId,
        completed: false,
      };

      stop.activities.push(newAct);
      saveTripsDB(allTrips);
      return trip;
    });
  },

  async removeActivityFromStop(tripId: string, stopId: string, activityId: string): Promise<Trip> {
    return apiClient.delete(`/trips/${tripId}/stops/${stopId}/activities/${activityId}`, () => {
      const currentUserId = getCurrentUserIdFromSession();
      const allTrips = getTripsDB();
      const trip = allTrips.find(t => t.id === tripId);
      if (!trip) throw new Error('Trip not found');
      if (trip.userId !== currentUserId) throw new Error('Unauthorized');

      const stop = trip.stops.find(s => s.id === stopId);
      if (!stop) throw new Error('Stop not found');

      stop.activities = stop.activities.filter(a => a.id !== activityId);
      saveTripsDB(allTrips);
      return trip;
    });
  }
};
