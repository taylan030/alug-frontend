import React, { useState, useEffect } from 'react';
import { Search, Link2, Trash2, Copy, Check, Lock, ShoppingBag, TrendingUp, Upload, Handshake, BarChart3, DollarSign, MousePointerClick, Eye, User, LogOut, LogIn, Filter, SlidersHorizontal, Plus, X, Trophy, Medal, Users, CreditCard, AlertCircle, CheckCircle, Clock, XCircle, Package, FileText, Store, Webhook, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from './services/api';
import { CookieBanner, Footer, LegalModal, AdminLegalEditor } from './components/LegalPages';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace('/api', '')
  : 'https://alug-backend.onrender.com';

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

const DailyStatsChart = () => {
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.analytics.getDailyStats().then(data => {
      setDailyData(data.map(d => ({ ...d, dateLabel: new Date(d.date).toLocaleDateString('de-DE', { month: 'short', day: 'numeric' }) })));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);
  if (loading) return <LoadingSpinner />;
  return (
    <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
      <h3 className="text-xl font-bold text-white mb-4">📈 Clicks & Conversions (Last 7 Days)</h3>
      {dailyData.length === 0 ? <p className="text-gray-400 text-center py-8">No data yet</p> : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="dateLabel" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px', color: '#fff' }} />
            <Line type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={2} name="Clicks" dot={{ fill: '#3B82F6', r: 4 }} />
            <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2} name="Conversions" dot={{ fill: '#10B981', r: 4 }} />
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
      setProductData(data.map(p => ({ name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name, revenue: parseFloat(p.revenue || 0), conversions: parseInt(p.conversions || 0) })));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);
  if (loading) return <LoadingSpinner />;
  return (
    <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
      <h3 className="text-xl font-bold text-white mb-4">💰 Top Products by Revenue</h3>
      {productData.length === 0 ? <p className="text-gray-400 text-center py-8">No data yet</p> : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={productData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" style={{ fontSize: '11px' }} angle={-15} textAnchor="end" height={60} />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px', color: '#fff' }} formatter={(value, name) => name === 'revenue' ? [`${parseFloat(value).toFixed(2)}€`, 'Revenue'] : [value, 'Conversions']} />
            <Bar dataKey="revenue" fill="#A855F7" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
      <div className="text-center mt-4"><span className="text-sm text-gray-400">Showing top 5 products</span></div>
    </div>
  );
};

// ============================================
// PRODUCT FORM (shared by Admin & Partner)
// ============================================
const ProductForm = ({ onSubmit, onCancel, loading, categories, title = "Create Product" }) => {
  const [formData, setFormData] = useState({ name: '', description: '', price: '', priceValue: 0, type: 'product', commissionType: 'percentage', commissionValue: '', category: '', imageData: null, imagePreview: null, productUrl: '', attributionDays: 30 });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Bild ist zu groß (max 5MB)'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setFormData(f => ({ ...f, imageData: reader.result, imagePreview: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const priceMatch = formData.price.match(/[\d.,]+/);
    const priceValue = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : 0;
    onSubmit({ ...formData, priceValue });
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-purple-500">
      <h2 className="text-2xl font-semibold mb-4 text-white">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
          <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white">
            <option value="product">Product</option>
            <option value="service">Service</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="Product name" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
          <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" rows="3" placeholder="Product description" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Price *</label>
          <input type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="e.g. 29.99€" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Commission Type</label>
          <select value={formData.commissionType} onChange={(e) => setFormData({ ...formData, commissionType: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white">
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed (€)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Commission Value * {formData.commissionType === 'percentage' ? '(%)' : '(€)'}</label>
          <input type="number" step="0.01" value={formData.commissionValue} onChange={(e) => setFormData({ ...formData, commissionValue: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder={formData.commissionType === 'percentage' ? 'e.g. 15' : 'e.g. 5.00'} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Attribution Window (Tage)</label>
          <select value={formData.attributionDays} onChange={(e) => setFormData({ ...formData, attributionDays: parseInt(e.target.value) })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white">
            <option value={7}>7 Tage</option>
            <option value={14}>14 Tage</option>
            <option value={30}>30 Tage (Standard)</option>
            <option value={60}>60 Tage</option>
            <option value={90}>90 Tage</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Category *</label>
          <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white">
            <option value="">Select...</option>
            {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Product URL</label>
          <input type="url" value={formData.productUrl} onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="https://example.com/product" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Image</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 cursor-pointer">
              <Upload size={18} /><span className="text-sm font-medium">Choose</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {formData.imagePreview && (
              <div className="flex items-center gap-2">
                <img src={formData.imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg border-2 border-purple-500" />
                <button onClick={() => setFormData({ ...formData, imageData: null, imagePreview: null })} className="text-red-400 text-sm">Remove</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button onClick={handleSubmit} disabled={loading} className="bg-purple-600 text-white px-6 py-2 rounded-lg disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
        <button onClick={onCancel} className="bg-gray-700 text-gray-300 px-6 py-2 rounded-lg">Cancel</button>
      </div>
    </div>
  );
};

export default function AlugMarketplace() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Gaming', 'Hosting & Server', 'Marketing', 'Software', 'Hardware']);
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
  const [authMode, setAuthMode] = useState('login'); // login | register | register-partner
  const [userForm, setUserForm] = useState({ email: '', password: '', name: '', confirmPassword: '' });
  const [myLinks, setMyLinks] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('shop');
  const [analytics, setAnalytics] = useState(null);
  const [topMarketers, setTopMarketers] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [balance, setBalance] = useState({ total_earned: 0, total_paid: 0, available: 0 });
  const [payouts, setPayouts] = useState([]);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutForm, setPayoutForm] = useState({ amount: '', paymentMethod: 'paypal', paymentDetails: '' });
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

  const ADMIN_PASSWORD = 'admin123';

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/aff/')) {
      const code = path.split('/aff/')[1];
      window.location.href = `${BACKEND_URL}/aff/${code}`;
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
        if (parsedUser.isAdmin || adminStatus) setIsAdmin(true);
        if (parsedUser.isPartner) { setIsPartner(true); setPartnerApproved(parsedUser.partnerApproved); }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
      }
    } else if (adminStatus) {
      setIsAdmin(true);
    }
  };

  useEffect(() => {
    if (isUserLoggedIn) {
      if (activeView === 'dashboard') { loadAnalytics(); loadMyLinks(); loadBalance(); loadPayouts(); }
      else if (activeView === 'leaderboard') { loadTopMarketers(); loadTopProducts(); }
      else if (activeView === 'partner') { loadPartnerData(); }
    }
  }, [isUserLoggedIn, activeView]);

  useEffect(() => {
    if (isAdmin && activeView === 'admin') loadAdminData();
  }, [isAdmin, activeView]);

  const loadProducts = async () => {
    try { const data = await api.products.getAll(); setProducts(data); }
    catch (err) { showError('Fehler beim Laden der Produkte'); }
  };

  const loadAnalytics = async () => {
    try { const data = await api.analytics.getMyStats(); setAnalytics(data); }
    catch (err) { console.error('Analytics error:', err); }
  };

  const loadMyLinks = async () => {
    try { const data = await api.affiliate.getMyLinks(); setMyLinks(data); }
    catch (err) { console.error('Links error:', err); }
  };

  const loadTopMarketers = async () => {
    try { const data = await api.leaderboard.getTopMarketers(); setTopMarketers(data); }
    catch (err) { console.error('Leaderboard error:', err); }
  };

  const loadTopProducts = async () => {
    try { const data = await api.leaderboard.getTopProducts(); setTopProducts(data); }
    catch (err) { console.error('Top products error:', err); }
  };

  const loadBalance = async () => {
    try {
      const res = await fetch(`${API_URL}/payouts/balance`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setBalance(await res.json());
    } catch (err) { console.error('Balance error:', err); }
  };

  const loadPayouts = async () => {
    try {
      const res = await fetch(`${API_URL}/payouts/my-payouts`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setPayouts(await res.json());
    } catch (err) { console.error('Payouts error:', err); }
  };

  const loadPartnerData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [prods, stats, webhook] = await Promise.all([
        fetch(`${API_URL}/partner/products`, { headers }).then(r => r.json()),
        fetch(`${API_URL}/partner/stats`, { headers }).then(r => r.json()),
        fetch(`${API_URL}/partner/webhook-info`, { headers }).then(r => r.json())
      ]);
      setPartnerProducts(Array.isArray(prods) ? prods : []);
      setPartnerStats(Array.isArray(stats) ? stats : []);
      setWebhookInfo(webhook);
    } catch (err) { console.error('Partner data error:', err); }
  };

  const loadAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [users, conversions, payoutRequests, stats, partners, allProducts] = await Promise.all([
        api.admin.getAllUsers(),
        api.admin.getAllConversions(),
        fetch(`${API_URL}/admin/payouts`, { headers }).then(r => r.json()),
        fetch(`${API_URL}/admin/stats`, { headers }).then(r => r.json()),
        fetch(`${API_URL}/admin/partners`, { headers }).then(r => r.json()),
        fetch(`${API_URL}/admin/products`, { headers }).then(r => r.json())
      ]);
      setAdminUsers(users);
      setAdminConversions(conversions);
      setAdminPayouts(payoutRequests);
      setAdminStats(stats);
      setAdminPartners(Array.isArray(partners) ? partners : []);
      setAdminAllProducts(Array.isArray(allProducts) ? allProducts : []);
    } catch (err) { showError('Fehler beim Laden der Admin-Daten'); }
  };

  const handleAdminLogin = async () => {
    if (adminPassword !== ADMIN_PASSWORD) { showError('Falsches Admin-Passwort!'); return; }
    setLoading(true);
    try {
      const data = await api.auth.login('admin@alug.com', 'admin123');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setIsUserLoggedIn(true);
      setCurrentUser(data.user);
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      setShowAdminLogin(false);
      setAdminPassword('');
      showSuccess('Admin-Modus aktiviert! 🔓');
    } catch (err) { showError('Admin-Login fehlgeschlagen'); }
    finally { setLoading(false); }
  };

  const handleUserLogin = async () => {
    setLoading(true);
    try {
      const data = await api.auth.login(userForm.email, userForm.password);
      if (data.token) localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setIsUserLoggedIn(true);
      setCurrentUser(data.user);
      if (data.user.isAdmin) { setIsAdmin(true); localStorage.setItem('isAdmin', 'true'); }
      if (data.user.isPartner) { setIsPartner(true); setPartnerApproved(data.user.partnerApproved); }
      setShowUserAuth(false);
      setUserForm({ email: '', password: '', name: '', confirmPassword: '' });
      showSuccess('Erfolgreich angemeldet!');
    } catch (err) { showError(err.message || 'Login fehlgeschlagen'); }
    finally { setLoading(false); }
  };

  const handleUserRegister = async () => {
    if (!userForm.email || !userForm.password || !userForm.name) { showError('Bitte fülle alle Felder aus!'); return; }
    if (userForm.password !== userForm.confirmPassword) { showError('Passwörter stimmen nicht überein!'); return; }
    setLoading(true);
    try {
      const data = await api.auth.register(userForm.name, userForm.email, userForm.password);
      if (data.token) localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setIsUserLoggedIn(true);
      setCurrentUser(data.user);
      setShowUserAuth(false);
      setUserForm({ email: '', password: '', name: '', confirmPassword: '' });
      showSuccess('Erfolgreich registriert!');
    } catch (err) { showError(err.message || 'Registrierung fehlgeschlagen'); }
    finally { setLoading(false); }
  };

  const handlePartnerRegister = async () => {
    if (!userForm.email || !userForm.password || !userForm.name) { showError('Bitte fülle alle Felder aus!'); return; }
    if (userForm.password !== userForm.confirmPassword) { showError('Passwörter stimmen nicht überein!'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register-partner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userForm.name, email: userForm.email, password: userForm.password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.token) localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setIsUserLoggedIn(true);
      setCurrentUser(data.user);
      setIsPartner(true);
      setPartnerApproved(false);
      setShowUserAuth(false);
      setUserForm({ email: '', password: '', name: '', confirmPassword: '' });
      showSuccess('Partner-Account erstellt! Warte auf Admin-Freigabe.');
    } catch (err) { showError(err.message || 'Registrierung fehlgeschlagen'); }
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    setIsUserLoggedIn(false);
    setCurrentUser(null);
    setIsAdmin(false);
    setIsPartner(false);
    setPartnerApproved(false);
    setActiveView('shop');
    showSuccess('Erfolgreich abgemeldet');
  };

  const handleSubmit = async (formData) => {
    if (!formData.name || !formData.description || !formData.price || !formData.commissionValue || !formData.category) { showError('Bitte fülle alle Pflichtfelder aus'); return; }
    setLoading(true);
    try {
      const newProduct = await api.products.create(formData);
      setProducts([newProduct, ...products]);
      setShowForm(false);
      showSuccess('Produkt erfolgreich erstellt!');
    } catch (err) { showError(err.message || 'Fehler beim Erstellen'); }
    finally { setLoading(false); }
  };

  const handlePartnerSubmit = async (formData) => {
    if (!formData.name || !formData.description || !formData.price || !formData.commissionValue || !formData.category) { showError('Bitte fülle alle Pflichtfelder aus'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/partner/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPartnerProducts([data, ...partnerProducts]);
      setShowForm(false);
      showSuccess('Produkt eingereicht! Warte auf Admin-Genehmigung.');
      loadPartnerData();
    } catch (err) { showError(err.message || 'Fehler beim Erstellen'); }
    finally { setLoading(false); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Produkt wirklich löschen?')) return;
    try { await api.products.delete(id); setProducts(products.filter(p => p.id !== id)); showSuccess('Produkt gelöscht'); }
    catch (err) { showError('Fehler beim Löschen'); }
  };

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) { setCategories([...categories, newCategory]); setNewCategory(''); showSuccess('Kategorie hinzugefügt'); }
  };

  const deleteCategory = (cat) => {
    if (window.confirm(`Kategorie "${cat}" wirklich löschen?`)) setCategories(categories.filter(c => c !== cat));
  };

  const generateAffiliateLink = async (productId) => {
    if (!isUserLoggedIn) { showError('Bitte melde dich an!'); setShowUserAuth(true); return; }
    setLoading(true);
    try { await api.affiliate.generateLink(productId); showSuccess('Link generiert!'); await loadMyLinks(); }
    catch (err) { showError(err.message || 'Fehler beim Generieren'); }
    finally { setLoading(false); }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showSuccess('Link kopiert!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRequestPayout = async () => {
    const amount = parseFloat(payoutForm.amount);
    if (!amount || amount < 10) { showError('Mindestbetrag: 10€'); return; }
    if (amount > balance?.available) { showError('Nicht genug Guthaben'); return; }
    if (!payoutForm.paymentDetails) { showError('Zahlungsdetails fehlen'); return; }
    setLoading(true);
    try {
      await fetch(`${API_URL}/payouts/request`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify(payoutForm) });
      showSuccess('Auszahlung beantragt!');
      setShowPayoutModal(false);
      setPayoutForm({ amount: '', paymentMethod: 'paypal', paymentDetails: '' });
      await Promise.all([loadBalance(), loadPayouts()]);
    } catch (err) { showError('Fehler bei Auszahlung'); }
    finally { setLoading(false); }
  };

  const handleUpdatePayoutStatus = async (payoutId, status) => {
    try {
      await fetch(`${API_URL}/admin/payouts/${payoutId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify({ status }) });
      showSuccess('Status aktualisiert');
      await loadAdminData();
    } catch (err) { showError('Fehler beim Aktualisieren'); }
  };

  const handleApprovePartner = async (partnerId) => {
    try {
      await fetch(`${API_URL}/admin/partners/${partnerId}/approve`, { method: 'PUT', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      showSuccess('Partner genehmigt!');
      await loadAdminData();
    } catch (err) { showError('Fehler beim Genehmigen'); }
  };

  const handleRevokePartner = async (partnerId) => {
    try {
      await fetch(`${API_URL}/admin/partners/${partnerId}/revoke`, { method: 'PUT', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      showSuccess('Partner gesperrt');
      await loadAdminData();
    } catch (err) { showError('Fehler'); }
  };

  const handleApproveProduct = async (productId) => {
    try {
      await fetch(`${API_URL}/admin/products/${productId}/approve`, { method: 'PUT', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      showSuccess('Produkt genehmigt!');
      await loadAdminData();
      await loadProducts();
    } catch (err) { showError('Fehler beim Genehmigen'); }
  };

  const handleRejectProduct = async (productId) => {
    try {
      await fetch(`${API_URL}/admin/products/${productId}/reject`, { method: 'PUT', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      showSuccess('Produkt abgelehnt');
      await loadAdminData();
    } catch (err) { showError('Fehler'); }
  };

  const showError = (message) => { setError(message); setTimeout(() => setError(null), 5000); };
  const showSuccess = (message) => { setSuccess(message); setTimeout(() => setSuccess(null), 3000); };

  const getStatusBadge = (status) => {
    const badges = {
      pending: <span className="flex items-center gap-1 text-yellow-400"><Clock size={14} /> Ausstehend</span>,
      approved: <span className="flex items-center gap-1 text-blue-400"><CheckCircle size={14} /> Genehmigt</span>,
      paid: <span className="flex items-center gap-1 text-green-400"><CheckCircle size={14} /> Bezahlt</span>,
      rejected: <span className="flex items-center gap-1 text-red-400"><XCircle size={14} /> Abgelehnt</span>
    };
    return badges[status] || status;
  };

  const filteredProducts = products
    .filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc': return (a.name || '').localeCompare(b.name || '');
      case 'name-desc': return (b.name || '').localeCompare(a.name || '');
      case 'price-asc': return (a.price_value || 0) - (b.price_value || 0);
      case 'price-desc': return (b.price_value || 0) - (a.price_value || 0);
      case 'commission-high': return parseFloat(b.commission_value || 0) - parseFloat(a.commission_value || 0);
      case 'commission-low': return parseFloat(a.commission_value || 0) - parseFloat(b.commission_value || 0);
      default: return (b.id || 0) - (a.id || 0);
    }
  });

  return (
    <div className="min-h-screen bg-gray-900">
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && <SuccessAlert message={success} onClose={() => setSuccess(null)} />}

      {/* NAVBAR */}
      <div className="bg-gray-800 shadow-lg border-b border-purple-500 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 to-pink-400 p-2 rounded-lg shadow-lg">
                <Handshake size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Alug</h1>
                <p className="text-xs sm:text-sm text-gray-400">Your Affiliate Plug</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => setActiveView('shop')} className={`px-3 py-2 rounded-lg text-sm ${activeView === 'shop' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}><ShoppingBag size={16} className="inline mr-1" />Shop</button>
              {isUserLoggedIn && !isPartner && <button onClick={() => setActiveView('dashboard')} className={`px-3 py-2 rounded-lg text-sm ${activeView === 'dashboard' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}><BarChart3 size={16} className="inline mr-1" />Dashboard</button>}
              {isPartner && <button onClick={() => setActiveView('partner')} className={`px-3 py-2 rounded-lg text-sm ${activeView === 'partner' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}><Store size={16} className="inline mr-1" />Partner</button>}
              <button onClick={() => setActiveView('leaderboard')} className={`px-3 py-2 rounded-lg text-sm ${activeView === 'leaderboard' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}><Trophy size={16} className="inline mr-1" />Leaderboard</button>
              {isAdmin && <button onClick={() => setActiveView('admin')} className={`px-3 py-2 rounded-lg text-sm ${activeView === 'admin' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}><Users size={16} className="inline mr-1" />Admin</button>}
              {isUserLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
                    <User size={16} className="text-purple-400" />
                    <span className="text-sm text-white hidden sm:inline">{currentUser?.name}</span>
                    {isAdmin && <Lock size={14} className="text-yellow-400" title="Admin" />}
                    {isPartner && <Store size={14} className="text-green-400" title="Partner" />}
                  </div>
                  <button onClick={handleLogout} className="bg-gray-700 text-gray-200 p-2 rounded-lg hover:bg-gray-600"><LogOut size={16} /></button>
                </>
              ) : (
                <button onClick={() => { setShowUserAuth(true); setAuthMode('login'); }} className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 text-sm"><LogIn size={16} className="inline mr-1" />Login</button>
              )}
              {!isAdmin && (
                <button onClick={() => setShowAdminLogin(true)} className="bg-yellow-600 text-white p-2 rounded-lg hover:bg-yellow-700 border border-yellow-400" title="Admin Login"><Lock size={16} /></button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ADMIN LOGIN MODAL */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border-2 border-yellow-500">
            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2"><Lock className="text-yellow-400" />Admin Login</h2>
            <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white mb-4" placeholder="Admin-Passwort" autoFocus />
            <div className="flex gap-3">
              <button onClick={handleAdminLogin} disabled={loading} className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50">{loading ? 'Anmelden...' : 'Anmelden'}</button>
              <button onClick={() => { setShowAdminLogin(false); setAdminPassword(''); }} className="flex-1 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg">Abbrechen</button>
            </div>
          </div>
        </div>
      )}

      {/* USER AUTH MODAL */}
      {showUserAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-purple-500">
            <div className="flex gap-2 mb-6">
              <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 rounded-lg text-sm ${authMode === 'login' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Login</button>
              <button onClick={() => setAuthMode('register')} className={`flex-1 py-2 rounded-lg text-sm ${authMode === 'register' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Affiliate</button>
              <button onClick={() => setAuthMode('register-partner')} className={`flex-1 py-2 rounded-lg text-sm ${authMode === 'register-partner' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Partner</button>
            </div>

            {authMode === 'register-partner' && (
              <div className="mb-4 bg-green-900 border border-green-600 rounded-lg p-3">
                <p className="text-green-300 text-sm font-semibold">🤝 Partner-Account</p>
                <p className="text-green-400 text-xs mt-1">Als Partner kannst du eigene Produkte eintragen und von Affiliates bewerben lassen. Dein Account muss vom Admin genehmigt werden.</p>
              </div>
            )}

            {authMode === 'login' ? (
              <div className="space-y-4">
                <input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="Email" />
                <input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} onKeyPress={(e) => e.key === 'Enter' && handleUserLogin()} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="Passwort" />
                <div className="flex gap-3">
                  <button onClick={handleUserLogin} disabled={loading} className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">{loading ? 'Loading...' : 'Login'}</button>
                  <button onClick={() => setShowUserAuth(false)} className="flex-1 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <input type="text" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="Name" />
                <input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="Email" />
                <input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="Passwort" />
                <input type="password" value={userForm.confirmPassword} onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="Passwort bestätigen" />
                <div className="flex gap-3">
                  <button onClick={authMode === 'register-partner' ? handlePartnerRegister : handleUserRegister} disabled={loading} className={`flex-1 text-white px-4 py-2 rounded-lg disabled:opacity-50 ${authMode === 'register-partner' ? 'bg-green-600' : 'bg-purple-600'}`}>{loading ? 'Loading...' : 'Registrieren'}</button>
                  <button onClick={() => setShowUserAuth(false)} className="flex-1 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAYOUT MODAL */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-purple-500">
            <h2 className="text-2xl font-bold mb-4 text-white">Auszahlung</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Betrag (Verfügbar: {parseFloat(balance?.available || 0).toFixed(2)}€)</label>
                <input type="number" step="0.01" value={payoutForm.amount} onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="Min 10€" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Methode</label>
                <select value={payoutForm.paymentMethod} onChange={(e) => setPayoutForm({ ...payoutForm, paymentMethod: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white">
                  <option value="paypal">PayPal</option>
                  <option value="bank">Bank</option>
                  <option value="crypto">Crypto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Details</label>
                <input type="text" value={payoutForm.paymentDetails} onChange={(e) => setPayoutForm({ ...payoutForm, paymentDetails: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="Email/IBAN/Address" />
              </div>
              <div className="flex gap-3">
                <button onClick={handleRequestPayout} disabled={loading} className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">{loading ? 'Processing...' : 'Request'}</button>
                <button onClick={() => setShowPayoutModal(false)} className="flex-1 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ============================================ */}
        {/* PARTNER DASHBOARD */}
        {/* ============================================ */}
        {activeView === 'partner' && isPartner && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3"><Store size={36} className="text-green-400" />Partner Dashboard</h2>

            {/* Noch nicht genehmigt */}
            {!partnerApproved && (
              <div className="bg-yellow-900 border border-yellow-600 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock size={24} className="text-yellow-400" />
                  <h3 className="text-xl font-bold text-yellow-300">Account wartet auf Genehmigung</h3>
                </div>
                <p className="text-yellow-400">Dein Partner-Account wurde erstellt und wartet auf die Freigabe durch den Admin. Du wirst benachrichtigt sobald dein Account genehmigt wurde.</p>
              </div>
            )}

            {/* Genehmigt */}
            {partnerApproved && (
              <>
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-6 border border-green-500">
                    <Package className="text-green-300 mb-2" size={32} />
                    <p className="text-3xl font-bold text-white">{partnerProducts.length}</p>
                    <p className="text-sm text-green-300">Meine Produkte</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 border border-blue-500">
                    <MousePointerClick className="text-blue-300 mb-2" size={32} />
                    <p className="text-3xl font-bold text-white">{partnerStats.reduce((s, p) => s + parseInt(p.total_clicks || 0), 0)}</p>
                    <p className="text-sm text-blue-300">Gesamte Clicks</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6 border border-purple-500">
                    <TrendingUp className="text-purple-300 mb-2" size={32} />
                    <p className="text-3xl font-bold text-white">{partnerStats.reduce((s, p) => s + parseInt(p.total_sales || 0), 0)}</p>
                    <p className="text-sm text-purple-300">Gesamte Sales</p>
                  </div>
                </div>

                {/* Webhook Info */}
                <div className="bg-gray-800 rounded-xl border border-green-500 p-6">
                  <button onClick={() => setShowWebhookInfo(!showWebhookInfo)} className="flex items-center justify-between w-full">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Webhook size={22} className="text-green-400" />Webhook URL & Anleitung</h3>
                    {showWebhookInfo ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                  </button>
                  {showWebhookInfo && webhookInfo && (
                    <div className="mt-4 space-y-4">
                      <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                        <p className="text-sm text-gray-400 mb-2">Deine Webhook URL:</p>
                        <code className="text-green-400 text-sm break-all block">{webhookInfo.webhookUrl}</code>
                        <button onClick={() => { navigator.clipboard.writeText(webhookInfo.webhookUrl); setCopiedWebhook(true); setTimeout(() => setCopiedWebhook(false), 2000); }} className="mt-2 flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300">
                          {copiedWebhook ? <><Check size={14} /> Kopiert!</> : <><Copy size={14} /> Kopieren</>}
                        </button>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                        <p className="text-sm font-semibold text-white mb-3">📋 Anleitung:</p>
                        <ol className="space-y-2">
                          {webhookInfo.instructions?.map((step, i) => (
                            <li key={i} className="text-sm text-gray-300">{step}</li>
                          ))}
                        </ol>
                      </div>
                      <div className="bg-blue-900 border border-blue-600 rounded-lg p-4">
                        <p className="text-blue-300 text-sm font-semibold">💡 Wie funktioniert ALUG_CODE?</p>
                        <p className="text-blue-400 text-sm mt-1">Wenn ein Besucher auf einen Affiliate-Link klickt, wird er zu deiner Seite weitergeleitet mit einem Parameter: <code className="bg-blue-800 px-1 rounded">?alug_code=1-3-1234567890</code>. Diesen Wert musst du bei einem Kauf an den Webhook weitergeben.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Produkte */}
                <div className="bg-gray-800 rounded-xl border border-purple-500 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Meine Produkte</h3>
                    <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-lg text-sm">
                      <Plus size={16} />Produkt hinzufügen
                    </button>
                  </div>

                  {showForm && (
                    <ProductForm
                      onSubmit={handlePartnerSubmit}
                      onCancel={() => setShowForm(false)}
                      loading={loading}
                      categories={categories}
                      title="Produkt einreichen (wird von Admin geprüft)"
                    />
                  )}

                  <div className="space-y-3">
                    {partnerProducts.map(product => {
                      const stat = partnerStats.find(s => s.id === product.id);
                      return (
                        <div key={product.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-white font-semibold">{product.name}</h4>
                                {product.approved
                                  ? <span className="text-xs bg-green-800 text-green-300 px-2 py-0.5 rounded-full">✅ Live</span>
                                  : <span className="text-xs bg-yellow-800 text-yellow-300 px-2 py-0.5 rounded-full">⏳ Wartend</span>
                                }
                              </div>
                              <p className="text-gray-400 text-sm">{product.price} · {product.commission_type === 'percentage' ? `${product.commission_value}%` : `${product.commission_value}€`} Commission · {product.attribution_days || 30} Tage Attribution</p>
                            </div>
                            {stat && (
                              <div className="text-right text-sm">
                                <p className="text-blue-400">{stat.total_clicks || 0} Clicks</p>
                                <p className="text-green-400">{stat.total_sales || 0} Sales</p>
                                <p className="text-purple-400 font-bold">{parseFloat(stat.total_revenue || 0).toFixed(2)}€</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {partnerProducts.length === 0 && <p className="text-gray-400 text-center py-8">Noch keine Produkte. Füge dein erstes Produkt hinzu!</p>}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/* ADMIN VIEW */}
        {/* ============================================ */}
        {activeView === 'admin' && isAdmin && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3"><Users size={36} className="text-purple-400" />Admin Dashboard</h2>

            {adminStats && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-4 border border-purple-500"><p className="text-2xl font-bold text-white">{adminStats.total_users}</p><p className="text-xs text-purple-300">Affiliates</p></div>
                <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-4 border border-green-500"><p className="text-2xl font-bold text-white">{adminStats.total_partners}</p><p className="text-xs text-green-300">Partner</p></div>
                <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 rounded-lg p-4 border border-yellow-500"><p className="text-2xl font-bold text-white">{adminStats.pending_partners}</p><p className="text-xs text-yellow-300">Partner ausstehend</p></div>
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 border border-blue-500"><p className="text-2xl font-bold text-white">{adminStats.total_products}</p><p className="text-xs text-blue-300">Produkte live</p></div>
                <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-lg p-4 border border-orange-500"><p className="text-2xl font-bold text-white">{adminStats.pending_products}</p><p className="text-xs text-orange-300">Produkte ausstehend</p></div>
                <div className="bg-gradient-to-br from-pink-900 to-pink-800 rounded-lg p-4 border border-pink-500"><p className="text-2xl font-bold text-white">{parseFloat(adminStats.total_revenue || 0).toFixed(0)}€</p><p className="text-xs text-pink-300">Umsatz</p></div>
              </div>
            )}

            {/* Partner genehmigen */}
            <div className="bg-gray-800 rounded-lg border border-green-500 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Store className="text-green-400" />Partner ({adminPartners.length})</h3>
              <div className="space-y-3">
                {adminPartners.map(partner => (
                  <div key={partner.id} className="bg-gray-900 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <p className="text-white font-semibold">{partner.name}</p>
                      <p className="text-sm text-gray-400">{partner.email}</p>
                      <p className="text-xs text-gray-500">{partner.approved_products}/{partner.total_products} Produkte genehmigt</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {partner.partner_approved
                        ? <span className="text-xs bg-green-800 text-green-300 px-3 py-1 rounded-full">✅ Genehmigt</span>
                        : <span className="text-xs bg-yellow-800 text-yellow-300 px-3 py-1 rounded-full">⏳ Ausstehend</span>
                      }
                      {!partner.partner_approved
                        ? <button onClick={() => handleApprovePartner(partner.id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Genehmigen</button>
                        : <button onClick={() => handleRevokePartner(partner.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Sperren</button>
                      }
                    </div>
                  </div>
                ))}
                {adminPartners.length === 0 && <p className="text-gray-400 text-center py-4">Noch keine Partner</p>}
              </div>
            </div>

            {/* Produkte genehmigen */}
            <div className="bg-gray-800 rounded-lg border border-orange-500 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Package className="text-orange-400" />Produkte zur Genehmigung</h3>
              <div className="space-y-3">
                {adminAllProducts.filter(p => !p.approved && p.vendor_id).map(product => (
                  <div key={product.id} className="bg-gray-900 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <p className="text-white font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-400">von {product.vendor_name || 'Unbekannt'} · {product.price} · {product.commission_value}{product.commission_type === 'percentage' ? '%' : '€'}</p>
                      <p className="text-xs text-gray-500">{product.category} · {product.attribution_days || 30} Tage</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleApproveProduct(product.id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Genehmigen</button>
                      <button onClick={() => handleRejectProduct(product.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Ablehnen</button>
                    </div>
                  </div>
                ))}
                {adminAllProducts.filter(p => !p.approved && p.vendor_id).length === 0 && <p className="text-gray-400 text-center py-4">Keine ausstehenden Produkte</p>}
              </div>
            </div>

            {/* Users */}
            <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Affiliates ({adminUsers.filter(u => !u.is_partner).length})</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {adminUsers.filter(u => !u.is_partner).slice(0, 20).map(user => (
                  <div key={user.id} className="flex justify-between items-center p-3 bg-gray-900 rounded">
                    <div><p className="text-white font-semibold">{user.name}</p><p className="text-sm text-gray-400">{user.email}</p></div>
                    <div className="text-right"><p className="text-purple-400 font-bold">{parseFloat(user.total_earnings || 0).toFixed(2)}€</p><p className="text-xs text-gray-400">{user.total_conversions || 0} sales</p></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payout Requests */}
            <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Payout Requests</h3>
              <div className="space-y-3">
                {adminPayouts.map(payout => (
                  <div key={payout.id} className="bg-gray-900 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div><p className="text-white font-semibold">{payout.user_name}</p><p className="text-sm text-gray-400">{payout.payment_method} - {payout.payment_details}</p></div>
                    <div className="text-right"><p className="text-2xl font-bold text-purple-400">{parseFloat(payout.amount).toFixed(2)}€</p><p className="text-sm">{getStatusBadge(payout.status)}</p></div>
                    {payout.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdatePayoutStatus(payout.id, 'paid')} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Paid</button>
                        <button onClick={() => handleUpdatePayoutStatus(payout.id, 'rejected')} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Reject</button>
                      </div>
                    )}
                  </div>
                ))}
                {adminPayouts.length === 0 && <p className="text-gray-400 text-center py-8">No requests</p>}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FileText className="text-purple-400" />Rechtliche Angaben</h3>
              <AdminLegalEditor />
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* LEADERBOARD VIEW */}
        {/* ============================================ */}
        {activeView === 'leaderboard' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3"><Trophy size={36} className="text-yellow-400" />Top Performers</h2>
            <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
              <h3 className="text-xl font-bold text-white mb-4">🏆 Top Marketers</h3>
              <div className="space-y-4">
                {topMarketers.map((marketer, index) => (
                  <div key={marketer.id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-900">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700">
                      {index === 0 && <Trophy size={24} className="text-yellow-400" />}
                      {index === 1 && <Medal size={24} className="text-gray-300" />}
                      {index === 2 && <Medal size={24} className="text-orange-400" />}
                      {index > 2 && <span className="text-gray-400 font-bold">{index + 1}</span>}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg">{marketer.name}</h4>
                      <div className="flex gap-4 text-sm text-gray-400"><span>✅ {marketer.conversions} Sales</span><span>🖱 {marketer.clicks} Clicks</span></div>
                    </div>
                    <div className="text-2xl font-bold text-purple-400">{parseFloat(marketer.revenue || 0).toFixed(2)}€</div>
                  </div>
                ))}
                {topMarketers.length === 0 && <p className="text-gray-400 text-center py-8">No data yet</p>}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
              <h3 className="text-xl font-bold text-white mb-4">📦 Top Products</h3>
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex justify-between items-center p-3 bg-gray-900 rounded">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{index + 1}</span>
                      <div><p className="text-white font-semibold">{product.name}</p><p className="text-sm text-gray-400">{product.category}</p></div>
                    </div>
                    <div className="text-right"><p className="text-purple-400 font-bold">{parseFloat(product.revenue || 0).toFixed(2)}€</p><p className="text-xs text-gray-400">{product.conversions} sales</p></div>
                  </div>
                ))}
                {topProducts.length === 0 && <p className="text-gray-400 text-center py-8">No data yet</p>}
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* DASHBOARD VIEW */}
        {/* ============================================ */}
        {activeView === 'dashboard' && (
          isUserLoggedIn ? (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6">Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6 border border-purple-500"><DollarSign className="text-purple-300 mb-2" size={32} /><p className="text-3xl font-bold text-white">{parseFloat(analytics?.total_earnings || 0).toFixed(2)}€</p><p className="text-sm text-purple-300">Total Earnings</p></div>
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 border border-blue-500"><MousePointerClick className="text-blue-300 mb-2" size={32} /><p className="text-3xl font-bold text-white">{analytics?.total_clicks || 0}</p><p className="text-sm text-blue-300">Clicks</p></div>
                <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-6 border border-green-500"><TrendingUp className="text-green-300 mb-2" size={32} /><p className="text-3xl font-bold text-white">{analytics?.total_conversions || 0}</p><p className="text-sm text-green-300">Conversions</p></div>
                <div className="bg-gradient-to-br from-pink-900 to-pink-800 rounded-lg p-6 border border-pink-500"><Link2 className="text-pink-300 mb-2" size={32} /><p className="text-3xl font-bold text-white">{analytics?.active_links || 0}</p><p className="text-sm text-pink-300">Active Links</p></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DailyStatsChart />
                <ProductStatsChart />
              </div>
              <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6 border border-purple-500">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">💰 Available Balance</h3>
                    <p className="text-4xl font-bold text-white mt-2">{parseFloat(balance?.available_balance || 0).toFixed(2)}€</p>
                    <p className="text-sm text-purple-300 mt-1">Earned: {parseFloat(balance?.total_earned || 0).toFixed(2)}€ | Paid: {parseFloat(balance?.total_paid || 0).toFixed(2)}€</p>
                  </div>
                  <button onClick={() => setShowPayoutModal(true)} disabled={!balance?.available_balance || balance.available_balance < 10} className="bg-white text-purple-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    <CreditCard size={20} className="inline mr-2" />Request Payout
                  </button>
                </div>
                {payouts.length > 0 && (
                  <div className="mt-4 border-t border-purple-700 pt-4">
                    <h4 className="text-white font-semibold mb-2">Recent Payouts</h4>
                    <div className="space-y-2">
                      {payouts.slice(0, 3).map(payout => (
                        <div key={payout.id} className="flex justify-between items-center text-sm">
                          <span className="text-gray-300">{new Date(payout.requested_at).toLocaleDateString()}</span>
                          <span className="text-white font-semibold">{parseFloat(payout.amount).toFixed(2)}€</span>
                          <span>{getStatusBadge(payout.status)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
                <h3 className="text-xl font-bold text-white mb-4">My Affiliate Links ({myLinks.length})</h3>
                {myLinks.length === 0 ? <p className="text-gray-400">No links yet. Go to Shop!</p> : (
                  <div className="space-y-3">
                    {myLinks.map(link => {
                      const fullLink = `${window.location.origin}/aff/${link.link_code}`;
                      return (
                        <div key={link.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                          <div className="flex justify-between mb-2">
                            <p className="text-white font-semibold">{link.product_name}</p>
                            <button onClick={() => copyToClipboard(fullLink, link.id)} className="text-purple-400">{copiedId === link.id ? <Check size={16} /> : <Copy size={16} />}</button>
                          </div>
                          <code className="text-xs text-gray-400 break-all block mb-2">{fullLink}</code>
                          <div className="flex gap-4 text-xs">
                            <span className="text-gray-400">🖱 {link.clicks || 0} Clicks</span>
                            <span className="text-gray-400">✅ {link.conversions || 0} Sales</span>
                            <span className="text-purple-400 font-semibold">💰 {parseFloat(link.revenue || 0).toFixed(2)}€</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
              <Lock size={64} className="mx-auto text-purple-400 mb-4" />
              <p className="text-white text-lg mb-4">Please login to see your dashboard</p>
              <button onClick={() => { setShowUserAuth(true); setAuthMode('login'); }} className="bg-purple-600 text-white px-6 py-3 rounded-lg"><LogIn size={18} className="inline mr-2" />Login Now</button>
            </div>
          )
        )}

        {/* ============================================ */}
        {/* SHOP VIEW */}
        {/* ============================================ */}
        {activeView === 'shop' && (
          <>
            <div className="mb-6">
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white" />
              </div>
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><Filter size={16} />Category</label>
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white">
                    <option value="all">All Categories</option>
                    {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                  </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><SlidersHorizontal size={16} />Sort</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white">
                    <option value="newest">Newest</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="price-asc">Price (Low-High)</option>
                    <option value="price-desc">Price (High-Low)</option>
                    <option value="commission-high">Highest Commission</option>
                    <option value="commission-low">Lowest Commission</option>
                  </select>
                </div>
                {isAdmin && (
                  <div className="flex items-end">
                    <button onClick={() => setShowCategoryManager(!showCategoryManager)} className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600 border border-purple-500 flex items-center gap-2"><SlidersHorizontal size={18} />Manage</button>
                  </div>
                )}
              </div>
              {showCategoryManager && isAdmin && (
                <div className="bg-gray-800 rounded-lg border border-purple-500 p-4 mb-4">
                  <h3 className="text-white font-semibold mb-3">Manage Categories</h3>
                  <div className="flex gap-2 mb-3">
                    <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New category..." className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" onKeyPress={(e) => e.key === 'Enter' && addCategory()} />
                    <button onClick={addCategory} className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18} />Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <div key={cat} className="bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm text-white">{cat}<button onClick={() => deleteCategory(cat)} className="text-red-400 hover:text-red-300"><X size={14} /></button></div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isAdmin && (
              <>
                <button onClick={() => setShowForm(!showForm)} className="mb-6 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg shadow-lg"><ShoppingBag size={20} />Add Product</button>
                {showForm && (
                  <ProductForm
                    onSubmit={handleSubmit}
                    onCancel={() => setShowForm(false)}
                    loading={loading}
                    categories={categories}
                    title="Create Product"
                  />
                )}
              </>
            )}

            <div className="mb-4 text-gray-400 text-sm">{sortedProducts.length} product{sortedProducts.length !== 1 && 's'} found</div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => {
                const hasLink = myLinks.find(l => l.product_id === product.id);
                const fullLink = hasLink ? `${window.location.origin}/aff/${hasLink.link_code}` : null;
                return (
                  <div key={product.id} className="bg-gray-800 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all border border-gray-700 hover:border-purple-500 overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-purple-900 to-gray-900 flex items-center justify-center relative">
                      {product.image_data ? <img src={product.image_data} alt={product.name} className="w-full h-full object-cover" /> : <ShoppingBag size={64} className="text-purple-400" />}
                      <span className="absolute top-3 left-3 px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-semibold">{product.type === 'product' ? 'Product' : 'Service'}</span>
                      {isAdmin && <button onClick={() => deleteProduct(product.id)} className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg"><Trash2 size={16} /></button>}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2"><span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">{product.category}</span></div>
                      <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                      <p className="text-gray-400 text-sm mb-3 h-10 line-clamp-2">{product.description}</p>
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">{product.price}</div>
                      <div className="bg-gradient-to-r from-purple-900 to-pink-900 border border-purple-500 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 text-purple-300"><TrendingUp size={16} /><span className="text-sm font-semibold">Commission:</span></div>
                        <p className="text-lg font-bold text-purple-200 mt-1">{product.commission_type === 'percentage' ? `${product.commission_value}%` : `${product.commission_value}€ per sale`}</p>
                      </div>
                      {!isPartner && (!fullLink ? (
                        <button onClick={() => generateAffiliateLink(product.id)} className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 text-sm font-medium shadow-lg"><Link2 size={16} />Generate Link</button>
                      ) : (
                        <div className="bg-gray-900 rounded-lg p-3 border border-purple-500">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-purple-300">Your Link</span>
                            <button onClick={() => copyToClipboard(fullLink, product.id)} className="text-purple-400 flex items-center gap-1">
                              {copiedId === product.id ? <><Check size={14} /><span className="text-xs">Copied!</span></> : <><Copy size={14} /><span className="text-xs">Copy</span></>}
                            </button>
                          </div>
                          <code className="text-xs text-gray-400 break-all block bg-gray-800 p-2 rounded">{fullLink}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <Footer onLegalClick={(page) => { setLegalPage(page); setShowLegalModal(true); }} />
      <CookieBanner />
      {showLegalModal && <LegalModal page={legalPage} onClose={() => setShowLegalModal(false)} />}
    </div>
  );
}