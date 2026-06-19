import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Droplet, Hospital, Calendar, AlertTriangle, Upload, Info } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { toast } from 'sonner';

const requestSchema = z.object({
  hospitalName: z.string().min(3, 'Hospital name is required'),
  bloodType: z.string().min(1, 'Please select blood type'),
  units: z.string().min(1, 'Units required'),
  neededDate: z.string().min(1, 'Date is required'),
  reason: z.string().min(10, 'Please provide more detail'),
});

export default function SubmitBloodRequest() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(requestSchema)
  });

  const onSubmit = (data) => {
    console.log(data);
    toast.success('Request submitted successfully! Tracking initiated.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2C3E50] tracking-tight">Submit Blood Request</h1>
          <p className="text-gray-500 font-medium mt-1">Please provide accurate details for the emergency broadcast.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 font-bold text-xs">
           <AlertTriangle className="w-4 h-4" /> EMERGENCY PROTOCOL ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6 bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Hospital Name" 
                placeholder="e.g. City General Hospital" 
                icon={Hospital} 
                register={register('hospitalName')} 
                error={errors.hospitalName?.message}
              />
              <div className="space-y-1.5 flex flex-col">
                 <label className="text-sm font-bold text-[#2C3E50] ml-1">Blood Type Needed</label>
                 <select {...register('bloodType')} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-medium outline-none focus:border-rose-400 transition-all appearance-none cursor-pointer">
                    <option value="">Select Type</option>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
                 </select>
                 {errors.bloodType && <p className="text-xs text-rose-500 font-medium ml-1">{errors.bloodType.message}</p>}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Units Required" 
                type="number" 
                placeholder="Total bags" 
                icon={Droplet} 
                register={register('units')} 
                error={errors.units?.message}
              />
              <Input 
                label="Required Date" 
                type="date" 
                icon={Calendar} 
                register={register('neededDate')} 
                error={errors.neededDate?.message}
              />
           </div>

           <div className="space-y-1.5 ">
              <label className="text-sm font-bold text-[#2C3E50] ml-1">Medical Reason / Case Detail</label>
              <textarea 
                {...register('reason')} 
                rows={4} 
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-medium outline-none focus:border-rose-400 transition-all resize-none"
                placeholder="Briefly explain the medical emergency..."
              />
              {errors.reason && <p className="text-xs text-rose-500 font-medium ml-1">{errors.reason.message}</p>}
           </div>

           <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-slate-100 transition-all">
              <Upload className="w-8 h-8 text-slate-400 mb-2 group-hover:text-rose-500 transition-colors" />
              <p className="text-sm font-bold text-slate-600">Upload Hospital Memo / Request Slips</p>
              <p className="text-xs text-slate-400 font-medium mt-1">PDF or image, max 5MB</p>
           </div>

           <Button type="submit" className="w-full h-14 font-black text-lg tracking-wide shadow-[0_4px_0_#922B21]">
              Submit Emergency Request
           </Button>
        </form>

        <div className="space-y-6">
           <div className="bg-rose-50 rounded-[32px] p-8 border border-rose-100 shadow-sm">
              <h3 className="text-xl font-black text-rose-900 mb-4 flex items-center gap-2">
                 <Info className="w-5 h-5" /> Quick Tips
              </h3>
              <div className="space-y-4 text-sm text-rose-700 font-medium leading-relaxed">
                 <p>• Requests for <strong>Rare Groups (O-, AB-)</strong> usually take 2-4 hours to identify donors.</p>
                 <p>• Make sure the hospital address is accurate for donor guidance.</p>
                 <p>• The system will notify you as soon as a donor confirms their availability.</p>
              </div>
           </div>
           
           <div className="bg-[#2C3E50] rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-10 pointer-events-none" />
              <p className="text-rose-400 font-black text-xs uppercase tracking-[0.2em] mb-4">Urgent Help?</p>
              <p className="text-2xl font-black mb-2">0800-BLOOD</p>
              <p className="text-xs text-gray-400 font-bold">24/7 Helpline Support</p>
           </div>
        </div>
      </div>
    </div>
  );
}
