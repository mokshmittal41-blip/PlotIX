import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  UserCheck, 
  MapPin, 
  PlusCircle, 
  CheckCircle2, 
  UploadCloud, 
  FileText, 
  Phone, 
  Trash2, 
  Sparkles, 
  Compass, 
  Tag, 
  ArrowRight,
  IndianRupee,
  Layers,
  X,
  RefreshCw,
  Eye,
  Check,
  Navigation,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/useAuth';
import { propertyService } from '../services/propertyService';
import { apiClient } from '../services/apiClient';
import type { Property } from '../types';
import './MyProperties.css';

interface MyPropertiesProps {
  onNavigate?: (page: string, propertyId?: string) => void;
}

export type PropertySubmissionRole = 'broker' | 'buyer';

export interface BuyerRequirementItem {
  id: string;
  title: string;
  property_type: string;
  district: string;
  preferred_area?: string;
  budget_min?: number;
  budget_max: number;
  required_size?: string;
  purpose?: string;
  buyer_name: string;
  buyer_phone: string;
  status: string;
  created_at: string;
}

export default function MyProperties({ onNavigate }: MyPropertiesProps) {
  const { activeLocation, addToast } = useApp();
  const { language, t, translateType, translateIntent, translateUnit, translateDocStatus } = useLanguage();
  const { user } = useAuth();

  // Active Role Mode: 'broker' vs 'buyer'
  const [activeRole, setActiveRole] = useState<PropertySubmissionRole>('broker');

  // Broker Form State
  const [brokerTitle, setBrokerTitle] = useState('');
  const [brokerDescription, setBrokerDescription] = useState('');
  const [brokerType, setBrokerType] = useState('Agricultural Land');
  const [brokerIntent, setBrokerIntent] = useState<'sale' | 'rent'>('sale');
  const [brokerDistrict, setBrokerDistrict] = useState(activeLocation?.district || 'Rewari');
  const [brokerTehsil, setBrokerTehsil] = useState(activeLocation?.tehsil || activeLocation?.name || 'Bawal');
  const [brokerLocality, setBrokerLocality] = useState('');
  const [brokerLatitude, setBrokerLatitude] = useState('');
  const [brokerLongitude, setBrokerLongitude] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [brokerArea, setBrokerArea] = useState('');
  const [brokerAreaUnit, setBrokerAreaUnit] = useState('Acre');
  const [brokerPrice, setBrokerPrice] = useState('');
  const [brokerFacing, setBrokerFacing] = useState('East');
  const [brokerKhasra, setBrokerKhasra] = useState('');
  const [brokerRoadWidth, setBrokerRoadWidth] = useState('30 ft Road');
  const [brokerDocStatus, setBrokerDocStatus] = useState('Clear Registry Verified');
  const [brokerContactName, setBrokerContactName] = useState(user?.name || '');
  const [brokerContactPhone, setBrokerContactPhone] = useState(user?.type === 'phone' ? user.identifier : '');
  const [brokerAgency, setBrokerAgency] = useState('');
  const [brokerImages, setBrokerImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmittingBroker, setIsSubmittingBroker] = useState(false);

  // Buyer Form State
  const [buyerTitle, setBuyerTitle] = useState('');
  const [buyerType, setBuyerType] = useState('Agricultural Land');
  const [buyerDistrict, setBuyerDistrict] = useState(activeLocation?.district || 'Rewari');
  const [buyerPreferredArea, setBuyerPreferredArea] = useState('');
  const [buyerBudgetMin, setBuyerBudgetMin] = useState('');
  const [buyerBudgetMax, setBuyerBudgetMax] = useState('');
  const [buyerRequiredSize, setBuyerRequiredSize] = useState('');
  const [buyerPurpose, setBuyerPurpose] = useState('Immediate Purchase');
  const [buyerName, setBuyerName] = useState(user?.name || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.type === 'phone' ? user.identifier : '');
  const [isSubmittingBuyer, setIsSubmittingBuyer] = useState(false);

  // Database listings state
  const [myPropertiesList, setMyPropertiesList] = useState<Property[]>([]);
  const [myRequirementsList, setMyRequirementsList] = useState<BuyerRequirementItem[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync profile defaults when user loads
  useEffect(() => {
    if (user?.name && !brokerContactName) {
      setBrokerContactName(user.name);
      setBuyerName(user.name);
    }
    if (user?.type === 'phone' && user.identifier && !brokerContactPhone) {
      setBrokerContactPhone(user.identifier);
      setBuyerPhone(user.identifier);
    }
  }, [user]);

  // Sync district with activeLocation if default changed
  useEffect(() => {
    if (activeLocation?.district) {
      if (!brokerDistrict || brokerDistrict === 'Rewari') setBrokerDistrict(activeLocation.district);
      if (!buyerDistrict || buyerDistrict === 'Rewari') setBuyerDistrict(activeLocation.district);
    }
  }, [activeLocation]);

  // Load database listings
  const loadUserData = async () => {
    setIsLoadingListings(true);
    try {
      const [listings, reqsRes] = await Promise.all([
        propertyService.getMyListings(),
        apiClient.getMyBuyerRequirements()
      ]);
      setMyPropertiesList(listings);
      if (reqsRes.success && reqsRes.data) {
        setMyRequirementsList(Array.isArray(reqsRes.data) ? reqsRes.data : []);
      }
    } catch (err) {
      console.error('[MyProperties] Error loading user listings:', err);
    } finally {
      setIsLoadingListings(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [user]);

  // Handle Image Upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 10 * 1024 * 1024) {
        addToast(`Image ${file.name} is larger than 10MB limit.`, 'error');
        continue;
      }
      const uploadRes = await propertyService.uploadImage(file);
      if (uploadRes.success && uploadRes.url) {
        newImages.push(uploadRes.url);
      }
    }

    if (newImages.length > 0) {
      setBrokerImages(prev => [...prev, ...newImages]);
      addToast(language === 'pa' ? 'ਤਸਵੀਰਾਂ ਸਫਲਤਾਪੂਰਵਕ ਅਪਲੋਡ ਹੋ ਗਈਆਂ!' : (language === 'hi' ? 'फोटो सफलतापूर्वक अपलोड हो गई!' : 'Images uploaded successfully!'), 'success');
    }

    setIsUploadingImage(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setBrokerImages(prev => prev.filter((_, i) => i !== index));
  };

  // Detect Live GPS Location via Browser Geolocation
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      addToast('Geolocation is not supported by your browser.', 'error');
      return;
    }
    setIsDetectingLocation(true);
    addToast(language === 'pa' ? 'ਸਹੀ GPS ਲੋਕੇਸ਼ਨ ਖੋਜੀ ਜਾ ਰਹੀ ਹੈ...' : (language === 'hi' ? 'सटीक GPS लोकेशन खोजी जा रही है...' : 'Detecting accurate GPS location...'), 'info');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setBrokerLatitude(lat.toFixed(6));
        setBrokerLongitude(lng.toFixed(6));
        setIsDetectingLocation(false);
        addToast(
          language === 'pa'
            ? `📍 ਸਹੀ GPS ਲੋਕੇਸ਼ਨ ਮਿਲੀ (${lat.toFixed(4)}, ${lng.toFixed(4)})`
            : (language === 'hi'
              ? `📍 सटीक GPS लोकेशन मिली (${lat.toFixed(4)}, ${lng.toFixed(4)})`
              : `📍 Exact GPS location detected (${lat.toFixed(4)}, ${lng.toFixed(4)})`),
          'success'
        );
      },
      (err) => {
        setIsDetectingLocation(false);
        console.warn('[MyProperties] Geolocation error:', err);
        addToast(
          language === 'pa'
            ? 'ਲਾਈਵ ਲੋਕੇਸ਼ਨ ਦੀ ਇਜਾਜ਼ਤ ਨਹੀਂ ਮਿਲੀ। ਤੁਸੀਂ ਹੱਥੀਂ ਕੋਆਰਡੀਨੇਟ ਦਰਜ ਕਰ ਸਕਦੇ ਹੋ।'
            : (language === 'hi'
              ? 'लाइव लोकेशन अनुमति नहीं मिली। आप स्वयं निर्देशांक दर्ज कर सकते हैं।'
              : 'GPS permission denied or timed out. You can enter coordinates manually or verify with Google Maps.'),
          'info'
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Test Location on Google Maps in New Tab
  const handleTestLocationOnGoogleMaps = () => {
    if (brokerLatitude && brokerLongitude) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${brokerLatitude},${brokerLongitude}`, '_blank', 'noopener,noreferrer');
    } else {
      const query = [brokerLocality, brokerTehsil, brokerDistrict, 'India'].filter(Boolean).join(', ');
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
    }
  };

  // Handle Broker Submission
  const handleBrokerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brokerTitle.trim() || !brokerPrice.trim() || !brokerContactName.trim() || !brokerContactPhone.trim()) {
      addToast(language === 'pa' ? 'ਕਿਰਪਾ ਕਰਕੇ ਪ੍ਰਾਪਰਟੀ ਦਾ ਨਾਮ, ਕੀਮਤ ਅਤੇ ਮੋਬਾਈਲ ਨੰਬਰ ਭਰੋ।' : (language === 'hi' ? 'कृपया प्रॉपर्टी का शीर्षक, कीमत और संपर्क जानकारी भरें।' : 'Please fill in the required property title, price, and contact info'), 'error');
      return;
    }

    setIsSubmittingBroker(true);
    try {
      const numLat = brokerLatitude ? parseFloat(brokerLatitude) : undefined;
      const numLng = brokerLongitude ? parseFloat(brokerLongitude) : undefined;
      const coords: [number, number] | undefined = (numLat && numLng && !isNaN(numLat) && !isNaN(numLng)) ? [numLat, numLng] : undefined;

      const createRes = await propertyService.createProperty({
        title: brokerTitle.trim(),
        description: brokerDescription.trim(),
        propertyType: brokerType,
        listingType: brokerIntent,
        district: brokerDistrict,
        tehsil: brokerTehsil,
        locality: brokerLocality || brokerTehsil,
        address: brokerLocality ? `${brokerLocality}, ${brokerTehsil}, ${brokerDistrict}` : `${brokerTehsil}, ${brokerDistrict}`,
        city: brokerDistrict,
        latitude: numLat,
        longitude: numLng,
        coordinates: coords,
        area: brokerArea || '1',
        areaUnit: brokerAreaUnit,
        price: brokerPrice,
        facing: brokerFacing,
        khasraNo: brokerKhasra,
        roadWidth: brokerRoadWidth,
        registryStatus: brokerDocStatus,
        contactName: brokerContactName.trim(),
        contactPhone: brokerContactPhone.trim(),
        agencyName: brokerAgency.trim(),
        images: brokerImages.length > 0 ? brokerImages : undefined
      });

      if (createRes.success && createRes.property) {
        addToast(language === 'pa' ? '🎉 ਪ੍ਰਾਪਰਟੀ ਸਫਲਤਾਪੂਰਵਕ ਲਾਈਵ ਹੋ ਗਈ!' : (language === 'hi' ? '🎉 प्रॉपर्टी सफलतापूर्वक प्रकाशित व लाइव हो गई!' : '🎉 Property published live with accurate Google Maps location immediately!'), 'success');

        // Reset Form
        setBrokerTitle('');
        setBrokerDescription('');
        setBrokerPrice('');
        setBrokerArea('');
        setBrokerLocality('');
        setBrokerLatitude('');
        setBrokerLongitude('');
        setBrokerKhasra('');
        setBrokerImages([]);

        // Reload user listings
        await loadUserData();
      } else {
        addToast(createRes.error || 'Failed to publish property.', 'error');
      }
    } catch (err: any) {
      addToast(`Error: ${err.message || 'Submission failed'}`, 'error');
    } finally {
      setIsSubmittingBroker(false);
    }
  };

  // Handle Buyer Submission
  const handleBuyerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerTitle.trim() || !buyerBudgetMax.trim() || !buyerName.trim() || !buyerPhone.trim()) {
      addToast(language === 'pa' ? 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਮੰਗ, ਬਜਟ ਅਤੇ ਮੋਬਾਈਲ ਨੰਬਰ ਭਰੋ।' : (language === 'hi' ? 'कृपया अपनी मांग, बजट और संपर्क जानकारी भरें।' : 'Please enter your requirement title, budget, and contact info'), 'error');
      return;
    }

    setIsSubmittingBuyer(true);
    try {
      const res = await apiClient.createBuyerRequirement({
        title: buyerTitle.trim(),
        propertyType: buyerType,
        district: buyerDistrict,
        preferredArea: buyerPreferredArea || buyerDistrict,
        budgetMin: buyerBudgetMin,
        budgetMax: buyerBudgetMax,
        requiredSize: buyerRequiredSize || (language === 'pa' ? 'ਬਜਟ ਮੁਤਾਬਕ' : (language === 'hi' ? 'बजट अनुसार' : 'As per budget')),
        purpose: buyerPurpose,
        buyerName: buyerName.trim(),
        buyerPhone: buyerPhone.trim()
      });

      if (res.success) {
        addToast(language === 'pa' ? '🎯 ਤੁਹਾਡੀ ਲੋੜ ਦਰਜ ਹੋ ਗਈ ਹੈ! ਸਥਾਨਕ ਡੀਲਰਾਂ ਨੂੰ ਸੂਚਿਤ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ।' : (language === 'hi' ? '🎯 खरीदार आवश्यकता पोस्ट हो गई! स्थानीय डीलरों को सूचित किया गया।' : '🎯 Buyer requirement posted! Matching local brokers notified.'), 'success');

        // Reset Form
        setBuyerTitle('');
        setBuyerBudgetMin('');
        setBuyerBudgetMax('');
        setBuyerPreferredArea('');
        setBuyerRequiredSize('');

        await loadUserData();
      } else {
        addToast(res.error || 'Failed to post requirement.', 'error');
      }
    } catch (err: any) {
      addToast(`Error: ${err.message || 'Post failed'}`, 'error');
    } finally {
      setIsSubmittingBuyer(false);
    }
  };

  // Status Change handler (mark sold/rented)
  const handleStatusChange = async (propertyId: string, newStatus: 'active' | 'sold' | 'rented') => {
    try {
      const res = await propertyService.updateProperty(propertyId, { status: newStatus });
      if (res.success) {
        addToast(`Listing status updated to ${newStatus}`, 'success');
        await loadUserData();
      } else {
        addToast(res.error || 'Failed to update status', 'error');
      }
    } catch {
      addToast('Status update failed', 'error');
    }
  };

  // Delete handlers
  const handleDeleteBrokerListing = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this property listing?')) return;
    try {
      const res = await propertyService.deleteProperty(id);
      if (res.success) {
        addToast(language === 'pa' ? 'ਲਿਸਟਿੰਗ ਹਟਾ ਦਿੱਤੀ ਗਈ' : (language === 'hi' ? 'लिस्टिंग हटा दी गई' : 'Property listing removed'), 'info');
        await loadUserData();
      } else {
        addToast(res.error || 'Failed to delete listing', 'error');
      }
    } catch {
      addToast('Delete failed', 'error');
    }
  };

  const handleDeleteBuyerRequirement = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this requirement inquiry?')) return;
    try {
      const res = await apiClient.deleteBuyerRequirement(id);
      if (res.success) {
        addToast(language === 'pa' ? 'ਲੋੜ ਹਟਾ ਦਿੱਤੀ ਗਈ' : (language === 'hi' ? 'मांग हटा दी गई' : 'Requirement inquiry removed'), 'info');
        await loadUserData();
      } else {
        addToast(res.error || 'Failed to delete requirement', 'error');
      }
    } catch {
      addToast('Delete failed', 'error');
    }
  };

  const propertyTypeOptions = [
    'Agricultural Land', 
    'Residential Plot', 
    'Villa / House', 
    'Commercial SCO', 
    'Industrial Land'
  ];

  const purposeOptions = [
    { id: 'Immediate Purchase', label: language === 'pa' ? 'ਤੁਰੰਤ ਖਰੀਦ (30 ਦਿਨਾਂ ਅੰਦਰ)' : (language === 'hi' ? 'तुरंत खरीद (30 दिनों में)' : 'Immediate Purchase (Within 30 Days)') },
    { id: 'Investment for 2-3 Years', label: language === 'pa' ? '2-3 ਸਾਲ ਲਈ ਨਿਵੇਸ਼' : (language === 'hi' ? '2-3 वर्ष के लिए निवेश' : 'Investment for 2-3 Years') },
    { id: 'Immediate Construction', label: language === 'pa' ? 'ਤੁਰੰਤ ਮਕਾਨ ਬਣਾਉਣ ਲਈ' : (language === 'hi' ? 'तुरंत मकान निर्माण हेतु' : 'Immediate Construction') },
    { id: 'Commercial Setup', label: language === 'pa' ? 'ਵਪਾਰਕ ਦੁਕਾਨ / ਦਫ਼ਤਰ' : (language === 'hi' ? 'कमर्शियल सेटअप / दुकान' : 'Commercial Setup') },
    { id: 'Agricultural / Farm House', label: language === 'pa' ? 'ਖੇਤੀਬਾੜੀ / ਫਾਰਮ ਹਾਊਸ' : (language === 'hi' ? 'कृषि / फार्म हाउस' : 'Agricultural / Farm House') }
  ];

  return (
    <div className="my-prop-portal-wrapper">
      {/* ─── Top Hero Title ──────────────────────────────────────────────────── */}
      <div className="my-prop-hero">
        <div className="my-prop-hero-pill">
          <Sparkles size={13} />
          {language === 'pa' ? 'ਪ੍ਰੋਪਵਾਈਜ਼ ਜਾਇਦਾਦ ਪੋਰਟਲ' : (language === 'hi' ? 'PropWise प्रॉपर्टी पोर्टल' : 'PropWise Direct Property Portal')}
        </div>
        <h1 className="my-prop-hero-title">{t.myProperties.title}</h1>
        <p className="my-prop-hero-subtitle">{t.myProperties.subtitle}</p>
      </div>

      {/* ─── 2 Role Selector Cards ────────────────────────────────────────────── */}
      <div className="role-selector-grid">
        {/* Option 1: Broker / Seller */}
        <div 
          className={`role-select-card broker ${activeRole === 'broker' ? 'active' : ''}`}
          onClick={() => setActiveRole('broker')}
          id="btn-select-role-broker"
        >
          <div className="role-card-header">
            <div className="role-icon-box">
              <Building2 size={24} />
            </div>
            <span className="role-tag-pill">{t.myProperties.brokerSellerRole}</span>
          </div>
          <h2 className="role-title">{t.myProperties.addAsBroker}</h2>
          <p className="role-description">
            {language === 'pa' 
              ? 'ਪਲਾਟ, ਖੇਤੀ ਜ਼ਮੀਨ ਜਾਂ ਮਕਾਨ ਵੇਚਣ ਜਾਂ ਕਿਰਾਏ \'ਤੇ ਦੇਣ ਲਈ ਲਿਸਟ ਕਰੋ। ਤੁਰੰਤ ਲਾਈਵ ਹੋਵੇਗੀ।' 
              : (language === 'hi' 
                ? 'अपने प्लाट, कृषि भूमि या मकान को बिक्री या किराए पर देने हेतु लिस्ट करें। तुरंत लाइव प्रकाशित।' 
                : 'List your verified plots, agricultural land, built homes, or commercial real estate. Published live immediately.')}
          </p>
          <div className="role-check-indicator">
            {activeRole === 'broker' ? (
              <>
                <CheckCircle2 size={16} />
                <span>{language === 'pa' ? 'ਚੁਣਿਆ ਗਿਆ ਫਾਰਮ' : (language === 'hi' ? 'चयनित फॉर्म मोड' : 'Selected Form Mode')}</span>
              </>
            ) : (
              <span>{language === 'pa' ? 'ਬਦਲਣ ਲਈ ਕਲਿੱਕ ਕਰੋ' : (language === 'hi' ? 'बदलने के लिए क्लिक करें' : 'Click to switch')}</span>
            )}
          </div>
        </div>

        {/* Option 2: Buyer / Investor */}
        <div 
          className={`role-select-card buyer ${activeRole === 'buyer' ? 'active' : ''}`}
          onClick={() => setActiveRole('buyer')}
          id="btn-select-role-buyer"
        >
          <div className="role-card-header">
            <div className="role-icon-box">
              <UserCheck size={24} />
            </div>
            <span className="role-tag-pill">{t.myProperties.buyerInvestorRole}</span>
          </div>
          <h2 className="role-title">{t.myProperties.addAsBuyer}</h2>
          <p className="role-description">
            {language === 'pa' 
              ? 'ਆਪਣੀ ਪਸੰਦੀਦਾ ਜ਼ਮੀਨ ਜਾਂ ਪਲਾਟ ਦੀ ਮੰਗ ਤੇ ਬਜਟ ਦਰਜ ਕਰੋ ਅਤੇ ਡੀਲਰਾਂ ਤੋਂ ਸਿੱਧੇ ਰਾਬਤਾ ਕਰੋ।' 
              : (language === 'hi' 
                ? 'अपनी जरूरत, पसंदीदा जिला व बजट पोस्ट करें और प्रमाणित डीलरों से सीधे संपर्क पाएं।' 
                : 'Post your property requirement, target district, and budget. Get direct matches from verified local dealers.')}
          </p>
          <div className="role-check-indicator">
            {activeRole === 'buyer' ? (
              <>
                <CheckCircle2 size={16} />
                <span>{language === 'pa' ? 'ਚੁਣਿਆ ਗਿਆ ਫਾਰਮ' : (language === 'hi' ? 'चयनित फॉर्म मोड' : 'Selected Form Mode')}</span>
              </>
            ) : (
              <span>{language === 'pa' ? 'ਬਦਲਣ ਲਈ ਕਲਿੱਕ ਕਰੋ' : (language === 'hi' ? 'बदलने के लिए क्लिक करें' : 'Click to switch')}</span>
            )}
          </div>
        </div>
      </div>

      {/* ─── DYNAMIC FORM SECTION ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {/* 🏢 MODE 1: BROKER / OWNER FORM */}
        {activeRole === 'broker' && (
          <motion.div
            key="broker-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="add-property-form-card"
          >
            <div className="form-section-head">
              <div className="form-section-title-group">
                <div className="form-badge-icon broker-mode">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="form-main-heading">{t.myProperties.addAsBroker}</h3>
                  <p className="form-main-sub">{language === 'pa' ? 'ਪੰਜਾਬ ਅਤੇ ਹਰਿਆਣਾ ਦੀਆਂ ਮੰਡੀਆਂ ਵਿੱਚ ਪਲਾਟ ਜਾਂ ਜ਼ਮੀਨ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ — ਬਿਨਾਂ ਕਿਸੇ ਦੇਰੀ ਤੁਰੰਤ ਲਾਈਵ' : (language === 'hi' ? 'हरियाणा व पंजाब के बाजारों में जमीन या प्लाट प्रकाशित करें — बिना किसी देरी के तुरंत लाइव' : 'Publish land, plots, or houses across Haryana & Punjab markets — Published Live Instantly')}</p>
                </div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', background: 'rgba(5,150,105,0.1)', padding: '4px 10px', borderRadius: '999px' }}>
                ⚡ Instant Live
              </span>
            </div>

            <form onSubmit={handleBrokerSubmit}>
              {/* Property Title */}
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="form-label" htmlFor="input-broker-title">
                  <Tag size={15} />
                  {t.myProperties.propertyTitle} <span className="form-label-req">*</span>
                </label>
                <input
                  type="text"
                  id="input-broker-title"
                  className="form-input"
                  placeholder={language === 'pa' ? 'ਜਿਵੇਂ: 2 ਏਕੜ ਹਾਈਵੇ ਫੇਸਿੰਗ ਜ਼ਮੀਨ ਬਾਵਲ ਆਈ.ਐਮ.ਟੀ ਨੇੜੇ' : (language === 'hi' ? 'उदा: 2 एकड़ हाईवे फेसिंग जमीन बावल IMT के पास' : 'e.g. 2 Acre Highway Facing Agricultural Land near Bawal IMT')}
                  value={brokerTitle}
                  onChange={(e) => setBrokerTitle(e.target.value)}
                  required
                />
              </div>

              {/* Property Description */}
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="form-label" htmlFor="input-broker-desc">
                  <FileText size={15} />
                  {language === 'pa' ? 'ਵੇਰਵਾ / ਖਾਸ ਗੱਲਾਂ' : (language === 'hi' ? 'विवरण एवं विशेषताएं' : 'Property Description & Details')}
                </label>
                <textarea
                  id="input-broker-desc"
                  className="form-input"
                  rows={3}
                  placeholder={language === 'pa' ? 'ਪ੍ਰਾਪਰਟੀ ਬਾਰੇ ਵਿਸਤਾਰ ਨਾਲ ਲਿਖੋ (ਜਿਵੇਂ: ਪਾਣੀ, ਬਿਜਲੀ, ਸੜਕ ਕਨੈਕਟੀਵਿਟੀ, ਰਜਿਸਟਰੀ ਸਥਿਤੀ)' : (language === 'hi' ? 'प्रॉपर्टी का पूरा विवरण लिखें (उदा: सड़क चौड़ाई, बिजली, पानी, रजिस्ट्री स्थिति)' : 'Provide complete property details, road access, registry status, electricity, and water connectivity...')}
                  value={brokerDescription}
                  onChange={(e) => setBrokerDescription(e.target.value)}
                  style={{ height: 'auto', padding: '10px 14px', resize: 'vertical' }}
                />
              </div>

              {/* Property Category & Intent */}
              <div className="form-grid-row">
                <div className="form-group">
                  <label className="form-label">{t.myProperties.propertyType}</label>
                  <div className="category-pills-row">
                    {propertyTypeOptions.map(type => (
                      <button
                        key={type}
                        type="button"
                        className={`cat-pill-btn ${brokerType === type ? 'active broker' : ''}`}
                        onClick={() => setBrokerType(type)}
                      >
                        {translateType(type)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t.myProperties.purpose}</label>
                  <div className="category-pills-row">
                    <button
                      type="button"
                      className={`cat-pill-btn ${brokerIntent === 'sale' ? 'active broker' : ''}`}
                      onClick={() => setBrokerIntent('sale')}
                    >
                      {translateIntent('sale')}
                    </button>
                    <button
                      type="button"
                      className={`cat-pill-btn ${brokerIntent === 'rent' ? 'active broker' : ''}`}
                      onClick={() => setBrokerIntent('rent')}
                    >
                      {translateIntent('rent')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Location Hierarchy */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label" htmlFor="select-broker-district">
                    <MapPin size={15} /> {t.myProperties.district} <span className="form-label-req">*</span>
                  </label>
                  <select
                    id="select-broker-district"
                    className="form-select"
                    value={brokerDistrict}
                    onChange={(e) => setBrokerDistrict(e.target.value)}
                  >
                    <option value="Rewari">Rewari (Haryana)</option>
                    <option value="Gurugram">Gurugram (Haryana)</option>
                    <option value="SAS Nagar (Mohali)">SAS Nagar / Mohali (Punjab)</option>
                    <option value="Patiala">Patiala (Punjab)</option>
                    <option value="Panchkula">Panchkula (Haryana)</option>
                    <option value="Chandigarh">Chandigarh (UT)</option>
                    <option value="Ludhiana">Ludhiana (Punjab)</option>
                    <option value="Bathinda">Bathinda (Punjab)</option>
                    <option value="Sangrur">Sangrur (Punjab)</option>
                    <option value="Amritsar">Amritsar (Punjab)</option>
                    <option value="Jalandhar">Jalandhar (Punjab)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="input-broker-tehsil">{t.myProperties.tehsil}</label>
                  <input
                    type="text"
                    id="input-broker-tehsil"
                    className="form-input"
                    placeholder="e.g. Bawal / Rewari / Kharar / Sunam"
                    value={brokerTehsil}
                    onChange={(e) => setBrokerTehsil(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="input-broker-locality">{t.myProperties.locality}</label>
                  <input
                    type="text"
                    id="input-broker-locality"
                    className="form-input"
                    placeholder="e.g. Model Town / Jakhal Road / NH-48"
                    value={brokerLocality}
                    onChange={(e) => setBrokerLocality(e.target.value)}
                  />
                </div>
              </div>

              {/* ─── GOOGLE MAPS & GPS LOCATION PIN (ACCURATE LOCATION) ─── */}
              <div style={{
                marginBottom: '20px',
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(56, 189, 248, 0.04)',
                border: '1.5px solid rgba(56, 189, 248, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Navigation size={16} style={{ color: '#38bdf8' }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--color-text)' }}>
                      {language === 'pa' ? 'ਗੂਗਲ ਮੈਪਸ ਲੋਕੇਸ਼ਨ ਤੇ GPS ਪਿੰਨ' : (language === 'hi' ? 'गूगल मैप्स लोकेशन एवं GPS पिन' : 'Google Maps Location & Accurate GPS Pin')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleDetectCurrentLocation}
                      disabled={isDetectingLocation}
                      className="btn btn-outline btn-sm"
                      style={{
                        borderColor: '#38bdf8',
                        color: '#38bdf8',
                        background: 'rgba(56, 189, 248, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        fontSize: '11.5px',
                        fontWeight: 700
                      }}
                    >
                      {isDetectingLocation ? <RefreshCw size={12} className="spin" /> : <Navigation size={12} />}
                      <span>{isDetectingLocation ? 'Detecting GPS...' : '📍 Use Live GPS Location'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleTestLocationOnGoogleMaps}
                      className="btn btn-ghost btn-sm"
                      style={{
                        color: '#60a5fa',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: '11.5px',
                        fontWeight: 700
                      }}
                    >
                      <ExternalLink size={12} />
                      <span>Verify on Google Maps</span>
                    </button>
                  </div>
                </div>

                <div className="form-grid-row" style={{ marginBottom: 0 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>
                      Latitude (e.g. 30.1340)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Optional / auto-detected"
                      value={brokerLatitude}
                      onChange={(e) => setBrokerLatitude(e.target.value)}
                      style={{ height: '38px', fontSize: '12.5px' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '12px' }}>
                      Longitude (e.g. 75.8080)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Optional / auto-detected"
                      value={brokerLongitude}
                      onChange={(e) => setBrokerLongitude(e.target.value)}
                      style={{ height: '38px', fontSize: '12.5px' }}
                    />
                  </div>
                </div>

                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: '8px 0 0', lineHeight: 1.4 }}>
                  💡 {language === 'pa' ? 'ਜੇਕਰ ਖਾਲੀ ਛੱਡਿਆ ਜਾਵੇ, ਤਾਂ ਸ਼ਹਿਰ ਅਤੇ ਇਲਾਕੇ ਅਨੁਸਾਰ ਆਟੋ-ਮੈਪ ਹੋ ਜਾਵੇਗਾ।' : (language === 'hi' ? 'यदि खाली छोड़ें, तो शहर और इलाके के अनुसार स्वतः सटीक लोकेशन पिन बन जाएगी।' : 'If left blank, PropWise automatically resolves exact coordinates from the locality and city.')}
                </p>
              </div>

              {/* Area & Price */}
              <div className="form-grid-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="input-broker-area">
                    <Layers size={15} /> {t.myProperties.area} <span className="form-label-req">*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      step="any"
                      id="input-broker-area"
                      className="form-input"
                      placeholder="e.g. 2, 150, 500"
                      value={brokerArea}
                      onChange={(e) => setBrokerArea(e.target.value)}
                      style={{ flex: 2 }}
                      required
                    />
                    <select
                      className="form-select"
                      value={brokerAreaUnit}
                      onChange={(e) => setBrokerAreaUnit(e.target.value)}
                      style={{ flex: 1 }}
                    >
                      <option value="Acre">{translateUnit('Acre')}</option>
                      <option value="sq.yd.">{translateUnit('Gaj')}</option>
                      <option value="Bigha">{translateUnit('Bigha')}</option>
                      <option value="Marla">{translateUnit('Marla')}</option>
                      <option value="Kanal">{translateUnit('Kanal')}</option>
                      <option value="sq.ft.">{translateUnit('Sq.Ft')}</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="input-broker-price">
                    <IndianRupee size={15} /> {t.myProperties.askingPrice} <span className="form-label-req">*</span>
                  </label>
                  <input
                    type="text"
                    id="input-broker-price"
                    className="form-input"
                    placeholder="e.g. 8500000 or ₹85 Lakh / ₹2.25 Cr"
                    value={brokerPrice}
                    onChange={(e) => setBrokerPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Land Records & Road Width & Facing */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label" htmlFor="input-broker-khasra">
                    <FileText size={15} /> {t.myProperties.khasraNo} ({language === 'pa' ? 'ਵਿਕਲਪਿਕ' : (language === 'hi' ? 'वैकल्पिक' : 'Optional')})
                  </label>
                  <input
                    type="text"
                    id="input-broker-khasra"
                    className="form-input"
                    placeholder="e.g. 142//15/2"
                    value={brokerKhasra}
                    onChange={(e) => setBrokerKhasra(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="select-broker-road">{t.myProperties.roadConnectivity}</label>
                  <select
                    id="select-broker-road"
                    className="form-select"
                    value={brokerRoadWidth}
                    onChange={(e) => setBrokerRoadWidth(e.target.value)}
                  >
                    <option value="20">20 ft Internal Road</option>
                    <option value="30">30 ft Colony Road</option>
                    <option value="60">60 ft Sector Road</option>
                    <option value="100">100 ft Main Highway / NH</option>
                    <option value="Corner Plot">Corner Plot (2-Side Road)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="select-broker-facing">Facing</label>
                  <select
                    id="select-broker-facing"
                    className="form-select"
                    value={brokerFacing}
                    onChange={(e) => setBrokerFacing(e.target.value)}
                  >
                    <option value="East">East Facing</option>
                    <option value="West">West Facing</option>
                    <option value="North">North Facing</option>
                    <option value="South">South Facing</option>
                    <option value="North-East">North-East Facing</option>
                    <option value="North-West">North-West Facing</option>
                  </select>
                </div>
              </div>

              {/* Registry Status */}
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="form-label" htmlFor="select-broker-doc">{t.myProperties.registryStatus}</label>
                <select
                  id="select-broker-doc"
                  className="form-select"
                  value={brokerDocStatus}
                  onChange={(e) => setBrokerDocStatus(e.target.value)}
                >
                  <option value="Clear Registry Verified">{translateDocStatus('Clear Registry Verified')}</option>
                  <option value="Title Deed 2024-25 Available">{translateDocStatus('Title Deed 2024-25 Available')}</option>
                  <option value="CLU / GMADA Approved">{translateDocStatus('CLU / GMADA Approved')}</option>
                  <option value="Lal Dora / Abadi Deh">{translateDocStatus('Lal Dora / Abadi Deh')}</option>
                </select>
              </div>

              {/* Contact Info */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label" htmlFor="input-broker-name">
                    <UserCheck size={15} /> {t.myProperties.contactName} <span className="form-label-req">*</span>
                  </label>
                  <input
                    type="text"
                    id="input-broker-name"
                    className="form-input"
                    placeholder="e.g. Moksh Properties"
                    value={brokerContactName}
                    onChange={(e) => setBrokerContactName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="input-broker-phone">
                    <Phone size={15} /> {t.myProperties.phone} <span className="form-label-req">*</span>
                  </label>
                  <input
                    type="tel"
                    id="input-broker-phone"
                    className="form-input"
                    placeholder="e.g. +91 98765 43210"
                    value={brokerContactPhone}
                    onChange={(e) => setBrokerContactPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="input-broker-agency">{t.myProperties.agencyName}</label>
                  <input
                    type="text"
                    id="input-broker-agency"
                    className="form-input"
                    placeholder="e.g. RERA-HR-2024 / Direct Owner"
                    value={brokerAgency}
                    onChange={(e) => setBrokerAgency(e.target.value)}
                  />
                </div>
              </div>

              {/* Real Photo Upload with Supabase Storage */}
              <div className="form-group" style={{ marginTop: '12px' }}>
                <label className="form-label">
                  <UploadCloud size={15} /> {t.myProperties.photos} ({language === 'pa' ? 'ਤਸਵੀਰਾਂ' : (language === 'hi' ? 'फोटो' : 'Images')})
                </label>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageFileChange} 
                  multiple 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                <div 
                  className="form-upload-zone" 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: isUploadingImage ? 'wait' : 'pointer' }}
                >
                  <div className="upload-icon-circle">
                    {isUploadingImage ? <RefreshCw size={22} className="spin" /> : <UploadCloud size={22} />}
                  </div>
                  <span className="upload-main-text">
                    {isUploadingImage 
                      ? 'Uploading images to Supabase Storage...' 
                      : (language === 'pa' ? 'ਤਸਵੀਰਾਂ ਜਾਂ ਨਕਸ਼ਾ ਅਪਲੋਡ ਕਰਨ ਲਈ ਕਲਿੱਕ ਕਰੋ' : (language === 'hi' ? 'प्रॉपर्टी फोटो या नक्शा अपलोड करने के लिए क्लिक करें' : 'Click to Upload Real Property Images'))}
                  </span>
                  <span className="upload-sub-text">PNG, JPG, WebP up to 10MB each</span>
                </div>

                {/* Uploaded Image Previews */}
                {brokerImages.length > 0 && (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                    {brokerImages.map((imgUrl, idx) => (
                      <div key={idx} style={{ position: 'relative', width: 90, height: 70, borderRadius: 8, overflow: 'hidden', border: '1.5px solid var(--color-border)' }}>
                        <img src={imgUrl} alt={`Upload ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          style={{
                            position: 'absolute', top: 2, right: 2, width: 20, height: 20,
                            borderRadius: '50%', background: 'rgba(0,0,0,0.7)', color: 'white',
                            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="form-submit-btn-wrap">
                <button 
                  type="submit" 
                  className="form-submit-btn broker-btn" 
                  id="btn-submit-broker-property"
                  disabled={isSubmittingBroker}
                  style={{ opacity: isSubmittingBroker ? 0.7 : 1 }}
                >
                  {isSubmittingBroker ? <RefreshCw size={20} className="spin" /> : <PlusCircle size={20} />}
                  <span>{isSubmittingBroker ? 'Publishing live...' : t.myProperties.publishListing}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* 🎯 MODE 2: BUYER FORM */}
        {activeRole === 'buyer' && (
          <motion.div
            key="buyer-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="add-property-form-card"
          >
            <div className="form-section-head">
              <div className="form-section-title-group">
                <div className="form-badge-icon buyer-mode">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 className="form-main-heading">{t.myProperties.addAsBuyer}</h3>
                  <p className="form-main-sub">{language === 'pa' ? 'ਆਪਣੀ ਮੰਗ ਸਥਾਨਕ ਪ੍ਰਮਾਣਿਤ ਡੀਲਰਾਂ ਤੱਕ ਪਹੁੰਚਾਓ' : (language === 'hi' ? 'अपनी खरीद आवश्यकता सीधे स्थानीय प्रमाणित ब्रोकरों तक पहुंचाएं' : 'Broadcast your buying demand directly to local verified brokers')}</p>
                </div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563eb', background: 'rgba(37,99,235,0.1)', padding: '4px 10px', borderRadius: '999px' }}>
                {t.myProperties.buyerInvestorRole}
              </span>
            </div>

            <form onSubmit={handleBuyerSubmit}>
              {/* Requirement Title */}
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="form-label" htmlFor="input-buyer-title">
                  <Tag size={15} />
                  {language === 'pa' ? 'ਤੁਹਾਨੂੰ ਕਿਸ ਤਰ੍ਹਾਂ ਦੀ ਜਾਇਦਾਦ ਚਾਹੀਦੀ ਹੈ?' : (language === 'hi' ? 'आपको किस प्रकार की प्रॉपर्टी चाहिए?' : 'What type of property are you looking for?')} <span className="form-label-req">*</span>
                </label>
                <input
                  type="text"
                  id="input-buyer-title"
                  className="form-input"
                  placeholder={language === 'pa' ? 'ਜਿਵੇਂ: ਮਾਡਲ ਟਾਊਨ ਵਿੱਚ 150-200 ਗਜ਼ ਪਲਾਟ ਦੀ ਭਾਲ ਹੈ' : (language === 'hi' ? 'उदा: मॉडल टाउन में 150-200 गज प्लाट की तलाश' : 'e.g. Looking for 150-200 Gaj Plot in Model Town or Sector 3')}
                  value={buyerTitle}
                  onChange={(e) => setBuyerTitle(e.target.value)}
                  required
                />
              </div>

              {/* Property Category */}
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="form-label">{t.myProperties.propertyType}</label>
                <div className="category-pills-row">
                  {propertyTypeOptions.map(type => (
                    <button
                      key={type}
                      type="button"
                      className={`cat-pill-btn ${buyerType === type ? 'active buyer' : ''}`}
                      onClick={() => setBuyerType(type)}
                    >
                      {translateType(type)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Preference */}
              <div className="form-grid-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="select-buyer-district">
                    <MapPin size={15} /> {t.myProperties.preferredDistrict} <span className="form-label-req">*</span>
                  </label>
                  <select
                    id="select-buyer-district"
                    className="form-select"
                    value={buyerDistrict}
                    onChange={(e) => setBuyerDistrict(e.target.value)}
                  >
                    <option value="Rewari">Rewari (Haryana)</option>
                    <option value="Gurugram">Gurugram (Haryana)</option>
                    <option value="SAS Nagar (Mohali)">SAS Nagar / Mohali (Punjab)</option>
                    <option value="Patiala">Patiala (Punjab)</option>
                    <option value="Panchkula">Panchkula (Haryana)</option>
                    <option value="Chandigarh">Chandigarh (UT)</option>
                    <option value="Ludhiana">Ludhiana (Punjab)</option>
                    <option value="Bathinda">Bathinda (Punjab)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="input-buyer-area-pref">
                    {t.myProperties.preferredArea}
                  </label>
                  <input
                    type="text"
                    id="input-buyer-area-pref"
                    className="form-input"
                    placeholder="e.g. Model Town / Khori / Bawal NH-48 / Sec 82"
                    value={buyerPreferredArea}
                    onChange={(e) => setBuyerPreferredArea(e.target.value)}
                  />
                </div>
              </div>

              {/* Budget Range & Required Size */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label" htmlFor="input-buyer-budget-min">{t.myProperties.minBudget}</label>
                  <input
                    type="text"
                    id="input-buyer-budget-min"
                    className="form-input"
                    placeholder="e.g. 2000000 or ₹20 Lakh"
                    value={buyerBudgetMin}
                    onChange={(e) => setBuyerBudgetMin(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="input-buyer-budget-max">
                    <IndianRupee size={15} /> {t.myProperties.maxBudget} <span className="form-label-req">*</span>
                  </label>
                  <input
                    type="text"
                    id="input-buyer-budget-max"
                    className="form-input"
                    placeholder="e.g. 12500000 or ₹1.25 Cr"
                    value={buyerBudgetMax}
                    onChange={(e) => setBuyerBudgetMax(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="input-buyer-size">{t.myProperties.requiredSize}</label>
                  <input
                    type="text"
                    id="input-buyer-size"
                    className="form-input"
                    placeholder="e.g. 2 Acre or 200 Gaj"
                    value={buyerRequiredSize}
                    onChange={(e) => setBuyerRequiredSize(e.target.value)}
                  />
                </div>
              </div>

              {/* Purchase Purpose & Timeline */}
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="form-label">{t.myProperties.purpose}</label>
                <div className="category-pills-row">
                  {purposeOptions.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      className={`cat-pill-btn ${buyerPurpose === p.id ? 'active buyer' : ''}`}
                      onClick={() => setBuyerPurpose(p.id)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buyer Contact Information */}
              <div className="form-grid-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="input-buyer-name">
                    <UserCheck size={15} /> {t.myProperties.contactName} <span className="form-label-req">*</span>
                  </label>
                  <input
                    type="text"
                    id="input-buyer-name"
                    className="form-input"
                    placeholder="e.g. Amit Sharma"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="input-buyer-phone">
                    <Phone size={15} /> {t.myProperties.phone} <span className="form-label-req">*</span>
                  </label>
                  <input
                    type="tel"
                    id="input-buyer-phone"
                    className="form-input"
                    placeholder="e.g. +91 98765 43210"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="form-submit-btn-wrap">
                <button 
                  type="submit" 
                  className="form-submit-btn buyer-btn" 
                  id="btn-submit-buyer-requirement"
                  disabled={isSubmittingBuyer}
                  style={{ opacity: isSubmittingBuyer ? 0.7 : 1 }}
                >
                  {isSubmittingBuyer ? <RefreshCw size={20} className="spin" /> : <Compass size={20} />}
                  <span>{isSubmittingBuyer ? 'Posting...' : t.myProperties.broadcastRequirement}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── ACTIVE SUBMISSIONS LIST SECTION ──────────────────────────────────── */}
      <div className="my-submissions-section">
        {/* Broker Listings Submissions */}
        <div style={{ marginBottom: '28px' }}>
          <div className="submissions-section-header">
            <div className="submissions-title-group">
              <Building2 size={20} style={{ color: '#059669' }} />
              <h3 className="submissions-title">{t.myProperties.myListings}</h3>
              <span className="submissions-count-badge">
                {myPropertiesList.length} {language === 'pa' ? 'ਲਿਸਟਿੰਗਾਂ' : (language === 'hi' ? 'प्रॉपर्टीज' : 'Properties')}
              </span>
            </div>
            <button 
              type="button" 
              className="btn btn-ghost btn-sm" 
              onClick={loadUserData} 
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <RefreshCw size={13} className={isLoadingListings ? 'spin' : ''} /> Refresh
            </button>
          </div>

          {isLoadingListings ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              Loading your properties...
            </div>
          ) : myPropertiesList.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', background: 'var(--color-surface)', borderRadius: '16px', border: '1px dashed #cbd5e1', color: 'var(--color-text-muted)' }}>
              {t.myProperties.noListings}
            </div>
          ) : (
            <div className="submissions-list">
              {myPropertiesList.map(item => (
                <div key={item.id} className="submission-item-card" style={{ flexWrap: 'wrap', gap: '12px' }}>
                  <div className="submission-left" style={{ flex: '1 1 300px' }}>
                    <div className="submission-type-icon broker">
                      {item.images && item.images[0] ? (
                        <img src={item.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                      ) : (
                        <Building2 size={20} />
                      )}
                    </div>
                    <div className="submission-details">
                      <h4 className="submission-headline">{item.title}</h4>
                      <div className="submission-meta-row" style={{ flexWrap: 'wrap', gap: '8px' }}>
                        <span className={`submission-badge-live ${item.status !== 'active' ? 'non-active' : ''}`} style={{
                          background: item.status === 'active' ? 'rgba(5,150,105,0.1)' : 'rgba(239,68,68,0.1)',
                          color: item.status === 'active' ? '#059669' : '#ef4444',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 6
                        }}>
                          {item.status === 'active' ? '🟢 Live' : `⚪ ${item.status?.toUpperCase()}`}
                        </span>
                        <span>📍 {item.location || item.city}</span>
                        <span>📐 {item.area} {translateUnit(item.areaUnit)}</span>
                        <strong style={{ color: '#059669' }}>₹{(item.price >= 10000000 ? (item.price / 10000000).toFixed(2) + ' Cr' : (item.price / 100000).toFixed(0) + ' L')}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions: View, Mark Sold, Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {onNavigate && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => onNavigate('detail', item.id)}
                        title="View Property Detail"
                        style={{ padding: '6px 10px' }}
                      >
                        <Eye size={15} />
                      </button>
                    )}

                    {item.status === 'active' ? (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleStatusChange(item.id, 'sold')}
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                      >
                        <Check size={13} /> Mark Sold
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleStatusChange(item.id, 'active')}
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                      >
                        Reactivate
                      </button>
                    )}

                    <button 
                      type="button" 
                      className="submission-delete-btn"
                      onClick={() => handleDeleteBrokerListing(item.id)}
                      title={t.common.delete}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buyer Requirements Submissions */}
        <div>
          <div className="submissions-section-header">
            <div className="submissions-title-group">
              <UserCheck size={20} style={{ color: '#2563eb' }} />
              <h3 className="submissions-title">{t.myProperties.myRequirements}</h3>
              <span className="submissions-count-badge">
                {myRequirementsList.length} {language === 'pa' ? 'ਮੰਗਾਂ' : (language === 'hi' ? 'मांग' : 'Demands')}
              </span>
            </div>
          </div>

          {myRequirementsList.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', background: 'var(--color-surface)', borderRadius: '16px', border: '1px dashed #cbd5e1', color: 'var(--color-text-muted)' }}>
              {t.myProperties.noRequirements}
            </div>
          ) : (
            <div className="submissions-list">
              {myRequirementsList.map(item => (
                <div key={item.id} className="submission-item-card">
                  <div className="submission-left">
                    <div className="submission-type-icon buyer">
                      <UserCheck size={20} />
                    </div>
                    <div className="submission-details">
                      <h4 className="submission-headline">{item.title}</h4>
                      <div className="submission-meta-row" style={{ flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#2563eb', background: 'rgba(37,99,235,0.1)', padding: '1px 7px', borderRadius: '4px' }}>
                          ⚡ {language === 'pa' ? 'ਡੀਲਰਾਂ ਨੂੰ ਸੂਚਿਤ ਕੀਤਾ' : (language === 'hi' ? 'डीलरों को सूचित किया' : 'Brokers Notified')}
                        </span>
                        <span>📍 {item.district} ({item.preferred_area || item.district})</span>
                        <span>💰 {t.myProperties.maxBudget}: ₹{(item.budget_max >= 10000000 ? (item.budget_max / 10000000).toFixed(2) + ' Cr' : (item.budget_max / 100000).toFixed(0) + ' L')}</span>
                        <span>👤 {item.buyer_name}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="submission-delete-btn"
                    onClick={() => handleDeleteBuyerRequirement(item.id)}
                    title={t.common.delete}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
