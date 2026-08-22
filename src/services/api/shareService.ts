import type { Trip } from '../../types';
import { tripsService } from './tripsService';
import { apiClient } from './apiClient';

export const shareService = {
  async getPublicTripByToken(shareToken: string): Promise<Trip | null> {
    return apiClient.get(`/share/trip/${shareToken}`, async () => {
      const trips = await tripsService.getTrips();
      return trips.find(t => t.shareToken === shareToken || t.id === shareToken) || null;
    });
  },

  async copyTripToUserAccount(tripId: string): Promise<Trip> {
    return apiClient.post(`/share/trip/${tripId}/copy`, {}, async () => {
      const sourceTrip = await tripsService.getTripById(tripId);
      if (!sourceTrip) throw new Error('Trip not found');

      const copiedTrip = await tripsService.createTrip({
        name: `${sourceTrip.name} (Copy)`,
        description: sourceTrip.description,
        startDate: sourceTrip.startDate,
        endDate: sourceTrip.endDate,
        estimatedBudget: sourceTrip.estimatedBudget,
        coverImage: sourceTrip.coverImage,
        status: 'planning',
        isPublic: false,
      });

      for (const stop of sourceTrip.stops) {
        const addedTrip = await tripsService.addStop(copiedTrip.id, stop.cityId, stop.startDate, stop.endDate);
        const newStop = addedTrip.stops[addedTrip.stops.length - 1];
        if (newStop) {
          for (const act of stop.activities) {
            await tripsService.addActivityToStop(copiedTrip.id, newStop.id, {
              name: act.name,
              category: act.category,
              startTime: act.startTime,
              durationHours: act.durationHours,
              cost: act.cost,
              description: act.description,
              coverImage: act.coverImage,
            });
          }
        }
      }

      return (await tripsService.getTripById(copiedTrip.id))!;
    });
  }
};
