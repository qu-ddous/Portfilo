import { useEffect, useState } from 'react';
import {
  Plus,
  Dumbbell as WorkoutIcon,
  Clock,
  Edit3,
  Trash2,
  Users as UsersIcon,
  Flame,
  Loader2,
  X,
  TrendingUp,
  Search,
  Check,
  Zap,
  ChevronRight,
  Activity,
  Sparkles,
  Upload,
} from 'lucide-react';
import api from '../utils/api';
import GlassCard from '../components/GlassCard';
import EmptyState from '../components/EmptyState';

const difficultyConfig = {
  beginner: { 
    label: 'Beginner', 
    badge: 'bg-emerald-400', 
    cardBg: 'from-emerald-500 to-teal-600',
    shadow: 'shadow-emerald-200' 
  },
  intermediate: { 
    label: 'Intermediate', 
    badge: 'bg-blue-400', 
    cardBg: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-blue-200' 
  },
  advanced: { 
    label: 'Advanced', 
    badge: 'bg-rose-500', 
    cardBg: 'from-rose-500 to-red-600',
    shadow: 'shadow-red-200' 
  },
};

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [userSearch, setUserSearch] = useState('');

  // Online Image WebP Search States
  const [imageTab, setImageTab] = useState('upload');
  const [onlineSearch, setOnlineSearch] = useState('');
  const [onlineResults, setOnlineResults] = useState([]);
  const [searchingOnline, setSearchingOnline] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: 'intermediate',
    difficulty: 'intermediate',
    duration_minutes: 30,
    status: 'active',
    image: null,
    exercises: [] // { exercise_id, recommended_sets, recommended_reps, recommended_weight_kg, rest_seconds, sequence_order }
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
    const query = `${rawQuery} fitness gym workout`;
    
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
        const lexicaRes = await fetch(`https://lexica.art/api/v1/search?q=${encodeURIComponent(query)}`);
        const lexicaData = await lexicaRes.json();
        if (lexicaData.images?.length > 0) {
          setOnlineResults(lexicaData.images.slice(0, 16).map(img => ({
            id: img.id,
            src: img.src,
            thumbnail: img.src
          })));
        } else {
          // 3. LoremFlickr Fallback
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

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const wRes = await api.get('/admin/workouts');
      setWorkouts(wRes.data.workouts || []);
      
      const eRes = await api.get('/admin/workouts/exercises');
      setExercises(eRes.data.exercises || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkouts(); }, []);

  const handleOpenModal = (workout = null) => {
    if (workout) {
      setCurrentWorkout(workout);
      setFormData({
        name: workout.name,
        description: workout.description || '',
        difficulty: workout.difficulty,
        duration_minutes: workout.duration_minutes,
        status: workout.status || 'active',
        image: workout.image || null,
        exercises: workout.workout_exercises || []
      });
    } else {
      setCurrentWorkout(null);
      setFormData({ name: '', description: '', difficulty: 'intermediate', duration_minutes: 30, status: 'active', image: null, exercises: [] });
    }
    setImageTab('upload');
    setOnlineSearch('');
    setOnlineResults([]);
    setIsModalOpen(true);
  };

  const handleAddExerciseToForm = (exId) => {
    const ex = exercises.find(e => e.id === exId);
    if (!ex) return;
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { 
        exercise_id: ex.id, 
        name: ex.name,
        recommended_sets: 3, 
        recommended_reps: 12, 
        recommended_weight_kg: 0, 
        rest_seconds: 60, 
        sequence_order: prev.exercises.length + 1 
      }]
    }));
  };

  const removeExerciseFromForm = (idx) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== idx)
    }));
  };

  const handleOpenAssignModal = async (workout) => {
    setCurrentWorkout(workout);
    setIsAssignModalOpen(true);
    setSelectedUserIds([]);
    if (users.length === 0) {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data.users);
      } catch (err) { console.log(err); }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentWorkout) {
        await api.put(`/admin/workouts/${currentWorkout.id}`, formData);
      } else {
        await api.post('/admin/workouts/create', formData);
      }
      setIsModalOpen(false);
      fetchWorkouts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving workout');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Archive this workout?')) return;
    try {
      await api.delete(`/admin/workouts/${id}`);
      fetchWorkouts();
    } catch (err) { alert('Error deleting workout'); }
  };

  const handleAssign = async () => {
    if (!selectedUserIds.length) return;
    setIsSubmitting(true);
    try {
      await api.post('/admin/workouts/assign', { workout_id: currentWorkout.id, user_ids: selectedUserIds });
      setIsAssignModalOpen(false);
    } catch (err) { alert('Assignment failed'); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="space-y-10 animate-in pb-20">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 rounded-[30px] shadow-xl shadow-emerald-500/20 border border-white/10 relative overflow-hidden group">
        {/* Animated Mesh */}
        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_4s_infinite] skew-x-[-25deg]"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-white flex items-center gap-3 drop-shadow-lg">
             <WorkoutIcon className="text-emerald-200 animate-sway animate-hue" size={30} /> Workout Programs
          </h2>
          <p className="text-emerald-100/60 font-bold mt-1 text-[10px] uppercase tracking-widest">Global training & athlete dispatch</p>
        </div>
        <button onClick={() => handleOpenModal()} className="relative z-10 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 flex items-center gap-2 py-4 px-8 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 text-[10px] uppercase tracking-widest shadow-lg">
          <Plus size={18} /> Create New Plan
        </button>
      </div>

      {/* ── Workout Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-80 shimmer rounded-[40px]" />)
        ) : workouts.map((workout) => {
          const config = difficultyConfig[workout.difficulty] || difficultyConfig.intermediate;
          return (
            <div key={workout.id} className={`relative overflow-hidden rounded-[40px] group transition-all duration-500 hover:-translate-y-2 shadow-2xl ${config.shadow} flex flex-col h-[420px] border border-white/20 bg-slate-900`}>
               {/* Full Background Image */}
               <div className="absolute inset-0 z-0">
                  {workout.image ? (
                    <img src={workout.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-90" alt={workout.name} />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${config.cardBg}`} />
                  )}
                  {/* Subtle Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-90" />
               </div>

               <div className="relative z-10 p-8 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg">
                      {config.label}
                    </span>
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                       <WorkoutIcon className="text-white/80" size={20} />
                    </div>
                  </div>
                  
                  <div className="flex-1 mt-4">
                    <h3 className="text-3xl font-black mb-3 text-white leading-tight drop-shadow-2xl uppercase italic tracking-tighter">{workout.name}</h3>
                    <p className="text-white/90 text-xs font-bold line-clamp-3 mb-6 leading-relaxed drop-shadow-lg">{workout.description || 'Professional training program designed for maximum results.'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                     <div className="bg-white/10 backdrop-blur-md p-4 rounded-[25px] border border-white/10 flex flex-col items-center shadow-inner">
                        <Clock size={16} className="text-emerald-400 mb-2" />
                        <span className="font-black text-white text-lg leading-none">{workout.duration_minutes}m</span>
                        <span className="text-[8px] font-black uppercase text-white/40 tracking-widest mt-1">Duration</span>
                     </div>
                     <div className="bg-white/10 backdrop-blur-md p-4 rounded-[25px] border border-white/10 flex flex-col items-center shadow-inner">
                        <Activity size={16} className="text-blue-400 mb-2 animate-pulse" />
                        <span className="font-black text-white text-lg leading-none">{workout.workout_exercises?.length || 0}</span>
                        <span className="text-[8px] font-black uppercase text-white/40 tracking-widest mt-1">Exercises</span>
                     </div>
                  </div>

                  <div className="flex gap-3 items-center">
                    <button onClick={() => handleOpenAssignModal(workout)} className="h-14 flex-1 bg-white hover:bg-emerald-500 hover:text-white text-slate-900 rounded-[25px] flex items-center justify-center gap-3 font-black text-[11px] transition-all uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-[0.98]"><UsersIcon size={16} /> Assign</button>
                    <button onClick={() => handleOpenModal(workout)} className="w-14 h-14 bg-white/20 hover:bg-white text-white hover:text-slate-900 backdrop-blur-xl rounded-[25px] flex items-center justify-center border border-white/30 transition-all active:scale-95 shadow-xl"><Edit3 size={20} /></button>
                    <button onClick={() => handleDelete(workout.id)} className="w-14 h-14 bg-rose-500/30 hover:bg-rose-600 text-white backdrop-blur-xl rounded-[25px] flex items-center justify-center border border-white/30 transition-all active:scale-95 shadow-xl"><Trash2 size={20} /></button>
                  </div>
               </div>
            </div>
          );
        })}
      </div>

      {/* ── Create/Edit Modal with Exercise Selection ── */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl">
            <GlassCard className="w-full max-h-[85vh] overflow-hidden shadow-2xl border-white rounded-[40px] flex flex-col" hover={false}>
            <div className={`p-8 bg-gradient-to-r ${currentWorkout ? difficultyConfig[currentWorkout.difficulty]?.cardBg || 'from-slate-800 to-slate-900' : 'from-emerald-600 to-emerald-500'} text-white relative flex-shrink-0 border-b border-white/10`}>
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-black">{currentWorkout ? 'Edit Athlete Program' : 'Initialize New Plan'}</h3>
                  <p className="text-white/70 font-bold uppercase tracking-widest text-[10px] mt-1">Strategic training configuration v3.0</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all hover:rotate-90 border border-white/10">
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-10 bg-white space-y-10 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Left: General Info */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                       <Zap size={16} className="text-emerald-500" /> Core Parameters
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Name</label>
                        <input type="text" required className="input-field !bg-slate-50 border-slate-100" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Description</label>
                        <textarea rows="2" className="input-field !bg-slate-50 border-slate-100 resize-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Difficulty</label>
                          <select className="input-field cursor-pointer !bg-slate-50 border-slate-100" value={formData.difficulty} onChange={(e) => setFormData({...formData, difficulty: e.target.value})}>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Time (min)</label>
                          <input type="number" required className="input-field !bg-slate-50 border-slate-100" value={formData.duration_minutes} onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})} />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Visual Presentation (WebP)</label>
                        
                        {/* Sub Tabs */}
                        <div className="flex gap-4 mb-4">
                          <button 
                            type="button"
                            onClick={() => setImageTab('upload')}
                            className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all ${imageTab === 'upload' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                          >
                            DEVICE UPLOAD
                          </button>
                          <button 
                            type="button"
                            onClick={() => setImageTab('online')}
                            className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all ${imageTab === 'online' ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                          >
                            SEARCH ONLINE
                          </button>
                        </div>

                        {imageTab === 'upload' ? (
                          <div className="relative h-48 group cursor-pointer">
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                              onChange={handleImageChange}
                            />
                            <div className={`h-full border-2 border-dashed border-slate-200 rounded-[30px] flex flex-col items-center justify-center gap-3 transition-all bg-white hover:border-emerald-400`}>
                              {formData.image ? (
                                <div className="relative w-full h-full p-2">
                                  <img src={formData.image} className="w-full h-full object-cover rounded-[25px]" alt="" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[25px]">
                                      <Upload className="text-white" size={24} />
                                  </div>
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
                                <input 
                                  type="text"
                                  placeholder="Search e.g. 'Push up'..."
                                  className="flex-1 bg-slate-50 border border-slate-100 rounded-[20px] px-5 py-4 text-sm font-bold outline-none focus:border-blue-500 transition-all"
                                  value={onlineSearch}
                                  onChange={(e) => setOnlineSearch(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleOnlineSearch())}
                                />
                                <button 
                                  type="button"
                                  onClick={handleOnlineSearch}
                                  className="bg-blue-500 text-white p-4 rounded-[20px] hover:bg-blue-600 transition-all"
                                >
                                  {searchingOnline ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                                </button>
                             </div>

                             <div className="relative min-h-[200px]">
                                {searchingOnline && (
                                  <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-[20px] animate-in fade-in">
                                     <Loader2 size={32} className="animate-spin text-blue-500 mb-2" />
                                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Refreshing Results...</p>
                                  </div>
                                )}
                                
                                <div className="grid grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                  {onlineResults.map((img) => (
                                    <button
                                      key={img.id}
                                      type="button"
                                      onClick={() => setFormData({...formData, image: img.src})}
                                      className={`relative aspect-square rounded-[15px] overflow-hidden border-4 transition-all hover:scale-105 ${formData.image === img.src ? 'border-blue-500' : 'border-transparent'}`}
                                    >
                                      <img src={img.thumbnail || img.src} className="w-full h-full object-cover" alt="" />
                                      {formData.image === img.src && (
                                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                           <Sparkles size={16} className="text-white fill-current" />
                                        </div>
                                      )}
                                    </button>
                                  ))}
                                </div>
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Exercise Builder */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                       <WorkoutIcon size={16} className="text-blue-500" /> Program Builder
                    </h4>
                    
                    <div className="space-y-4">
                        <select 
                          className="input-field !bg-blue-50 !border-blue-100 text-blue-800 font-bold"
                          onChange={(e) => e.target.value && handleAddExerciseToForm(e.target.value)}
                          value=""
                        >
                          <option value="">+ Add Exercise to Program</option>
                          {exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name} ({ex.muscle_group})</option>)}
                        </select>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                           {formData.exercises.length > 0 ? formData.exercises.map((ex, i) => (
                             <div key={i} className="p-4 bg-slate-50 rounded-3xl border border-slate-100 space-y-3 relative group">
                                <button type="button" onClick={() => removeExerciseFromForm(i)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><X size={16} /></button>
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center font-black text-slate-400 text-xs shadow-sm border border-slate-100">{i+1}</div>
                                   <p className="font-extrabold text-slate-800 text-sm">{ex.name || 'Movement Unit'}</p>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                   <div>
                                      <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Sets</label>
                                      <input type="number" className="w-full bg-white border border-slate-100 rounded-lg p-1 text-xs font-bold text-center" value={ex.recommended_sets} onChange={(e) => {
                                         const newEx = [...formData.exercises];
                                         newEx[i].recommended_sets = parseInt(e.target.value);
                                         setFormData({...formData, exercises: newEx});
                                      }} />
                                   </div>
                                   <div>
                                      <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Reps</label>
                                      <input type="number" className="w-full bg-white border border-slate-100 rounded-lg p-1 text-xs font-bold text-center" value={ex.recommended_reps} onChange={(e) => {
                                         const newEx = [...formData.exercises];
                                         newEx[i].recommended_reps = parseInt(e.target.value);
                                         setFormData({...formData, exercises: newEx});
                                      }} />
                                   </div>
                                   <div>
                                      <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Rest (s)</label>
                                      <input type="number" className="w-full bg-white border border-slate-100 rounded-lg p-1 text-xs font-bold text-center" value={ex.rest_seconds} onChange={(e) => {
                                         const newEx = [...formData.exercises];
                                         newEx[i].rest_seconds = parseInt(e.target.value);
                                         setFormData({...formData, exercises: newEx});
                                      }} />
                                   </div>
                                </div>
                             </div>
                           )) : <div className="text-center py-10 text-slate-300 italic text-sm">No exercises added yet.</div>}
                        </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 sticky bottom-0 bg-white">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-secondary !py-4">Discard</button>
                  <button type="submit" disabled={isSubmitting} className={`flex-[2] btn-primary !py-4 !bg-gradient-to-r ${currentWorkout ? difficultyConfig[currentWorkout.difficulty]?.cardBg : 'from-emerald-600 to-emerald-500'}`}>
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : currentWorkout ? 'Confirm Optimization' : 'Broadcast to Platform'}
                  </button>
                </div>
            </form>
          </GlassCard>
          </div>
        </div>
      )}

      {/* Assign Modal remains similar but with updated styling */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in">
          <GlassCard className="w-full max-w-2xl p-0 overflow-hidden shadow-2xl border-white rounded-[40px]" hover={false}>
            <div className="p-10 bg-slate-950 text-white flex justify-between items-center">
              <div><h3 className="text-2xl font-black">Dispatch Program</h3><p className="text-slate-400 font-medium">{currentWorkout?.name}</p></div>
              <button onClick={() => setIsAssignModalOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl"><X size={24} /></button>
            </div>
            <div className="p-10 space-y-6">
              <div className="relative"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="text" placeholder="Search athletes..." className="input-field pl-14 !bg-slate-50" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} /></div>
              <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {users.filter(u => u.name?.toLowerCase().includes(userSearch.toLowerCase())).map(user => (
                  <div key={user.id} onClick={() => setSelectedUserIds(prev => prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id])}
                    className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${selectedUserIds.includes(user.id) ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-slate-50 border-slate-50 hover:border-slate-200'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${selectedUserIds.includes(user.id) ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>{user.name?.charAt(0)}</div>
                      <div><p className="font-extrabold text-slate-800">{user.name}</p><p className="text-xs text-slate-400 font-bold tracking-tight">{user.email}</p></div>
                    </div>
                    {selectedUserIds.includes(user.id) && <Check size={24} className="text-emerald-600" />}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                <p className="text-sm text-slate-500 font-bold">Selected athletes: <span className="text-emerald-600 font-black text-lg">{selectedUserIds.length}</span></p>
                <button onClick={handleAssign} disabled={isSubmitting || !selectedUserIds.length} className="btn-primary py-4 px-12">{isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Dispatch Now'}</button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Workouts;
