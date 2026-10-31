import type { AdvisorContext, AdvisorResponse } from '../types';
import type { Language } from '../translations/translations';

/**
 * Intelligent Real Estate AI Advisor Engine for PropWise.
 * Simulates high-precision, domain-specific AI analysis across valuations,
 * bylaws, infrastructure forecasts, legal checklists, and investment comparisons
 * with full English, Hindi (हिंदी), and Punjabi (ਪੰਜਾਬੀ) natural language generation.
 */

const generateId = () => `ai-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const MOCK_DELAY = 850;

export const askAdvisor = async (
  message: string,
  context?: AdvisorContext,
  depth: 'fast' | 'deep' = 'deep',
  lang: Language = 'en'
): Promise<AdvisorResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerMsg = message.toLowerCase();
      const hasProperty = !!context?.property;
      
      const locName = context?.selectedLocation?.name 
        ? `${context.selectedLocation.name}, ${context.selectedLocation.city || 'Punjab'}`
        : context?.property?.title || (lang === 'pa' ? 'ਸੈਕਟਰ 82, ਮੋਹਾਲੀ' : (lang === 'hi' ? 'सेक्टर 82, मोहाली' : 'Sector 82, Mohali'));

      const plotArea = context?.plot?.areaSqYd || (context?.property?.area ? context.property.area : 200);

      // 1. Location & Infrastructure Analysis
      if (lowerMsg.includes('location') || lowerMsg.includes('investment') || lowerMsg.includes('area') || lowerMsg.includes('growth') || lowerMsg.includes('forecast') || lowerMsg.includes('future') || lowerMsg.includes('इलाका') || lowerMsg.includes('भविष्य') || lowerMsg.includes('ਇਲਾਕਾ') || lowerMsg.includes('ਵਾਧਾ')) {
        
        let messageText = `### Comprehensive Location & Growth Assessment for **${locName}**\n\n${locName} currently ranks in the **top 8th percentile** for capital appreciation in the tri-city/regional corridor. High commercial spillover and fast-tracked arterial road expansions are driving significant institutional and end-user capital influx.`;
        if (lang === 'hi') {
          messageText = `### **${locName}** की पूरी लोकेशन व विकास रिपोर्ट\n\n**${locName}** इस समय पूरे क्षेत्र में सबसे तेज़ी से बढ़ने वाले शीर्ष इलाकों में शामिल है। एयरपोर्ट रोड, नए कमर्शियल हब और चौड़ी सड़कों के कारण यहाँ अगले 3 सालों में बेहतरीन मुनाफ़े की उम्मीद है।`;
        } else if (lang === 'pa') {
          messageText = `### **${locName}** ਦੀ ਪੂਰੀ ਲੋਕੇਸ਼ਨ ਤੇ ਵਿਕਾਸ ਰਿਪੋਰਟ\n\n**${locName}** ਇਸ ਵੇਲੇ ਇਲਾਕੇ ਦੇ ਸਭ ਤੋਂ ਤੇਜ਼ੀ ਨਾਲ ਵਧਣ ਵਾਲੇ ਚੋਟੀ ਦੇ ਖੇਤਰਾਂ ਵਿੱਚ ਸ਼ਾਮਲ ਹੈ। ਏਅਰਪੋਰਟ ਰੋਡ ਅਤੇ ਨਵੇਂ ਕਮਰਸ਼ੀਅਲ ਪ੍ਰੋਜੈਕਟਾਂ ਕਾਰਨ ਅਗਲੇ 3 ਸਾਲਾਂ ਵਿੱਚ ਇੱਥੇ ਚੰਗੇ ਮੁਨਾਫ਼ੇ ਦੀ ਉਮੀਦ ਹੈ।`;
        }

        resolve({
          id: generateId(),
          type: 'location_analysis',
          message: messageText,
          data: {
            title: lang === 'pa' ? `${locName} ਵਿਕਾਸ ਰਿਪੋਰਟ` : (lang === 'hi' ? `${locName} विकास रिपोर्ट` : `${locName} Growth Intelligence`),
            score: 88,
            verdict: lang === 'pa' ? 'ਤੇਜ਼ੀ ਨਾਲ ਵਾਧਾ ਵਾਲਾ ਖੇਤਰ' : (lang === 'hi' ? 'उच्च विकास कॉरिडोर' : 'High Growth Corridor'),
            metrics: {
              appreciation3Yr: '+22.4%',
              rentalYield: '4.2% - 4.8%',
              infraScore: '9.2 / 10',
              demandLiquidity: lang === 'pa' ? 'ਭਾਰੀ ਮੰਗ' : (lang === 'hi' ? 'उच्च मांग' : 'Very High'),
            },
            summary: lang === 'pa'
              ? 'ਨਵੀਂ 200 ਫੁੱਟ ਰਿੰਗ ਰੋਡ ਅਤੇ ਆਈਟੀ ਹੱਬ ਕਾਰਨ ਇੱਥੇ ਨਿਵੇਸ਼ ਬਹੁਤ ਲਾਭਦਾਇਕ ਹੈ।'
              : (lang === 'hi'
                ? 'नई 200-फुट रिंग रोड और आईटी हब से सीधे जुड़ाव के कारण यहाँ निवेश करना बहुत फ़ायदेमंद है।'
                : 'Accelerated master plan execution, upcoming 200-ft PR-7 ring road access, and proximity to IT clusters position this zone for strong yield.'),
            positives: lang === 'pa' ? [
              'ਏਅਰਪੋਰਟ ਰੋਡ ਅਤੇ ਹਾਈਵੇਅ ਨਾਲ ਸਿੱਧਾ ਸੰਪਰਕ',
              'ਸਾਲਾਨਾ 14% ਦੀ ਦਰ ਨਾਲ ਮੰਗ ਵਿੱਚ ਵਾਧਾ',
              'ਪੁੱਡਾ/ਗਮਾਡਾ ਵੱਲੋਂ ਪਾਸ ਕੀਤੀਆਂ ਚੌੜੀਆਂ ਸੜਕਾਂ ਤੇ ਪਾਰਕ',
              'ਵੱਡੇ ਹਸਪਤਾਲ ਤੇ ਸਕੂਲ 10 ਮਿੰਟ ਦੀ ਦੂਰੀ ਤੇ'
            ] : (lang === 'hi' ? [
              'एयरपोर्ट रोड और नेशनल हाईवे से सीधा सिग्नल-फ्री रास्ता',
              'सालाना 14% की रफ्तार से खरीदारों की मांग में बढ़ोतरी',
              'PUDA / GMADA स्वीकृत चौड़ी सड़कें, सीवरेज व पार्क',
              'अस्पताल, स्कूल और आईटी हब 10 मिनट की दूरी पर'
            ] : [
              'Direct signal-free connectivity to Airport Road & Highway',
              'Sustained 14% annual demand growth among buyers',
              'GMADA/PUDA planned underground cabling, drainage & parks',
              'Hospitals, schools, and IT City within 10–15 min'
            ]),
            considerations: lang === 'pa' ? [
              'ਅਗਲੇ ਸਾਲ ਸਰਕਾਰੀ ਕਲੈਕਟਰ ਰੇਟ 8–10% ਵਧਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ',
              'ਦਫ਼ਤਰੀ ਸਮੇਂ ਦੌਰਾਨ ਮੁੱਖ ਚੌਰਾਹੇ ਉੱਤੇ ਥੋੜ੍ਹਾ ਟ੍ਰੈਫਿਕ'
            ] : (lang === 'hi' ? [
              'आगामी वित्त वर्ष में सरकारी कलेक्टर रेट 8–10% बढ़ने की संभावना',
              'ऑफिस के समय मुख्य चौराहे पर हल्का ट्रैफिक'
            ] : [
              'Circle rates expected to rise 8–10% in upcoming revision',
              'Peak hour traffic at connecting flyover junctions'
            ]),
            upcomingProjects: [
              { name: 'PR-7 Airport Ring Road Expansion', impact: 'High Impact', distance: '1.8 km' },
              { name: 'New Cyber & Tech Innovation Hub', impact: 'Moderate Impact', distance: '3.2 km' },
              { name: 'Integrated Metro/Rapid Transit Line', impact: 'Transformational', distance: '4.5 km' }
            ]
          },
          actions: [
            { 
              label: lang === 'pa' ? '💰 ਇਸ ਇਲਾਕੇ ਦੇ ਰੇਟ ਜਾਣੋ' : (lang === 'hi' ? '💰 इस इलाके का सही दाम जानें' : '💰 Check Property Values'), 
              type: 'followup', 
              target: lang === 'pa' ? 'ਇਸ ਇਲਾਕੇ ਦੇ ਰੇਟ ਅਤੇ ਕਲੈਕਟਰ ਭਾਅ ਦੱਸੋ' : (lang === 'hi' ? 'इस इलाके का सही दाम और कलेक्टर रेट बताएं' : 'Check property values in this area') 
            },
            { 
              label: lang === 'pa' ? '🗺️ ਨਕਸ਼ੇ ਉੱਤੇ ਵੇਖੋ' : (lang === 'hi' ? '🗺️ नक्शे पर देखें' : '🗺️ View on Map'), 
              type: 'navigate', 
              target: 'map' 
            },
            { 
              label: lang === 'pa' ? '🧮 ਜ਼ਮੀਨ ਦਾ ਮੁੱਲ ਕੈਲਕੁਲੇਟਰ' : (lang === 'hi' ? '🧮 ज़मीन का कुल खर्चा कैलकुलेटर' : '🧮 Calculate Land Value'), 
              type: 'navigate', 
              target: 'land-calculator' 
            }
          ]
        });
        return;
      }

      // 2. Property Valuation & Circle Rate Analysis
      if (lowerMsg.includes('worth') || lowerMsg.includes('price') || lowerMsg.includes('valuation') || lowerMsg.includes('rate') || lowerMsg.includes('cost') || lowerMsg.includes('circle rate') || lowerMsg.includes('कीमत') || lowerMsg.includes('दाम') || lowerMsg.includes('रेट') || lowerMsg.includes('ਭਾਅ') || lowerMsg.includes('ਮੁੱਲ')) {
        const askingVal = hasProperty ? (context.property!.price / 10000000) : 1.42;
        const askingRate = hasProperty && context.property?.area ? Math.round(context.property.price / context.property.area) : 71000;
        const circleRate = 38000;

        let messageText = `### Proprietary Valuation Model • **${locName}**\n\nWe analyzed recent registered sale deeds and active registry data to estimate fair intrinsic value. The asking price is well-aligned with market dynamics.`;
        if (lang === 'hi') {
          messageText = `### **${locName}** का सटीक मूल्यांकन व सरकारी रेट\n\nहमने इस इलाके की हाल ही में हुई 140+ रजिस्ट्रियों और सरकारी कलेक्टर रेट के आधार पर जांच की है। मांगा गया दाम बाजार भाव के बिल्कुल अनुकूल है।`;
        } else if (lang === 'pa') {
          messageText = `### **${locName}** ਦਾ ਸਹੀ ਮੁੱਲ ਤੇ ਸਰਕਾਰੀ ਕਲੈਕਟਰ ਭਾਅ\n\nਅਸੀਂ ਇਸ ਇਲਾਕੇ ਦੀਆਂ ਹਾਲੀਆ ਰਜਿਸਟਰੀਆਂ ਅਤੇ ਸਰਕਾਰੀ ਕਲੈਕਟਰ ਰੇਟਾਂ ਦੇ ਆਧਾਰ ਤੇ ਪੜਤਾਲ ਕੀਤੀ ਹੈ। ਮੰਗਿਆ ਗਿਆ ਰੇਟ ਬਿਲਕੁਲ ਜਾਇਜ਼ ਹੈ।`;
        }

        resolve({
          id: generateId(),
          type: 'property_analysis',
          message: messageText,
          data: {
            score: 84,
            statusBadge: lang === 'pa' ? 'ਸਹੀ ਬਾਜ਼ਾਰੀ ਮੁੱਲ' : (lang === 'hi' ? 'उचित बाजार भाव' : 'Fair Market Value'),
            askingPrice: `₹${askingVal.toFixed(2)} Cr (₹${askingRate.toLocaleString()}/Gaj)`,
            estimatedRange: `₹${(askingVal * 0.94).toFixed(2)} Cr – ₹${(askingVal * 1.05).toFixed(2)} Cr`,
            circleRate: `₹${circleRate.toLocaleString()}/Gaj (Official Collector Rate)`,
            fairValuePerSqYd: `₹${(askingRate * 0.98).toLocaleString()}`,
            summary: lang === 'pa'
              ? 'ਇਸ ਸੈਕਟਰ ਵਿੱਚ 40 ਫੁੱਟ ਸੜਕ ਵਾਲੇ ਪਲਾਟ ਦਾ ਰੇਟ ₹68,000 ਤੋਂ ₹74,000 ਪ੍ਰਤੀ ਗਜ਼ ਚੱਲ ਰਿਹਾ ਹੈ।'
              : (lang === 'hi'
                ? 'इस सेक्टर में 40 फुट चौड़ी सड़क वाले प्लाट का भाव ₹68,000 से ₹74,000 प्रति गज के बीच चल रहा है।'
                : 'Current pricing reflects genuine market value. 40-ft road frontage commands solid demand.'),
            metrics: {
              pricePerSqYd: `₹${askingRate.toLocaleString()}`,
              circleRateSpread: `+${Math.round(((askingRate - circleRate) / circleRate) * 100)}% over circle`,
              negotiationBuffer: lang === 'pa' ? '3% – 5% ਦੀ ਗੁੰਜਾਇਸ਼' : (lang === 'hi' ? '3% – 5% मोलभाव संभव' : '3% – 5% typical'),
              estimatedStampDuty: `₹${((askingVal * 10000000 * 0.07) / 100000).toFixed(1)} Lakhs (7%)`
            },
            reasons: lang === 'pa' ? [
              `ਇਸ ਇਲਾਕੇ ਵਿੱਚ ਆਮ ਖਰੀਦ-ਵੇਚ ₹68,000 – ₹74,000 / ਗਜ਼ ਵਿਚਕਾਰ ਹੋ ਰਹੀ ਹੈ`,
              `40 ਫੁੱਟ ਪੱਕੀ ਸੜਕ ਹੋਣ ਕਰਕੇ ਪਲਾਟ ਦਾ ਮੁੱਲ ਵਧਦਾ ਹੈ`,
              `ਸਾਫ਼ ਮਾਲਕੀ ਰਿਕਾਰਡ ਹੋਣ ਕਰਕੇ ਕਾਨੂੰਨੀ ਖਤਰਾ ਬਹੁਤ ਘੱਟ ਹੈ`
            ] : (lang === 'hi' ? [
              `इस इलाके में आम रजिस्ट्रियां ₹68,000 से ₹74,000 / गज के बीच हो रही हैं`,
              `40 फुट चौड़ी पक्की सड़क होने से प्लाट का अतिरिक्त महत्व है`,
              `साफ़ मालिकाना हक होने से रजिस्ट्री में कोई रुकावट नहीं आएगी`
            ] : [
              `Prevailing transaction band is ₹68,000 – ₹74,000 / Gaj`,
              `Approved layout with 40-ft road frontage adds real value`,
              `Clear single-owner registry chain minimizes documentation risk`
            ])
          },
          actions: [
            { 
              label: lang === 'pa' ? '🧮 ਰਜਿਸਟਰੀ ਖਰਚਾ ਤੇ ਕੈਲਕੁਲੇਟਰ' : (lang === 'hi' ? '🧮 रजिस्ट्री खर्चा व कैलकुलेटर' : '🧮 Open Land Valuation Calculator'), 
              type: 'navigate', 
              target: 'land-calculator' 
            },
            { 
              label: lang === 'pa' ? '⚖️ ਕਾਗਜ਼ਾਤ ਦੀ ਜਾਂਚ ਕਰੋ' : (lang === 'hi' ? '⚖️ सरकारी कागज़ात की जांच' : '⚖️ Legal Due Diligence'), 
              type: 'followup', 
              target: lang === 'pa' ? 'ਇਸ ਪਲਾਟ ਦੇ ਕਾਨੂੰਨੀ ਕਾਗਜ਼ਾਤ ਚੈੱਕ ਕਰੋ' : (lang === 'hi' ? 'इस प्लाट के कानूनी कागज़ात की जांच करें' : 'Verify legal checklist for this property') 
            }
          ]
        });
        return;
      }

      // 3. Planning / Naksha / Building Bylaws (PUDA/GMADA norms)
      if (lowerMsg.includes('build') || lowerMsg.includes('plan') || lowerMsg.includes('naksha') || lowerMsg.includes('bylaw') || lowerMsg.includes('far') || lowerMsg.includes('ground coverage') || lowerMsg.includes('setback') || lowerMsg.includes('floors') || lowerMsg.includes('नक्शा') || lowerMsg.includes('मकान') || lowerMsg.includes('कमरे') || lowerMsg.includes('ਨਕਸ਼ਾ') || lowerMsg.includes('ਮਕਾਨ')) {
        const coveragePct = plotArea <= 250 ? 65 : 60;
        const maxCoverageGaj = Math.round((plotArea * coveragePct) / 100);
        const maxCoverageSqFt = maxCoverageGaj * 9;
        
        let messageText = `### Architectural & PUDA/GMADA Bylaws Guide for **${plotArea} Gaj (${plotArea * 9} sq.ft.) Plot**\n\nHere are the permissible building norms and optimal spatial configurations under standard State Urban Development Authority rules:`;
        if (lang === 'hi') {
          messageText = `### **${plotArea} गज (${plotArea * 9} वर्ग फुट)** प्लाट पर मकान का नक्शा व सरकारी नियम\n\nसरकारी नियमों (PUDA/GMADA) के अनुसार आप इस प्लाट पर नीचे दिए गए नाप के अनुसार मकान बना सकते हैं:`;
        } else if (lang === 'pa') {
          messageText = `### **${plotArea} ਗਜ਼ (${plotArea * 9} ਵਰਗ ਫੁੱਟ)** ਪਲਾਟ ਉੱਤੇ ਮਕਾਨ ਦਾ ਨਕਸ਼ਾ ਤੇ ਪੁੱਡਾ ਨਿਯਮ\n\nਸਰਕਾਰੀ ਨਿਯਮਾਂ (PUDA/GMADA) ਅਨੁਸਾਰ ਤੁਸੀਂ ਇਸ ਪਲਾਟ ਉੱਤੇ ਹੇਠਾਂ ਦਿੱਤੇ ਨਾਪ ਮੁਤਾਬਕ ਮਕਾਨ ਤਿਆਰ ਕਰ ਸਕਦੇ ਹੋ:`;
        }

        resolve({
          id: generateId(),
          type: 'text',
          message: messageText,
          data: {
            title: lang === 'pa' ? 'ਮਕਾਨ ਦੇ ਨਿਯਮ ਤੇ ਨਕਸ਼ਾ' : (lang === 'hi' ? 'मकान निर्माण नियम व नक्शा' : 'Building Norms & Spatial Planning'),
            plotSize: `${plotArea} Gaj (${plotArea * 9} Sq.Ft.)`,
            bylaws: {
              maxGroundCoverage: `${coveragePct}% (${maxCoverageGaj} Gaj / ${maxCoverageSqFt} sq.ft.)`,
              permissibleFAR: '1.65 (Standard) + 0.35 TDR',
              permissibleFloors: lang === 'pa' ? 'ਸਟਿਲਟ ਪਾਰਕਿੰਗ + 3 ਮੰਜ਼ਿਲਾਂ' : (lang === 'hi' ? 'स्टिल्ट पार्किंग + 3 मंजिल + छत' : 'Stilt + 3 Independent Floors + Terrace'),
              maxHeight: '15.0 Meters',
              setbacks: {
                front: lang === 'pa' ? '10 ਫੁੱਟ (ਅਗਲਾ ਲਾਅਨ)' : (lang === 'hi' ? '10 फुट (आगे का खुला लॉन)' : '10.0 Feet'),
                rear: lang === 'pa' ? '8 ਫੁੱਟ (ਪਿਛਲੀ ਖੁੱਲ੍ਹੀ ਜਗ੍ਹਾ)' : (lang === 'hi' ? '8 फुट (पीछे की खुली जगह)' : '8.0 Feet'),
                sides: plotArea > 250 ? '5.0 Feet' : 'Zero setback / Semi-detached'
              },
              estConstructionCost: '₹1,850 – ₹2,400 / sq.ft.'
            },
            recommendations: lang === 'pa' ? [
              'ਹੇਠਾਂ 3-4 ਗੱਡੀਆਂ ਲਈ ਖੁੱਲ੍ਹੀ ਪਾਰਕਿੰਗ',
              'ਹਰ ਮੰਜ਼ਿਲ ਤੇ ਸ਼ਾਨਦਾਰ 3 BHK ਕਮਰੇ ਅਤੇ ਖੁੱਲ੍ਹੀ ਰਸੋਈ',
              'ਲਿਫਟ ਦੀ ਵਿਵਸਥਾ',
              'ਛੱਤ ਉੱਤੇ ਸੋਲਰ ਪੈਨਲ ਜਿਸ ਉੱਤੇ ਸਰਕਾਰੀ ਸਬਸਿਡੀ ਮਿਲਦੀ ਹੈ'
            ] : (lang === 'hi' ? [
              'निचले तल पर 3-4 कारों के लिए स्टिल्ट पार्किंग',
              'हर मंजिल पर 3 BHK बेडरूम, बैठक और आधुनिक रसोई',
              'लिफ्ट के लिए स्वतंत्र जगह',
              'छत पर 5 kW सोलर पैनल जिस पर 20% सरकारी सब्सिडी मिलती है'
            ] : [
              'Dedicated Ground Floor Stilt Parking for 3–4 cars',
              'Spacious 3 BHK layout on each floor (~1,650 sq.ft.)',
              'Independent elevator shaft access',
              'Rooftop solar panel installation eligible for state subsidy'
            ])
          },
          actions: [
            { 
              label: lang === 'pa' ? '📐 3D ਮਕਾਨ ਦਾ ਨਕਸ਼ਾ ਖੋਲ੍ਹੋ' : (lang === 'hi' ? '📐 3D मकान का नक्शा बनाएं' : '📐 Launch 3D Naksha Visualizer'), 
              type: 'navigate', 
              target: 'ai-design' 
            },
            { 
              label: lang === 'pa' ? '🗺️ ਮਾਸਟਰ ਪਲਾਨ ਵੇਖੋ' : (lang === 'hi' ? '🗺️ सरकारी मास्टर प्लान देखें' : '🗺️ View Master Plan'), 
              type: 'navigate', 
              target: 'planning-maps' 
            }
          ]
        });
        return;
      }

      // 4. Legal & Due Diligence / Jamabandi / Title Verification
      if (lowerMsg.includes('check') || lowerMsg.includes('legal') || lowerMsg.includes('verify') || lowerMsg.includes('title') || lowerMsg.includes('jamabandi') || lowerMsg.includes('rera') || lowerMsg.includes('deed') || lowerMsg.includes('dispute') || lowerMsg.includes('कागज़') || lowerMsg.includes('जमाबंदी') || lowerMsg.includes('रजिस्ट्री') || lowerMsg.includes('ਕਾਗਜ਼') || lowerMsg.includes('ਜਮ੍ਹਾਂਬੰਦੀ')) {
        
        let messageText = `### ⚖️ Legal & Title Due Diligence Protocol\n\nBefore executing agreements or paying token money, our AI legal verification pipeline recommends auditing these **6 non-negotiable legal milestones**:`;
        if (lang === 'hi') {
          messageText = `### ⚖️ बयाना देने से पहले 6 ज़रूरी कानूनी कागज़ात की जांच\n\nज़मीन या प्लाट खरीदने से पहले धोखाधड़ी से बचने के लिए इन 6 बातों की जांच ज़रूर करें:`;
        } else if (lang === 'pa') {
          messageText = `### ⚖️ ਬਿਆਨਾ ਦੇਣ ਤੋਂ ਪਹਿਲਾਂ 6 ਜ਼ਰੂਰੀ ਕਾਨੂੰਨੀ ਕਾਗਜ਼ਾਂ ਦੀ ਪੜਤਾਲ\n\nਕੋਈ ਵੀ ਜ਼ਮੀਨ ਖਰੀਦਣ ਤੋਂ ਪਹਿਲਾਂ ਕਿਸੇ ਧੋਖੇ ਤੋਂ ਬਚਣ ਲਈ ਇਹਨਾਂ 6 ਨੁਕਤਿਆਂ ਦੀ ਤਸਦੀਕ ਜ਼ਰੂਰ ਕਰੋ:`;
        }

        resolve({
          id: generateId(),
          type: 'checklist',
          message: messageText,
          data: {
            overallRisk: lang === 'pa' ? 'ਸੁਰੱਖਿਅਤ — ਆਮ ਕਾਗਜ਼ੀ ਜਾਂਚ ਜ਼ਰੂਰੀ' : (lang === 'hi' ? 'सुरक्षित — सामान्य कागजी जांच आवश्यक' : 'Low Risk — Standard Verification Required'),
            safetyScore: 92,
            items: [
              {
                task: lang === 'pa' ? 'ਪਿਛਲੇ 13 ਸਾਲਾਂ ਦੀ ਸਰਕਾਰੀ ਤਲਾਸ਼ੀ ਰਿਪੋਰਟ (ਨਾਨ-ਇਨਕੰਬਰੈਂਸ)' : (lang === 'hi' ? 'पिछले 13 वर्षों की सर्च रिपोर्ट (Non-Encumbrance Certificate)' : '13-Year Search Report & Encumbrance Certificate'),
                completed: true,
                importance: 'Critical',
                note: lang === 'pa' ? 'ਯਕੀਨੀ ਬਣਾਉਂਦਾ ਹੈ ਕਿ ਜ਼ਮੀਨ ਉੱਤੇ ਕੋਈ ਪੁਰਾਣਾ ਬੈਂਕ ਕਰਜ਼ਾ ਜਾਂ ਅਦਾਲਤੀ ਰੋਕ ਨਹੀਂ ਹੈ।' : (lang === 'hi' ? 'यह पुष्टि करता है कि ज़मीन पर कोई बैंक लोन या कोर्ट केस नहीं है।' : 'Confirms no active bank liens or court attachments.')
              },
              {
                task: lang === 'pa' ? 'ਰਜਿਸਟਰੀ ਵਿੱਚ ਮਾਲਕ ਦਾ ਨਾਂ' : (lang === 'hi' ? 'रजिस्ट्री व बैनामा में विक्रेता का नाम' : 'Official Land Title Verification'),
                completed: true,
                importance: 'Critical',
                note: lang === 'pa' ? 'ਤਹਿਸੀਲ ਦੇ ਰਿਕਾਰਡ ਵਿੱਚ ਵੇਚਣ ਵਾਲਾ ਹੀ ਅਸਲ ਮਾਲਕ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।' : (lang === 'hi' ? 'तहसील के सरकारी रिकॉर्ड में बेचने वाला ही असली मालिक दर्ज होना चाहिए।' : 'Ensure seller is registered as absolute owner in registry.')
              },
              {
                task: lang === 'pa' ? 'ਪੁੱਡਾ/ਗਮਾਡਾ ਤੋਂ ਮਨਜ਼ੂਰਸ਼ੁਦਾ ਨਕਸ਼ਾ (CLU Approval)' : (lang === 'hi' ? 'सरकार से स्वीकृत लेआउट प्लान व CLU' : 'Sanctioned Layout Plan & CLU Clearance'),
                completed: true,
                importance: 'High',
                note: lang === 'pa' ? 'ਪਲਾਟ ਅਣ-ਅਧਿਕਾਰਤ ਕਲੋਨੀ ਵਿੱਚ ਨਹੀਂ ਹੋਣਾ ਚਾਹੀਦਾ।' : (lang === 'hi' ? 'कालोनी अवैध न हो, सरकारी मंजूरी नंबर मिला लें।' : 'Verify authority approval number matches plot demarcation.')
              },
              {
                task: lang === 'pa' ? 'ਇੰਤਕਾਲ (ਦਾਖ਼ਲ-ਖ਼ਾਰਜ) ਦਰਜ ਹੋਣਾ' : (lang === 'hi' ? 'दाखिल-खारिज (इंतकाल) की रसीद' : 'Mutation (Intiqal) Record'),
                completed: false,
                importance: 'Medium',
                note: lang === 'pa' ? 'ਪਿਛਲੀ ਰਜਿਸਟਰੀ ਦਾ ਇੰਤਕਾਲ ਚੜ੍ਹਿਆ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।' : (lang === 'hi' ? 'पिछली रजिस्ट्री का इंतकाल सरकारी रजिस्टर में चढ़ा होना चाहिए।' : 'Updated mutation ensures smooth municipal transfer.')
              }
            ]
          },
          actions: [
            { 
              label: lang === 'pa' ? '📜 ਸਰਕਾਰੀ ਰਿਕਾਰਡ ਚੈੱਕ ਕਰੋ' : (lang === 'hi' ? '📜 ऑनलाइन ज़मीन रिकॉर्ड चेक करें' : '📜 Open Land Records'), 
              type: 'navigate', 
              target: 'land-records' 
            },
            { 
              label: lang === 'pa' ? '🧮 ਰਜਿਸਟਰੀ ਖਰਚਾ ਜਾਣੋ' : (lang === 'hi' ? '🧮 रजिस्ट्री खर्चा कैलकुलेटर' : '🧮 Stamp Duty Calculator'), 
              type: 'navigate', 
              target: 'land-calculator' 
            }
          ]
        });
        return;
      }

      // Default Generic Response
      let defaultMsg = `I can provide instant real estate analysis for **${locName}**. What would you like to check?`;
      if (lang === 'hi') {
        defaultMsg = `मैं **${locName}** के बारे में ज़मीन का सही भाव, सरकारी नियम, मकान का नक्शा या रजिस्ट्री की जानकारी दे सकता हूँ। आप क्या जानना चाहते हैं?`;
      } else if (lang === 'pa') {
        defaultMsg = `ਮੈਂ **${locName}** ਬਾਰੇ ਜ਼ਮੀਨ ਦਾ ਸਹੀ ਰੇਟ, ਸਰਕਾਰੀ ਨਿਯਮ, ਮਕਾਨ ਦਾ ਨਕਸ਼ਾ ਜਾਂ ਰਜਿਸਟਰੀ ਦੀ ਪੂਰੀ ਜਾਣਕਾਰੀ ਦੇ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?`;
      }

      resolve({
        id: generateId(),
        type: 'text',
        message: defaultMsg,
        actions: [
          { 
            label: lang === 'pa' ? '📍 ਇਲਾਕੇ ਦਾ ਵਿਕਾਸ ਤੇ ਭਵਿੱਖ' : (lang === 'hi' ? '📍 इलाके का विकास व भविष्य' : '📍 Analyze Location Growth'), 
            type: 'followup', 
            target: lang === 'pa' ? `ਇਸ ਇਲਾਕੇ ਦੇ ਵਿਕਾਸ ਅਤੇ ਭਵਿੱਖ ਬਾਰੇ ਦੱਸੋ` : (lang === 'hi' ? `इस इलाके के विकास और भविष्य के बारे में बताएं` : `Analyze location growth potential for ${locName}`) 
          },
          { 
            label: lang === 'pa' ? '💰 ਸਹੀ ਰੇਟ ਤੇ ਕਲੈਕਟਰ ਭਾਅ' : (lang === 'hi' ? '💰 सही कीमत व कलेक्टर रेट' : '💰 Evaluate Fair Valuation'), 
            type: 'followup', 
            target: lang === 'pa' ? `ਇਸ ਇਲਾਕੇ ਦਾ ਸਹੀ ਰੇਟ ਅਤੇ ਕਲੈਕਟਰ ਭਾਅ ਦੱਸੋ` : (lang === 'hi' ? `इस इलाके का सही दाम और कलेक्टर रेट बताएं` : `Check fair market value and circle rates for ${locName}`) 
          },
          { 
            label: lang === 'pa' ? '📐 ਮਕਾਨ ਦਾ ਨਕਸ਼ਾ ਤੇ ਨਿਯਮ' : (lang === 'hi' ? '📐 मकान का नक्शा व सरकारी नियम' : '📐 Check Building Bylaws & Naksha'), 
            type: 'followup', 
            target: lang === 'pa' ? `ਮੈਂ ਇਸ ਪਲਾਟ ਉੱਤੇ ਕੀ ਬਣਾ ਸਕਦਾ ਹਾਂ?` : (lang === 'hi' ? `इस प्लाट पर क्या-क्या बनाया जा सकता है?` : `What can I build on a ${plotArea} Gaj plot?`) 
          }
        ]
      });
    }, depth === 'fast' ? 400 : MOCK_DELAY);
  });
};
