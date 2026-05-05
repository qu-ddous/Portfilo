import { useState, useEffect } from 'react';
import {
  Plus, Search, Import, Utensils,
  Zap, Beef, Grape, Droplet,
  Loader2, X, Upload, Activity,
  Clock, Flame, Layers, Sparkles,
  Trash2, Edit3
} from 'lucide-react';
import api from '../utils/api';
import GlassCard from '../components/GlassCard';
import EmptyState from '../components/EmptyState';
import { uploadImage } from '../utils/supabaseClient';

const mealGradients = [
  'from-rose-500 via-pink-500 to-orange-500',
  'from-emerald-500 via-teal-500 to-cyan-500',
  'from-blue-600 via-indigo-500 to-purple-500',
  'from-amber-400 via-orange-500 to-red-500',
  'from-fuchsia-500 via-purple-600 to-indigo-700',
  'from-cyan-400 via-blue-500 to-indigo-600',
  'from-lime-400 via-emerald-500 to-teal-600',
  'from-violet-500 via-purple-500 to-fuchsia-500',
  'from-sky-400 via-blue-500 to-indigo-500',
  'from-orange-500 via-red-500 to-rose-600',
];

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [search, setSearch] = useState('');
  const [usdaResults, setUsdaResults] = useState([]);
  const [importingId, setImportingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    meal_type: 'breakfast',
    image_url: '',
    servings: 1,
    servings: 1,
    nutrition: { 
      calories: 0, 
      protein_grams: 0, 
      carbs_grams: 0, 
      fats_grams: 0,
      fiber_grams: 0,
      serving_size_grams: 100
    }
  });

  const [onlineSearch, setOnlineSearch] = useState('');
  const [onlineResults, setOnlineResults] = useState([]);
  const [searchingOnline, setSearchingOnline] = useState(false);
  const [imageTab, setImageTab] = useState('online');

  // Live suggestions logic
  useEffect(() => {
    if (!showModal) return;
    const timer = setTimeout(() => {
      if (formData.name && formData.name.length > 2) {
        setOnlineSearch(formData.name);
        handleOnlineSearch(formData.name);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData.name, showModal]);

  useEffect(() => { fetchMeals(); }, []);

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/meals');
      setMeals(response.data.meals || []);
    } catch (err) {
      console.error('Fetch meals error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUsdaSearch = async () => {
    if (!search) return;
    try {
      const response = await api.get(`/admin/meals/nutrition/search?q=${search}`);
      setUsdaResults(response.data.results || []);
    } catch (err) { console.error('USDA search error'); }
  };

  const handleImport = async (food) => {
    setImportingId(food.id);
    try {
      // Instead of direct saving, we open the modal with this food's data
      // This allows the admin to pick a custom high-quality image before finalizing
      const randomSeed = Math.floor(Math.random() * 1000000);
      const initialImage = `https://loremflickr.com/800/600/food,dish,${encodeURIComponent(food.name.split(' ')[0])}?lock=${randomSeed}`;
      
      setFormData({
        name: food.name,
        description: `Imported from nutritional database. ${food.name}`,
        meal_type: 'snack',
        image_url: initialImage,
        servings: 1,
        nutrition: {
          calories: food.nutrition.calories || 0,
          protein_grams: food.nutrition.protein || 0,
          carbs_grams: food.nutrition.carbs || 0,
          fats_grams: food.nutrition.fats || 0,
          fiber_grams: 0,
          serving_size_grams: 100
        }
      });
      
      setEditingMeal(null); // It's a new entry
      setShowModal(true);
      setImageTab('online'); // Default to online search for a better image
      setOnlineSearch(food.name);
      handleOnlineSearch(food.name); // Auto-trigger search for this food
      
    } catch (err) { 
      console.error('Import prep failed'); 
    } finally { 
      setImportingId(null); 
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, 'meal-images');
      setFormData({ ...formData, image_url: url });
    } catch (err) { alert('Upload failed'); } finally { setUploading(false); }
  };

  const handleOnlineSearch = async (queryOverride) => {
    const rawQuery = queryOverride || onlineSearch;
    if (!rawQuery) return;
    
    setOnlineResults([]);
    setSearchingOnline(true);
    
    const unsplashKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    const searchSuffix = rawQuery.toLowerCase().includes('pushup') || rawQuery.toLowerCase().includes('gym') ? 'fitness' : 'food dish';
    const query = `${rawQuery} ${searchSuffix}`;
    
    try {
      // 1. Try Unsplash (Gold Standard)
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${unsplashKey}&per_page=16`);
      const data = await response.json();
      
      if (data.results?.length > 0) {
        setOnlineResults(data.results.map(img => ({
          id: img.id,
          src: img.urls.regular,
          thumbnail: img.urls.small
        })));
      } else {
        // 2. Fallback to Lexica
        const lexicaRes = await fetch(`https://lexica.art/api/v1/search?q=${encodeURIComponent(query)}`);
        const lexicaData = await lexicaRes.json();
        if (lexicaData.images?.length > 0) {
          setOnlineResults(lexicaData.images.slice(0, 16).map(img => ({
            id: img.id,
            src: img.src,
            thumbnail: img.src
          })));
        } else {
          // 3. Last Fallback: LoremFlickr
          setOnlineResults([1,2,3,4,5,6,7,8].map(idx => ({
            id: `fallback-${idx}`,
            src: `https://loremflickr.com/800/600/${encodeURIComponent(rawQuery.split(' ')[0])}?lock=${idx}`,
            thumbnail: `https://loremflickr.com/300/300/${encodeURIComponent(rawQuery.split(' ')[0])}?lock=${idx}`
          })));
        }
      }
    } catch (err) {
      console.error('Online search failed', err);
      // Ensure UI doesn't break
      setOnlineResults([1,2,3,4].map(idx => ({
        id: `err-${idx}`,
        src: `https://loremflickr.com/800/600/food?lock=${idx}`,
        thumbnail: `https://loremflickr.com/300/300/food?lock=${idx}`
      })));
    } finally {
      setSearchingOnline(false);
    }
  };

  const handleEdit = (meal) => {
    const nutrients = meal.meal_nutrition?.[0] || {};
    setEditingMeal(meal);
    setFormData({
      name: meal.name,
      description: meal.description || '',
      meal_type: meal.meal_type || 'breakfast',
      image_url: meal.image_url || '',
      servings: nutrients.servings || 1,
      nutrition: {
        calories: nutrients.calories || 0,
        protein_grams: nutrients.protein_grams || 0,
        carbs_grams: nutrients.carbs_grams || 0,
        fats_grams: nutrients.fats_grams || 0,
        fiber_grams: nutrients.fiber_grams || 0,
        serving_size_grams: nutrients.serving_size_grams || 100
      }
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this meal?')) return;
    try {
      await api.delete(`/admin/meals/${id}`);
      fetchMeals();
    } catch (err) { alert('Delete failed'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        nutrition: {
          ...formData.nutrition,
          servings: formData.servings || 1
        }
      };
      
      if (editingMeal) {
        await api.put(`/admin/meals/${editingMeal.id}`, payload);
      } else {
        await api.post('/admin/meals/create', payload);
      }
      setShowModal(false);
      setEditingMeal(null);
      fetchMeals();
    } catch (err) { alert('Error saving meal'); }
  };

  return (
    <div className="space-y-6 animate-in pb-20">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-6 rounded-[30px] shadow-xl shadow-orange-500/20 border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_infinite] skew-x-[-25deg]"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-white flex items-center gap-3 drop-shadow-lg">
             <Utensils className="text-orange-100 animate-sway animate-hue" size={30} /> Nutrition Master
          </h2>
          <p className="text-orange-50/60 font-bold mt-1 text-[10px] uppercase tracking-widest">Global nutrient analytics engine</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="relative z-10 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 flex items-center gap-2 py-4 px-8 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 text-[10px] uppercase tracking-widest shadow-lg"
        >
          <Plus size={18} /> Create Meal
        </button>
      </div>

      {/* ── USDA Global Search (Full Width Top) ── */}
      <GlassCard className="p-8 rounded-[35px] border-white shadow-xl shadow-slate-100 overflow-hidden relative group">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
               <h3 className="font-black text-xl text-slate-800 flex items-center gap-3">
                 <Sparkles size={24} className="text-orange-500 animate-glow animate-hue" /> USDA Engine
               </h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Nutrient Retrieval Matrix</p>
            </div>
            
            <div className="flex-1 w-full flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group/s">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors animate-float animate-hue" size={20} />
                <input 
                  type="text" 
                  placeholder="Query global food database (e.g. Grilled Chicken)..." 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[25px] pl-16 pr-8 py-5 text-sm font-black text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:ring-8 focus:ring-orange-500/10 outline-none transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUsdaSearch()}
                />
              </div>
              <button 
                onClick={handleUsdaSearch}
                className="md:w-64 h-[68px] bg-slate-900 hover:bg-black text-white rounded-[25px] active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20"
              >
                <Search size={18} /> Execute Retrieval
              </button>
            </div>
          </div>

          {usdaResults.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar">
              {usdaResults.map((food, idx) => (
                <div key={food.id} style={{animationDelay: `${idx * 50}ms`}} className="p-5 bg-white rounded-[25px] border border-slate-100 flex justify-between items-center group hover:border-orange-200 transition-all shadow-sm animate-in">
                  <div className="max-w-[150px]">
                    <p className="text-[11px] font-black text-slate-800 truncate leading-tight mb-1 uppercase italic tracking-tighter">{food.name}</p>
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">{food.nutrition.calories} kcal</span>
                  </div>
                  <button onClick={() => handleImport(food)} disabled={importingId === food.id} className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center border border-orange-100">
                    {importingId === food.id ? <Loader2 className="animate-spin" size={16} /> : <Import size={18} />}
                  </button>
                </div>
              ))}
            </div>
          )}
      </GlassCard>

      {/* ── HIGH SHINE Meal Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? [1,2,3,4,5,6].map(i => <div key={i} className="h-[420px] shimmer rounded-[35px]" />) : meals.map((meal, idx) => {
          const grad = mealGradients[idx % mealGradients.length];
          const nutrients = meal.meal_nutrition?.[0] || {};
          
          return (
            <div 
              key={meal.id} 
              style={{animationDelay: `${idx * 100}ms`}}
              className={`group relative rounded-[35px] overflow-hidden shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:scale-[1.02] animate-in h-[420px] border border-white/20 bg-slate-900`}
            >
               <div className="absolute inset-0 z-0">
                  {meal.image_url ? (
                    <img src={meal.image_url} alt={meal.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-1000 group-hover:scale-110" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${grad}`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/10 to-transparent opacity-95" />
               </div>

               <div className="relative z-10 h-full flex flex-col p-8 text-white">
                  <div className="flex justify-between items-start mb-4">
                     <div className="flex gap-2">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-[20px] flex items-center justify-center border border-white/20 shadow-2xl">
                           <Utensils size={24} className="text-white/60" />
                        </div>
                        {(nutrients.servings > 1 || nutrients.servings < 1) && (
                           <div className="bg-orange-500/80 backdrop-blur-xl px-3 py-2 rounded-[15px] border border-orange-400/30 flex items-center gap-1.5 shadow-lg">
                              <Layers size={12} className="text-white" />
                              <span className="text-[10px] font-black text-white italic">x{nutrients.servings} Qty</span>
                           </div>
                        )}
                     </div>
                     <div className="bg-white/20 backdrop-blur-xl px-5 py-2 rounded-full border border-white/30 shadow-2xl">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{meal.meal_type || 'Snack'}</span>
                     </div>
                  </div>

                  <div className="flex-1 mt-4">
                     <h4 className="text-3xl font-black mb-3 leading-[1.1] tracking-tighter italic uppercase drop-shadow-2xl">{meal.name}</h4>
                     <div className="inline-block px-4 py-2 bg-orange-500/80 backdrop-blur-md rounded-2xl border border-orange-400/30 mb-6 shadow-xl">
                        <p className="text-white font-black uppercase tracking-widest text-[10px] leading-none">{(nutrients.calories * (nutrients.servings || 1)).toFixed(0)} TOTAL CALORIES</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                     {[
                       { icon: Beef, label: 'Prot', val: (nutrients.protein_grams * (nutrients.servings || 1)).toFixed(1), color: 'text-rose-400' },
                       { icon: Grape, label: 'Carb', val: (nutrients.carbs_grams * (nutrients.servings || 1)).toFixed(1), color: 'text-sky-400' },
                       { icon: Droplet, label: 'Fat', val: (nutrients.fats_grams * (nutrients.servings || 1)).toFixed(1), color: 'text-amber-400' },
                     ].map((item, i) => (
                       <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[25px] p-4 flex flex-col items-center group-hover:bg-white/20 transition-colors shadow-inner">
                          <item.icon size={16} className={`mb-2 ${item.color} animate-pulse`} />
                          <span className="text-lg font-black">{item.val}g</span>
                          <span className="text-[8px] font-black uppercase text-white/40 tracking-widest mt-1">{item.label}</span>
                       </div>
                     ))}
                  </div>

                  <div className="flex gap-3 mt-auto">
                     <button onClick={(e) => { e.stopPropagation(); handleDelete(meal.id); }} className="w-14 h-14 bg-rose-500/20 hover:bg-rose-600 text-white rounded-[22px] flex items-center justify-center border border-white/20 transition-all active:scale-95 shadow-xl">
                        <Trash2 size={20} />
                     </button>
                     <button onClick={() => handleEdit(meal)} className="flex-1 h-14 bg-white hover:bg-orange-500 hover:text-white text-slate-900 rounded-[22px] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl hover:scale-[1.02] active:scale-[0.98]">
                       Modify Meal
                     </button>
                  </div>
               </div>
            </div>
          );
        })}
      </div>

      {/* ── QUANTUM REDESIGN: Creation/Edit Modal ── */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-[20px] animate-in fade-in duration-500"
          onClick={() => { setShowModal(false); setEditingMeal(null); }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="w-full max-w-6xl h-[85vh] bg-slate-900 border border-white/10 rounded-[50px] shadow-[0_0_100px_rgba(249,115,22,0.15)] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-500"
          >
            {/* Header / Top Control Bar */}
            <div className="p-8 flex justify-between items-center border-b border-white/5 bg-slate-900/50 backdrop-blur-md relative z-10">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-600/40 animate-pulse">
                     <Utensils size={32} className="text-white" />
                  </div>
                  <div>
                     <h3 className="text-4xl font-black text-white tracking-tighter italic uppercase">{editingMeal ? 'Recalibrate' : 'Synthesize'} Meal</h3>
                     <p className="text-orange-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Advanced Nutritional Core v3.0</p>
                  </div>
               </div>
               <button 
                 onClick={() => { setShowModal(false); setEditingMeal(null); }} 
                 className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-500 text-white/40 flex items-center justify-center transition-all hover:rotate-90 border border-white/5"
               >
                 <X size={24} />
               </button>
            </div>

            {/* Main Operational Body */}
            <div className="flex-1 flex overflow-hidden">
               {/* Left Panel: Visuals & Discovery */}
               <div className="w-1/2 p-10 overflow-y-auto custom-scrollbar border-r border-white/5 space-y-10">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">Meal Core Designation</label>
                     <input 
                        type="text" 
                        required 
                        className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white font-black text-xl outline-none focus:border-orange-500 focus:bg-white/10 transition-all placeholder:text-white/10" 
                        placeholder="e.g. OLYMPIA STEAK PLATTER" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                     />
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">Neural Description / Recipe Notes</label>
                     <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white font-bold text-sm outline-none focus:border-orange-500 focus:bg-white/10 transition-all min-h-[120px] resize-none" 
                        placeholder="Describe the essence of this meal..." 
                        value={formData.description} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})} 
                     />
                  </div>

                  <div className="space-y-6">
                     <div className="flex justify-between items-end">
                        <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest ml-2">Visual Core Integration</label>
                        <div className="flex gap-2">
                           {['online', 'upload'].map(t => (
                              <button key={t} type="button" onClick={() => setImageTab(t)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${imageTab === t ? 'bg-orange-500 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>
                                 {t}
                              </button>
                           ))}
                        </div>
                     </div>

                     {imageTab === 'upload' ? (
                        <div className="relative h-64 group">
                           <input type="file" accept="image/*" className="absolute inset-0 opacity-0 z-20 cursor-pointer" onChange={handleFileUpload} />
                           <div className="h-full bg-white/5 border-2 border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center gap-4 group-hover:border-orange-500 transition-all">
                              {uploading ? <Loader2 size={40} className="animate-spin text-orange-500" /> : formData.image_url ? 
                                 <img src={formData.image_url} className="w-full h-full object-cover rounded-[38px] opacity-60 group-hover:opacity-100 transition-opacity" alt="" /> :
                                 <><Upload size={48} className="text-white/10" /><span className="text-[10px] font-black text-slate-500 uppercase">Inject Media</span></>
                              }
                           </div>
                        </div>
                     ) : (
                        <div className="space-y-4">
                           <div className="relative group">
                              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors" />
                              <input 
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-8 py-5 text-white text-sm font-bold outline-none focus:border-orange-500" 
                                 placeholder="Scan neural library..." 
                                 value={onlineSearch} onChange={(e) => setOnlineSearch(e.target.value)}
                                 onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleOnlineSearch())}
                              />
                           </div>
                           <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-3 custom-scrollbar">
                              {searchingOnline ? [1,2,3].map(i => <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-2xl" />) : 
                                 onlineResults.map(img => (
                                    <button key={img.id} type="button" onClick={() => setFormData({...formData, image_url: img.src})} className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${formData.image_url === img.src ? 'border-orange-500 scale-95 shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'border-transparent opacity-40 hover:opacity-100'}`}>
                                       <img src={img.thumbnail} className="w-full h-full object-cover" alt="" />
                                    </button>
                                 ))
                              }
                           </div>
                        </div>
                     )}
                  </div>
               </div>

               {/* Right Panel: The Engine (Scrollable to see all Macros) */}
               <div className="w-1/2 p-10 bg-black/20 flex flex-col space-y-12 relative overflow-y-auto custom-scrollbar-dark">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-500/5 blur-[150px] pointer-events-none" />
                  
                  {/* Category Shell */}
                  <div className="grid grid-cols-2 gap-4">
                     {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
                        <button key={type} type="button" onClick={() => setFormData({...formData, meal_type: type})} className={`p-5 rounded-2xl border font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${formData.meal_type === type ? 'bg-orange-600 border-orange-500 text-white shadow-xl shadow-orange-600/20' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}>
                           {type}
                        </button>
                     ))}
                  </div>

                  {/* Quantum Multiplier Section */}
                  <div className="bg-slate-950/80 border border-orange-500/30 rounded-[40px] p-8 space-y-6 shadow-2xl relative group">
                     <div className="flex justify-between items-center">
                        <label className="text-[11px] font-black text-orange-500 uppercase tracking-[0.3em]">Neural Scale (Servings)</label>
                        <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-xl font-black italic">x{formData.servings || 1}</span>
                     </div>
                     <input 
                        type="range" min="0.5" max="5" step="0.5" 
                        className="w-full h-4 bg-white/5 rounded-full appearance-none cursor-pointer accent-orange-500 border border-white/5"
                        value={formData.servings || 1}
                        onChange={(e) => setFormData({...formData, servings: parseFloat(e.target.value)})}
                     />
                     <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest">
                        <span>Min Scale</span>
                        <span>Standard Core (1.0)</span>
                        <span>Max Synthesis</span>
                     </div>
                  </div>

                  {/* Live Macros Dashboard */}
                  <div className="grid grid-cols-2 gap-6 relative z-10">
                     {['calories', 'protein_grams', 'carbs_grams', 'fats_grams', 'fiber_grams', 'serving_size_grams'].map((nut) => {
                        const baseVal = formData.nutrition[nut] || 0;
                        const totalScaled = (baseVal * (formData.servings || 1)).toFixed(0);
                        const isPrimary = ['calories', 'protein_grams', 'carbs_grams', 'fats_grams'].includes(nut);
                        
                        return (
                           <div key={nut} className={`bg-white/5 border border-white/10 rounded-[35px] p-6 group hover:bg-white/10 transition-all hover:-translate-y-1 relative overflow-hidden ${!isPrimary ? 'opacity-70 scale-95' : ''}`}>
                              <div className="absolute top-0 right-0 w-10 h-10 bg-white/5 rounded-bl-2xl flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                                 {nut === 'calories' ? <Flame size={12} className="text-orange-500" /> : <Activity size={12} className="text-sky-400" />}
                              </div>
                              <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 block">{nut.replace('_grams', '').replace('calories', 'KCAL').replace('serving_size_', 'Base ')}</label>
                              <div className="flex items-baseline gap-2">
                                 <input 
                                    type="number" 
                                    className={`bg-transparent border-none font-black text-white outline-none focus:text-orange-500 transition-colors ${isPrimary ? 'text-2xl w-20' : 'text-xl w-16'}`}
                                    value={baseVal} 
                                    onChange={(e) => setFormData({...formData, nutrition: {...formData.nutrition, [nut]: parseFloat(e.target.value) || 0}})}
                                 />
                                 {formData.servings !== 1 && isPrimary && (
                                    <span className="text-orange-500 font-bold text-xs animate-in fade-in transition-all">
                                       → {totalScaled}
                                    </span>
                                 )}
                              </div>
                           </div>
                        );
                     })}
                  </div>

                  {/* Submission Core */}
                  <div className="mt-auto pt-6 flex gap-4">
                     <button 
                        type="submit" 
                        onClick={handleSubmit} 
                        className="flex-1 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white py-8 rounded-[30px] font-black text-xs uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(249,115,22,0.3)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4"
                     >
                        <Zap size={20} className="animate-pulse" /> Finalize Configuration
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meals;
