import { useState } from 'react';
import { Dumbbell, Activity } from 'lucide-react';
import Workouts from './Workouts';
import Exercises from './Exercises';

const TrainingHub = () => {
  const [activeTab, setActiveTab] = useState('programs');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Central Navigation Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-100/50 p-2 rounded-full border border-slate-200/50 backdrop-blur-xl shadow-inner flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('programs')}
            className={`flex items-center gap-2 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'programs' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-500 hover:text-indigo-600 hover:bg-white/50'}`}
          >
            <Activity size={18} /> Training Programs
          </button>
          <button 
            onClick={() => setActiveTab('movements')}
            className={`flex items-center gap-2 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'movements' ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/30' : 'text-slate-500 hover:text-purple-600 hover:bg-white/50'}`}
          >
            <Dumbbell size={18} /> Movement Library
          </button>
        </div>
      </div>

      {/* Render Active Component */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'programs' ? <Workouts /> : <Exercises />}
      </div>
    </div>
  );
};

export default TrainingHub;
