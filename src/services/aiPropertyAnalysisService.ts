import type { POI } from './geoService';

export interface PropertyAnalysisScores {
  connectivity: number;
  livability: number;
  investmentPotential: number;
  rentalPotential: number;
  commercialActivity: number;
}

export interface PropertyAnalysisResult {
  scores: PropertyAnalysisScores;
  whyThisArea: string[];
  aiRecommendation: string;
}

export function analyzeArea(pois: POI[], locationName: string): PropertyAnalysisResult {
  // Count POIs by category
  const counts = {
    School: 0, Hospital: 0, Park: 0, Market: 0, Bank: 0, Police: 0, College: 0, Transport: 0, Other: 0
  };

  pois.forEach(poi => {
    if (counts[poi.category] !== undefined) {
      counts[poi.category]++;
    }
  });

  // Simple heuristic scoring (0-100) based on POI counts
  const calcScore = (count: number, weight: number, maxExpected: number) => {
    const raw = (count / maxExpected) * 100 * weight;
    return Math.min(Math.round(raw), 98); // Max 98 so it doesn't look completely fake
  };

  // Base scores if no data
  let connectivity = 60;
  let livability = 60;
  let investmentPotential = 65;
  let rentalPotential = 60;
  let commercialActivity = 50;

  if (pois.length > 0) {
    connectivity = 50 + calcScore(counts.Transport + counts.Market, 1.2, 10);
    livability = 50 + calcScore(counts.School + counts.Hospital + counts.Park, 1.5, 15);
    commercialActivity = 40 + calcScore(counts.Market + counts.Bank, 2.0, 15);
    
    // Derived scores
    investmentPotential = Math.round((connectivity * 0.4) + (commercialActivity * 0.4) + (livability * 0.2));
    rentalPotential = Math.round((livability * 0.5) + (connectivity * 0.3) + (counts.College * 5)); // Colleges boost rental
  }

  // Cap scores between 40 and 99
  const cap = (s: number) => Math.max(40, Math.min(99, s));
  
  const scores = {
    connectivity: cap(connectivity),
    livability: cap(livability),
    investmentPotential: cap(investmentPotential),
    rentalPotential: cap(rentalPotential),
    commercialActivity: cap(commercialActivity),
  };

  // Generate 'Why this area' bullet points
  const whyThisArea: string[] = [];
  if (counts.Transport > 0) whyThisArea.push('Public transport access nearby');
  if (counts.School > 0 || counts.College > 0) whyThisArea.push(`Educational institutions nearby (${counts.School + counts.College})`);
  if (counts.Hospital > 0) whyThisArea.push(`Healthcare facilities nearby (${counts.Hospital})`);
  if (counts.Market > 0) whyThisArea.push('Established commercial and shopping activity');
  if (counts.Park > 0) whyThisArea.push('Green spaces and parks in the vicinity');
  if (counts.Bank > 0) whyThisArea.push('Banking and financial services available');

  if (whyThisArea.length === 0) {
    whyThisArea.push('Limited established infrastructure detected in the immediate vicinity.');
  }

  // Generate recommendation text
  let recommendation = '';
  if (pois.length === 0) {
    recommendation = `We couldn't find sufficient infrastructure data for ${locationName}. This could indicate a developing area or limited data coverage.`;
  } else if (scores.investmentPotential > 80 && scores.livability > 80) {
    recommendation = `Based on available data, ${locationName} appears highly suitable for residential investment due to strong livability metrics and established commercial activity.`;
  } else if (scores.commercialActivity > 80) {
    recommendation = `${locationName} shows strong commercial activity, making it potentially attractive for business investments or high-yield rental properties.`;
  } else if (scores.livability > 75) {
    recommendation = `With good access to essential amenities like schools and healthcare, ${locationName} is a solid choice for end-use residential purposes.`;
  } else {
    recommendation = `Data suggests ${locationName} has moderate infrastructure. It may be suitable for long-term holding depending on future development plans.`;
  }

  return {
    scores,
    whyThisArea,
    aiRecommendation: recommendation
  };
}
