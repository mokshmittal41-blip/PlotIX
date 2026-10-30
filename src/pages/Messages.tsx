import { MessageCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Messages() {
  const { t, language } = useLanguage();

  const DEMO_MESSAGES = [
    {
      id: 1,
      from: 'Harpreet Singh',
      company: 'Punjab Properties',
      preview: language === 'pa' 
        ? 'ਸੈਕਟਰ 82 ਪਲਾਟ ਵਿੱਚ ਤੁਹਾਡੀ ਦਿਲਚਸਪੀ ਲਈ ਧੰਨਵਾਦ। ਮਾਲਕ ਗੱਲਬਾਤ ਲਈ ਤਿਆਰ ਹੈ। ਕੀ ਅਸੀਂ ਇਸ ਹਫਤੇ ਸਾਈਟ ਵਿਜ਼ਿਟ ਰੱਖੀਏ?'
        : (language === 'hi' 
          ? 'सेक्टर 82 प्लाट में आपकी रुचि के लिए धन्यवाद। मालिक बातचीत के लिए तैयार हैं। क्या हम इस सप्ताहांत साइट विजिट रखें?'
          : 'Thank you for your interest in Sector 82 plot. The owner is open for negotiation. Should we arrange a site visit this weekend?'),
      time: '2:30 PM',
      unread: true,
      unreadCount: 2,
      avatar: 'H',
      verified: true,
    },
    {
      id: 2,
      from: 'Ravi Sharma',
      company: 'Trimurti Realty',
      preview: language === 'pa'
        ? 'ਪੰਚਕੂਲਾ ਸੈਕਟਰ 20 ਕਾਰਨਰ ਪਲਾਟ ਉਪਲਬਧ ਹੈ। ਰਜਿਸਟਰੀ ਸਾਫ਼ ਹੈ।'
        : (language === 'hi'
          ? 'पंचकूला सेक्टर 20 कॉर्नर प्लाट उपलब्ध है। रजिस्ट्री बिल्कुल साफ व सत्यापित है।'
          : 'The Panchkula Sector 20 corner plot is still available. Registry is clear and verified by our legal team.'),
      time: 'Yesterday',
      unread: true,
      unreadCount: 1,
      avatar: 'R',
      verified: false,
    },
    {
      id: 3,
      from: 'Deepak Verma',
      company: 'Omaxe Realty',
      preview: language === 'pa'
        ? 'ਨਿਊ ਚੰਡੀਗੜ੍ਹ ਵਿਲਾ ਲਈ ਸਾਈਟ ਵਿਜ਼ਿਟ ਸ਼ਨੀਵਾਰ ਸਵੇਰੇ 11 ਵਜੇ ਪੱਕੀ ਹੈ।'
        : (language === 'hi'
          ? 'न्यू चंडीगढ़ विला हेतु शनिवार सुबह 11 बजे साइट विजिट कन्फर्म है।'
          : 'Site visit for New Chandigarh villa confirmed for this Saturday at 11 AM. Please bring your ID proof.'),
      time: '3 days ago',
      unread: false,
      unreadCount: 0,
      avatar: 'D',
      verified: true,
    },
  ];

  const AVATAR_COLORS = ['var(--color-primary)', '#7C3AED', '#059669', '#B45309'];

  return (
    <div>
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.3px', marginBottom: 2 }}>{t.messages.title}</h2>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
            {DEMO_MESSAGES.filter(m => m.unread).length} {t.messages.unreadConversations}
          </div>
        </div>
        {DEMO_MESSAGES.some(m => m.unread) && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'var(--color-accent-bg)', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 700, color: 'var(--color-accent)' }}>
            <span style={{ width: 6, height: 6, background: 'var(--color-accent)', borderRadius: '50%', display: 'inline-block' }} />
            {DEMO_MESSAGES.filter(m => m.unread).length} {t.messages.newBadge}
          </div>
        )}
      </div>

      {/* Message List */}
      <div className="card" style={{ overflow: 'hidden', maxWidth: 640 }}>
        {DEMO_MESSAGES.map((msg, i) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: 12,
              padding: '16px 18px',
              borderBottom: i < DEMO_MESSAGES.length - 1 ? '1px solid var(--color-border)' : 'none',
              cursor: 'pointer',
              background: msg.unread ? 'rgba(37, 99, 235, 0.03)' : 'transparent',
              transition: 'background var(--transition-fast)',
              position: 'relative',
            }}
            role="button"
            tabIndex={0}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = msg.unread ? 'rgba(37, 99, 235, 0.03)' : '')}
          >
            {/* Unread indicator */}
            {msg.unread && (
              <div style={{
                position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                width: 3, height: 32, background: 'var(--color-accent)', borderRadius: '0 2px 2px 0',
              }} />
            )}

            {/* Avatar */}
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: AVATAR_COLORS[i % AVATAR_COLORS.length], color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 16, flexShrink: 0,
              position: 'relative',
            }}>
              {msg.avatar}
              {msg.unreadCount > 0 && (
                <div style={{
                  position: 'absolute', bottom: -2, right: -2,
                  width: 18, height: 18, background: 'var(--color-accent)',
                  borderRadius: '50%', fontSize: 10, fontWeight: 800,
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid var(--color-surface)',
                }}>
                  {msg.unreadCount}
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: msg.unread ? 800 : 600, color: 'var(--color-text)' }}>
                    {msg.from}
                  </span>
                  {msg.verified && (
                    <CheckCircle size={13} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                  )}
                </div>
                <span style={{ fontSize: 11, color: msg.unread ? 'var(--color-accent)' : 'var(--color-text-muted)', fontWeight: msg.unread ? 700 : 400 }}>
                  {msg.time}
                </span>
              </div>

              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4, fontWeight: 500 }}>
                {msg.company}
              </div>

              <p style={{
                fontSize: 13,
                color: msg.unread ? 'var(--color-text)' : 'var(--color-text-muted)',
                fontWeight: msg.unread ? 500 : 400,
                lineHeight: 1.4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                margin: 0,
              }}>
                {msg.preview}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)', fontSize: 12 }}>
        <MessageCircle size={14} />
        <span>{t.messages.secureChatNote}</span>
      </div>
    </div>
  );
}
