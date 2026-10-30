import { useState, useEffect } from 'react';
import { FileText, UploadCloud, Search, CheckCircle2, AlertTriangle, ShieldCheck, Download, File, Target, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

interface JamabandiProps {
  onNavigate?: (page: string) => void;
}

export default function Jamabandi({ onNavigate: _onNavigate }: JamabandiProps) {
  const { t, language } = useLanguage();
  const { activeLocation } = useApp();
  const [activeTab, setActiveTab] = useState<'upload' | 'search'>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [selectedState, setSelectedState] = useState(activeLocation?.state || 'Haryana');
  const [searchDistrict, setSearchDistrict] = useState(activeLocation?.district || 'Rewari');
  const [searchTehsil, setSearchTehsil] = useState(activeLocation?.tehsil || activeLocation?.name || 'Bawal');

  useEffect(() => {
    if (activeLocation) {
      setSelectedState(activeLocation.state);
      setSearchDistrict(activeLocation.district);
      setSearchTehsil(activeLocation.tehsil || activeLocation.name);
    }
  }, [activeLocation]);

  const handleUpload = () => {
    setIsAnalyzing(true);
    setHasResult(false);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnalyzing(false);
          setHasResult(true);
          setUploadProgress(0);
        }, 600);
      }
    }, 150);
  };

  return (
    <div className="doc-intell-page" style={{ maxWidth: '1300px', margin: '0 auto' }}>
      
      {/* ─── HEADER ─── */}
      <div className="doc-intell-header" style={{ marginBottom: '20px' }}>
        <div className="header-icon" style={{ background: 'var(--color-primary)', color: '#ffffff' }}>
          <FileText size={26} />
        </div>
        <div className="header-text">
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
            {t.jamabandi.title}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
            {t.jamabandi.subtitle}
          </p>
        </div>
      </div>

      {/* 1-CLICK DEMO TEST BUTTON (FOR ZERO CONFUSION) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(79, 124, 172, 0.12) 100%)',
        border: '1.5px dashed var(--color-accent-dark)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px 18px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={20} style={{ color: 'var(--color-accent-dark)' }} />
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--color-text)' }}>
              {t.jamabandi.demoSampleBtn}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>
              {language === 'pa' ? 'ਬਿਨਾਂ ਫ਼ਾਈਲ ਅੱਪਲੋਡ ਕੀਤੇ ਜਾਂਚ ਕੇ ਵੇਖੋ ਕਿ ਰਿਕਾਰਡ ਕਿਵੇਂ ਪੜ੍ਹਿਆ ਜਾਂਦਾ ਹੈ' :
               (language === 'hi' ? 'बिना फाइल अपलोड किए देखें कि AI सरकारी फर्द को कैसे पढ़ता है' :
                'Test instantly with real Punjab/Haryana revenue sample data')}
            </div>
          </div>
        </div>
        <button
          onClick={handleUpload}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-primary)',
            color: '#ffffff',
            border: 'none',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(11, 23, 38, 0.2)'
          }}
        >
          {t.jamabandi.demoSampleBtn}
        </button>
      </div>

      <div className="doc-intell-layout">
        
        {/* ─── LEFT: UPLOAD / ENTRY ─── */}
        <div className="doc-intell-entry glass-panel">
          <div className="entry-tabs">
            <button 
              className={activeTab === 'upload' ? 'active' : ''} 
              onClick={() => setActiveTab('upload')}
            >
              <UploadCloud size={16} /> {t.jamabandi.uploadTab}
            </button>
            <button 
              className={activeTab === 'search' ? 'active' : ''} 
              onClick={() => setActiveTab('search')}
            >
              <Search size={16} /> {t.jamabandi.searchTab}
            </button>
          </div>

          <div className="entry-content">
            {activeTab === 'upload' && (
              <div className="upload-section">
                <div 
                  className={`dropzone ${isAnalyzing ? 'analyzing' : ''}`}
                  onClick={!isAnalyzing && !hasResult ? handleUpload : undefined}
                >
                  {!isAnalyzing && !hasResult && (
                    <>
                      <div className="dropzone-icon"><UploadCloud size={32} /></div>
                      <h3>{t.jamabandi.dragDropText}</h3>
                      <p>{t.jamabandi.fileFormats}</p>
                      <button className="browse-btn">{t.jamabandi.browseBtn}</button>
                    </>
                  )}
                  
                  {isAnalyzing && (
                    <div className="analyzing-state">
                      <div className="ai-scanner">
                        <div className="ai-scanner-line" />
                        <FileText size={48} className="text-primary opacity-50" />
                      </div>
                      <h3>{t.jamabandi.analyzingText}</h3>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
                      </div>
                      <p>{uploadProgress}% Complete</p>
                    </div>
                  )}

                  {hasResult && !isAnalyzing && (
                    <div className="upload-success">
                      <div className="success-icon"><CheckCircle2 size={32} /></div>
                      <h3>{language === 'pa' ? 'ਜਮ੍ਹਾਂਬੰਦੀ ਰਿਕਾਰਡ ਦੀ ਜਾਂਚ ਸਫਲ' : (language === 'hi' ? 'जमाबंदी रिकॉर्ड जांच सफल' : 'Jamabandi Verified & Extracted')}</h3>
                      <p>Jamabandi_145_2.pdf (Punjab Revenue Record)</p>
                      <button className="reset-btn" onClick={() => setHasResult(false)}>
                        {language === 'pa' ? 'ਦੂਜਾ ਰਿਕਾਰਡ ਚੈੱਕ ਕਰੋ' : (language === 'hi' ? 'दूसरा रिकॉर्ड चेक करें' : 'Upload Another Document')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'search' && (
              <div className="search-section">
                <div className="form-group">
                  <label>{language === 'pa' ? 'ਸੂਬਾ (State)' : (language === 'hi' ? 'राज्य (State)' : 'State')}</label>
                  <select value={selectedState} onChange={e => setSelectedState(e.target.value)}>
                    <option value="Haryana">Haryana (हरियाणा)</option>
                    <option value="Punjab">Punjab (ਪੰਜਾਬ)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>{language === 'pa' ? 'ਜ਼ਿਲ੍ਹਾ (District)' : (language === 'hi' ? 'जिला (District)' : 'District')}</label>
                  <input type="text" value={searchDistrict} onChange={e => setSearchDistrict(e.target.value)} placeholder="e.g. Rewari / Gurugram / Mohali" />
                </div>
                <div className="form-group">
                  <label>{language === 'pa' ? 'ਤਹਿਸੀਲ (Tehsil)' : (language === 'hi' ? 'तहसील (Tehsil)' : 'Tehsil')}</label>
                  <input type="text" value={searchTehsil} onChange={e => setSearchTehsil(e.target.value)} placeholder="e.g. Bawal / Rewari / Dharuhera" />
                </div>
                <div className="form-group">
                  <label>{language === 'pa' ? 'ਪਿੰਡ (Village)' : (language === 'hi' ? 'गांव (Village)' : 'Village')}</label>
                  <input type="text" placeholder="e.g. Khori / Manethi / Sector 3" />
                </div>
                <div className="form-group">
                  <label>{language === 'pa' ? 'ਖਸਰਾ / ਖੇਵਟ ਨੰਬਰ' : (language === 'hi' ? 'खसरा / खेवट नंबर' : 'Khasra / Khewat Number')}</label>
                  <input type="text" placeholder="e.g. 145/2/1" />
                </div>
                <button className="search-submit-btn" onClick={handleUpload}>
                  {language === 'pa' ? 'ਰਿਕਾਰਡ ਦੀ ਪੜਤਾਲ ਕਰੋ' : (language === 'hi' ? 'रिकॉर्ड की जांच करें' : 'Fetch & Analyze Record')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ─── RIGHT: AI ANALYSIS RESULTS ─── */}
        <div className="doc-intell-results">
          {!hasResult && !isAnalyzing && (
            <div className="results-empty glass-panel" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Target size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text)' }}>
                {language === 'pa' ? 'ਰਿਕਾਰਡ ਪੜਤਾਲ ਪੈਨਲ' : (language === 'hi' ? 'सरकारी रिकॉर्ड जांच पैनल' : 'AI Intelligence Panel')}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', maxWidth: '400px', margin: '6px auto 16px' }}>
                {language === 'pa' ? 'ਫ਼ਰਦ ਅੱਪਲੋਡ ਕਰੋ ਜਾਂ ਉੱਪਰ ਦਿੱਤਾ ਸੈਂਪਲ ਬਟਨ ਦਬਾਓ' : (language === 'hi' ? 'फर्द अपलोड करें या ऊपर दिया गया सैंपल बटन दबाएं' : 'Upload a document or click the sample button above to extract ownership.')}
              </p>
              <button 
                onClick={handleUpload}
                style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', background: 'var(--color-primary)', color: '#ffffff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                {t.jamabandi.demoSampleBtn}
              </button>
            </div>
          )}

          {isAnalyzing && (
            <div className="results-loading glass-panel">
              <div className="skeleton-line title" />
              <div className="skeleton-box" />
              <div className="skeleton-grid">
                <div className="skeleton-box sm" />
                <div className="skeleton-box sm" />
              </div>
              <div className="skeleton-line" />
            </div>
          )}

          {hasResult && !isAnalyzing && (
            <motion.div 
              className="results-data"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="result-header glass-panel">
                <div className="badge-verified"><ShieldCheck size={16} /> {t.jamabandi.ownershipDetails}</div>
                <h2>Khasra No. 145/2/1</h2>
                <p>Barewal Awana, Ludhiana West, Punjab</p>
                <div className="doc-meta">
                  <span>Year: 2024-25 (Updated Jamabandi)</span>
                  <span className="dot">•</span>
                  <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>✓ Verified in Tehsil Database</span>
                </div>
              </div>

              <div className="result-grid">
                
                {/* Ownership Card */}
                <div className="data-card propwise-card">
                  <div className="card-label">{t.jamabandi.ownerName} (ਮਾਲਕੀ / मालिकाना)</div>
                  <div className="owner-list">
                    <div className="owner-item">
                      <div className="owner-name">Jaswinder Singh s/o Gurdial Singh</div>
                      <div className="owner-share">1/2 Share (50%)</div>
                    </div>
                    <div className="owner-item">
                      <div className="owner-name">Harpreet Kaur w/o Jaswinder Singh</div>
                      <div className="owner-share">1/2 Share (50%)</div>
                    </div>
                  </div>
                </div>

                {/* Area Card */}
                <div className="data-card propwise-card">
                  <div className="card-label">{t.jamabandi.totalArea} (ਰਕਬਾ / रकबा)</div>
                  <div className="area-value">5 Kanal 4 Marla</div>
                  <div className="area-sub">≈ 3,146 Gaj (28,314 Sq.Ft)</div>
                  <div className="land-type mt-2">
                    <span className="type-label">Classification:</span> Chahi (Irrigated Agriculture / Residential Potential)
                  </div>
                </div>

                {/* Mutation Card */}
                <div className="data-card propwise-card">
                  <div className="card-label">{t.jamabandi.mutationStatus}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-success)', fontWeight: 800, fontSize: '14px', marginTop: '6px' }}>
                    <CheckCircle2 size={16} /> Sanctioned (मंजूरशुदा / ਮਨਜ਼ੂਰਸ਼ੁਦਾ)
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    Mutation No. 892 attested in 2022. Clear chain of ownership.
                  </p>
                </div>

                {/* Encumbrance Card */}
                <div className="data-card propwise-card encumbrance-card">
                  <div className="card-label">{t.jamabandi.encumbranceStatus}</div>
                  <div className="encumbrance-alert" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '12px' }}>
                    <AlertTriangle size={15} />
                    <span>{t.jamabandi.bankMortgage}</span>
                  </div>
                  <p className="enc-details" style={{ fontSize: '12px', marginTop: '6px' }}>
                    Mortgaged to State Bank of India against agriculture credit limit of ₹15,00,000 (Rapat No. 452). Obtain bank NOC before purchase.
                  </p>
                </div>

              </div>

              <div className="doc-actions glass-panel mt-4" style={{ display: 'flex', gap: '10px' }}>
                <button className="action-btn outline">
                  <File size={16} /> {language === 'pa' ? 'ਅਸਲ ਜਮ੍ਹਾਂਬੰਦੀ ਵੇਖੋ' : (language === 'hi' ? 'मूल जमाबंदी देखें' : 'View Original Jamabandi')}
                </button>
                <button className="action-btn primary">
                  <Download size={16} /> {language === 'pa' ? 'ਜਾਂਚ ਰਿਪੋਰਟ ਡਾਊਨਲੋਡ ਕਰੋ' : (language === 'hi' ? 'जांच रिपोर्ट डाउनलोड करें' : 'Download Verification Report')}
                </button>
              </div>
              
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
