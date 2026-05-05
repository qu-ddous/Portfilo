import { useEffect, useState } from 'react';
import {
  Activity,
  Plus,
  Search,
  Dumbbell,
  Target,
  Box,
  Trash2,
  Edit3,
  X,
  Loader2,
  CheckCircle2,
  Sparkles,
  Info,
  Upload
} from 'lucide-react';
import api from '../utils/api';
import GlassCard from '../components/GlassCard';
import EmptyState from '../components/EmptyState';

const muscleGradients = {
  'Chest': 'from-blue-600 to-indigo-600',
  'Back': 'from-emerald-500 to-teal-700',
  'Legs': 'from-rose-600 to-pink-700',
  'Arms': 'from-purple-600 to-indigo-700',
  'Shoulders': 'from-amber-500 to-orange-600',
  'Core': 'from-slate-800 to-slate-950',
  'Full Body': 'from-cyan-500 to-blue-600',
  'Default': 'from-slate-600 to-slate-800'
};

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Online Image WebP Search States
  const [imageTab, setImageTab] = useState('upload');
  const [onlineSearch, setOnlineSearch] = useState('');
  const [onlineResults, setOnlineResults] = useState([]);
  const [searchingOnline, setSearchingOnline] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    muscle_group: 'Chest',
    equipment_needed: 'Dumbbell',
    status: 'active',
    image: null
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleOnlineSearch = async (queryOverride) => {
    const rawQuery = typeof queryOverride === 'string' ? queryOverride : (onlineSearch || formData.name);
    if (!rawQuery) return;
    
    setOnlineResults([]);
    setSearchingOnline(true);
    
    const unsplashKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    const query = `${rawQuery} workout bodyweight fitness`;
    
    try {
      // 1. Unsplash (Primary)
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${unsplashKey}&per_page=16`);
      const data = await response.json();
      
      if (data.results?.length > 0) {
        setOnlineResults(data.results.map(img => ({
          id: img.id,
          src: img.urls.regular,
          thumbnail: img.urls.small
        })));
      } else {
        // 2. Lexica Fallback
        const lexRes = await fetch(`https://lexica.art/api/v1/search?q=${encodeURIComponent(query)}`);
        const lexData = await lexRes.json();
        if (lexData.images?.length > 0) {
          setOnlineResults(lexData.images.slice(0, 16).map(img => ({
            id: img.id,
            src: img.src,
            thumbnail: img.src
          })));
        } else {
          // 3. Placeholder Fallback
          setOnlineResults([1,2,3,4].map(idx => ({
            id: `fallback-${idx}`,
            src: `https://loremflickr.com/800/600/fitness,gym,${encodeURIComponent(rawQuery.split(' ')[0])}?lock=${idx}`,
            thumbnail: `https://loremflickr.com/300/300/fitness,gym,${encodeURIComponent(rawQuery.split(' ')[0])}?lock=${idx}`
          })));
        }
      }
    } catch (err) {
      console.error('Search failed', err);
      setOnlineResults([1,2,3,4].map(idx => ({
        id: `err-${idx}`,
        src: `https://loremflickr.com/800/600/fitness?lock=${idx}`,
        thumbnail: `https://loremflickr.com/300/300/fitness?lock=${idx}`
      })));
    } finally {
      setSearchingOnline(false);
    }
  };

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/workouts/exercises');
      setExercises(response.data.exercises || []);
    } catch (err) {
      console.error('Error fetching exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExercises(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/admin/workouts/exercises', formData);
      setIsModalOpen(false);
      fetchExercises();
      setFormData({ name: '', description: '', muscle_group: 'Chest', equipment_needed: 'Dumbbell', status: 'active', image: null });
      setImageTab('upload');
      setOnlineSearch('');
      setOnlineResults([]);
    } catch (err) {
      alert(`Failed to save exercise: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = exercises.filter(ex => 
    ex.name?.toLowerCase().includes(search.toLowerCase()) ||
    ex.muscle_group?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-in pb-20 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6 rounded-[30px] shadow-xl shadow-indigo-500/20 border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_infinite] skew-x-[-25deg]"></div>
        
        <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-2xl font-black text-white flex items-center gap-3 justify-center md:justify-start drop-shadow-lg">
             <Dumbbell className="text-indigo-200 animate-sway animate-hue" size={30} /> Movement Library
          </h2>
          <p className="text-indigo-100/60 font-bold mt-1 text-[10px] uppercase tracking-widest">Global physiological movement registry</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="relative z-10 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 flex items-center gap-2 py-4 px-8 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 text-[10px] uppercase tracking-widest shadow-lg">
          <Plus size={18} /> Add Movement
        </button>
      </div>

      {/* ── Enhanced Search Command Center ── */}
      <div className="relative max-w-xl group">
         <div className="absolute inset-0 bg-indigo-500/5 blur-2xl rounded-full -z-10 group-focus-within:bg-indigo-500/10 transition-all"></div>
         <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors animate-float animate-hue" size={20} />
         <input 
           type="text" 
           placeholder="Search library by movement or muscle..." 
           className="w-full bg-white border-2 border-slate-100 rounded-[25px] pl-16 pr-8 py-5 text-sm font-black text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/10 shadow-2xl shadow-slate-200/50 outline-none transition-all focus:animate-pulse focus:animate-hue"
           value={search}
           onChange={(e) => setSearch(e.target.value)}
         />
      </div>

      {/* ── Exercise Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-64 shimmer rounded-[35px]" />)
        ) : filtered.length === 0 ? (
          <div className="col-span-full">
            <EmptyState message="Registry Empty" submessage="No movements detected." />
          </div>
        ) : filtered.map((ex, idx) => {
          const grad = muscleGradients[ex.muscle_group] || muscleGradients.Default;
          return (
            <div 
              key={ex.id} 
              style={{ animationDelay: `${idx * 100}ms` }}
              className={`group relative overflow-hidden rounded-[35px] shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:scale-[1.02] animate-in flex flex-col h-[350px] border border-white/20 bg-slate-900`}
            >
               {/* Full Background Image */}
               <div className="absolute inset-0 z-0">
                  {ex.image ? (
                    <img src={ex.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-90" alt={ex.name} />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${grad}`} />
                  )}
                  {/* Bottom-heavy Dark Overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent opacity-90" />
               </div>

               <div className="relative z-10 p-6 h-full flex flex-col items-center justify-center text-center">
                  <div className="absolute top-4 left-6 px-3 py-1 bg-white/20 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-white/30 backdrop-blur-md text-white shadow-lg">
                    {ex.muscle_group}
                  </div>
                  
                  <div className="mb-4">
                     <div className="w-16 h-16 bg-white/10 backdrop-blur-2xl rounded-[22px] flex items-center justify-center mx-auto border border-white/20 shadow-2xl group-hover:rotate-12 transition-transform">
                        <Dumbbell className="text-white/80" size={28} />
                     </div>
                  </div>

                  <h4 className="text-2xl font-black leading-tight mb-2 text-white drop-shadow-2xl uppercase italic tracking-tighter">{ex.name}</h4>
                  
                  <div className="px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 mb-4 inline-block">
                    <p className="text-white/70 text-[9px] font-black uppercase tracking-widest leading-none">
                       {ex.equipment_needed || 'Bodyweight'}
                    </p>
                  </div>

                  <p className="text-white/80 text-[11px] font-bold leading-relaxed line-clamp-2 mb-6 px-4 drop-shadow-lg">
                    {ex.description || 'Precision movement protocol.'}
                  </p>

                  <div className="flex gap-3 mt-auto w-full">
                     <button onClick={() => handleEdit(ex)} className="h-12 flex-1 bg-white hover:bg-indigo-500 hover:text-white text-slate-900 rounded-2xl flex items-center justify-center transition-all border border-white/10 shadow-xl font-black text-[10px] uppercase tracking-widest active:scale-95">
                        <Edit3 size={16} className="mr-2" /> Edit
                     </button>
                     <button onClick={() => handleDelete(ex.id)} className="w-12 h-12 bg-rose-500/30 hover:bg-rose-600 text-white rounded-2xl flex items-center justify-center transition-all border border-white/30 shadow-xl active:scale-90">
                        <Trash2 size={18} />
                     </button>
                  </div>
               </div>
            </div>
          );
        })}
      </div>

      {/* ── Add Exercise Modal ── */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-2xl animate-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl">
            <GlassCard className="w-full max-h-[90vh] p-0 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-white/20 rounded-[60px] flex flex-col" hover={false}>
            <div className={`p-10 bg-gradient-to-br ${muscleGradients[formData.muscle_group] || muscleGradients.Default} text-white relative flex-shrink-0 border-b border-white/10`}>
              <div className="relative z-10 flex justify-between items-start">
                <div className="flex items-center gap-5">
                   <div className="w-16 h-16 bg-white/20 rounded-[25px] flex items-center justify-center border border-white/20 shadow-2xl">
                      <Sparkles size={32} />
                   </div>
                   <div>
                     <h3 className="text-3xl font-black tracking-tight">Deploy Movement</h3>
                     <p className="text-white/70 font-black uppercase tracking-widest text-[9px] mt-1">Kinetic block initialization v4.0</p>
                   </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 hover:rotate-90"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSave} className="p-12 space-y-10 bg-white flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Movement Nomenclature</label>
                    <input type="text" required className="w-full bg-slate-50 border border-slate-100 rounded-[22px] px-7 py-5 text-base font-black text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all" placeholder="e.g. Incline Bench Press" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Primary Muscle</label>
                      <select className="w-full bg-slate-50 border border-slate-100 rounded-[22px] px-7 py-5 text-base font-black text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all appearance-none cursor-pointer" value={formData.muscle_group} onChange={(e) => setFormData({...formData, muscle_group: e.target.value})}>
                        {Object.keys(muscleGradients).map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Apparatus Required</label>
                      <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-[22px] px-7 py-5 text-base font-black text-slate-800 focus:bg-white focus:border-indigo-400 outline-none transition-all" placeholder="e.g. Barbell" value={formData.equipment_needed} onChange={(e) => setFormData({...formData, equipment_needed: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Kinetic Instructions</label>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-100 rounded-[30px] px-7 py-5 text-sm font-medium text-slate-600 focus:bg-white focus:border-indigo-400 outline-none transition-all resize-none" 
                      rows={3} 
                      placeholder="Briefly detail the execution pattern..." 
                      value={formData.description} 
                      onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Movement Blueprint (WebP)</label>
                    <div className="flex gap-4 mb-4">
                      <button type="button" onClick={() => setImageTab('upload')} className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all ${imageTab === 'upload' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>DEVICE UPLOAD</button>
                      <button type="button" onClick={() => setImageTab('online')} className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all ${imageTab === 'online' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>SEARCH ONLINE</button>
                    </div>

                    {imageTab === 'upload' ? (
                      <div className="relative h-48 group cursor-pointer">
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleImageChange} />
                        <div className={`h-full border-2 border-dashed border-slate-200 rounded-[30px] flex flex-col items-center justify-center gap-3 transition-all bg-white hover:border-indigo-400`}>
                          {formData.image ? (
                            <div className="relative w-full h-full p-2">
                              <img src={formData.image} className="w-full h-full object-cover rounded-[25px]" alt="" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[25px]"><Upload className="text-white" size={24} /></div>
                            </div>
                          ) : (
                            <>
                              <Upload className="text-slate-300" size={32} />
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drop Image or Click</span>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                         <div className="flex gap-2">
                            <input type="text" placeholder="Search e.g. 'Push up'..." className="flex-1 bg-slate-50 border border-slate-100 rounded-[20px] px-5 py-4 text-sm font-bold outline-none focus:border-purple-600 transition-all" value={onlineSearch} onChange={(e) => setOnlineSearch(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleOnlineSearch())} />
                            <button type="button" onClick={() => handleOnlineSearch()} className="bg-purple-600 text-white p-4 rounded-[20px] hover:bg-purple-700 transition-all">{searchingOnline ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}</button>
                         </div>
                         <div className="relative min-h-[200px]">
                            {searchingOnline && <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-[20px] animate-in fade-in"><Loader2 size={32} className="animate-spin text-purple-600 mb-2" /><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Refreshing Results...</p></div>}
                            <div className="grid grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                              {onlineResults.map((img) => (
                                <button key={img.id} type="button" onClick={() => setFormData({...formData, image: img.src})} className={`relative aspect-square rounded-[15px] overflow-hidden border-4 transition-all hover:scale-105 ${formData.image === img.src ? 'border-purple-500' : 'border-transparent'}`}><img src={img.thumbnail || img.src} className="w-full h-full object-cover" alt="" />{formData.image === img.src && <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center"><Sparkles size={16} className="text-white fill-current" /></div>}</button>
                              ))}
                            </div>
                         </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-6 pt-6 sticky bottom-0 bg-white">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-5 rounded-[25px] font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all border border-transparent">Abort</button>
                   <button type="submit" disabled={isSubmitting} className={`flex-[2] relative overflow-hidden bg-slate-900 text-white rounded-[25px] font-black py-5 text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/30 transition-all hover:scale-[1.02] active:scale-95`}>
                      {isSubmitting ? <div className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={18} /> Syncing...</div> : 'Deploy to Library'}
                      <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite] skew-x-[-25deg]"></div>
                   </button>
                </div>
            </form>
          </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercises;
