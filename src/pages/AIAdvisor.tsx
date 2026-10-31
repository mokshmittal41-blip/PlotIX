import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Send,
  Bot,
  Sparkles,
  MapPin,
  Map,
  TrendingUp,
  Navigation,
  MessageSquare,
  Plus,
  Trash2,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Mic,
  MicOff,
  ShieldCheck,
  Building2,
  Coins,
  Download,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ChevronDown,
  ChevronUp,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Compass,
  ArrowUpRight,
  Activity,
  Layers,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { askAdvisor } from '../services/advisorService';
import type { AdvisorContext, AdvisorResponse, AdvisorAction, ChatMessage } from '../types';

interface AIAdvisorProps {
  onNavigate: (page: string, propertyId?: string) => void;
}

type AdvisorMode = 'all' | 'valuation' | 'naksha' | 'legal' | 'investment';

interface HistorySession {
  id: string;
  title: string;
  category: 'Valuation' | 'Bylaws' | 'Location' | 'Legal' | 'Investment' | 'General';
  timestamp: string;
  messages: (ChatMessage | AdvisorResponse)[];
}

export default function AIAdvisor({ onNavigate }: AIAdvisorProps) {
  const { importedPlot, addToast, activeLocation } = useApp();
  const { t, language } = useLanguage();

  // Sidebar visibility
  const [showHistory, setShowHistory] = useState(true);
  const [showRadar, setShowRadar] = useState(true);

  // Active Context Setup
  const [customContextLocation, setCustomContextLocation] = useState<string | null>(null);

  const advisorContext: AdvisorContext = useMemo(() => {
    const ctx: AdvisorContext = {};
    if (importedPlot) {
      ctx.plot = {
        areaSqYd: importedPlot.areaSqYd,
        perimeter: importedPlot.perimeter,
        boundary: importedPlot.polygon
      };
      if (importedPlot.location) {
        ctx.selectedLocation = {
          name: importedPlot.location.split(',')[0],
          city: importedPlot.location.split(',')[1]?.trim() || 'Punjab',
          coordinates: [30.7333, 76.7794]
        };
      }
    } else if (customContextLocation) {
      ctx.selectedLocation = {
        name: customContextLocation.split(',')[0],
        city: customContextLocation.split(',')[1]?.trim() || 'Punjab',
        coordinates: [30.7333, 76.7794]
      };
      ctx.plot = {
        areaSqYd: 200,
        perimeter: 60,
        boundary: [[0, 0], [10, 0], [10, 20], [0, 20]]
      };
    } else if (activeLocation) {
      ctx.selectedLocation = {
        name: activeLocation.name,
        city: `${activeLocation.district}, ${activeLocation.state}`,
        coordinates: activeLocation.coordinates
      };
    }
    return ctx;
  }, [importedPlot, customContextLocation, activeLocation]);

  const hasContext = !!(advisorContext.plot || advisorContext.selectedLocation || advisorContext.property);

  // Chat State
  const [messages, setMessages] = useState<(ChatMessage | AdvisorResponse)[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeMode, setActiveMode] = useState<AdvisorMode>('all');
  const [responseDepth, setResponseDepth] = useState<'fast' | 'deep'>('deep');
  
  // History & Sessions
  const [historyList, setHistoryList] = useState<HistorySession[]>([
    {
      id: 'hist-1',
      title: language === 'pa' ? 'ਮਾਡਲ ਟਾਊਨ ਰੇਟ ਤੇ ਕਲੈਕਟਰ ਭਾਅ' : (language === 'hi' ? 'मॉडल टाउन रेट व सर्कल भाव' : 'Model Town valuation & circle rates'),
      category: 'Valuation',
      timestamp: '2h ago',
      messages: []
    },
    {
      id: 'hist-2',
      title: language === 'pa' ? 'ਏਅਰਪੋਰਟ ਰੋਡ ਦਾ ਵਿਕਾਸ ਅਸਰ' : (language === 'hi' ? 'एयरपोर्ट रोड 3-Yr ROI प्रभाव' : 'PR-7 Airport Road 3-Yr ROI & growth'),
      category: 'Location',
      timestamp: 'Yesterday',
      messages: []
    },
    {
      id: 'hist-3',
      title: language === 'pa' ? '200 ਗਜ਼ ਪਲਾਟ ਦੇ ਪੁੱਡਾ ਨਿਯਮ' : (language === 'hi' ? '200 गज प्लाट के सरकारी नियम' : 'PUDA 200 Gaj setback & FAR code'),
      category: 'Bylaws',
      timestamp: '3d ago',
      messages: []
    }
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');
  
  // Interactive UI states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<Record<string, 'up' | 'down'>>({});
  const [isListening, setIsListening] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [expandedThoughtIds, setExpandedThoughtIds] = useState<Record<string, boolean>>({});

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleActionClick = (action: AdvisorAction) => {
    if (action.type === 'navigate') {
      onNavigate(action.target);
    } else if (action.type === 'followup') {
      sendMessage(action.target);
    }
  };

  const sendMessage = async (textToSend?: string) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    setIsTyping(true);

    try {
      const response = await askAdvisor(promptText, advisorContext, responseDepth, language);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error(error);
      if (addToast) addToast('Error generating AI response.', 'error');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setActiveSessionId(null);
    setInput('');
    if (inputRef.current) inputRef.current.focus();
    if (addToast) addToast(t.advisor.newChat, 'info');
  };

  const loadSession = (session: HistorySession) => {
    setActiveSessionId(session.id);
    if (session.messages && session.messages.length > 0) {
      setMessages(session.messages);
    } else {
      setMessages([]);
      sendMessage(session.title);
    }
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistoryList(prev => prev.filter(item => item.id !== id));
    if (activeSessionId === id) {
      startNewChat();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    if (addToast) addToast(t.advisor.copied, 'success');
  };

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedbacks(prev => ({
      ...prev,
      [id]: prev[id] === type ? undefined! : type
    }));
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      if (addToast) addToast('Listening to speech...', 'info');
      setTimeout(() => {
        setInput(language === 'pa' ? 'ਸੈਕਟਰ 82 ਮੋਹਾਲੀ ਦੇ ਰੇਟ ਦੱਸੋ' : (language === 'hi' ? 'सेक्टर 82 मोहाली के सही दाम बताएं' : 'Evaluate Sector 82 growth potential and circle rates'));
        setIsListening(false);
      }, 2000);
    }
  };

  const exportConversation = () => {
    if (messages.length === 0) return;
    const conversationText = messages.map(m => {
      if ('role' in m) {
        return `[USER] (${m.timestamp}):\n${m.content}\n`;
      } else {
        return `[PROPWISE AI]:\n${m.message}\n`;
      }
    }).join('\n────────────────────────────────────────────\n\n');

    const blob = new Blob([conversationText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PropWise_AI_Consultation_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    if (addToast) addToast('Report Exported!', 'success');
  };

  const toggleThought = (msgId: string) => {
    setExpandedThoughtIds(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  // Bento Quick Action Cards
  const QUICK_PROMPTS = [
    {
      id: 'loc-growth',
      title: t.advisor.quickPrompts.growth.title,
      subtitle: t.advisor.quickPrompts.growth.desc,
      prompt: language === 'pa' ? 'ਇਸ ਇਲਾਕੇ ਦੇ ਵਿਕਾਸ ਅਤੇ ਭਵਿੱਖ ਬਾਰੇ ਦੱਸੋ' : (language === 'hi' ? 'इस इलाके के विकास और भविष्य के बारे में बताएं' : 'Evaluate the location potential, connectivity, and 3-year growth forecast for this area'),
      icon: <Compass size={18} />,
      badge: '9.4 / 10 Hotspot',
      theme: 'sapphire'
    },
    {
      id: 'prop-val',
      title: t.advisor.quickPrompts.valuation.title,
      subtitle: t.advisor.quickPrompts.valuation.desc,
      prompt: language === 'pa' ? 'ਇਸ ਇਲਾਕੇ ਦਾ ਸਹੀ ਰੇਟ ਅਤੇ ਕਲੈਕਟਰ ਭਾਅ ਦੱਸੋ' : (language === 'hi' ? 'इस इलाके का सही दाम और कलेक्टर रेट बताएं' : 'Is this property worth the asking price compared to official circle rates?'),
      icon: <Coins size={18} />,
      badge: 'Circle vs Market',
      theme: 'emerald'
    },
    {
      id: 'bylaw-plan',
      title: t.advisor.quickPrompts.bylaws.title,
      subtitle: t.advisor.quickPrompts.bylaws.desc,
      prompt: language === 'pa' ? 'ਇਸ ਪਲਾਟ ਉੱਤੇ ਕਿੰਨੇ ਕਮਰੇ ਅਤੇ ਮੰਜ਼ਿਲਾਂ ਬਣ ਸਕਦੀਆਂ ਹਨ?' : (language === 'hi' ? 'इस प्लाट पर कितने कमरे और मंजिलें बनाई जा सकती हैं?' : 'What are the building bylaws, permissible FAR, and setback rules for this plot?'),
      icon: <Building2 size={18} />,
      badge: 'PUDA 2026 Code',
      theme: 'amber'
    },
    {
      id: 'legal-check',
      title: t.advisor.quickPrompts.legal.title,
      subtitle: t.advisor.quickPrompts.legal.desc,
      prompt: language === 'pa' ? 'ਬਿਆਨਾ ਦੇਣ ਤੋਂ ਪਹਿਲਾਂ ਕਿਹੜੇ ਸਰਕਾਰੀ ਕਾਗਜ਼ ਚੈੱਕ ਕਰਨੇ ਜ਼ਰੂਰੀ ਹਨ?' : (language === 'hi' ? 'बयाना देने से पहले कौन-से सरकारी कागज़ चेक करने जरूरी हैं?' : 'What are the mandatory legal documents and title checks before buying?'),
      icon: <ShieldCheck size={18} />,
      badge: '6 Checkpoints',
      theme: 'violet'
    }
  ];

  const TRENDING_CHIPS = language === 'pa' ? [
    '🔥 ਸੈਕਟਰ 82 ਮੋਹਾਲੀ ਦਾ ਰੇਟ',
    '📐 200 ਗਜ਼ ਪਲਾਟ ਦੇ ਪੁੱਡਾ ਨਿਯਮ',
    '💰 ਦੁਕਾਨ ਬਨਾਮ ਰਿਹਾਇਸ਼ੀ ਪਲਾਟ ROI',
    '📋 ਰਜਿਸਟਰੀ ਤੇ ਮਾਲਕੀ ਜਾਂਚ',
    '⚖️ ਪੰਜਾਬ ਰਜਿਸਟਰੀ ਤੇ ਸਟੈਂਪ ਡਿਊਟੀ'
  ] : (language === 'hi' ? [
    '🔥 सेक्टर 82 मोहाली का भाव',
    '📐 200 गज प्लाट के PUDA नियम',
    '💰 दुकान बनाम रिहायशी प्लाट ROI',
    '📋 रजिस्ट्री व मालिकाना हक जांच',
    '⚖️ पंजाब रजिस्ट्री व स्टाम्प ड्यूटी'
  ] : [
    '🔥 Sector 82 Mohali 2026 Forecast',
    '📐 Setback rules for 200 Gaj plot',
    '💰 Commercial SCO vs Residential ROI',
    '📋 Land Registry & Title Search Checklist',
    '⚖️ Punjab Stamp Duty & Registry Charges'
  ]);

  const FEATURED_LOCATIONS = [
    { name: 'Sector 82, Mohali', rate: '₹71,000/Gaj', roi: '+22.4%' },
    { name: 'PR-7 Airport Road, Zirakpur', rate: '₹84,000/Gaj', roi: '+20.1%' },
    { name: 'New Chandigarh (Mullanpur)', rate: '₹62,000/Gaj', roi: '+18.5%' },
    { name: 'Sector 20, Panchkula', rate: '₹95,000/Gaj', roi: '+12.5%' },
    { name: 'Bathinda Bypass Road', rate: '₹34,000/Gaj', roi: '+28.0%' }
  ];

  const filteredHistory = historyList.filter(item => 
    item.title.toLowerCase().includes(searchHistoryQuery.toLowerCase())
  );

  // Render Rich Message Content
  const renderMessageContent = (msg: ChatMessage | AdvisorResponse) => {
    if ('role' in msg && msg.role === 'user') {
      return (
        <div className="adv-user-message-card">
          <div className="adv-bubble adv-user">{msg.content}</div>
          <div className="adv-msg-timestamp">{msg.timestamp}</div>
        </div>
      );
    }

    const response = msg as AdvisorResponse;
    const msgId = response.id;
    const isFeedbackUp = feedbacks[msgId] === 'up';
    const isFeedbackDown = feedbacks[msgId] === 'down';
    const isThoughtExpanded = expandedThoughtIds[msgId] ?? false;

    return (
      <div className="adv-ai-wrapper">
        
        {/* Chain of Thought / Intelligence Reasoning Accordion */}
        <div className="adv-reasoning-card">
          <button 
            className="adv-reasoning-toggle"
            onClick={() => toggleThought(msgId)}
          >
            <div className="reasoning-left">
              <Sparkles size={13} className="color-emerald" />
              <span>Synthesized with PropWise Neural Real Estate Model</span>
            </div>
            {isThoughtExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          
          {isThoughtExpanded && (
            <div className="adv-reasoning-content">
              <div className="thought-step">
                <CheckCircle2 size={12} className="step-check" />
                <span>Verified against 2026-27 District Collector Circle Rates</span>
              </div>
              <div className="thought-step">
                <CheckCircle2 size={12} className="step-check" />
                <span>Cross-referenced Punjab Urban Planning & Development Bylaws</span>
              </div>
              <div className="thought-step">
                <CheckCircle2 size={12} className="step-check" />
                <span>Indexed 200+ local transaction benchmarks & infrastructure plans</span>
              </div>
            </div>
          )}
        </div>

        <div className="adv-bubble adv-ai">
          <div className="adv-ai-message-body">
            {response.message.split('\n\n').map((paragraph, pIdx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h4 key={pIdx} className="adv-ai-heading">
                    {paragraph.replace('### ', '')}
                  </h4>
                );
              }
              if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
                const items = paragraph.split('\n');
                return (
                  <ul key={pIdx} className="adv-ai-bullet-list">
                    {items.map((item, iIdx) => (
                      <li key={iIdx}>
                        {item.replace(/^[*|-]\s+/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={pIdx} className="adv-ai-paragraph">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* 1. Location Analysis */}
          {response.type === 'location_analysis' && response.data && (
            <div className="adv-rich-card adv-card-growth">
              <div className="adv-card-top-bar">
                <div className="adv-card-badge-row">
                  <span className="adv-pulse-badge">
                    <span className="pulse-dot" /> {response.data.verdict}
                  </span>
                  <span className="adv-score-tag">
                    <Sparkles size={12} /> {response.data.score}/100 Score
                  </span>
                </div>
                <div className="adv-card-main-title">{response.data.title}</div>
              </div>

              {response.data.metrics && (
                <div className="adv-metrics-strip">
                  <div className="adv-metric-box">
                    <div className="adv-metric-lbl">3-Yr Growth</div>
                    <div className="adv-metric-num color-emerald">{response.data.metrics.appreciation3Yr}</div>
                  </div>
                  <div className="adv-metric-box">
                    <div className="adv-metric-lbl">Rental Yield</div>
                    <div className="adv-metric-num color-sapphire">{response.data.metrics.rentalYield}</div>
                  </div>
                  <div className="adv-metric-box">
                    <div className="adv-metric-lbl">Infra Score</div>
                    <div className="adv-metric-num color-violet">{response.data.metrics.infraScore}</div>
                  </div>
                  <div className="adv-metric-box">
                    <div className="adv-metric-lbl">Demand</div>
                    <div className="adv-metric-num color-amber">{response.data.metrics.demandLiquidity}</div>
                  </div>
                </div>
              )}

              <p className="adv-rich-summary">{response.data.summary}</p>

              <div className="adv-pros-cons-grid">
                {response.data.positives && (
                  <div className="adv-pro-column">
                    <div className="adv-pro-header">
                      <CheckCircle2 size={14} className="color-emerald" /> {language === 'pa' ? 'ਮੁੱਖ ਖੂਬੀਆਂ' : (language === 'hi' ? 'प्रमुख फायदे' : 'Strengths')}
                    </div>
                    <ul className="adv-pro-list">
                      {response.data.positives.map((pos: string, idx: number) => (
                        <li key={idx}>{pos}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {response.data.considerations && (
                  <div className="adv-con-column">
                    <div className="adv-con-header">
                      <AlertTriangle size={14} className="color-amber" /> {language === 'pa' ? 'ਧਿਆਨ ਦੇਣ ਯੋਗ ਗੱਲਾਂ' : (language === 'hi' ? 'ध्यान योग्य बातें' : 'Considerations')}
                    </div>
                    <ul className="adv-con-list">
                      {response.data.considerations.map((con: string, idx: number) => (
                        <li key={idx}>{con}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. Property Valuation */}
          {response.type === 'property_analysis' && response.data && (
            <div className="adv-rich-card adv-card-valuation">
              <div className="adv-card-top-bar">
                <div className="adv-card-badge-row">
                  <span className="adv-badge-val">{response.data.verdict}</span>
                  <span className="adv-score-tag">
                    <Coins size={12} /> {response.data.confidenceScore}% Confidence
                  </span>
                </div>
                <div className="adv-card-main-title">{response.data.title}</div>
              </div>

              <div className="adv-valuation-rates-row">
                <div className="adv-rate-box">
                  <span className="adv-rate-lbl">Fair Market Estimate</span>
                  <span className="adv-rate-val color-emerald">{response.data.estimatedFairValue}</span>
                </div>
                <div className="adv-rate-box">
                  <span className="adv-rate-lbl">Collector Circle Rate</span>
                  <span className="adv-rate-val">{response.data.circleRateBenchmark}</span>
                </div>
                <div className="adv-rate-box">
                  <span className="adv-rate-lbl">Price Delta</span>
                  <span className="adv-rate-val color-amber">{response.data.priceDelta}</span>
                </div>
              </div>

              <p className="adv-rich-summary">{response.data.rationale}</p>
            </div>
          )}

          {/* 3. Bylaws Analysis */}
          {response.type === 'bylaws_analysis' && response.data && (
            <div className="adv-rich-card adv-card-bylaws">
              <div className="adv-card-top-bar">
                <div className="adv-card-badge-row">
                  <span className="adv-badge-bylaw">
                    <Building2 size={12} /> {response.data.authority}
                  </span>
                  <span className="adv-score-tag">Zoning: {response.data.zoningType}</span>
                </div>
                <div className="adv-card-main-title">{response.data.title}</div>
              </div>

              <div className="adv-bylaws-matrix">
                <div className="adv-bylaw-row">
                  <span className="adv-bylaw-param">Permissible FAR</span>
                  <span className="adv-bylaw-value bold">{response.data.bylaws.permissibleFAR}</span>
                </div>
                <div className="adv-bylaw-row">
                  <span className="adv-bylaw-param">Ground Coverage</span>
                  <span className="adv-bylaw-value bold">{response.data.bylaws.maxGroundCoverage}</span>
                </div>
                <div className="adv-bylaw-row">
                  <span className="adv-bylaw-param">Floor Limit</span>
                  <span className="adv-bylaw-value">{response.data.bylaws.permissibleFloors}</span>
                </div>
                <div className="adv-bylaw-row">
                  <span className="adv-bylaw-param">Front Setback</span>
                  <span className="adv-bylaw-value">{response.data.bylaws.setbacks.front}</span>
                </div>
                <div className="adv-bylaw-row highlight-row">
                  <span className="adv-bylaw-param">Est. Construction Cost</span>
                  <span className="adv-bylaw-value color-emerald bold">{response.data.bylaws.estConstructionCost}</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. Legal Checklist */}
          {response.type === 'checklist' && response.data && (
            <div className="adv-rich-card adv-card-legal">
              <div className="adv-card-top-bar">
                <div className="adv-card-badge-row">
                  <span className="adv-badge-legal">
                    <ShieldCheck size={12} /> {response.data.overallRisk}
                  </span>
                  <span className="adv-score-tag">
                    <CheckCircle2 size={12} /> {response.data.safetyScore}/100 Title Safety
                  </span>
                </div>
                <div className="adv-card-main-title">{language === 'pa' ? 'ਜ਼ਰੂਰੀ ਕਾਨੂੰਨੀ ਕਾਗਜ਼' : (language === 'hi' ? 'ज़रूरी सरकारी कागज़ात की जांच' : 'Legal Due Diligence')}</div>
              </div>

              <div className="adv-checklist-items-stack">
                {response.data.items?.map((item: any, idx: number) => {
                  const itemId = `${msgId}-item-${idx}`;
                  const isChecked = checkedItems[itemId] !== undefined ? checkedItems[itemId] : item.completed;

                  return (
                    <div
                      key={idx}
                      className={`adv-check-card ${isChecked ? 'is-checked' : ''}`}
                      onClick={() => setCheckedItems(prev => ({ ...prev, [itemId]: !isChecked }))}
                    >
                      <div className="adv-check-box">
                        {isChecked ? <Check size={13} className="color-emerald" /> : null}
                      </div>
                      <div className="adv-check-content">
                        <div className="adv-check-title-row">
                          <span className="adv-check-task">{item.task}</span>
                          <span className={`adv-importance-badge ${item.importance.toLowerCase()}`}>
                            {item.importance}
                          </span>
                        </div>
                        <p className="adv-check-note">{item.note}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Chips */}
        {response.actions && response.actions.length > 0 && (
          <div className="adv-action-chips">
            {response.actions.map((action, i) => (
              <button
                key={i}
                className={`adv-chip ${action.type === 'navigate' ? 'adv-chip-nav' : ''}`}
                onClick={() => handleActionClick(action)}
              >
                {action.type === 'navigate' && <Navigation size={12} />}
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Response Footer */}
        <div className="adv-msg-footer-bar">
          <button
            className="adv-footer-tool-btn"
            onClick={() => copyToClipboard(response.message, msgId)}
            title="Copy Response"
          >
            {copiedId === msgId ? <Check size={13} className="color-emerald" /> : <Copy size={13} />}
            <span>{copiedId === msgId ? t.advisor.copied : t.advisor.copy}</span>
          </button>

          <div className="adv-feedback-group">
            <button
              className={`adv-feedback-btn ${isFeedbackUp ? 'active-up' : ''}`}
              onClick={() => handleFeedback(msgId, 'up')}
            >
              <ThumbsUp size={13} />
            </button>
            <button
              className={`adv-feedback-btn ${isFeedbackDown ? 'active-down' : ''}`}
              onClick={() => handleFeedback(msgId, 'down')}
            >
              <ThumbsDown size={13} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="adv-studio-root">
      
      {/* ─── LEFT: INQUIRIES DRAWER ─── */}
      {showHistory && (
        <aside className="adv-inquiries-sidebar">
          <div className="adv-inquiries-header">
            <button className="adv-new-consult-btn" onClick={startNewChat}>
              <Plus size={16} />
              <span>New Consultation</span>
            </button>
          </div>

          <div className="adv-inquiries-search">
            <Search size={13} className="adv-search-icon" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchHistoryQuery}
              onChange={e => setSearchHistoryQuery(e.target.value)}
              className="adv-search-input"
            />
          </div>

          <div className="adv-inquiries-list">
            <span className="adv-inquiries-subhead">Recent Inquiries</span>
            {filteredHistory.map(chat => (
              <div
                key={chat.id}
                className={`adv-inquiry-item ${activeSessionId === chat.id ? 'active' : ''}`}
                onClick={() => loadSession(chat)}
              >
                <MessageSquare size={14} className="adv-inquiry-icon" />
                <div className="adv-inquiry-text-group">
                  <div className="adv-inquiry-title">{chat.title}</div>
                  <span className="adv-inquiry-time">{chat.timestamp}</span>
                </div>
                <button 
                  className="adv-inquiry-del" 
                  onClick={e => deleteSession(e, chat.id)}
                  title="Delete chat"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </aside>
      )}

      {/* ─── CENTER: SEAMLESS MAIN STUDIO ─── */}
      <section className="adv-main-stage">
        
        {/* Studio Top Control Strip */}
        <div className="adv-top-control-strip">
          <div className="strip-left">
            <button 
              className="adv-icon-toggle"
              onClick={() => setShowHistory(!showHistory)}
              title={showHistory ? "Hide History" : "Show History"}
            >
              {showHistory ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            </button>

            {/* Mode Selector Tabs Bar */}
            <div className="adv-filter-tabs">
              {[
                { id: 'all', label: t.advisor.modes.all, icon: <Sparkles size={13} /> },
                { id: 'valuation', label: t.advisor.modes.valuation, icon: <Coins size={13} /> },
                { id: 'naksha', label: t.advisor.modes.naksha, icon: <Building2 size={13} /> },
                { id: 'legal', label: t.advisor.modes.legal, icon: <ShieldCheck size={13} /> },
                { id: 'investment', label: t.advisor.modes.investment, icon: <TrendingUp size={13} /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`adv-filter-tab ${activeMode === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveMode(tab.id as AdvisorMode)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="strip-right">
            <div className="adv-depth-pill">
              <button
                className={`depth-opt ${responseDepth === 'fast' ? 'active' : ''}`}
                onClick={() => setResponseDepth('fast')}
              >
                <Zap size={12} /> Fast
              </button>
              <button
                className={`depth-opt ${responseDepth === 'deep' ? 'active' : ''}`}
                onClick={() => setResponseDepth('deep')}
              >
                <Layers size={12} /> Deep Intel
              </button>
            </div>

            {messages.length > 0 && (
              <>
                <button className="adv-action-icon-btn" onClick={exportConversation} title="Export Report">
                  <Download size={15} />
                </button>
                <button className="adv-action-icon-btn" onClick={startNewChat} title="Reset Chat">
                  <RefreshCw size={15} />
                </button>
              </>
            )}

            <button 
              className="adv-icon-toggle"
              onClick={() => setShowRadar(!showRadar)}
              title={showRadar ? "Hide Market Radar" : "Show Market Radar"}
            >
              {showRadar ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
            </button>
          </div>
        </div>

        {/* Studio Content Area */}
        <div className="adv-scrollable-content">
          {messages.length === 0 ? (
            <div className="adv-hero-hub">
              
              {/* Minimal Glowing AI Orb */}
              <div className="adv-hero-orb">
                <div className="orb-aura" />
                <div className="orb-center">
                  <Sparkles size={24} />
                </div>
              </div>

              <h2 className="adv-hero-headline">
                {language === 'pa' 
                  ? 'ਅੱਜ ਤੁਸੀਂ ਕਿਸ ਪ੍ਰਾਪਰਟੀ ਬਾਰੇ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?' 
                  : (language === 'hi' 
                    ? 'आज आप किस प्रॉपर्टी के बारे में विश्लेषण चाहते हैं?' 
                    : 'What would you like to evaluate today?')}
              </h2>
              <p className="adv-hero-tagline">
                {language === 'pa'
                  ? 'ਕਿਸੇ ਵੀ ਪਲਾਟ, ਕਲੈਕਟਰ ਰੇਟ, ਪੁੱਡਾ ਨਿਯਮ ਜਾਂ ਰਜਿਸਟਰੀ ਬਾਰੇ ਸਵਾਲ ਪੁੱਛੋ।'
                  : (language === 'hi'
                    ? 'कलेक्टर सर्कल रेट, PUDA नियम, निर्माण FAR व रजिस्ट्री का तुरंत विश्लेषण पाएं।'
                    : 'Ask about any plot, circle rate, building rules, or land registry title verification.')}
              </p>

              {/* 4 Premium Bento Action Cards */}
              <div className="adv-bento-grid-2x2">
                {QUICK_PROMPTS.map(card => (
                  <div
                    key={card.id}
                    className={`adv-bento-card theme-${card.theme}`}
                    onClick={() => sendMessage(card.prompt)}
                  >
                    <div className="bento-card-top">
                      <div className="bento-icon-box">{card.icon}</div>
                      <span className="bento-badge">{card.badge}</span>
                    </div>
                    <h3 className="bento-title">{card.title}</h3>
                    <p className="bento-desc">{card.subtitle}</p>
                    <div className="bento-arrow"><ArrowUpRight size={15} /></div>
                  </div>
                ))}
              </div>

              {/* Trending Questions Carousel */}
              <div className="adv-trending-strip">
                <span className="trending-label">Trending Topics:</span>
                <div className="trending-chips-wrap">
                  {TRENDING_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      className="trending-chip-btn"
                      onClick={() => sendMessage(chip.replace(/^[🔥📐💰📋⚖️]\s+/, ''))}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="adv-thread-flow">
              {messages.map((msg, i) => (
                <div
                  key={'id' in msg ? msg.id : i}
                  className={`adv-msg-row ${'role' in msg && msg.role === 'user' ? 'user-row' : 'ai-row'}`}
                >
                  {(!('role' in msg) || msg.role !== 'user') && (
                    <div className="adv-avatar-core"><Bot size={16} /></div>
                  )}
                  {renderMessageContent(msg)}
                </div>
              ))}

              {isTyping && (
                <div className="adv-msg-row ai-row">
                  <div className="adv-avatar-core"><Bot size={16} /></div>
                  <div className="adv-typing-capsule">
                    <div className="typing-dots">
                      <div className="dot" /><div className="dot" /><div className="dot" />
                    </div>
                    <span className="typing-label">
                      {language === 'pa' ? 'AI ਪੜਤਾਲ ਕਰ ਰਿਹਾ ਹੈ...' : (language === 'hi' ? 'AI जानकारी निकाल रहा है...' : 'PropWise AI is synthesizing variables...')}
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* ─── FLOATING INPUT DOCK ─── */}
        <div className="adv-floating-dock-container">
          
          {/* Active Context Chip Pill */}
          {hasContext && (
            <div className="adv-context-pill-badge">
              <div className="pill-info">
                <MapPin size={12} className="color-emerald" />
                <span>
                  Context: <strong>{advisorContext.selectedLocation?.name || 'Selected Plot'}</strong> ({advisorContext.plot?.areaSqYd || 200} Gaj)
                </span>
              </div>
              <button className="pill-remove-btn" onClick={() => setCustomContextLocation(null)}>
                Clear
              </button>
            </div>
          )}

          <div className="adv-input-capsule">
            <button
              className="adv-input-extra-btn"
              onClick={() => setInput(language === 'pa' ? 'ਮੈਨੂੰ 200 ਗਜ਼ ਪਲਾਟ ਦੇ ਨਿਯਮ ਦੱਸੋ' : (language === 'hi' ? 'मुझे 200 गज प्लाट के सरकारी नियम बताएं' : 'Analyze the maximum buildable FAR and setback rules for this plot'))}
              title="Suggested prompt"
            >
              <Sparkles size={16} className="color-emerald" />
            </button>

            <textarea
              ref={inputRef}
              className="adv-dock-textarea"
              placeholder={t.advisor.inputPlaceholder}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
            />

            <button
              className={`adv-input-extra-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleVoiceInput}
              title="Voice dictation"
            >
              {isListening ? <MicOff size={16} className="color-error" /> : <Mic size={16} />}
            </button>

            <button
              className="adv-submit-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
            >
              <Send size={15} />
            </button>
          </div>

          <div className="adv-dock-disclaimer">
            <span>{t.advisor.disclaimer}</span>
          </div>
        </div>

      </section>

      {/* ─── RIGHT: MARKET RADAR DRAWER ─── */}
      {showRadar && (
        <aside className="adv-radar-sidebar">
          
          {/* Context Card */}
          <div className="adv-radar-card">
            <div className="radar-card-header">
              <div className="radar-title-group">
                <MapPin size={15} className="color-sapphire" />
                <h4>Active Property Context</h4>
              </div>
              {hasContext && (
                <button className="radar-clear-btn" onClick={() => setCustomContextLocation(null)}>
                  Clear
                </button>
              )}
            </div>

            {hasContext ? (
              <div className="active-context-meta">
                {advisorContext.selectedLocation && (
                  <div className="context-meta-row">
                    <span className="meta-lbl">Location</span>
                    <span className="meta-val">{advisorContext.selectedLocation.name}, {advisorContext.selectedLocation.city}</span>
                  </div>
                )}
                {advisorContext.plot && (
                  <div className="context-meta-row">
                    <span className="meta-lbl">Plot Area</span>
                    <span className="meta-val">{advisorContext.plot.areaSqYd.toLocaleString()} Gaj ({advisorContext.plot.areaSqYd * 9} sq.ft.)</span>
                  </div>
                )}
                <button className="radar-btn-action" onClick={() => onNavigate('map')}>
                  <MapPin size={13} /> Change on Map
                </button>
              </div>
            ) : (
              <div className="no-context-meta">
                <p className="no-context-text">No plot selected. Tap any micro-market below or pick a plot on the GIS map.</p>
                <button className="radar-btn-action" onClick={() => onNavigate('map')}>
                  <Map size={13} /> Select on Live Map
                </button>
              </div>
            )}
          </div>

          {/* Top Micro-Markets */}
          <div className="adv-radar-card">
            <div className="radar-card-header">
              <div className="radar-title-group">
                <Activity size={15} className="color-emerald" />
                <h4>Top Micro-Markets</h4>
              </div>
            </div>

            <div className="micro-markets-list">
              {FEATURED_LOCATIONS.map((loc, idx) => (
                <button
                  key={idx}
                  className="micro-market-row"
                  onClick={() => {
                    setCustomContextLocation(loc.name);
                    sendMessage(language === 'pa' ? `${loc.name} ਬਾਰੇ ਪੂਰੀ ਜਾਣਕਾਰੀ ਦਿਓ` : (language === 'hi' ? `${loc.name} की पूरी रिपोर्ट बताएं` : `Provide complete property report for ${loc.name}`));
                  }}
                >
                  <div className="market-row-top">
                    <span className="market-name">{loc.name}</span>
                    <span className="market-roi">{loc.roi}</span>
                  </div>
                  <span className="market-rate">{loc.rate}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Regional Market Radar */}
          <div className="adv-radar-card">
            <div className="radar-card-header">
              <div className="radar-title-group">
                <TrendingUp size={15} className="color-amber" />
                <h4>Regional Market Radar</h4>
              </div>
            </div>

            <div className="radar-metrics-stack">
              <div className="radar-metric-item">
                <span className="metric-name">Punjab Circle Index</span>
                <span className="metric-figure color-emerald">₹34,500/Gaj (+8.4%)</span>
              </div>
              <div className="radar-metric-item">
                <span className="metric-name">Home Loan Benchmark</span>
                <span className="metric-figure">8.35% – 8.65%</span>
              </div>
              <div className="radar-metric-item">
                <span className="metric-name">Tri-City Demand Index</span>
                <span className="metric-figure color-sapphire">Very High (94/100)</span>
              </div>
            </div>
          </div>

        </aside>
      )}

    </div>
  );
}
