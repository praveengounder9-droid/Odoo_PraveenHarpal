import type { RetrievedContextData } from './retrievalService';

export const contextBuilder = {
  /**
   * Constructs targeted LLM context string from retrieved user trip data
   */
  buildLlmContext(data: RetrievedContextData | null): string {
    if (!data) {
      return '[Context: User has no active trips or itineraries planned yet.]';
    }

    let contextStr = `[RETRIEVED AUTHENTICATED USER TRIP CONTEXT]\n`;
    contextStr += `Trip Name: "${data.tripName}" (Status: ${data.status.toUpperCase()})\n`;
    contextStr += `Dates: ${data.startDate} to ${data.endDate}\n`;
    contextStr += `Target Estimated Budget: $${data.estimatedBudget}\n\n`;

    contextStr += `ITINERARY STOPS & CITIES (${data.stops.length} Cities Configured):\n`;
    data.stops.forEach((stop, idx) => {
      contextStr += `Stop ${idx + 1}: ${stop.cityName}, ${stop.country} (${stop.startDate} to ${stop.endDate})\n`;
      if (stop.activities.length === 0) {
        contextStr += `  - No scheduled activities (Leisure exploration day)\n`;
      } else {
        stop.activities.forEach(act => {
          contextStr += `  - ${act.startTime || '10:00 AM'}: ${act.name} [Category: ${act.category}, Cost: $${act.cost}, Duration: ${act.durationHours || 2}h]\n`;
        });
      }
    });

    if (data.financialSummary) {
      contextStr += `\nFINANCIAL BREAKDOWN & EXPENSE SUMMARY:\n`;
      contextStr += `Total Target Budget: $${data.financialSummary.totalEstimatedBudget}\n`;
      contextStr += `Total Actual Calculated Costs: $${data.financialSummary.totalActualCost}\n`;
      const variance = data.financialSummary.budgetVariance;
      contextStr += `Variance: ${variance >= 0 ? `Under budget by $${variance}` : `Over budget threshold by $${Math.abs(variance)}`}\n`;
      contextStr += `Category Totals:\n`;
      Object.entries(data.financialSummary.byCategory).forEach(([cat, sum]) => {
        contextStr += `  * ${cat}: $${sum}\n`;
      });
    }

    return contextStr;
  }
};
