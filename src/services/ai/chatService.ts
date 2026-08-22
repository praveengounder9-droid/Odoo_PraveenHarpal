import { retrievalService } from './retrievalService';
import { contextBuilder } from './contextBuilder';
import { geminiService } from './geminiService';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: Array<{
    type: string;
    title: string;
    detail: string;
  }>;
}

export const chatService = {
  /**
   * Main RAG Chat Execution Pipeline
   */
  async sendMessage(userId: string, activeTripId: string | undefined, userQuery: string): Promise<ChatMessage> {
    if (!userQuery.trim()) {
      throw new Error('Message cannot be empty');
    }

    // Step 1 & 2: RAG Data Retrieval & Authorization Verification
    const retrievedData = await retrievalService.retrieveContextForQuery(userId, activeTripId, userQuery);

    // Step 3: Context Building
    const llmContext = contextBuilder.buildLlmContext(retrievedData);

    // Step 4: Gemini LLM Execution
    const aiAnswer = await geminiService.generateGroundedResponse(userQuery, llmContext);

    // Step 5: Format Source Metadata for Hackathon Demonstration
    const sources = retrievedData ? [
      { type: 'trip', title: `Trip: ${retrievedData.tripName}`, detail: `Status: ${retrievedData.status}` },
      { type: 'stops', title: `Stops: ${retrievedData.stops.map(s => s.cityName).join(', ')}`, detail: `${retrievedData.stops.length} Cities` },
      ...(retrievedData.financialSummary ? [{ type: 'budget', title: `Budget: $${retrievedData.financialSummary.totalEstimatedBudget}`, detail: `Spent: $${retrievedData.financialSummary.totalActualCost}` }] : [])
    ] : [];

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: aiAnswer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources
    };
  }
};
