
import { GoogleGenAI } from "@google/genai";
import { MarketData, AnalysisResult, Language } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMarketAnalysis = async (market: MarketData, score: number, language: Language = 'en'): Promise<AnalysisResult> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("No API Key");
    }

    const langInstruction = language === 'ko' 
      ? "Provide the response in Korean." 
      : "Provide the response in English.";

    const prompt = `
      Act as a DeFi analyst for Pendle Finance.
      Analyze the following Yield Token (YT) market opportunity:
      
      Project: ${market.protocol} (${market.name})
      Symbol: ${market.symbol}
      Implied APY (Market Price of Yield): ${market.impliedAPY}%
      Underlying APY (Real Yield): ${market.underlyingAPY}%
      Days to Maturity: ${Math.ceil((market.expiry.getTime() - new Date().getTime()) / (86400000))} days
      7-Day APY Trend: ${market.historicalUnderlyingAPY.join(', ')}
      Calculated Investment Score: ${score}/100

      ${langInstruction}
      
      Provide a JSON response with two fields:
      1. "description": A 1-sentence explanation of what this protocol does.
      2. "aiVerdict": A concise 2-sentence strategic comment on why the score is ${score}. Mention the spread between Underlying and Implied APY, and the maturity risk/benefit.

      Do not include markdown formatting like \`\`\`json. Just return the raw JSON string.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return getDefaultAnalysis(market, score, language);

    const json = JSON.parse(text);
    return {
      description: json.description || `Protocol for ${market.symbol}`,
      aiVerdict: json.aiVerdict || `Score based on APY spread of ${(market.underlyingAPY - market.impliedAPY).toFixed(2)}%.`
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return getDefaultAnalysis(market, score, language);
  }
};

const getDefaultAnalysis = (market: MarketData, score: number, language: Language): AnalysisResult => {
  const spread = (market.underlyingAPY - market.impliedAPY).toFixed(2);
  if (language === 'ko') {
    return {
      description: `${market.protocol}은(는) ${market.symbol} 자산을 포함합니다.`,
      aiVerdict: `계산된 점수는 ${score}점입니다. 기초 APY와 내재 APY의 차이는 ${spread}%입니다.`
    };
  }
  return {
    description: `${market.protocol} involves ${market.symbol} assets.`,
    aiVerdict: `Calculated score is ${score}. The spread between Underlying and Implied APY is ${spread}%.`
  };
};
