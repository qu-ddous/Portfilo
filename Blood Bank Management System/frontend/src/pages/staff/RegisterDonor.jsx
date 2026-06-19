import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, UserCheck, AlertTriangle } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { toast } from 'sonner';
import axiosInstance from '../../api/axiosInstance';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
  cnic: z.string().min(13, 'Valid CNIC required'),
  age: z.string().refine(val => parseInt(val) >= 18 && parseInt(val) <= 65, 'Age must be between 18 and 65'),
  weight: z.string().refine(val => parseInt(val) >= 50, 'Weight must be at least 50 kg'),
  bloodType: z.string().min(1, 'Blood type is required'),
  gender: z.string().min(1, 'Gender is required'),
  city: z.string().min(2, 'City is required'),
});

export default function RegisterDonor() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/donors', {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        blood_type: data.bloodType,
        age: data.age,
        weight: data.weight
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Donor registered successfully!');
        reset();
      } else {
        toast.error(response.data.error || 'Failed to register donor.');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to register donor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#2C3E50] tracking-tight">Register Walk-in Donor</h1>
        <p className="text-gray-500 font-medium mt-1">Register a new donor visiting the facility directly.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full pointer-events-none" />
        <UserPlus className="absolute top-6 right-6 w-10 h-10 text-red-100 pointer-events-none" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
          
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-4 text-blue-800 mb-8">
             <AlertTriangle className="w-5 h-5 shrink-0 text-blue-500" />
             <div className="text-sm font-medium">
               <p className="font-bold mb-1 border-b border-blue-200/50 pb-1">Real-time Registration: ACTIVE</p>
               <ul className="list-disc pl-4 space-y-1 mt-2 text-blue-700/80 text-xs">
                 <li>Data will be synchronized with Central Blood Bank.</li>
                 <li>Donor will be assigned a unique Global ID.</li>
               </ul>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" placeholder="e.g. Ali Raza" register={register('fullName')} error={errors.fullName?.message} />
            <Input label="Email Address" type="email" placeholder="e.g. ali@example.com" register={register('email')} error={errors.email?.message} />
            <Input label="Phone Number" placeholder="e.g. 03001234567" register={register('phone')} error={errors.phone?.message} />
            <Input label="CNIC / ID Number" placeholder="e.g. 35202-0000000-0" register={register('cnic')} error={errors.cnic?.message} />
          </div>

          <hr className="border-gray-100 my-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Age (Years)" type="number" placeholder="e.g. 25" register={register('age')} error={errors.age?.message} />
            <Input label="Weight (kg)" type="number" placeholder="e.g. 70" register={register('weight')} error={errors.weight?.message} />
            
            <div className="space-y-1.5 flex flex-col">
              <label className="block text-sm font-bold text-[#2C3E50]">Blood Type</label>
              <select {...register('bloodType')} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium outline-none focus:border-red-400 focus:bg-white transition-all h-[46px]">
                <option value="">Select Type</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.bloodType && <p className="text-red-500 text-xs font-semibold mt-1">{errors.bloodType.message}</p>}
            </div>
            
            <Input label="City" placeholder="e.g. Lahore" register={register('city')} error={errors.city?.message} />
          </div>

          <div className="flex justify-end pt-6">
            <Button type="submit" loading={loading} className="px-10 flex items-center gap-2">
              <UserCheck className="w-5 h-5" /> Register & Sync
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
