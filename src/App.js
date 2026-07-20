import React, { useState, useEffect } from 'react';
import { Search, Link2, Trash2, Copy, Check, Lock, ShoppingBag, TrendingUp, Upload, Handshake, BarChart3, DollarSign, MousePointerClick, User, LogOut, LogIn, Filter, SlidersHorizontal, Plus, X, Trophy, Medal, Users, CreditCard, AlertCircle, CheckCircle, Clock, XCircle, Package, FileText, Store, Webhook, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from './services/api';
import { CookieBanner, Footer, LegalModal, AdminLegalEditor } from './components/LegalPages';
import LandingPage from './components/LandingPage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'https://alug-backend.onrender.com';

// ─── Alerts ──────────────────────────────────────────────────────────────────
const ErrorAlert = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50">
    <AlertCircle size={20} /><span>{message}</span>
    {onClose && <button onClick={onClose}><X size={16} /></button>}
  </div>
);
const SuccessAlert = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50">
    <CheckCircle size={20} /><span>{message}</span>
    {onClose && <button onClick={onClose}><X size={16} /></button>}
  </div>
);
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>
);

// ─── Auth Modal — MUST be defined OUTSIDE the main component ─────────────────
// If defined inside, React recreates it on every render → inputs lose focus
const AuthModal = ({ authMode, setAuthMode, userForm, setUserForm, onLogin, onRegister, onPartnerRegister, loading, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-purple-500">
      <div className="flex gap-2 mb-6">
        <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 rounded-lg text-sm ${authMode==='login'?'bg-purple-600 text-white':'bg-gray-700 text-gray-300'}`}>Login</button>
        <button onClick={() => setAuthMode('register')} className={`flex-1 py-2 rounded-lg text-sm ${authMode==='register'?'bg-purple-600 text-white':'bg-gray-700 text-gray-300'}`}>Affiliate</button>
        <button onClick={() => setAuthMode('register-partner')} className={`flex-1 py-2 rounded-lg text-sm ${authMode==='register-partner'?'bg-green-600 text-white':'bg-gray-700 text-gray-300'}`}>Partner</button>
      </div>
      {authMode==='register-partner' && (
        <div className="mb-4 bg-green-900 border border-green-600 rounded-lg p-3">
          <p className="text-green-300 text-sm font-semibold">🤝 Partner-Account</p>
          <p className="text-green-400 text-xs mt-1">Als Partner kannst du eigene Produkte eintragen. Dein Account wird vom Admin geprüft.</p>
        </div>
      )}
      {authMode==='login' ? (
        <div className="space-y-4">
          <input type="email" value={userForm.email} onChange={e => setUserForm(f=>({...f,email:e.target.value}))} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="Email" autoComplete="email" />
          <input type="password" value={userForm.password} onChange={e => setUserForm(f=>({...f,password:e.target.value}))} onKeyPress={e=>e.key==='Enter'&&onLogin()} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="Passwort" autoComplete="current-password" />
          <div className="flex gap-3">
            <button onClick={onLogin} disabled={loading} className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">{loading?'Loading...':'Login'}</button>
            <button onClick={onClose} className="flex-1 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg">Abbrechen</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <input type="text" value={userForm.name} onChange={e => setUserForm(f=>({...f,name:e.target.value}))} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="Name" autoComplete="name" />
          <input type="email" value={userForm.email} onChange={e => setUserForm(f=>({...f,email:e.target.value}))} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="Email" autoComplete="email" />
          <input type="password" value={userForm.password} onChange={e => setUserForm(f=>({...f,password:e.target.value}))} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="Passwort" autoComplete="new-password" />
          <input type="password" value={userForm.confirmPassword} onChange={e => setUserForm(f=>({...f,confirmPassword:e.target.value}))} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="Passwort bestätigen" autoComplete="new-password" />
          <div className="flex gap-3">
            <button onClick={authMode==='register-partner'?onPartnerRegister:onRegister} disabled={loading} className={`flex-1 text-white px-4 py-2 rounded-lg disabled:opacity-50 ${authMode==='register-partner'?'bg-green-600':'bg-purple-600'}`}>{loading?'Loading...':'Registrieren'}</button>
            <button onClick={onClose} className="flex-1 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg">Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  </div>
);

// ─── Charts ───────────────────────────────────────────────────────────────────
const DailyStatsChart = () => {
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.analytics.getDailyStats().then(data => {
      setDailyData(data.map(d => ({ ...d, dateLabel: new Date(d.date).toLocaleDateString('de-DE', { month:'short', day:'numeric' }) })));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);
  if (loading) return <LoadingSpinner />;
  return (
    <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
      <h3 className="text-xl font-bold text-white mb-4">📈 Clicks & Conversions (Last 7 Days)</h3>
      {dailyData.length===0 ? <p className="text-gray-400 text-center py-8">No data yet</p> : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="dateLabel" stroke="#9CA3AF" style={{fontSize:'12px'}} />
            <YAxis stroke="#9CA3AF" style={{fontSize:'12px'}} />
            <Tooltip contentStyle={{backgroundColor:'#1F2937',border:'1px solid #4B5563',borderRadius:'8px',color:'#fff'}} />
            <Line type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={2} name="Clicks" dot={{fill:'#3B82F6',r:4}} />
            <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2} name="Conversions" dot={{fill:'#10B981',r:4}} />
          </LineChart>
        </ResponsiveContainer>
      )}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-sm text-gray-300">Clicks</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-sm text-gray-300">Conversions</span></div>
      </div>
    </div>
  );
};

const ProductStatsChart = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.analytics.getProductStats().then(data => {
      setProductData(data.map(p => ({ name: p.name.length>15?p.name.substring(0,15)+'...':p.name, revenue: parseFloat(p.revenue||0), conversions: parseInt(p.conversions||0) })));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);
  if (loading) return <LoadingSpinner />;
  return (
    <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
      <h3 className="text-xl font-bold text-white mb-4">💰 Top Products by Revenue</h3>
      {productData.length===0 ? <p className="text-gray-400 text-center py-8">No data yet</p> : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={productData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" style={{fontSize:'11px'}} angle={-15} textAnchor="end" height={60} />
            <YAxis stroke="#9CA3AF" style={{fontSize:'12px'}} />
            <Tooltip contentStyle={{backgroundColor:'#1F2937',border:'1px solid #4B5563',borderRadius:'8px',color:'#fff'}} formatter={(v,n)=>n==='revenue'?[`${parseFloat(v).toFixed(2)}€`,'Revenue']:[v,'Conversions']} />
            <Bar dataKey="revenue" fill="#A855F7" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
      <div className="text-center mt-4"><span className="text-sm text-gray-400">Showing top 5 products</span></div>
    </div>
  );
};

// ─── Product Form ─────────────────────────────────────────────────────────────
const ProductForm = ({ onSubmit, onCancel, loading, categories, title="Create Product" }) => {
  const [formData, setFormData] = useState({ name:'', description:'', price:'', priceValue:0, type:'product', commissionType:'percentage', commissionValue:'', category:'', imageData:null, imagePreview:null, productUrl:'', attributionDays:30 });
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5*1024*1024) { alert('Bild ist zu groß (max 5MB)'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setFormData(f=>({...f, imageData:reader.result, imagePreview:reader.result}));
    reader.readAsDataURL(file);
  };
  const handleSubmit = () => {
    const priceMatch = formData.price.match(/[\d.,]+/);
    const priceValue = priceMatch ? parseFloat(priceMatch[0].replace(',','.')) : 0;
    onSubmit({...formData, priceValue});
  };
  return (
    <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-purple-500">
      <h2 className="text-2xl font-semibold mb-4 text-white">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-300 mb-1">Type</label><select value={formData.type} onChange={e=>setFormData({...formData,type:e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"><option value="product">Product</option><option value="service">Service</option></select></div>
        <div><label className="block text-sm font-medium text-gray-300 mb-1">Name *</label><input type="text" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="Product name" /></div>
        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-300 mb-1">Description *</label><textarea value={formData.description} onChange={e=>setFormData({...formData,description:e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" rows="3" placeholder="Product description" /></div>
        <div><label className="block text-sm font-medium text-gray-300 mb-1">Price *</label><input type="text" value={formData.price} onChange={e=>setFormData({...formData,price:e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="e.g. 29.99€" /></div>
        <div><label className="block text-sm font-medium text-gray-300 mb-1">Commission Type</label><select value={formData.commissionType} onChange={e=>setFormData({...formData,commissionType:e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"><option value="percentage">Percentage (%)</option><option value="fixed">Fixed (€)</option></select></div>
        <div><label className="block text-sm font-medium text-gray-300 mb-1">Commission Value * {formData.commissionType==='percentage'?'(%)':'(€)'}</label><input type="number" step="0.01" value={formData.commissionValue} onChange={e=>setFormData({...formData,commissionValue:e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder={formData.commissionType==='percentage'?'e.g. 15':'e.g. 5.00'} /></div>
        <div><label className="block text-sm font-medium text-gray-300 mb-1">Attribution Window</label><select value={formData.attributionDays} onChange={e=>setFormData({...formData,attributionDays:parseInt(e.target.value)})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"><option value={7}>7 Tage</option><option value={14}>14 Tage</option><option value={30}>30 Tage (Standard)</option><option value={60}>60 Tage</option><option value={90}>90 Tage</option></select></div>
        <div><label className="block text-sm font-medium text-gray-300 mb-1">Category *</label><select value={formData.category} onChange={e=>setFormData({...formData,category:e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"><option value="">Select...</option>{categories.map(cat=>(<option key={cat} value={cat}>{cat}</option>))}</select></div>
        <div><label className="block text-sm font-medium text-gray-300 mb-1">Product URL</label><input type="url" value={formData.productUrl} onChange={e=>setFormData({...formData,productUrl:e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="https://example.com/product" /></div>
        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-300 mb-2">Image</label><div className="flex items-center gap-4"><label className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 cursor-pointer"><Upload size={18} /><span className="text-sm font-medium">Choose</span><input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /></label>{formData.imagePreview&&(<div className="flex items-center gap-2"><img src={formData.imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg border-2 border-purple-500" /><button onClick={()=>setFormData({...formData,imageData:null,imagePreview:null})} className="text-red-400 text-sm">Remove</button></div>)}</div></div>
      </div>
      <div className="flex gap-3 pt-4">
        <button onClick={handleSubmit} disabled={loading} className="bg-purple-600 text-white px-6 py-2 rounded-lg disabled:opacity-50">{loading?'Saving...':'Save'}</button>
        <button onClick={onCancel} className="bg-gray-700 text-gray-300 px-6 py-2 rounded-lg">Cancel</button>
      </div>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function AlugMarketplace() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Gaming','Hosting & Server','Marketing','Software','Hardware']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPartner, setIsPartner] = useState(false);
  const [partnerApproved, setPartnerApproved] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserAuth, setShowUserAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [userForm, setUserForm] = useState({ email:'', password:'', name:'', confirmPassword:'' });
  const [myLinks, setMyLinks] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  // Default view: 'landing' für nicht-eingeloggte, wird in checkAuthStatus gesetzt
  const [activeView, setActiveView] = useState('landing');
  const [analytics, setAnalytics] = useState(null);
  const [topMarketers, setTopMarketers] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [balance, setBalance] = useState({ total_earned:0, total_paid:0, available:0 });
  const [payouts, setPayouts] = useState([]);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutForm, setPayoutForm] = useState({ amount:'', paymentMethod:'paypal', paymentDetails:'' });
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminConversions, setAdminConversions] = useState([]);
  const [adminPayouts, setAdminPayouts] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [adminPartners, setAdminPartners] = useState([]);
  const [adminAllProducts, setAdminAllProducts] = useState([]);
  const [partnerProducts, setPartnerProducts] = useState([]);
  const [partnerStats, setPartnerStats] = useState([]);
  const [webhookInfo, setWebhookInfo] = useState(null);
  const [showWebhookInfo, setShowWebhookInfo] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalPage, setLegalPage] = useState('impressum');

  const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'admin123';

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/aff/')) {
      window.location.href = `${BACKEND_URL}/aff/${path.split('/aff/')[1]}`;
      return;
    }
    loadProducts();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        setIsUserLoggedIn(true);
        setCurrentUser(parsedUser);
        if (parsedUser.isAdmin || adminStatus) {
          setIsAdmin(true);
          setActiveView('admin');
        } else if (parsedUser.isPartner) {
          setIsPartner(true);
          setPartnerApproved(parsedUser.partnerApproved);
          setActiveView('partner');
        } else {
          setActiveView('dashboard');
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
      }
    } else if (adminStatus) {
      setIsAdmin(true);
    }
    // Nicht eingeloggt → bleibt auf 'landing'
  };

  useEffect(() => {
    if (isUserLoggedIn) {
      if (activeView==='dashboard') { loadAnalytics(); loadMyLinks(); loadBalance(); loadPayouts(); }
      else if (activeView==='leaderboard') { loadTopMarketers(); loadTopProducts(); }
      else if (activeView==='partner') { loadPartnerData(); }
    } else {
      // Auch ohne Login Leaderboard laden
      if (activeView==='leaderboard') { loadTopMarketers(); loadTopProducts(); }
    }
  }, [isUserLoggedIn, activeView]);

  useEffect(() => {
    if (isAdmin && activeView==='admin') loadAdminData();
  }, [isAdmin, activeView]);

  const loadProducts = async () => { try { setProducts(await api.products.getAll()); } catch { showError('Fehler beim Laden der Produkte'); } };
  const loadAnalytics = async () => { try { setAnalytics(await api.analytics.getMyStats()); } catch(e) { console.error(e); } };
  const loadMyLinks = async () => { try { setMyLinks(await api.affiliate.getMyLinks()); } catch(e) { console.error(e); } };
  const loadTopMarketers = async () => { try { setTopMarketers(await api.leaderboard.getTopMarketers()); } catch(e) { console.error(e); } };
  const loadTopProducts = async () => { try { setTopProducts(await api.leaderboard.getTopProducts()); } catch(e) { console.error(e); } };
  const loadBalance = async () => { try { const r = await fetch(`${API_URL}/payouts/balance`,{headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}); setBalance(await r.json()); } catch(e) { console.error(e); } };
  const loadPayouts = async () => { try { const r = await fetch(`${API_URL}/payouts/my-payouts`,{headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}); setPayouts(await r.json()); } catch(e) { console.error(e); } };
  const loadPartnerData = async () => {
    try {
      const h = { Authorization:`Bearer ${localStorage.getItem('token')}` };
      const [prods,stats,webhook] = await Promise.all([
        fetch(`${API_URL}/partner/products`,{headers:h}).then(r=>r.json()),
        fetch(`${API_URL}/partner/stats`,{headers:h}).then(r=>r.json()),
        fetch(`${API_URL}/partner/webhook-info`,{headers:h}).then(r=>r.json())
      ]);
      setPartnerProducts(Array.isArray(prods)?prods:[]);
      setPartnerStats(Array.isArray(stats)?stats:[]);
      setWebhookInfo(webhook);
    } catch(e) { console.error(e); }
  };
  const loadAdminData = async () => {
    try {
      const h = { Authorization:`Bearer ${localStorage.getItem('token')}` };
      const [users,conversions,pr,stats,partners,allProducts] = await Promise.all([
        api.admin.getAllUsers(), api.admin.getAllConversions(),
        fetch(`${API_URL}/admin/payouts`,{headers:h}).then(r=>r.json()),
        fetch(`${API_URL}/admin/stats`,{headers:h}).then(r=>r.json()),
        fetch(`${API_URL}/admin/partners`,{headers:h}).then(r=>r.json()),
        fetch(`${API_URL}/admin/products`,{headers:h}).then(r=>r.json())
      ]);
      setAdminUsers(users); setAdminConversions(conversions); setAdminPayouts(pr);
      setAdminStats(stats); setAdminPartners(Array.isArray(partners)?partners:[]);
      setAdminAllProducts(Array.isArray(allProducts)?allProducts:[]);
    } catch { showError('Fehler beim Laden der Admin-Daten'); }
  };

  const handleAdminLogin = async () => {
    if (adminPassword!==ADMIN_PASSWORD) { showError('Falsches Admin-Passwort!'); return; }
    setLoading(true);
    try {
      const data = await api.auth.login('admin@alug.com','Ringbahn030');
      localStorage.setItem('token',data.token);
      localStorage.setItem('user',JSON.stringify(data.user));
      localStorage.setItem('isAdmin','true');
      setIsUserLoggedIn(true); setCurrentUser(data.user); setIsAdmin(true);
      setShowAdminLogin(false); setAdminPassword('');
      setActiveView('admin');
      showSuccess('Admin-Modus aktiviert! 🔓');
    } catch { showError('Admin-Login fehlgeschlagen'); }
    finally { setLoading(false); }
  };

  const handleUserLogin = async () => {
    setLoading(true);
    try {
      const data = await api.auth.login(userForm.email, userForm.password);
      if (data.token) localStorage.setItem('token',data.token);
      localStorage.setItem('user',JSON.stringify(data.user));
      setIsUserLoggedIn(true); setCurrentUser(data.user);
      if (data.user.isAdmin) { setIsAdmin(true); localStorage.setItem('isAdmin','true'); setActiveView('admin'); }
      else if (data.user.isPartner) { setIsPartner(true); setPartnerApproved(data.user.partnerApproved); setActiveView('partner'); }
      else { setActiveView('dashboard'); }
      setShowUserAuth(false);
      setUserForm({email:'',password:'',name:'',confirmPassword:''});
      showSuccess('Erfolgreich angemeldet!');
    } catch(err) { showError(err.message||'Login fehlgeschlagen'); }
    finally { setLoading(false); }
  };

  const handleUserRegister = async () => {
    if (!userForm.email||!userForm.password||!userForm.name) { showError('Bitte fülle alle Felder aus!'); return; }
    if (userForm.password!==userForm.confirmPassword) { showError('Passwörter stimmen nicht überein!'); return; }
    setLoading(true);
    try {
      const data = await api.auth.register(userForm.name,userForm.email,userForm.password);
      if (data.token) localStorage.setItem('token',data.token);
      localStorage.setItem('user',JSON.stringify(data.user));
      setIsUserLoggedIn(true); setCurrentUser(data.user);
      setActiveView('dashboard');
      setShowUserAuth(false);
      setUserForm({email:'',password:'',name:'',confirmPassword:''});
      showSuccess('Erfolgreich registriert!');
    } catch(err) { showError(err.message||'Registrierung fehlgeschlagen'); }
    finally { setLoading(false); }
  };

  const handlePartnerRegister = async () => {
    if (!userForm.email||!userForm.password||!userForm.name) { showError('Bitte fülle alle Felder aus!'); return; }
    if (userForm.password!==userForm.confirmPassword) { showError('Passwörter stimmen nicht überein!'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register-partner`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:userForm.name,email:userForm.email,password:userForm.password})});
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.token) localStorage.setItem('token',data.token);
      localStorage.setItem('user',JSON.stringify(data.user));
      setIsUserLoggedIn(true); setCurrentUser(data.user);
      setIsPartner(true); setPartnerApproved(false);
      setActiveView('partner');
      setShowUserAuth(false);
      setUserForm({email:'',password:'',name:'',confirmPassword:''});
      showSuccess('Partner-Account erstellt! Warte auf Admin-Freigabe.');
    } catch(err) { showError(err.message||'Registrierung fehlgeschlagen'); }
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user'); localStorage.removeItem('isAdmin');
    setIsUserLoggedIn(false); setCurrentUser(null); setIsAdmin(false); setIsPartner(false); setPartnerApproved(false);
    setActiveView('landing'); // ← zurück zur Landing Page
    showSuccess('Erfolgreich abgemeldet');
  };

  const handleSubmit = async (formData) => {
    if (!formData.name||!formData.description||!formData.price||!formData.commissionValue||!formData.category) { showError('Bitte fülle alle Pflichtfelder aus'); return; }
    setLoading(true);
    try { const p = await api.products.create(formData); setProducts([p,...products]); setShowForm(false); showSuccess('Produkt erstellt!'); }
    catch(err) { showError(err.message||'Fehler'); }
    finally { setLoading(false); }
  };

  const handlePartnerSubmit = async (formData) => {
    if (!formData.name||!formData.description||!formData.price||!formData.commissionValue||!formData.category) { showError('Bitte fülle alle Pflichtfelder aus'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/partner/products`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${localStorage.getItem('token')}`},body:JSON.stringify(formData)});
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPartnerProducts([data,...partnerProducts]); setShowForm(false);
      showSuccess('Produkt eingereicht! Warte auf Admin-Genehmigung.'); loadPartnerData();
    } catch(err) { showError(err.message||'Fehler'); }
    finally { setLoading(false); }
  };

  const deleteProduct = async (id) => { if (!window.confirm('Produkt wirklich löschen?')) return; try { await api.products.delete(id); setProducts(products.filter(p=>p.id!==id)); showSuccess('Produkt gelöscht'); } catch { showError('Fehler'); } };
  const addCategory = () => { if (newCategory&&!categories.includes(newCategory)) { setCategories([...categories,newCategory]); setNewCategory(''); showSuccess('Kategorie hinzugefügt'); } };
  const deleteCategory = (cat) => { if (window.confirm(`Kategorie "${cat}" löschen?`)) setCategories(categories.filter(c=>c!==cat)); };

  const generateAffiliateLink = async (productId) => {
    if (!isUserLoggedIn) { setAuthMode('login'); setShowUserAuth(true); return; }
    setLoading(true);
    try { await api.affiliate.generateLink(productId); showSuccess('Link generiert!'); await loadMyLinks(); }
    catch(err) { showError(err.message||'Fehler'); }
    finally { setLoading(false); }
  };

  const copyToClipboard = (text, id) => { navigator.clipboard.writeText(text); setCopiedId(id); showSuccess('Link kopiert!'); setTimeout(()=>setCopiedId(null),2000); };

  const handleRequestPayout = async () => {
    const amount = parseFloat(payoutForm.amount);
    if (!amount||amount<10) { showError('Mindestbetrag: 10€'); return; }
    if (amount>balance?.available) { showError('Nicht genug Guthaben'); return; }
    if (!payoutForm.paymentDetails) { showError('Zahlungsdetails fehlen'); return; }
    setLoading(true);
    try {
      await fetch(`${API_URL}/payouts/request`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${localStorage.getItem('token')}`},body:JSON.stringify(payoutForm)});
      showSuccess('Auszahlung beantragt!'); setShowPayoutModal(false);
      setPayoutForm({amount:'',paymentMethod:'paypal',paymentDetails:''});
      await Promise.all([loadBalance(),loadPayouts()]);
    } catch { showError('Fehler bei Auszahlung'); }
    finally { setLoading(false); }
  };

  const handleUpdatePayoutStatus = async (id, status) => { try { await fetch(`${API_URL}/admin/payouts/${id}`,{method:'PUT',headers:{'Content-Type':'application/json',Authorization:`Bearer ${localStorage.getItem('token')}`},body:JSON.stringify({status})}); showSuccess('Status aktualisiert'); await loadAdminData(); } catch { showError('Fehler'); } };
  const handleApprovePartner = async (id) => { try { await fetch(`${API_URL}/admin/partners/${id}/approve`,{method:'PUT',headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}); showSuccess('Partner genehmigt!'); await loadAdminData(); } catch { showError('Fehler'); } };
  const handleRevokePartner = async (id) => { try { await fetch(`${API_URL}/admin/partners/${id}/revoke`,{method:'PUT',headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}); showSuccess('Partner gesperrt'); await loadAdminData(); } catch { showError('Fehler'); } };
  const handleApproveProduct = async (id) => { try { await fetch(`${API_URL}/admin/products/${id}/approve`,{method:'PUT',headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}); showSuccess('Produkt genehmigt!'); await loadAdminData(); await loadProducts(); } catch { showError('Fehler'); } };
  const handleRejectProduct = async (id) => { try { await fetch(`${API_URL}/admin/products/${id}/reject`,{method:'PUT',headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}); showSuccess('Produkt abgelehnt'); await loadAdminData(); } catch { showError('Fehler'); } };

  const showError = (m) => { setError(m); setTimeout(()=>setError(null),5000); };
  const showSuccess = (m) => { setSuccess(m); setTimeout(()=>setSuccess(null),3000); };

  const getStatusBadge = (status) => {
    const badges = { pending:<span className="flex items-center gap-1 text-yellow-400"><Clock size={14}/> Ausstehend</span>, approved:<span className="flex items-center gap-1 text-blue-400"><CheckCircle size={14}/> Genehmigt</span>, paid:<span className="flex items-center gap-1 text-green-400"><CheckCircle size={14}/> Bezahlt</span>, rejected:<span className="flex items-center gap-1 text-red-400"><XCircle size={14}/> Abgelehnt</span> };
    return badges[status]||status;
  };

  const filteredProducts = products.filter(p=>p.name?.toLowerCase().includes(searchQuery.toLowerCase())||p.description?.toLowerCase().includes(searchQuery.toLowerCase())).filter(p=>selectedCategory==='all'||p.category===selectedCategory);
  const sortedProducts = [...filteredProducts].sort((a,b)=>{
    switch(sortBy){
      case 'name-asc': return (a.name||'').localeCompare(b.name||'');
      case 'name-desc': return (b.name||'').localeCompare(a.name||'');
      case 'price-asc': return (a.price_value||0)-(b.price_value||0);
      case 'price-desc': return (b.price_value||0)-(a.price_value||0);
      case 'commission-high': return parseFloat(b.commission_value||0)-parseFloat(a.commission_value||0);
      case 'commission-low': return parseFloat(a.commission_value||0)-parseFloat(b.commission_value||0);
      default: return (b.id||0)-(a.id||0);
    }
  });

  // Views die auch ohne Login verfügbar sind
  const publicViews = ['landing','shop','leaderboard'];

  return (
    <div className="min-h-screen" style={{background:'#07060f'}}>
      {error && <ErrorAlert message={error} onClose={()=>setError(null)} />}
      {success && <SuccessAlert message={success} onClose={()=>setSuccess(null)} />}

      {/* Auth Modal — außerhalb gerendert, kein Focus-Bug */}
      {showUserAuth && (
        <AuthModal
          authMode={authMode} setAuthMode={setAuthMode}
          userForm={userForm} setUserForm={setUserForm}
          onLogin={handleUserLogin} onRegister={handleUserRegister} onPartnerRegister={handlePartnerRegister}
          loading={loading} onClose={()=>setShowUserAuth(false)}
        />
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border-2 border-yellow-500">
            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2"><Lock className="text-yellow-400"/>Admin Login</h2>
            <input type="password" value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} onKeyPress={e=>e.key==='Enter'&&handleAdminLogin()} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white mb-4" placeholder="Admin-Passwort" autoFocus />
            <div className="flex gap-3">
              <button onClick={handleAdminLogin} disabled={loading} className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50">{loading?'Anmelden...':'Anmelden'}</button>
              <button onClick={()=>{setShowAdminLogin(false);setAdminPassword('');}} className="flex-1 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg">Abbrechen</button>
            </div>
          </div>
        </div>
      )}

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-purple-500">
            <h2 className="text-2xl font-bold mb-4 text-white">Auszahlung</h2>
            <div className="space-y-4">
              <div><label className="block text-sm text-gray-300 mb-2">Betrag (Verfügbar: {parseFloat(balance?.available||0).toFixed(2)}€)</label><input type="number" step="0.01" value={payoutForm.amount} onChange={e=>setPayoutForm({...payoutForm,amount:e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="Min 10€" /></div>
              <div><label className="block text-sm text-gray-300 mb-2">Methode</label><select value={payoutForm.paymentMethod} onChange={e=>setPayoutForm({...payoutForm,paymentMethod:e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"><option value="paypal">PayPal</option><option value="bank">Bank</option><option value="crypto">Crypto</option></select></div>
              <div><label className="block text-sm text-gray-300 mb-2">Details</label><input type="text" value={payoutForm.paymentDetails} onChange={e=>setPayoutForm({...payoutForm,paymentDetails:e.target.value})} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="Email/IBAN/Address" /></div>
              <div className="flex gap-3"><button onClick={handleRequestPayout} disabled={loading} className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">{loading?'Processing...':'Request'}</button><button onClick={()=>setShowPayoutModal(false)} className="flex-1 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg">Cancel</button></div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ NAVBAR — NUR wenn NICHT auf Landing Page ══════════════════════════ */}
      {activeView !== 'landing' && (
        <div style={{background:'#0d0b1a',borderBottom:'1px solid rgba(191,90,242,.18)'}} className="shadow-lg sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex justify-between items-center gap-2">
              {/* Logo */}
              <button onClick={()=>setActiveView(isUserLoggedIn?(isAdmin?'admin':isPartner?'partner':'dashboard'):'landing')} className="flex items-center gap-3 flex-shrink-0">
                <img
                  src={"data:image/jpeg;base64,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"}
                  alt="alug"
                  style={{height:'34px',mixBlendMode:'screen',objectFit:'contain'}}
                  onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='block';}}
                />
                <span style={{display:'none',fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'20px',background:'linear-gradient(135deg,#bf5af2,#ff2d78)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>alug</span>
              </button>

              {/* Nav Links */}
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <button onClick={()=>setActiveView('shop')} className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${activeView==='shop'?'bg-purple-600 text-white':'text-gray-400 hover:text-white hover:bg-white/5'}`}><ShoppingBag size={14} className="inline mr-1"/>Shop</button>
                <button onClick={()=>setActiveView('leaderboard')} className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${activeView==='leaderboard'?'bg-purple-600 text-white':'text-gray-400 hover:text-white hover:bg-white/5'}`}><Trophy size={14} className="inline mr-1"/>Board</button>
                {isUserLoggedIn && !isPartner && <button onClick={()=>setActiveView('dashboard')} className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${activeView==='dashboard'?'bg-purple-600 text-white':'text-gray-400 hover:text-white hover:bg-white/5'}`}><BarChart3 size={14} className="inline mr-1"/>Dashboard</button>}
                {isPartner && <button onClick={()=>setActiveView('partner')} className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${activeView==='partner'?'bg-green-600 text-white':'text-gray-400 hover:text-white hover:bg-white/5'}`}><Store size={14} className="inline mr-1"/>Partner</button>}
                {isAdmin && <button onClick={()=>setActiveView('admin')} className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${activeView==='admin'?'bg-purple-600 text-white':'text-gray-400 hover:text-white hover:bg-white/5'}`}><Users size={14} className="inline mr-1"/>Admin</button>}

                {isUserLoggedIn ? (
                  <>
                    <div style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.08)'}} className="flex items-center gap-1 px-2 sm:px-3 py-2 rounded-lg">
                      <User size={14} className="text-purple-400"/>
                      <span className="text-xs sm:text-sm text-white hidden md:inline">{currentUser?.name}</span>
                      {isAdmin && <Lock size={12} className="text-yellow-400"/>}
                      {isPartner && <Store size={12} className="text-green-400"/>}
                    </div>
                    <button onClick={handleLogout} style={{background:'rgba(255,255,255,.06)'}} className="text-gray-300 p-2 rounded-lg hover:bg-white/10 transition-all" title="Ausloggen"><LogOut size={14}/></button>
                  </>
                ) : (
                  <button onClick={()=>{setAuthMode('login');setShowUserAuth(true);}} style={{background:'linear-gradient(135deg,#bf5af2,#ff2d78)'}} className="text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium"><LogIn size={14} className="inline mr-1"/>Login</button>
                )}

                {!isAdmin && (
                  <button onClick={()=>setShowAdminLogin(true)} className="bg-yellow-600 text-white p-2 rounded-lg hover:bg-yellow-700 border border-yellow-500 transition-all" title="Admin Login"><Lock size={14}/></button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ LANDING PAGE VIEW — hat eigene Navbar ═════════════════════════════ */}
      {activeView==='landing' && (
        <div>
          <LandingPage
            onRegisterClick={()=>{setAuthMode('register');setShowUserAuth(true);}}
            onLoginClick={()=>{setAuthMode('login');setShowUserAuth(true);}}
            onPartnerRegisterClick={()=>{setAuthMode('register-partner');setShowUserAuth(true);}}
          />
          <Footer onLegalClick={(page)=>{setLegalPage(page);setShowLegalModal(true);}}/>
          <CookieBanner/>
          {showLegalModal && <LegalModal page={legalPage} onClose={()=>setShowLegalModal(false)}/>}
        </div>
      )}

      {/* ═══ APP VIEWS ═════════════════════════════════════════════════════════ */}
      {activeView!=='landing' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8" style={{minHeight:'calc(100vh - 60px)'}}>

          {/* PARTNER VIEW */}
          {activeView==='partner' && isPartner && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3"><Store size={36} className="text-green-400"/>Partner Dashboard</h2>
              {!partnerApproved && (
                <div className="bg-yellow-900 border border-yellow-600 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2"><Clock size={24} className="text-yellow-400"/><h3 className="text-xl font-bold text-yellow-300">Account wartet auf Genehmigung</h3></div>
                  <p className="text-yellow-400">Dein Partner-Account wurde erstellt und wartet auf die Freigabe durch den Admin.</p>
                </div>
              )}
              {partnerApproved && (<>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-6 border border-green-500"><Package className="text-green-300 mb-2" size={32}/><p className="text-3xl font-bold text-white">{partnerProducts.length}</p><p className="text-sm text-green-300">Meine Produkte</p></div>
                  <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 border border-blue-500"><MousePointerClick className="text-blue-300 mb-2" size={32}/><p className="text-3xl font-bold text-white">{partnerStats.reduce((s,p)=>s+parseInt(p.total_clicks||0),0)}</p><p className="text-sm text-blue-300">Gesamte Clicks</p></div>
                  <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6 border border-purple-500"><TrendingUp className="text-purple-300 mb-2" size={32}/><p className="text-3xl font-bold text-white">{partnerStats.reduce((s,p)=>s+parseInt(p.total_sales||0),0)}</p><p className="text-sm text-purple-300">Gesamte Sales</p></div>
                </div>
                <div className="bg-gray-800 rounded-xl border border-green-500 p-6">
                  <button onClick={()=>setShowWebhookInfo(!showWebhookInfo)} className="flex items-center justify-between w-full">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Webhook size={22} className="text-green-400"/>Webhook URL & Anleitung</h3>
                    {showWebhookInfo?<ChevronUp className="text-gray-400"/>:<ChevronDown className="text-gray-400"/>}
                  </button>
                  {showWebhookInfo && webhookInfo && (
                    <div className="mt-4 space-y-4">
                      <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                        <p className="text-sm text-gray-400 mb-2">Deine Webhook URL:</p>
                        <code className="text-green-400 text-sm break-all block">{webhookInfo.webhookUrl}</code>
                        <button onClick={()=>{navigator.clipboard.writeText(webhookInfo.webhookUrl);setCopiedWebhook(true);setTimeout(()=>setCopiedWebhook(false),2000);}} className="mt-2 flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300">{copiedWebhook?<><Check size={14}/>Kopiert!</>:<><Copy size={14}/>Kopieren</>}</button>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4 border border-gray-600"><p className="text-sm font-semibold text-white mb-3">📋 Anleitung:</p><ol className="space-y-2">{webhookInfo.instructions?.map((s,i)=><li key={i} className="text-sm text-gray-300">{s}</li>)}</ol></div>
                      <div className="bg-blue-900 border border-blue-600 rounded-lg p-4"><p className="text-blue-300 text-sm font-semibold">💡 Wie funktioniert ALUG_CODE?</p><p className="text-blue-400 text-sm mt-1">Wenn ein Besucher auf einen Affiliate-Link klickt, wird er zu deiner Seite weitergeleitet mit: <code className="bg-blue-800 px-1 rounded">?alug_code=1-3-1234567890</code></p></div>
                    </div>
                  )}
                </div>
                <div className="bg-gray-800 rounded-xl border border-purple-500 p-6">
                  <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-white">Meine Produkte</h3><button onClick={()=>setShowForm(!showForm)} className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-lg text-sm"><Plus size={16}/>Produkt hinzufügen</button></div>
                  {showForm&&<ProductForm onSubmit={handlePartnerSubmit} onCancel={()=>setShowForm(false)} loading={loading} categories={categories} title="Produkt einreichen (wird von Admin geprüft)"/>}
                  <div className="space-y-3">
                    {partnerProducts.map(product=>{
                      const stat=partnerStats.find(s=>s.id===product.id);
                      return(<div key={product.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700"><div className="flex justify-between items-start"><div><div className="flex items-center gap-2 mb-1"><h4 className="text-white font-semibold">{product.name}</h4>{product.approved?<span className="text-xs bg-green-800 text-green-300 px-2 py-0.5 rounded-full">✅ Live</span>:<span className="text-xs bg-yellow-800 text-yellow-300 px-2 py-0.5 rounded-full">⏳ Wartend</span>}</div><p className="text-gray-400 text-sm">{product.price} · {product.commission_type==='percentage'?`${product.commission_value}%`:`${product.commission_value}€`} · {product.attribution_days||30} Tage</p></div>{stat&&<div className="text-right text-sm"><p className="text-blue-400">{stat.total_clicks||0} Clicks</p><p className="text-green-400">{stat.total_sales||0} Sales</p><p className="text-purple-400 font-bold">{parseFloat(stat.total_revenue||0).toFixed(2)}€</p></div>}</div></div>);
                    })}
                    {partnerProducts.length===0&&<p className="text-gray-400 text-center py-8">Noch keine Produkte.</p>}
                  </div>
                </div>
              </>)}
            </div>
          )}

          {/* ADMIN VIEW */}
          {activeView==='admin' && isAdmin && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3"><Users size={36} className="text-purple-400"/>Admin Dashboard</h2>
              {adminStats&&(<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-4 border border-purple-500"><p className="text-2xl font-bold text-white">{adminStats.total_users}</p><p className="text-xs text-purple-300">Affiliates</p></div>
                <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-4 border border-green-500"><p className="text-2xl font-bold text-white">{adminStats.total_partners}</p><p className="text-xs text-green-300">Partner</p></div>
                <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 rounded-lg p-4 border border-yellow-500"><p className="text-2xl font-bold text-white">{adminStats.pending_partners}</p><p className="text-xs text-yellow-300">Partner ausstehend</p></div>
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 border border-blue-500"><p className="text-2xl font-bold text-white">{adminStats.total_products}</p><p className="text-xs text-blue-300">Produkte live</p></div>
                <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-lg p-4 border border-orange-500"><p className="text-2xl font-bold text-white">{adminStats.pending_products}</p><p className="text-xs text-orange-300">Produkte ausstehend</p></div>
                <div className="bg-gradient-to-br from-pink-900 to-pink-800 rounded-lg p-4 border border-pink-500"><p className="text-2xl font-bold text-white">{parseFloat(adminStats.total_revenue||0).toFixed(0)}€</p><p className="text-xs text-pink-300">Umsatz</p></div>
              </div>)}
              <div className="bg-gray-800 rounded-lg border border-green-500 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Store className="text-green-400"/>Partner ({adminPartners.length})</h3>
                <div className="space-y-3">{adminPartners.map(p=>(<div key={p.id} className="bg-gray-900 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"><div><p className="text-white font-semibold">{p.name}</p><p className="text-sm text-gray-400">{p.email}</p><p className="text-xs text-gray-500">{p.approved_products}/{p.total_products} Produkte</p></div><div className="flex items-center gap-3">{p.partner_approved?<span className="text-xs bg-green-800 text-green-300 px-3 py-1 rounded-full">✅ Genehmigt</span>:<span className="text-xs bg-yellow-800 text-yellow-300 px-3 py-1 rounded-full">⏳ Ausstehend</span>}{!p.partner_approved?<button onClick={()=>handleApprovePartner(p.id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Genehmigen</button>:<button onClick={()=>handleRevokePartner(p.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Sperren</button>}</div></div>))}{adminPartners.length===0&&<p className="text-gray-400 text-center py-4">Noch keine Partner</p>}</div>
              </div>
              <div className="bg-gray-800 rounded-lg border border-orange-500 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Package className="text-orange-400"/>Produkte zur Genehmigung</h3>
                <div className="space-y-3">{adminAllProducts.filter(p=>!p.approved&&p.vendor_id).map(product=>(<div key={product.id} className="bg-gray-900 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"><div><p className="text-white font-semibold">{product.name}</p><p className="text-sm text-gray-400">von {product.vendor_name||'Unbekannt'} · {product.price} · {product.commission_value}{product.commission_type==='percentage'?'%':'€'}</p><p className="text-xs text-gray-500">{product.category} · {product.attribution_days||30} Tage</p></div><div className="flex gap-2"><button onClick={()=>handleApproveProduct(product.id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Genehmigen</button><button onClick={()=>handleRejectProduct(product.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Ablehnen</button></div></div>))}{adminAllProducts.filter(p=>!p.approved&&p.vendor_id).length===0&&<p className="text-gray-400 text-center py-4">Keine ausstehenden Produkte</p>}</div>
              </div>
              <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Affiliates ({adminUsers.filter(u=>!u.is_partner).length})</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">{adminUsers.filter(u=>!u.is_partner).slice(0,20).map(u=>(<div key={u.id} className="flex justify-between items-center p-3 bg-gray-900 rounded"><div><p className="text-white font-semibold">{u.name}</p><p className="text-sm text-gray-400">{u.email}</p></div><div className="text-right"><p className="text-purple-400 font-bold">{parseFloat(u.total_earnings||0).toFixed(2)}€</p><p className="text-xs text-gray-400">{u.total_conversions||0} sales</p></div></div>))}</div>
              </div>
              <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Payout Requests</h3>
                <div className="space-y-3">{adminPayouts.map(p=>(<div key={p.id} className="bg-gray-900 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div><p className="text-white font-semibold">{p.user_name}</p><p className="text-sm text-gray-400">{p.payment_method} - {p.payment_details}</p></div><div className="text-right"><p className="text-2xl font-bold text-purple-400">{parseFloat(p.amount).toFixed(2)}€</p><p className="text-sm">{getStatusBadge(p.status)}</p></div>{p.status==='pending'&&<div className="flex gap-2"><button onClick={()=>handleUpdatePayoutStatus(p.id,'paid')} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Paid</button><button onClick={()=>handleUpdatePayoutStatus(p.id,'rejected')} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Reject</button></div>}</div>))}{adminPayouts.length===0&&<p className="text-gray-400 text-center py-8">No requests</p>}</div>
              </div>
              <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FileText className="text-purple-400"/>Rechtliche Angaben</h3>
                <AdminLegalEditor/>
              </div>
            </div>
          )}

          {/* LEADERBOARD VIEW — öffentlich */}
          {activeView==='leaderboard' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3"><Trophy size={36} className="text-yellow-400"/>Top Performers</h2>
              <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
                <h3 className="text-xl font-bold text-white mb-4">🏆 Top Marketers</h3>
                <div className="space-y-4">{topMarketers.map((m,i)=>(<div key={m.id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-900"><div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700">{i===0&&<Trophy size={24} className="text-yellow-400"/>}{i===1&&<Medal size={24} className="text-gray-300"/>}{i===2&&<Medal size={24} className="text-orange-400"/>}{i>2&&<span className="text-gray-400 font-bold">{i+1}</span>}</div><div className="flex-1"><h4 className="text-white font-bold text-lg">{m.name}</h4><div className="flex gap-4 text-sm text-gray-400"><span>✅ {m.conversions} Sales</span><span>🖱 {m.clicks} Clicks</span></div></div><div className="text-2xl font-bold text-purple-400">{parseFloat(m.revenue||0).toFixed(2)}€</div></div>))}{topMarketers.length===0&&<p className="text-gray-400 text-center py-8">No data yet</p>}</div>
              </div>
              <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
                <h3 className="text-xl font-bold text-white mb-4">📦 Top Products</h3>
                <div className="space-y-3">{topProducts.map((p,i)=>(<div key={p.id} className="flex justify-between items-center p-3 bg-gray-900 rounded"><div className="flex items-center gap-3"><span className="text-2xl">{i+1}</span><div><p className="text-white font-semibold">{p.name}</p><p className="text-sm text-gray-400">{p.category}</p></div></div><div className="text-right"><p className="text-purple-400 font-bold">{parseFloat(p.revenue||0).toFixed(2)}€</p><p className="text-xs text-gray-400">{p.conversions} sales</p></div></div>))}{topProducts.length===0&&<p className="text-gray-400 text-center py-8">No data yet</p>}</div>
              </div>
            </div>
          )}

          {/* DASHBOARD VIEW */}
          {activeView==='dashboard' && (
            isUserLoggedIn ? (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white mb-6">Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6 border border-purple-500"><DollarSign className="text-purple-300 mb-2" size={32}/><p className="text-3xl font-bold text-white">{parseFloat(analytics?.total_earnings||0).toFixed(2)}€</p><p className="text-sm text-purple-300">Total Earnings</p></div>
                  <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 border border-blue-500"><MousePointerClick className="text-blue-300 mb-2" size={32}/><p className="text-3xl font-bold text-white">{analytics?.total_clicks||0}</p><p className="text-sm text-blue-300">Clicks</p></div>
                  <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-6 border border-green-500"><TrendingUp className="text-green-300 mb-2" size={32}/><p className="text-3xl font-bold text-white">{analytics?.total_conversions||0}</p><p className="text-sm text-green-300">Conversions</p></div>
                  <div className="bg-gradient-to-br from-pink-900 to-pink-800 rounded-lg p-6 border border-pink-500"><Link2 className="text-pink-300 mb-2" size={32}/><p className="text-3xl font-bold text-white">{analytics?.active_links||0}</p><p className="text-sm text-pink-300">Active Links</p></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><DailyStatsChart/><ProductStatsChart/></div>
                <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6 border border-purple-500">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div><h3 className="text-xl font-bold text-white">💰 Available Balance</h3><p className="text-4xl font-bold text-white mt-2">{parseFloat(balance?.available_balance||0).toFixed(2)}€</p><p className="text-sm text-purple-300 mt-1">Earned: {parseFloat(balance?.total_earned||0).toFixed(2)}€ | Paid: {parseFloat(balance?.total_paid||0).toFixed(2)}€</p></div>
                    <button onClick={()=>setShowPayoutModal(true)} disabled={!balance?.available_balance||balance.available_balance<10} className="bg-white text-purple-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><CreditCard size={20} className="inline mr-2"/>Request Payout</button>
                  </div>
                  {payouts.length>0&&(<div className="mt-4 border-t border-purple-700 pt-4"><h4 className="text-white font-semibold mb-2">Recent Payouts</h4><div className="space-y-2">{payouts.slice(0,3).map(p=>(<div key={p.id} className="flex justify-between items-center text-sm"><span className="text-gray-300">{new Date(p.requested_at).toLocaleDateString()}</span><span className="text-white font-semibold">{parseFloat(p.amount).toFixed(2)}€</span><span>{getStatusBadge(p.status)}</span></div>))}</div></div>)}
                </div>
                <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">My Affiliate Links ({myLinks.length})</h3>
                  {myLinks.length===0?<p className="text-gray-400">No links yet. Go to Shop!</p>:(
                    <div className="space-y-3">{myLinks.map(link=>{const fullLink=`${window.location.origin}/aff/${link.link_code}`;return(<div key={link.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700"><div className="flex justify-between mb-2"><p className="text-white font-semibold">{link.product_name}</p><button onClick={()=>copyToClipboard(fullLink,link.id)} className="text-purple-400">{copiedId===link.id?<Check size={16}/>:<Copy size={16}/>}</button></div><code className="text-xs text-gray-400 break-all block mb-2">{fullLink}</code><div className="flex gap-4 text-xs"><span className="text-gray-400">🖱 {link.clicks||0} Clicks</span><span className="text-gray-400">✅ {link.conversions||0} Sales</span><span className="text-purple-400 font-semibold">💰 {parseFloat(link.revenue||0).toFixed(2)}€</span></div></div>);})}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
                <Lock size={64} className="mx-auto text-purple-400 mb-4"/>
                <p className="text-white text-lg mb-4">Bitte melde dich an um dein Dashboard zu sehen</p>
                <button onClick={()=>{setAuthMode('login');setShowUserAuth(true);}} className="bg-purple-600 text-white px-6 py-3 rounded-lg"><LogIn size={18} className="inline mr-2"/>Login</button>
              </div>
            )
          )}

          {/* SHOP VIEW — öffentlich */}
          {activeView==='shop' && (<>
            <div className="mb-6">
              <div className="relative mb-4"><Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={20}/><input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"/></div>
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex-1 min-w-[180px]"><label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><Filter size={16}/>Category</label><select value={selectedCategory} onChange={e=>setSelectedCategory(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"><option value="all">All Categories</option>{categories.map(cat=>(<option key={cat} value={cat}>{cat}</option>))}</select></div>
                <div className="flex-1 min-w-[180px]"><label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><SlidersHorizontal size={16}/>Sort</label><select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"><option value="newest">Newest</option><option value="name-asc">Name (A-Z)</option><option value="name-desc">Name (Z-A)</option><option value="price-asc">Price (Low-High)</option><option value="price-desc">Price (High-Low)</option><option value="commission-high">Highest Commission</option><option value="commission-low">Lowest Commission</option></select></div>
                {isAdmin&&(<div className="flex items-end"><button onClick={()=>setShowCategoryManager(!showCategoryManager)} className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600 border border-purple-500 flex items-center gap-2"><SlidersHorizontal size={18}/>Manage</button></div>)}
              </div>
              {showCategoryManager&&isAdmin&&(<div className="bg-gray-800 rounded-lg border border-purple-500 p-4 mb-4"><h3 className="text-white font-semibold mb-3">Manage Categories</h3><div className="flex gap-2 mb-3"><input type="text" value={newCategory} onChange={e=>setNewCategory(e.target.value)} placeholder="New category..." className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" onKeyPress={e=>e.key==='Enter'&&addCategory()}/><button onClick={addCategory} className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18}/>Add</button></div><div className="flex flex-wrap gap-2">{categories.map(cat=>(<div key={cat} className="bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm text-white">{cat}<button onClick={()=>deleteCategory(cat)} className="text-red-400 hover:text-red-300"><X size={14}/></button></div>))}</div></div>)}
            </div>
            {isAdmin&&(<><button onClick={()=>setShowForm(!showForm)} className="mb-6 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg shadow-lg"><ShoppingBag size={20}/>Add Product</button>{showForm&&<ProductForm onSubmit={handleSubmit} onCancel={()=>setShowForm(false)} loading={loading} categories={categories} title="Create Product"/>}</>)}
            <div className="mb-4 text-gray-400 text-sm">{sortedProducts.length} product{sortedProducts.length!==1&&'s'} found</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map(product=>{
                const hasLink=myLinks.find(l=>l.product_id===product.id);
                const fullLink=hasLink?`${window.location.origin}/aff/${hasLink.link_code}`:null;
                return(
                  <div key={product.id} className="bg-gray-800 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all border border-gray-700 hover:border-purple-500 overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-purple-900 to-gray-900 flex items-center justify-center relative">
                      {product.image_data?<img src={product.image_data} alt={product.name} className="w-full h-full object-cover"/>:<ShoppingBag size={64} className="text-purple-400"/>}
                      <span className="absolute top-3 left-3 px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-semibold">{product.type==='product'?'Product':'Service'}</span>
                      {isAdmin&&<button onClick={()=>deleteProduct(product.id)} className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg"><Trash2 size={16}/></button>}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2"><span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">{product.category}</span></div>
                      <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                      <p className="text-gray-400 text-sm mb-3 h-10 line-clamp-2">{product.description}</p>
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">{product.price}</div>
                      <div className="bg-gradient-to-r from-purple-900 to-pink-900 border border-purple-500 rounded-lg p-3 mb-3"><div className="flex items-center gap-2 text-purple-300"><TrendingUp size={16}/><span className="text-sm font-semibold">Commission:</span></div><p className="text-lg font-bold text-purple-200 mt-1">{product.commission_type==='percentage'?`${product.commission_value}%`:`${product.commission_value}€ per sale`}</p></div>
                      {!isPartner&&(!fullLink?(
                        <button onClick={()=>generateAffiliateLink(product.id)} className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 text-sm font-medium shadow-lg"><Link2 size={16}/>{isUserLoggedIn?'Generate Link':'Login to Generate'}</button>
                      ):(
                        <div className="bg-gray-900 rounded-lg p-3 border border-purple-500">
                          <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold text-purple-300">Your Link</span><button onClick={()=>copyToClipboard(fullLink,product.id)} className="text-purple-400 flex items-center gap-1">{copiedId===product.id?<><Check size={14}/><span className="text-xs">Copied!</span></>:<><Copy size={14}/><span className="text-xs">Copy</span></>}</button></div>
                          <code className="text-xs text-gray-400 break-all block bg-gray-800 p-2 rounded">{fullLink}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>)}
        </div>
      )}

      {/* Footer & Legal — bei allen App-Views außer Landing (Landing hat eigenen) */}
      {activeView!=='landing' && (
        <>
          <Footer onLegalClick={(page)=>{setLegalPage(page);setShowLegalModal(true);}}/>
          <CookieBanner/>
          {showLegalModal && <LegalModal page={legalPage} onClose={()=>setShowLegalModal(false)}/>}
        </>
      )}
    </div>
  );
}