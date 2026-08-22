import type { Trip, TripStop } from '../../types';
import { tripsService } from '../api/tripsService';
import { budgetService } from '../api/budgetService';

export interface RetrievedContextData {
  userId: string;
  tripId: string;
  tripName: string;
  startDate: string;
  endDate: string;
  status: string;
  estimatedBudget: number;
  currency: string;
  stops: Array<{
    cityName: string;
    country: string;
    startDate: string;
    endDate: string;
    activities: Array<{
      name: string;
      category: string;
      cost: number;
      startTime?: string;
      durationHours?: number;
    }>;
  }>;
  financialSummary?: {
    totalEstimatedBudget: number;
    totalActualCost: number;
    budgetVariance: number;
    byCategory: Record<string, number>;
  };
  queryIntent: 'itinerary' | 'budget' | 'city' | 'general';
}

export const retrievalService = {
  /**
   * RAG Retrieval Layer: Intelligently gathers structured context for the authenticated user
   */
  async retrieveContextForQuery(userId: string, activeTripId?: string, userQuery: string = ''): Promise<RetrievedContextData | null> {
    const userTrips = await tripsService.getTrips();
    if (userTrips.length === 0) return null;

    // Identify target trip (activeTripId or first upcoming/planning trip)
    let targetTrip: Trip | undefined = userTrips.find(t => t.id === activeTripId);
    if (!targetTrip) targetTrip = userTrips[0];

    if (!targetTrip || targetTrip.userId !== userId) return null;

    // Detect Intent
    const qLower = userQuery.toLowerCase();
    let queryIntent: RetrievedContextData['queryIntent'] = 'general';
    if (qLower.includes('budget') || qLower.includes('cost') || qLower.includes('spend') || qLower.includes('expense') || qLower.includes('over')) {
      queryIntent = 'budget';
    } else if (qLower.includes('day') || qLower.includes('today') || qLower.includes('tomorrow') || qLower.includes('itinerary') || qLower.includes('doing')) {
      queryIntent = 'itinerary';
    } else if (qLower.includes('city') || qLower.includes('paris') || qLower.includes('rome') || qLower.includes('tokyo') || qLower.includes('mumbai')) {
      queryIntent = 'city';
    }

    // Retrieve Budget Data if budget intent or general overview
    let financialSummary;
    try {
      const bData = await budgetService.getBudgetBreakdown(targetTrip.id);
      financialSummary = {
        totalEstimatedBudget: bData.totalEstimatedBudget,
        totalActualCost: bData.totalActualCost,
        budgetVariance: bData.totalEstimatedBudget - bData.totalActualCost,
        byCategory: bData.byCategory
      };
    } catch {
      // Ignore if budget calculation encounters no stops
    }

    return {
      userId,
      tripId: targetTrip.id,
      tripName: targetTrip.name,
      startDate: targetTrip.startDate,
      endDate: targetTrip.endDate,
      status: targetTrip.status,
      estimatedBudget: targetTrip.estimatedBudget,
      currency: 'USD',
      stops: targetTrip.stops.map((s: TripStop) => ({
        cityName: s.cityName,
        country: s.country,
        startDate: s.startDate,
        endDate: s.endDate,
        activities: s.activities.map(a => ({
          name: a.name,
          category: a.category,
          cost: a.cost,
          startTime: a.startTime,
          durationHours: a.durationHours
        }))
      })),
      financialSummary,
      queryIntent
    };
  }
};
