import React, { useState, useEffect } from 'react';
import { Search, Link2, Trash2, Copy, Check, Lock, ShoppingBag, TrendingUp, Upload, Handshake, BarChart3, DollarSign, MousePointerClick, Eye, User, LogOut, LogIn, Filter, SlidersHorizontal, Plus, X, Trophy, Medal, Users, CreditCard, AlertCircle, CheckCircle, Clock, XCircle, Package, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from './services/api';
import { CookieBanner, Footer, LegalModal, AdminLegalEditor } from './components/LegalPages';

const ErrorAlert = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-pulse">
    <AlertCircle size={20} />
    <span>{message}</span>
    {onClose && <button onClick={onClose} className="ml-2"><X size={16} /></button>}
  </div>
);

const SuccessAlert = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-pulse">
    <CheckCircle size={20} />
    <span>{message}</span>
    {onClose && <button onClick={onClose} className="ml-2"><X size={16} /></button>}
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
    const loadDailyStats = async () => {
      try {
        const data = await api.analytics.getDailyStats();
        const formatted = data.map(d => ({
          ...d,
          dateLabel: new Date(d.date).toLocaleDateString('de-DE', { month: 'short', day: 'numeric' })
        }));
        setDailyData(formatted);
      } catch (err) {
        console.error('Daily stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDailyStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
      <h3 className="text-xl font-bold text-white mb-4">📈 Clicks & Conversions (Last 7 Days)</h3>
      {dailyData.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="dateLabel" 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #4B5563',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="clicks" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Clicks"
              dot={{ fill: '#3B82F6', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="conversions" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Conversions"
              dot={{ fill: '#10B981', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm text-gray-300">Clicks</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-300">Conversions</span>
        </div>
      </div>
    </div>
  );
};

const ProductStatsChart = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProductStats = async () => {
      try {
        const data = await api.analytics.getProductStats();
        const formatted = data.map(p => ({
          name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
          revenue: parseFloat(p.revenue || 0),
          conversions: parseInt(p.conversions || 0)
        }));
        setProductData(formatted);
      } catch (err) {
        console.error('Product stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProductStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
      <h3 className="text-xl font-bold text-white mb-4">💰 Top Products by Revenue</h3>
      {productData.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={productData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF"
              style={{ fontSize: '11px' }}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #4B5563',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value, name) => {
                if (name === 'revenue') return [`${parseFloat(value).toFixed(2)}€`, 'Revenue'];
                return [value, 'Conversions'];
              }}
            />
            <Bar 
              dataKey="revenue" 
              fill="#A855F7" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
      <div className="text-center mt-4">
        <span className="text-sm text-gray-400">Showing top 5 products</span>
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
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', priceValue: 0, type: 'product',
    commissionType: 'percentage', commissionValue: '', category: '',
    imageData: null, imagePreview: null, productUrl: ''
  });

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserAuth, setShowUserAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
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
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // NEU: Legal Pages States
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalPage, setLegalPage] = useState('impressum');

  const ADMIN_PASSWORD = 'admin123';

  useEffect(() => {
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
        }
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
      if (activeView === 'dashboard') {
        loadAnalytics();
        loadMyLinks();
        loadBalance();
        loadPayouts();
      } else if (activeView === 'leaderboard') {
        loadTopMarketers();
        loadTopProducts();
      }
    }
  }, [isUserLoggedIn, activeView]);

  useEffect(() => {
    if (isAdmin && activeView === 'admin') {
      loadAdminData();
    }
  }, [isAdmin, activeView]);

  const loadProducts = async () => {
    try {
      const data = await api.products.getAll();
      setProducts(data);
    } catch (err) {
      showError('Fehler beim Laden der Produkte');
    }
  };

  const loadAnalytics = async () => {
    try {
      const data = await api.analytics.getMyStats();
      setAnalytics(data);
    } catch (err) {
      console.error('Analytics error:', err);
    }
  };

  const loadMyLinks = async () => {
    try {
      const data = await api.affiliate.getMyLinks();
      setMyLinks(data);
    } catch (err) {
      console.error('Links error:', err);
    }
  };

  const loadTopMarketers = async () => {
    try {
      const data = await api.leaderboard.getTopMarketers();
      setTopMarketers(data);
    } catch (err) {
      console.error('Leaderboard error:', err);
    }
  };

  const loadTopProducts = async () => {
    try {
      const data = await api.leaderboard.getTopProducts();
      setTopProducts(data);
    } catch (err) {
      console.error('Top products error:', err);
    }
  };

  const loadBalance = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payouts/balance', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setBalance(data);
    } catch (err) {
      console.error('Balance error:', err);
    }
  };

  const loadPayouts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payouts/my-payouts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setPayouts(data);
    } catch (err) {
      console.error('Payouts error:', err);
    }
  };

  const loadAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [users, conversions, payoutRequests, stats] = await Promise.all([
        api.admin.getAllUsers(),
        api.admin.getAllConversions(),
        fetch('http://localhost:5000/api/admin/payouts', { 
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json()),
        fetch('http://localhost:5000/api/admin/stats', { 
          headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json())
      ]);
      
      setAdminUsers(users);
      setAdminConversions(conversions);
      setAdminPayouts(payoutRequests);
      setAdminStats(stats);
    } catch (err) {
      showError('Fehler beim Laden der Admin-Daten');
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      setShowAdminLogin(false);
      setAdminPassword('');
      showSuccess('Admin-Modus aktiviert! 🔓');
      setActiveView('shop');
    } else {
      showError('Falsches Admin-Passwort!');
    }
  };

  const handleUserLogin = async () => {
    setLoading(true);
    try {
      const data = await api.auth.login(userForm.email, userForm.password);
      localStorage.setItem('user', JSON.stringify(data.user));
      setIsUserLoggedIn(true);
      setCurrentUser(data.user);
      if (data.user.isAdmin) {
        setIsAdmin(true);
        localStorage.setItem('isAdmin', 'true');
      }
      setShowUserAuth(false);
      setUserForm({ email: '', password: '', name: '', confirmPassword: '' });
      showSuccess('Erfolgreich angemeldet!');
    } catch (err) {
      showError(err.message || 'Login fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  const handleUserRegister = async () => {
    if (!userForm.email || !userForm.password || !userForm.name) {
      showError('Bitte fülle alle Felder aus!');
      return;
    }
    if (userForm.password !== userForm.confirmPassword) {
      showError('Passwörter stimmen nicht überein!');
      return;
    }

    setLoading(true);
    try {
      const data = await api.auth.register(userForm.name, userForm.email, userForm.password);
      localStorage.setItem('user', JSON.stringify(data.user));
      setIsUserLoggedIn(true);
      setCurrentUser(data.user);
      setShowUserAuth(false);
      setUserForm({ email: '', password: '', name: '', confirmPassword: '' });
      showSuccess('Erfolgreich registriert!');
    } catch (err) {
      showError(err.message || 'Registrierung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    setIsUserLoggedIn(false);
    setCurrentUser(null);
    setIsAdmin(false);
    setActiveView('shop');
    showSuccess('Erfolgreich abgemeldet');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError('Bild ist zu groß (max 5MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageData: reader.result, imagePreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.price || !formData.commissionValue || !formData.category) {
      showError('Bitte fülle alle Pflichtfelder aus');
      return;
    }
    
    const priceMatch = formData.price.match(/[\d.,]+/);
    const priceValue = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : 0;
    
    setLoading(true);
    try {
      const newProduct = await api.products.create({ ...formData, priceValue });
      setProducts([newProduct, ...products]);
      setFormData({ 
        name: '', description: '', price: '', priceValue: 0, type: 'product', 
        commissionType: 'percentage', commissionValue: '', category: '', 
        imageData: null, imagePreview: null, productUrl: '' 
      });
      setShowForm(false);
      showSuccess('Produkt erfolgreich erstellt!');
    } catch (err) {
      showError(err.message || 'Fehler beim Erstellen');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Produkt wirklich löschen?')) return;
    
    try {
      await api.products.delete(id);
      setProducts(products.filter(p => p.id !== id));
      showSuccess('Produkt gelöscht');
    } catch (err) {
      showError('Fehler beim Löschen');
    }
  };

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
      showSuccess('Kategorie hinzugefügt');
    }
  };

  const deleteCategory = (cat) => {
    if (window.confirm(`Kategorie "${cat}" wirklich löschen?`)) {
      setCategories(categories.filter(c => c !== cat));
      showSuccess('Kategorie gelöscht');
    }
  };

  const generateAffiliateLink = async (productId) => {
    if (!isUserLoggedIn) {
      showError('Bitte melde dich an!');
      setShowUserAuth(true);
      return;
    }
    
    setLoading(true);
    try {
      await api.affiliate.generateLink(productId);
      showSuccess('Link generiert!');
      await loadMyLinks();
    } catch (err) {
      showError(err.message || 'Fehler beim Generieren');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showSuccess('Link kopiert!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRequestPayout = async () => {
    const amount = parseFloat(payoutForm.amount);
    
    if (!amount || amount < 10) {
      showError('Mindestbetrag: 10€');
      return;
    }
    
    if (amount > balance?.available) {
      showError('Nicht genug Guthaben');
      return;
    }
    
    if (!payoutForm.paymentDetails) {
      showError('Zahlungsdetails fehlen');
      return;
    }

    setLoading(true);
    try {
      await fetch('http://localhost:5000/api/payouts/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payoutForm)
      });

      showSuccess('Auszahlung beantragt!');
      setShowPayoutModal(false);
      setPayoutForm({ amount: '', paymentMethod: 'paypal', paymentDetails: '' });
      await Promise.all([loadBalance(), loadPayouts()]);
    } catch (err) {
      showError('Fehler bei Auszahlung');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePayoutStatus = async (payoutId, status) => {
    try {
      await fetch(`http://localhost:5000/api/admin/payouts/${payoutId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      showSuccess('Status aktualisiert');
      await loadAdminData();
    } catch (err) {
      showError('Fehler beim Aktualisieren');
    }
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: <span className="flex items-center gap-1 text-yellow-400"><Clock size={14} /> Ausstehend</span>,
      approved: <span className="flex items-center gap-1 text-blue-400"><CheckCircle size={14} /> Genehmigt</span>,
      paid: <span className="flex items-center gap-1 text-green-400"><CheckCircle size={14} /> Bezahlt</span>,
      rejected: <span className="flex items-center gap-1 text-red-400"><XCircle size={14} /> Abgelehnt</span>
    };
    return badges[status] || status;
  };

  // NEU: Legal Click Handler
  const handleLegalClick = (page) => {
    setLegalPage(page);
    setShowLegalModal(true);
  };

  const filteredProducts = products
    .filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
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
              <button onClick={() => setActiveView('shop')} className={`px-3 py-2 rounded-lg text-sm ${activeView === 'shop' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                <ShoppingBag size={16} className="inline mr-1" />Shop
              </button>
              {isUserLoggedIn && (
                <button onClick={() => setActiveView('dashboard')} className={`px-3 py-2 rounded-lg text-sm ${activeView === 'dashboard' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                  <BarChart3 size={16} className="inline mr-1" />Dashboard
                </button>
              )}
              <button onClick={() => setActiveView('leaderboard')} className={`px-3 py-2 rounded-lg text-sm ${activeView === 'leaderboard' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                <Trophy size={16} className="inline mr-1" />Leaderboard
              </button>
              {isAdmin && (
                <button onClick={() => setActiveView('admin')} className={`px-3 py-2 rounded-lg text-sm ${activeView === 'admin' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                  <Users size={16} className="inline mr-1" />Admin
                </button>
              )}
              
              {isUserLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg">
                    <User size={16} className="text-purple-400" />
                    <span className="text-sm text-white hidden sm:inline">{currentUser?.name}</span>
                    {isAdmin && <Lock size={14} className="text-yellow-400" title="Admin" />}
                  </div>
                  <button onClick={handleLogout} className="bg-gray-700 text-gray-200 p-2 rounded-lg hover:bg-gray-600">
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <button onClick={() => { setShowUserAuth(true); setAuthMode('login'); }} className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 text-sm">
                  <LogIn size={16} className="inline mr-1" />Login
                </button>
              )}
              
              {!isAdmin && (
                <button 
                  onClick={() => setShowAdminLogin(true)} 
                  className="bg-yellow-600 text-white p-2 rounded-lg hover:bg-yellow-700 border border-yellow-400"
                  title="Admin Login"
                >
                  <Lock size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border-2 border-yellow-500">
            <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
              <Lock className="text-yellow-400" />
              Admin Login
            </h2>
            <p className="text-gray-400 text-sm mb-4">Passwort: <code className="bg-gray-700 px-2 py-1 rounded text-yellow-400">admin123</code></p>
            <input 
              type="password" 
              value={adminPassword} 
              onChange={(e) => setAdminPassword(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()} 
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white mb-4" 
              placeholder="Admin-Passwort eingeben"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={handleAdminLogin} className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 font-semibold">
                Anmelden
              </button>
              <button onClick={() => { setShowAdminLogin(false); setAdminPassword(''); }} className="flex-1 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg">
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {showUserAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-purple-500">
            <div className="flex gap-2 mb-6">
              <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 rounded-lg ${authMode === 'login' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Login</button>
              <button onClick={() => setAuthMode('register')} className={`flex-1 py-2 rounded-lg ${authMode === 'register' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Register</button>
            </div>

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
                <input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="Password" />
                <input type="password" value={userForm.confirmPassword} onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })} onKeyPress={(e) => e.key === 'Enter' && handleUserRegister()} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" placeholder="Confirm" />
                <div className="flex gap-3">
                  <button onClick={handleUserRegister} disabled={loading} className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">{loading ? 'Loading...' : 'Register'}</button>
                  <button onClick={() => setShowUserAuth(false)} className="flex-1 bg-gray-700 text-gray-300 px-4 py-2 rounded-lg">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-purple-500">
            <h2 className="text-2xl font-bold mb-4 text-white">Auszahlung</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Betrag (Verfügbar: {balance?.available || 0}€)</label>
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
        
        {activeView === 'admin' && isAdmin && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Users size={36} className="text-purple-400" />Admin Dashboard
            </h2>

            {adminStats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6 border border-purple-500">
                  <Users className="text-purple-300 mb-2" size={32} />
                  <p className="text-3xl font-bold text-white">{adminStats.total_users}</p>
                  <p className="text-sm text-purple-300">Users</p>
                </div>
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 border border-blue-500">
                  <Package className="text-blue-300 mb-2" size={32} />
                  <p className="text-3xl font-bold text-white">{adminStats.total_products}</p>
                  <p className="text-sm text-blue-300">Products</p>
                </div>
                <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-6 border border-green-500">
                  <TrendingUp className="text-green-300 mb-2" size={32} />
                  <p className="text-3xl font-bold text-white">{adminStats.total_conversions}</p>
                  <p className="text-sm text-green-300">Sales</p>
                </div>
                <div className="bg-gradient-to-br from-pink-900 to-pink-800 rounded-lg p-6 border border-pink-500">
                  <DollarSign className="text-pink-300 mb-2" size={32} />
                  <p className="text-3xl font-bold text-white">{parseFloat(adminStats.total_revenue || 0).toFixed(2)}€</p>
                  <p className="text-sm text-pink-300">Revenue</p>
                </div>
              </div>
            )}

            <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Users ({adminUsers.length})</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {adminUsers.slice(0, 20).map(user => (
                  <div key={user.id} className="flex justify-between items-center p-3 bg-gray-900 rounded">
                    <div>
                      <p className="text-white font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-400 font-bold">{parseFloat(user.total_earnings || 0).toFixed(2)}€</p>
                      <p className="text-xs text-gray-400">{user.total_conversions || 0} sales</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Payout Requests</h3>
              <div className="space-y-3">
                {adminPayouts.map(payout => (
                  <div key={payout.id} className="bg-gray-900 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="text-white font-semibold">{payout.name}</p>
                      <p className="text-sm text-gray-400">{payout.payment_method} - {payout.payment_details}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-400">{parseFloat(payout.amount).toFixed(2)}€</p>
                      <p className="text-sm">{getStatusBadge(payout.status)}</p>
                    </div>
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

            {/* NEU: Legal Editor im Admin Panel */}
            <div className="bg-gray-800 rounded-lg border border-purple-500 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="text-purple-400" />
                Rechtliche Angaben
              </h3>
              <AdminLegalEditor />
            </div>
          </div>
        )}
        {activeView === 'leaderboard' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Trophy size={36} className="text-yellow-400" />Top Performers
            </h2>

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
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>✅ {marketer.conversions} Sales</span>
                        <span>🖱 {marketer.clicks} Clicks</span>
                      </div>
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
                      <div>
                        <p className="text-white font-semibold">{product.name}</p>
                        <p className="text-sm text-gray-400">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-400 font-bold">{parseFloat(product.revenue || 0).toFixed(2)}€</p>
                      <p className="text-xs text-gray-400">{product.conversions} sales</p>
                    </div>
                  </div>
                ))}
                {topProducts.length === 0 && <p className="text-gray-400 text-center py-8">No data yet</p>}
              </div>
            </div>
          </div>
        )}

        {activeView === 'dashboard' && (
  isUserLoggedIn ? (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6 border border-purple-500">
          <DollarSign className="text-purple-300 mb-2" size={32} />
          <p className="text-3xl font-bold text-white">{parseFloat(analytics?.total_revenue || 0).toFixed(2)}€</p>
          <p className="text-sm text-purple-300">Total Earnings</p>
        </div>
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 border border-blue-500">
          <MousePointerClick className="text-blue-300 mb-2" size={32} />
          <p className="text-3xl font-bold text-white">{analytics?.total_clicks || 0}</p>
          <p className="text-sm text-blue-300">Clicks</p>
        </div>
        <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-6 border border-green-500">
          <TrendingUp className="text-green-300 mb-2" size={32} />
          <p className="text-3xl font-bold text-white">{analytics?.total_conversions || 0}</p>
          <p className="text-sm text-green-300">Conversions</p>
        </div>
        <div className="bg-gradient-to-br from-pink-900 to-pink-800 rounded-lg p-6 border border-pink-500">
          <Link2 className="text-pink-300 mb-2" size={32} />
          <p className="text-3xl font-bold text-white">{analytics?.total_links || 0}</p>
          <p className="text-sm text-pink-300">Active Links</p>
          {analytics?.total_clicks > 0 && (
            <p className="text-xs text-pink-200 mt-2">
              CVR: {((analytics.total_conversions / analytics.total_clicks) * 100).toFixed(1)}%
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyStatsChart />
        <ProductStatsChart />
      </div>

      <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6 border border-purple-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">💰 Available Balance</h3>
            <p className="text-4xl font-bold text-white mt-2">{parseFloat(balance?.available || 0).toFixed(2)}€</p>
            <p className="text-sm text-purple-300 mt-1">Total Earned: {parseFloat(balance?.total_earned || 0).toFixed(2)}€ | Paid: {parseFloat(balance?.total_paid || 0).toFixed(2)}€</p>
          </div>
          <button 
            onClick={() => setShowPayoutModal(true)}
            disabled={!balance?.available || balance.available < 10}
            className="bg-white text-purple-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCard size={20} className="inline mr-2" />
            Request Payout
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
        {myLinks.length === 0 ? (
          <p className="text-gray-400">No links yet. Go to Shop!</p>
        ) : (
          <div className="space-y-3">
            {myLinks.map(link => {
              const fullLink = `${window.location.origin}/aff/${link.link_code}`;
              return (
                <div key={link.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between mb-2">
                    <p className="text-white font-semibold">{link.product_name}</p>
                    <button onClick={() => copyToClipboard(fullLink, link.id)} className="text-purple-400">
                      {copiedId === link.id ? <Check size={16} /> : <Copy size={16} />}
                    </button>
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
      <button onClick={() => { setShowUserAuth(true); setAuthMode('login'); }} className="bg-purple-600 text-white px-6 py-3 rounded-lg">
        <LogIn size={18} className="inline mr-2" />Login Now
      </button>
    </div>
  )
)}

        {activeView === 'shop' && (
          <>
            <div className="mb-6">
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder="Search products..." 
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white" 
                />
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Filter size={16} />Category
                  </label>
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)} 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                  </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <SlidersHorizontal size={16} />Sort
                  </label>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)} 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
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
                    <button 
                      onClick={() => setShowCategoryManager(!showCategoryManager)} 
                      className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600 border border-purple-500 flex items-center gap-2"
                    >
                      <SlidersHorizontal size={18} />Manage
                    </button>
                  </div>
                )}
              </div>

              {showCategoryManager && isAdmin && (
                <div className="bg-gray-800 rounded-lg border border-purple-500 p-4 mb-4">
                  <h3 className="text-white font-semibold mb-3">Manage Categories</h3>
                  <div className="flex gap-2 mb-3">
                    <input 
                      type="text" 
                      value={newCategory} 
                      onChange={(e) => setNewCategory(e.target.value)} 
                      placeholder="New category..." 
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" 
                      onKeyPress={(e) => e.key === 'Enter' && addCategory()} 
                    />
                    <button onClick={addCategory} className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                      <Plus size={18} />Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <div key={cat} className="bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm text-white">
                        {cat}
                        <button onClick={() => deleteCategory(cat)} className="text-red-400 hover:text-red-300">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isAdmin && (
              <>
                <button 
                  onClick={() => setShowForm(!showForm)} 
                  className="mb-6 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg shadow-lg"
                >
                  <ShoppingBag size={20} />Add Product
                </button>

                {showForm && (
                  <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-purple-500">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Create Product</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                        <select 
                          value={formData.type} 
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                        >
                          <option value="product">Product</option>
                          <option value="service">Service</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
                        <input 
                          type="text" 
                          value={formData.name} 
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" 
                          placeholder="Product name" 
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
                        <textarea 
                          value={formData.description} 
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" 
                          rows="3" 
                          placeholder="Product description" 
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Price *</label>
                        <input 
                          type="text" 
                          value={formData.price} 
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" 
                          placeholder="e.g. 29.99€" 
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Commission Type</label>
                        <select 
                          value={formData.commissionType} 
                          onChange={(e) => setFormData({ ...formData, commissionType: e.target.value })} 
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed (€)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Commission Value * {formData.commissionType === 'percentage' ? '(%)' : '(€)'}
                        </label>
                        <input 
                          type="number" 
                          step="0.01" 
                          value={formData.commissionValue} 
                          onChange={(e) => setFormData({ ...formData, commissionValue: e.target.value })} 
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" 
                          placeholder={formData.commissionType === 'percentage' ? 'e.g. 15' : 'e.g. 5.00'} 
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Category *</label>
                        <select 
                          value={formData.category} 
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                        >
                          <option value="">Select...</option>
                          {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Product URL</label>
                        <input 
                          type="url" 
                          value={formData.productUrl} 
                          onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })} 
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white" 
                          placeholder="https://example.com/product" 
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Image</label>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 cursor-pointer">
                            <Upload size={18} />
                            <span className="text-sm font-medium">Choose</span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          </label>
                          {formData.imagePreview && (
                            <div className="flex items-center gap-2">
                              <img src={formData.imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg border-2 border-purple-500" />
                              <button onClick={() => setFormData({ ...formData, imageData: null, imagePreview: null })} className="text-red-400 hover:text-red-300 text-sm">
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button onClick={handleSubmit} className="bg-purple-600 text-white px-6 py-2 rounded-lg">Save</button>
                      <button onClick={() => setShowForm(false)} className="bg-gray-700 text-gray-300 px-6 py-2 rounded-lg">Cancel</button>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="mb-4 text-gray-400 text-sm">
              {sortedProducts.length} product{sortedProducts.length !== 1 && 's'} found
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => {
                const hasLink = myLinks.find(l => l.product_id === product.id);
                const fullLink = hasLink ? `${window.location.origin}/aff/${hasLink.link_code}` : null;
                
                return (
                  <div key={product.id} className="bg-gray-800 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all border border-gray-700 hover:border-purple-500 overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-purple-900 to-gray-900 flex items-center justify-center relative">
                      {product.image_data ? (
                        <img src={product.image_data} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag size={64} className="text-purple-400" />
                      )}
                      <span className="absolute top-3 left-3 px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-semibold">
                        {product.type === 'product' ? 'Product' : 'Service'}
                      </span>
                      {isAdmin && (
                        <button 
                          onClick={() => deleteProduct(product.id)} 
                          className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">{product.category}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                      <p className="text-gray-400 text-sm mb-3 h-10 line-clamp-2">{product.description}</p>
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                        {product.price}
                      </div>

                      <div className="bg-gradient-to-r from-purple-900 to-pink-900 border border-purple-500 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 text-purple-300">
                          <TrendingUp size={16} />
                          <span className="text-sm font-semibold">Commission:</span>
                        </div>
                        <p className="text-lg font-bold text-purple-200 mt-1">
                          {product.commission_type === 'percentage' 
                            ? `${product.commission_value}%` 
                            : `${product.commission_value}€ per sale`}
                        </p>
                      </div>

                      {!fullLink ? (
                        <button 
                          onClick={() => generateAffiliateLink(product.id)} 
                          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 text-sm font-medium shadow-lg"
                        >
                          <Link2 size={16} />
                          Generate Link
                        </button>
                      ) : (
                        <div className="bg-gray-900 rounded-lg p-3 border border-purple-500">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-purple-300">Your Link</span>
                            <button onClick={() => copyToClipboard(fullLink, product.id)} className="text-purple-400 flex items-center gap-1">
                              {copiedId === product.id ? (
                                <><Check size={14} /><span className="text-xs">Copied!</span></>
                              ) : (
                                <><Copy size={14} /><span className="text-xs">Copy</span></>
                              )}
                            </button>
                          </div>
                          <code className="text-xs text-gray-400 break-all block bg-gray-800 p-2 rounded">{fullLink}</code>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* NEU: Footer hinzugefügt */}
      <Footer onLegalClick={handleLegalClick} />

      {/* NEU: Cookie Banner */}
      <CookieBanner />

      {/* NEU: Legal Modal */}
      {showLegalModal && (
        <LegalModal 
          page={legalPage} 
          onClose={() => setShowLegalModal(false)} 
        />
      )}
    </div>
  );
}