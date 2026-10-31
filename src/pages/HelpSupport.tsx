import { useState } from 'react';
import { 
  ArrowLeft, Phone, Mail, MessageSquare, Copy, Check, 
  ShieldCheck, Send, 
  ExternalLink, UserCheck,
  CheckCircle2
} from 'lucide-react';
import PropWiseLogo from '../components/common/PropWiseLogo';
import { useLanguage } from '../context/LanguageContext';
import './HelpSupport.css';

interface HelpSupportProps {
  onNavigate: (page: string) => void;
}

export default function HelpSupport({ onNavigate }: HelpSupportProps) {
  const { language } = useLanguage();
  const [copiedType, setCopiedType] = useState<'phone' | 'email' | null>(null);
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderMessage, setSenderMessage] = useState('');
  const [sentNotice, setSentNotice] = useState(false);

  const OWNER_PHONE = '7658800280';
  const OWNER_PHONE_DISPLAY = '+91 76588 00280';
  const OWNER_EMAIL = 'mokshmittal41@gmail.com';

  const copyToClipboard = (text: string, type: 'phone' | 'email') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderMessage.trim()) return;
    const text = encodeURIComponent(
      `Hello Moksh,\n\nI am contacting you regarding PlotIX.\nName: ${senderName || 'User'}\nPhone: ${senderPhone || 'Not provided'}\n\nMessage: ${senderMessage}`
    );
    window.open(`https://wa.me/91${OWNER_PHONE}?text=${text}`, '_blank');
    setSentNotice(true);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderMessage.trim()) return;
    const subject = encodeURIComponent(`PlotIX Support Request from ${senderName || 'User'}`);
    const body = encodeURIComponent(
      `Hi Moksh,\n\nName: ${senderName || 'User'}\nPhone: ${senderPhone || 'Not provided'}\n\nMessage:\n${senderMessage}\n\nSent via PlotIX App Help Desk`
    );
    window.location.href = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;
    setSentNotice(true);
  };

  return (
    <div className="help-page-container">
      {/* ─── Top Bar with Back Action ─── */}
      <div className="help-top-nav">
        <button 
          type="button" 
          className="help-back-btn"
          onClick={() => onNavigate('settings')}
          id="btn-help-back-settings"
        >
          <ArrowLeft size={18} />
          <span>{language === 'pa' ? 'ਸੈਟਿੰਗਾਂ ਤੇ ਵਾਪਸ' : (language === 'hi' ? 'सेटिंग्स पर वापस' : 'Back to Settings')}</span>
        </button>

        <div className="help-status-pill">
          <span className="help-status-beacon" />
          <span>{language === 'pa' ? 'ਮਾਲਕ ਸਹਾਇਤਾ ਸਰਗਰਮ' : (language === 'hi' ? 'ऐप ओनर सहायता सक्रिय' : 'Founder Help Desk Online')}</span>
        </div>
      </div>

      {/* ─── Hero Header ─── */}
      <div className="help-hero-card">
        <div className="help-hero-badge">
          <PropWiseLogo size="sm" variant="dark" />
          <span className="help-badge-text">PlotIX Official Help Desk</span>
        </div>
        <h1 className="help-hero-title">
          {language === 'pa' 
            ? 'ਅਸੀਂ ਤੁਹਾਡੀ ਸਹਾਇਤਾ ਲਈ ਹਾਜ਼ਰ ਹਾਂ' 
            : (language === 'hi' 
                ? 'हम आपकी सहायता के लिए सदैव उपलब्ध हैं' 
                : 'Direct Founder & Platform Support')}
        </h1>
        <p className="help-hero-subtitle">
          {language === 'pa'
            ? 'ਕਿਸੇ ਵੀ ਤਕਨੀਕੀ ਮਸਲੇ, ਜ਼ਮੀਨ ਰਿਕਾਰਡ, ਨਕਸ਼ਾ ਜਾਂ ਸੁਝਾਅ ਲਈ ਐਪ ਦੇ ਮਾਲਕ ਨਾਲ ਸਿੱਧਾ ਸੰਪਰਕ ਕਰੋ।'
            : (language === 'hi'
                ? 'किसी भी तकनीकी समस्या, ज़मीन रिकॉर्ड, नक्शा या सुझाव के लिए ऐप ओनर से सीधे संपर्क करें।'
                : 'Connect directly with the creator of PlotIX for technical assistance, land records verification, floor plan inquiries, or feedback.')}
        </p>
      </div>

      {/* ─── Founder / Owner Profile Card ─── */}
      <div className="help-owner-card">
        <div className="help-owner-avatar-wrap">
          <div className="help-owner-avatar">M</div>
          <div className="help-owner-badge" title="Verified App Owner">
            <ShieldCheck size={16} />
          </div>
        </div>

        <div className="help-owner-info">
          <div className="help-owner-title-row">
            <h2 className="help-owner-name">Moksh Mittal</h2>
            <span className="help-role-chip">
              <UserCheck size={12} />
              <span>{language === 'pa' ? 'ਐਪ ਮਾਲਕ / ਡਿਵੈਲਪਰ' : (language === 'hi' ? 'ऐप ओनर व संस्थापक' : 'App Owner & Founder')}</span>
            </span>
          </div>
          <span className="help-owner-designation">
            PlotIX · DISCOVER.ANALYZE.INVEST · Mohali & Chandigarh
          </span>
          <p className="help-owner-bio">
            {language === 'pa'
              ? 'ਟ੍ਰਾਈਸਿਟੀ (ਮੋਹਾਲੀ, ਚੰਡੀਗੜ੍ਹ, ਪੰਚਕੂਲਾ) ਅਤੇ ਪੰਜਾਬ ਭਰ ਵਿੱਚ ਪ੍ਰਾਪਰਟੀ ਡਾਟਾ, ਜਮ੍ਹਾਂਬੰਦੀ ਤੇ ਨਕਸ਼ਾ ਟੈਕਨਾਲੋਜੀ ਦੀ ਸੁਵਿਧਾ।'
              : (language === 'hi'
                  ? 'ट्राइसिटी (मोहाली, चंडीगढ़, पंचकूला) और पंजाब में रियल एस्टेट डेटा, जमाबंदी व नक्शा तकनीक की सेवा।'
                  : 'Dedicated to providing precision cadastral land intelligence, verified plots, and AI architectural solutions across North India.')}
          </p>
        </div>
      </div>

      {/* ─── Direct Contact Cards Grid ─── */}
      <div className="help-contact-grid">
        {/* 1. Direct Phone Call */}
        <div className="help-contact-card card-phone">
          <div className="help-card-header">
            <div className="help-card-icon icon-phone">
              <Phone size={22} />
              <span className="icon-pulse-ring" />
            </div>
            <div className="help-card-title-group">
              <span className="help-card-label">{language === 'pa' ? 'ਸਿੱਧਾ ਫ਼ੋਨ ਕਾਲ' : (language === 'hi' ? 'सीधा फोन कॉल' : 'Direct Phone Call')}</span>
              <h3 className="help-card-value">{OWNER_PHONE_DISPLAY}</h3>
            </div>
          </div>
          <p className="help-card-desc">
            {language === 'pa'
              ? 'ਤੁਰੰਤ ਗੱਲਬਾਤ ਲਈ ਸਿੱਧਾ ਕਾਲ ਕਰੋ। ਸਮਾਂ: ਸਵੇਰੇ 9 ਵਜੇ ਤੋਂ ਰਾਤ 9 ਵਜੇ ਤੱਕ।'
              : (language === 'hi'
                  ? 'त्वरित बातचीत के लिए सीधे कॉल करें। समय: सुबह 9 बजे से रात 9 बजे तक।'
                  : 'Call directly for urgent assistance, property onboarding, or app queries.')}
          </p>
          <div className="help-card-actions">
            <a 
              href={`tel:${OWNER_PHONE}`} 
              className="help-action-btn btn-call"
              id="btn-call-owner"
            >
              <Phone size={16} />
              <span>{language === 'pa' ? 'ਹੁਣੇ ਕਾਲ ਕਰੋ' : (language === 'hi' ? 'अभी कॉल करें' : 'Call Now')}</span>
            </a>
            <button 
              type="button" 
              className="help-action-btn btn-copy"
              onClick={() => copyToClipboard(OWNER_PHONE, 'phone')}
              title="Copy number"
              id="btn-copy-phone"
            >
              {copiedType === 'phone' ? <Check size={16} className="text-success" /> : <Copy size={16} />}
              <span>{copiedType === 'phone' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* 2. Official Email */}
        <div className="help-contact-card card-email">
          <div className="help-card-header">
            <div className="help-card-icon icon-email">
              <Mail size={22} />
            </div>
            <div className="help-card-title-group">
              <span className="help-card-label">{language === 'pa' ? 'ਅਧਿਕਾਰਤ ਈਮੇਲ' : (language === 'hi' ? 'आधिकारिक ईमेल' : 'Official Email')}</span>
              <h3 className="help-card-value">{OWNER_EMAIL}</h3>
            </div>
          </div>
          <p className="help-card-desc">
            {language === 'pa'
              ? 'ਦਸਤਾਵੇਜ਼, ਫਰਦ ਜਾਂ ਵਿਸਤ੍ਰਿਤ ਪੁੱਛਗਿੱਛ ਈਮੇਲ ਰਾਹੀਂ ਭੇਜੋ। 24 ਘੰਟਿਆਂ ਵਿੱਚ ਜਵਾਬ।'
              : (language === 'hi'
                  ? 'दस्तावेज, फर्द या विस्तृत पूछताछ ईमेल के माध्यम से भेजें। 24 घंटे में उत्तर।'
                  : 'Send documents, registry deeds, partnership queries or detailed feedback.')}
          </p>
          <div className="help-card-actions">
            <a 
              href={`mailto:${OWNER_EMAIL}?subject=PlotIX%20Inquiry%20-%20Support`} 
              className="help-action-btn btn-email"
              id="btn-email-owner"
            >
              <Mail size={16} />
              <span>{language === 'pa' ? 'ਈਮੇਲ ਭੇਜੋ' : (language === 'hi' ? 'ईमेल भेजें' : 'Send Email')}</span>
            </a>
            <button 
              type="button" 
              className="help-action-btn btn-copy"
              onClick={() => copyToClipboard(OWNER_EMAIL, 'email')}
              title="Copy email"
              id="btn-copy-email"
            >
              {copiedType === 'email' ? <Check size={16} className="text-success" /> : <Copy size={16} />}
              <span>{copiedType === 'email' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* 3. WhatsApp Direct Chat */}
        <div className="help-contact-card card-whatsapp">
          <div className="help-card-header">
            <div className="help-card-icon icon-whatsapp">
              <MessageSquare size={22} />
            </div>
            <div className="help-card-title-group">
              <span className="help-card-label">{language === 'pa' ? 'ਵਟਸਐਪ ਚੈਟ' : (language === 'hi' ? 'व्हाट्सएप चैट' : 'WhatsApp Instant Chat')}</span>
              <h3 className="help-card-value">{OWNER_PHONE_DISPLAY}</h3>
            </div>
          </div>
          <p className="help-card-desc">
            {language === 'pa'
              ? 'ਵਟਸਐਪ ਤੇ ਸਿੱਧਾ ਸੁਨੇਹਾ ਭੇਜੋ, ਫੋਟੋਆਂ ਜਾਂ ਜ਼ਮੀਨ ਦੇ ਨਕਸ਼ੇ ਸਾਂਝੇ ਕਰੋ।'
              : (language === 'hi'
                  ? 'व्हाट्सएप पर सीधा संदेश भेजें, तस्वीरें या प्लॉट के नक्शे साझा करें।'
                  : 'Chat on WhatsApp for instant replies, sharing screenshots, or plot layout reviews.')}
          </p>
          <div className="help-card-actions">
            <a 
              href={`https://wa.me/91${OWNER_PHONE}?text=${encodeURIComponent('Hi Moksh, I am using PlotIX and need assistance.')}`} 
              target="_blank"
              rel="noopener noreferrer"
              className="help-action-btn btn-whatsapp"
              id="btn-whatsapp-owner"
            >
              <MessageSquare size={16} />
              <span>{language === 'pa' ? 'ਵਟਸਐਪ ਤੇ ਗੱਲ ਕਰੋ' : (language === 'hi' ? 'व्हाट्सएप पर चैट करें' : 'Chat on WhatsApp')}</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* ─── Quick Direct Message Form ─── */}
      <div className="help-form-card">
        <div className="help-form-header">
          <div className="form-icon-pill">
            <Send size={16} />
          </div>
          <div>
            <h3 className="help-form-title">
              {language === 'pa' ? 'ਮੋਕਸ਼ ਮਿੱਤਲ ਨੂੰ ਸਿੱਧਾ ਸੁਨੇਹਾ ਭੇਜੋ' : (language === 'hi' ? 'मोक्ष मित्तल को सीधा संदेश भेजें' : 'Send a Quick Message to Moksh')}
            </h3>
            <p className="help-form-subtitle">
              {language === 'pa' 
                ? 'ਆਪਣਾ ਸੁਨੇਹਾ ਲਿਖੋ ਅਤੇ ਵਟਸਐਪ ਜਾਂ ਈਮੇਲ ਰਾਹੀਂ ਤੁਰੰਤ ਭੇਜੋ।' 
                : (language === 'hi' 
                    ? 'अपना संदेश लिखें और व्हाट्सएप या ईमेल द्वारा तुरंत भेजें।' 
                    : 'Compose your query below and send instantly via WhatsApp or Email.')}
            </p>
          </div>
        </div>

        {sentNotice && (
          <div className="help-sent-banner">
            <CheckCircle2 size={18} />
            <span>
              {language === 'pa' 
                ? 'ਤੁਹਾਡਾ ਸੁਨੇਹਾ ਤਿਆਰ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ। ਧੰਨਵਾਦ!' 
                : (language === 'hi' 
                    ? 'आपका संदेश तैयार कर दिया गया है। धन्यवाद!' 
                    : 'Your message has been initiated. Moksh will respond shortly!')}
            </span>
          </div>
        )}

        <form className="help-form">
          <div className="help-form-row">
            <div className="help-form-field">
              <label>{language === 'pa' ? 'ਤੁਹਾਡਾ ਨਾਮ' : (language === 'hi' ? 'आपका नाम' : 'Your Name')}</label>
              <input 
                type="text" 
                placeholder="e.g. Gurpreet Singh / Rahul Sharma"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
              />
            </div>
            <div className="help-form-field">
              <label>{language === 'pa' ? 'ਤੁਹਾਡਾ ਫ਼ੋਨ ਨੰਬਰ' : (language === 'hi' ? 'आपका फोन नंबर' : 'Your Phone Number')}</label>
              <input 
                type="tel" 
                placeholder="e.g. 98765 43210"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="help-form-field">
            <label>{language === 'pa' ? 'ਸੁਨੇਹਾ ਜਾਂ ਸਵਾਲ' : (language === 'hi' ? 'संदेश या प्रश्न' : 'Your Message or Question')} *</label>
            <textarea 
              rows={4}
              placeholder={language === 'pa' 
                ? 'ਦੱਸੋ ਕਿ ਤੁਹਾਨੂੰ ਕਿਸ ਚੀਜ਼ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ (ਜ਼ਮੀਨ ਫਰਦ, ਨਕਸ਼ਾ, ਲਿਸਟਿੰਗ)...' 
                : (language === 'hi' 
                    ? 'बताएं कि आपको किस सहायता की आवश्यकता है (जमाबंदी, नक्शा, लिस्टिंग)...' 
                    : 'Describe what you need assistance with (land records, architectural Naksha, listing a property, or app feedback)...')}
              value={senderMessage}
              onChange={(e) => setSenderMessage(e.target.value)}
              required
            />
          </div>

          <div className="help-form-buttons">
            <button 
              type="button" 
              className="help-submit-btn whatsapp-submit"
              onClick={handleSendWhatsApp}
              disabled={!senderMessage.trim()}
            >
              <MessageSquare size={17} />
              <span>{language === 'pa' ? 'ਵਟਸਐਪ ਰਾਹੀਂ ਭੇਜੋ' : (language === 'hi' ? 'व्हाट्सएप से भेजें' : 'Send via WhatsApp')}</span>
            </button>

            <button 
              type="button" 
              className="help-submit-btn email-submit"
              onClick={handleSendEmail}
              disabled={!senderMessage.trim()}
            >
              <Mail size={17} />
              <span>{language === 'pa' ? 'ਈਮੇਲ ਰਾਹੀਂ ਭੇਜੋ' : (language === 'hi' ? 'ईमेल से भेजें' : 'Send via Email')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
