import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import type { NakshaState } from './types';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  hasAction?: boolean;
  proposedStateUpdate?: Partial<NakshaState>;
}

interface Props {
  state: NakshaState;
  updateState: (updates: Partial<NakshaState>) => void;
}

const QUICK_CHIPS = [
  "Add a bedroom",
  "Add parking",
  "Add pooja room",
  "Remove parking"
];

export default function AICustomizationChat({ state, updateState }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'I generated this floor plan based on your requirements. What would you like to change?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Mock AI response with dynamic layout manipulation
    setTimeout(() => {
      const lower = text.toLowerCase();
      let aiText = "I can apply this change. Shall I re-generate the layout?";
      let updates: Partial<NakshaState> | undefined = undefined;
      
      if (lower.includes('add') && lower.includes('bedroom')) {
        aiText = "Adding another bedroom will reduce the available living area and open space. Would you like me to add a 3rd bedroom and regenerate the layout?";
        updates = { requirements: { ...state.requirements, bedrooms: state.requirements.bedrooms + 1 } };
      } else if (lower.includes('add') && lower.includes('parking')) {
        aiText = "I'll add parking space. This will push the building line back from the road. Shall I apply this?";
        updates = { requirements: { ...state.requirements, parking: '1 Car' } };
      } else if (lower.includes('remove') && lower.includes('parking')) {
        aiText = "I'll remove the parking space to free up room for your living areas. Ready to regenerate?";
        updates = { requirements: { ...state.requirements, parking: 'No Parking' } };
      } else if (lower.includes('pooja')) {
        aiText = "I will add a Pooja room. Would you like to regenerate the floor plan?";
        updates = { requirements: { ...state.requirements, poojaRoom: true } };
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiText,
        hasAction: !!updates,
        proposedStateUpdate: updates
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const applyChange = (msg: ChatMessage) => {
    if (msg.proposedStateUpdate) {
      updateState(msg.proposedStateUpdate);
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, hasAction: false, text: m.text + " (Applied ✓)" } : m));
    }
  };

  return (
    <div className="naksha-chat-container card propwise-card">
      <div className="chat-header">
        <Bot size={20} className="text-primary" />
        <span className="font-semibold">AI Design Assistant</span>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender}`}>
            {msg.sender === 'ai' && <div className="chat-avatar ai"><Sparkles size={12} /></div>}
            <div className="chat-bubble">
              {msg.text}
              {msg.hasAction && (
                <div className="chat-actions">
                  <button className="btn btn-sm btn-primary" onClick={() => applyChange(msg)}>Apply Change</button>
                  <button className="btn btn-sm btn-ghost" onClick={() => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, hasAction: false, text: m.text + " (Cancelled)" } : m))}>Cancel</button>
                </div>
              )}
            </div>
            {msg.sender === 'user' && <div className="chat-avatar user"><User size={12} /></div>}
          </div>
        ))}
        {isTyping && (
          <div className="chat-bubble-wrapper ai">
            <div className="chat-avatar ai"><Sparkles size={12} /></div>
            <div className="chat-bubble typing">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <div className="quick-chips">
          {QUICK_CHIPS.map(chip => (
            <button key={chip} className="chip" onClick={() => handleSend(chip)}>
              {chip}
            </button>
          ))}
        </div>
        <div className="chat-input-box">
          <input
            type="text"
            placeholder="Ask AI to modify the plan..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
          />
          <button 
            className="send-btn" 
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim()}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
