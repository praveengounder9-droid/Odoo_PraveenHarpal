import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Trip, TripActivity } from '../types';
import { tripsService } from '../services/api/tripsService';

interface TripContextType {
  trips: Trip[];
  activeTrip: Trip | null;
  activeTripId: string | null;
  isLoading: boolean;
  setActiveTripId: (id: string | null) => void;
  refreshTrips: () => Promise<void>;
  createTrip: (data: Omit<Trip, 'id' | 'createdAt' | 'stops' | 'shareToken'>) => Promise<Trip>;
  updateTrip: (id: string, updates: Partial<Trip>) => Promise<Trip>;
  deleteTrip: (id: string) => Promise<void>;
  addStopToTrip: (
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
  ) => Promise<Trip>;
  removeStopFromTrip: (tripId: string, stopId: string) => Promise<Trip>;
  reorderTripStops: (tripId: string, stopIdsInOrder: string[]) => Promise<Trip>;
  addActivityToStop: (tripId: string, stopId: string, activityData: Omit<TripActivity, 'id' | 'stopId'>) => Promise<Trip>;
  removeActivityFromStop: (tripId: string, stopId: string, activityId: string) => Promise<Trip>;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshTrips = useCallback(async () => {
    try {
      const data = await tripsService.getTrips();
      setTrips(data);
      if (data.length > 0 && !activeTripId) {
        setActiveTripId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load trips', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTripId]);

  useEffect(() => {
    refreshTrips();
  }, []);

  const activeTrip = trips.find(t => t.id === activeTripId) || (trips.length > 0 ? trips[0] : null);

  const createTrip = async (data: Omit<Trip, 'id' | 'createdAt' | 'stops' | 'shareToken'>) => {
    const newTrip = await tripsService.createTrip(data);
    await refreshTrips();
    setActiveTripId(newTrip.id);
    return newTrip;
  };

  const updateTrip = async (id: string, updates: Partial<Trip>) => {
    const updated = await tripsService.updateTrip(id, updates);
    await refreshTrips();
    return updated;
  };

  const deleteTrip = async (id: string) => {
    await tripsService.deleteTrip(id);
    await refreshTrips();
    if (activeTripId === id) {
      const remaining = trips.filter(t => t.id !== id);
      setActiveTripId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const addStopToTrip = async (
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
  ) => {
    const updated = await tripsService.addStop(tripId, cityIdOrName, startDate, endDate, geoData);
    await refreshTrips();
    return updated;
  };

  const removeStopFromTrip = async (tripId: string, stopId: string) => {
    const updated = await tripsService.removeStop(tripId, stopId);
    await refreshTrips();
    return updated;
  };

  const reorderTripStops = async (tripId: string, stopIdsInOrder: string[]) => {
    const updated = await tripsService.reorderStops(tripId, stopIdsInOrder);
    await refreshTrips();
    return updated;
  };

  const addActivityToStop = async (tripId: string, stopId: string, activityData: Omit<TripActivity, 'id' | 'stopId'>) => {
    const updated = await tripsService.addActivityToStop(tripId, stopId, activityData);
    await refreshTrips();
    return updated;
  };

  const removeActivityFromStop = async (tripId: string, stopId: string, activityId: string) => {
    const updated = await tripsService.removeActivityFromStop(tripId, stopId, activityId);
    await refreshTrips();
    return updated;
  };

  return (
    <TripContext.Provider value={{
      trips,
      activeTrip,
      activeTripId,
      isLoading,
      setActiveTripId,
      refreshTrips,
      createTrip,
      updateTrip,
      deleteTrip,
      addStopToTrip,
      removeStopFromTrip,
      reorderTripStops,
      addActivityToStop,
      removeActivityFromStop,
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrips must be used within TripProvider');
  return ctx;
};
