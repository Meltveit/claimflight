import { GoogleGenAI } from "@google/genai";
import { FlightDetails, PassengerDetails } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateClaimLetter = async (
  flight: FlightDetails,
  passenger: PassengerDetails,
  regulation: string,
  amount: number,
  currency: string
): Promise<string> => {
  
  const timeDetails = flight.scheduledDepartureTime && flight.scheduledArrivalTime 
      ? `- Scheduled Times: ${flight.scheduledDepartureTime} (Departure) - ${flight.scheduledArrivalTime} (Arrival)` 
      : '';
  
  const reasonDetail = flight.delayReason && flight.delayReason !== 'Unknown' 
      ? `- Specific Reason for Disruption: ${flight.delayReason}` 
      : '';

  const prompt = `
    Act as a specialized aviation lawyer. Write a formal, legally robust letter of claim for flight compensation 
    pursuant to Regulation ${regulation}.
    
    Details:
    - Passenger: ${passenger.firstName} ${passenger.lastName}
    - Booking Ref: ${passenger.bookingReference}
    - Airline: ${flight.airline}
    - Flight: ${flight.flightNumber}
    - Date: ${flight.date}
    - Route: ${flight.departure} to ${flight.arrival}
    ${timeDetails}
    - Incident: ${flight.status} (${flight.delayDurationMinutes} min delay)
    ${reasonDetail}
    - Compensation Demanded: ${currency}${amount} per passenger.

    Instructions:
    1. Search for the **specific claims email address** or **postal address** for ${flight.airline} specifically for EU261/UK261 claims. 
    2. Search for the specific Dispute Resolution Body (ADR) that handles ${flight.airline}.
    3. Include these specific contact details in the letter header or footer.
    4. Cite relevant case law (e.g., Sturgeon v Condor) if applicable.
    5. If a delay reason is provided above, argue why it does not constitute an "extraordinary circumstance" if applicable, or state that the airline has failed to prove it is extraordinary.
    6. Use a firm but professional tone.
    7. Demand payment within 14 days.
    
    Format the output as a clean legal letter.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }] // Enable search to find the correct airline address
      }
    });

    let text = response.text || "Error generating letter. Please try again.";

    // Append source URLs if available (Requirement for using Search Grounding)
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && chunks.length > 0) {
        const uniqueUrls = [...new Set(chunks.map(c => c.web?.uri).filter(u => u))];
        if (uniqueUrls.length > 0) {
            text += `\n\n---\nSources for Airline Contact Info:\n${uniqueUrls.map(u => `- ${u}`).join('\n')}`;
        }
    }

    return text;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return "Failed to generate legal letter due to an API error. Please try again later.";
  }
};