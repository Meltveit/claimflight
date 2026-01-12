import { GoogleGenAI, Type } from "@google/genai";
import { FlightDetails, FlightStatus } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Checks flight status using Gemini with Google Search Grounding.
 * Step 1: Search for the flight status in natural language.
 * Step 2: Extract structured data (JSON) from the search result.
 */
export const checkFlightStatus = async (flightNumber: string, date: string): Promise<FlightDetails> => {
  // 1. Search for flight info
  const searchPrompt = `
    Find the actual status of flight ${flightNumber} on ${date}.
    I need:
    1. Airline name
    2. Departure Airport (IATA code)
    3. Arrival Airport (IATA code)
    4. Status (Landed, Delayed, Cancelled)
    5. Delay duration in minutes (if any, otherwise 0)
    6. Approximate flight distance in km.
    7. Scheduled Departure Time (local time, e.g. 14:30)
    8. Scheduled Arrival Time (local time, e.g. 18:45)
    9. Specific reason for delay/cancellation if mentioned (e.g. Technical issue, Weather, Crew, Strike).
    
    If the flight was cancelled, assume the delay is effectively > 180 minutes.
  `;

  try {
      // Step 1: Perform the search
      const searchResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: searchPrompt,
        config: {
            tools: [{ googleSearch: {} }]
        }
      });
      
      const searchResultText = searchResponse.text;

      // Step 2: Extract structured JSON from the search text
      // We do this separately to ensure clean JSON output conforming to the schema
      const extractPrompt = `
        Based on the following text, extract the flight details.
        Text: "${searchResultText}"
      `;
      
      const extractionResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: extractPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    airline: { type: Type.STRING },
                    departure: { type: Type.STRING },
                    arrival: { type: Type.STRING },
                    status: { type: Type.STRING, enum: ["ON_TIME", "DELAYED", "CANCELLED"] },
                    delayDurationMinutes: { type: Type.INTEGER },
                    distanceKm: { type: Type.INTEGER },
                    scheduledDepartureTime: { type: Type.STRING, description: "Format HH:MM" },
                    scheduledArrivalTime: { type: Type.STRING, description: "Format HH:MM" },
                    delayReason: { type: Type.STRING, description: "Reason or 'Unknown'" }
                },
                required: ["airline", "departure", "arrival", "status", "delayDurationMinutes", "distanceKm"]
            }
        }
      });

      const data = JSON.parse(extractionResponse.text || "{}");
      
      // Return structured data, defaulting if extraction was incomplete
      return {
          flightNumber: flightNumber.toUpperCase(),
          date: date,
          airline: data.airline || "Unknown Airline",
          departure: data.departure || "Unknown",
          arrival: data.arrival || "Unknown",
          status: (data.status as FlightStatus) || FlightStatus.ON_TIME,
          delayDurationMinutes: data.delayDurationMinutes || 0,
          distanceKm: data.distanceKm || 0,
          scheduledDepartureTime: data.scheduledDepartureTime,
          scheduledArrivalTime: data.scheduledArrivalTime,
          delayReason: data.delayReason
      };

  } catch (error) {
      console.error("Flight check failed:", error);
      // Graceful fallback if search fails
      return {
        flightNumber: flightNumber.toUpperCase(),
        date: date,
        airline: "Check Failed (Simulated)",
        departure: "Unknown",
        arrival: "Unknown",
        status: FlightStatus.ON_TIME,
        delayDurationMinutes: 0,
        distanceKm: 0,
        delayReason: "Unknown"
      };
  }
};

export const calculateEligibility = (flight: FlightDetails) => {
  if (flight.status === FlightStatus.CANCELLED) {
    return { eligible: true, amount: 600, currency: '€', regulation: 'EU 261/2004' };
  }

  if (flight.status === FlightStatus.DELAYED && flight.delayDurationMinutes >= 180) {
    let amount = 250;
    if (flight.distanceKm > 1500) amount = 400;
    if (flight.distanceKm > 3500) amount = 600;
    
    return { eligible: true, amount, currency: '€', regulation: 'EU 261/2004' };
  }

  return { eligible: false, amount: 0, currency: '€', regulation: 'N/A' };
};