import type { ExpenseSummary, Trip } from '../../types';
import { tripsService } from './tripsService';
import { apiClient } from './apiClient';

export const budgetService = {
  async getBudgetBreakdown(tripId: string): Promise<ExpenseSummary> {
    return apiClient.get(`/trips/${tripId}/budget`, async () => {
      const trip: Trip | null = await tripsService.getTripById(tripId);
      if (!trip) {
        return {
          totalEstimatedBudget: 0,
          totalActualCost: 0,
          byCategory: { transport: 0, accommodation: 0, activities: 0, meals: 0, other: 0 },
          dailyExpenses: []
        };
      }

      let transportCost = 0;
      let accommodationCost = 0;
      let activitiesCost = 0;
      let mealsEstimate = 0;
      let totalDaysCount = 0;

      const dailyExpensesMap: Map<string, { cityName: string; amount: number }> = new Map();

      trip.stops.forEach(stop => {
        transportCost += stop.transportCost;
        accommodationCost += stop.stayCost;

        const start = new Date(stop.startDate);
        const end = new Date(stop.endDate);
        const diffTime = Math.max(1000 * 60 * 60 * 24, end.getTime() - start.getTime());
        const daysInStop = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        totalDaysCount += daysInStop;

        mealsEstimate += daysInStop * 45;

        stop.activities.forEach(act => {
          activitiesCost += act.cost;
        });

        const stopDailyBaseCost = (stop.stayCost + (daysInStop * 45)) / daysInStop;
        for (let d = 0; d < daysInStop; d++) {
          const currentDayDate = new Date(start);
          currentDayDate.setDate(currentDayDate.getDate() + d);
          const dateStr = currentDayDate.toISOString().split('T')[0];

          let dayTotal = stopDailyBaseCost;
          if (d === 0) dayTotal += stop.transportCost;
          if (d < stop.activities.length) dayTotal += stop.activities[d].cost;

          dailyExpensesMap.set(dateStr, {
            cityName: stop.cityName,
            amount: Math.round(dayTotal)
          });
        }
      });

      const totalActualCost = transportCost + accommodationCost + activitiesCost + mealsEstimate;
      const targetDailyLimit = totalDaysCount > 0 ? Math.round(trip.estimatedBudget / totalDaysCount) : 200;

      const dailyExpenses = Array.from(dailyExpensesMap.entries()).map(([date, data], index) => {
        return {
          date,
          dayLabel: `Day ${index + 1}`,
          cityName: data.cityName,
          amount: data.amount,
          budgetLimit: targetDailyLimit,
          isOverBudget: data.amount > targetDailyLimit,
        };
      });

      return {
        totalEstimatedBudget: trip.estimatedBudget,
        totalActualCost,
        byCategory: {
          transport: transportCost,
          accommodation: accommodationCost,
          activities: activitiesCost,
          meals: mealsEstimate,
          other: 100,
        },
        dailyExpenses,
      };
    });
  }
};
