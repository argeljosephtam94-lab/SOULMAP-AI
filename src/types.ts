export interface BirthData {
  birthDate: string;
  birthTime?: string;
  birthLocation: string;
  focusArea: 'Love' | 'Career' | 'Money' | 'Life direction';
}

export interface SoulMapInsights {
  title: string;
  personalityTraits: string[];
  relationshipDynamics: string;
  careerAlignment: string;
  growthPhase: string;
  radarData: { subject: string; A: number; fullMark: number }[];
  futureOpportunities: string;
  blindSpots: string[];
}

export interface TarotDraw {
  card: string;
  meaning: string;
  aiAdvice: string;
}

export interface DailyGuidance {
  zodiacSign: string;
  horoscope: string;
  focusToday: string;
  avoidToday: string;
  tarot: TarotDraw;
}
