import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { Heart, UserPlus, Droplet } from 'lucide-react';
import { BLOOD_TYPES } from '../../constants/bloodTypes';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const passwordSchema = z.string()
  .min(8, 'Minimum 8 characters')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[0-9]/, 'Must contain a number')
  .regex(/[!@#$%^&*]/, 'Must contain special character');

const baseSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').regex(/^[a-zA-Z\s]+$/, 'Letters only'),
  email: z.string().email('Valid email required'),
  password: passwordSchema,
  phone: z.string().length(11, 'Phone must be exactly 11 digits').regex(/^\d+$/, 'Numbers only'),
});

const donorSchema = baseSchema.extend({
  blood_type: z.enum(BLOOD_TYPES, { errorMap: () => ({ message: 'Select a valid blood type' }) }),
  age: z.coerce.number().min(18, 'Min 18 years').max(65, 'Max 65 years'),
  weight: z.coerce.number().min(50, 'Minimum 50kg'),
});

const patientSchema = baseSchema.extend({
  blood_type: z.enum(BLOOD_TYPES, { errorMap: () => ({ message: 'Select a valid blood type' }) }),
  medical_condition: z.string().min(10, 'Describe condition in min 10 chars'),
});

const Signup = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'patient' ? 'patient' : 'donor';
  
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const currentSchema = role === 'donor' ? donorSchema : patientSchema;
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(currentSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signup(data.email, data.password, role, {
        name: data.name,
        phone: data.phone,
        blood_type: data.blood_type,
        age: data.age,
        weight: data.weight,
        medical_condition: data.medical_condition
      });
      toast.success('Registration successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop')" }}
    >
      {/* Dark glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E50]/90 via-[#2C3E50]/70 to-[#C0392B]/60 backdrop-blur-sm z-0" />

      <motion.div 
        layout
        initial={{ opacity: 0, y: 30, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        style={{ perspective: 1000 }}
        className="w-full max-w-lg bg-white/90 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_0_rgba(0,0,0,0.1),0_40px_60px_rgba(0,0,0,0.5)] border-t-2 border-l-2 border-white/80 overflow-hidden relative z-10 transform-gpu"
      >
        <div className="bg-[#C0392B] p-6 text-center">
          <h2 className="text-3xl font-bold text-white">Join BloodLink</h2>
          <p className="text-red-100 mt-2">Become part of our life-saving community</p>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-center text-[#2C3E50]">I want to register as a:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => { setRole('donor'); setStep(2); }}
                    className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${role === 'donor' ? 'border-[#C0392B] bg-red-50' : 'border-[#E5E7EB] hover:border-[#E74C3C]'}`}
                  >
                    <Heart className={`w-10 h-10 ${role === 'donor' ? 'text-[#C0392B]' : 'text-[#7F8C8D]'}`} />
                    <span className={`font-semibold ${role === 'donor' ? 'text-[#C0392B]' : 'text-[#7F8C8D]'}`}>Donor</span>
                  </button>
                  <button 
                    onClick={() => { setRole('patient'); setStep(2); }}
                    className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${role === 'patient' ? 'border-[#C0392B] bg-red-50' : 'border-[#E5E7EB] hover:border-[#E74C3C]'}`}
                  >
                    <UserPlus className={`w-10 h-10 ${role === 'patient' ? 'text-[#C0392B]' : 'text-[#7F8C8D]'}`} />
                    <span className={`font-semibold ${role === 'patient' ? 'text-[#C0392B]' : 'text-[#7F8C8D]'}`}>Patient</span>
                  </button>
                </div>
                <div className="text-center mt-6">
                  <p className="text-[#7F8C8D]">Already have an account? <Link to="/login" className="text-[#C0392B] hover:underline font-medium">Log in</Link></p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex items-center mb-6">
                  <button onClick={() => setStep(1)} className="text-[#7F8C8D] hover:text-[#C0392B] mr-4 transition-colors font-medium">← Back</button>
                  <h3 className="text-2xl font-bold text-[#2C3E50]">{role === 'donor' ? 'Donor' : 'Patient'} Registration</h3>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      register={register('name')}
                      error={errors.name?.message}
                    />
                    <Input
                      label="Phone (11 Digits)"
                      placeholder="03001234567"
                      register={register('phone')}
                      error={errors.phone?.message}
                    />
                  </div>

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    register={register('email')}
                    error={errors.email?.message}
                  />

                  <Input
                    label="Password"
                    type="password"
                    placeholder="Mix of cases, numbers, symbols"
                    register={register('password')}
                    error={errors.password?.message}
                  />

                  {/* Role Specific Fields */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className={role === 'patient' ? "col-span-2" : ""}>
                      <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">Blood Type</label>
                      <select {...register('blood_type')} className={`w-full px-3 py-2 h-10 rounded-lg border bg-white ${errors.blood_type ? 'border-[#E74C3C] focus:ring-[#E74C3C]' : 'border-[#E5E7EB] focus:ring-[#C0392B]'} focus:outline-none focus:ring-2 transition-colors text-sm`}>
                        <option value="">Select Type</option>
                        {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                      </select>
                      {errors.blood_type && <p className="text-[#E74C3C] text-sm mt-1.5 font-medium">{errors.blood_type.message}</p>}
                    </div>

                    {role === 'donor' && (
                      <>
                        <Input
                          label="Age"
                          type="number"
                          placeholder="e.g. 25"
                          register={register('age')}
                          error={errors.age?.message}
                        />
                        <Input
                          label="Weight (kg)"
                          type="number"
                          placeholder="e.g. 65"
                          register={register('weight')}
                          error={errors.weight?.message}
                        />
                      </>
                    )}
                  </div>

                  {role === 'patient' && (
                    <div className="pt-2">
                      <label className="block text-sm font-medium text-[#2C3E50] mb-1.5">Medical Condition & Instructions</label>
                      <textarea {...register('medical_condition')} rows="3" placeholder="Briefly describe the reason for blood request..." className={`w-full p-3 rounded-lg border text-sm ${errors.medical_condition ? 'border-[#E74C3C] focus:ring-[#E74C3C]' : 'border-[#E5E7EB] focus:ring-[#C0392B]'} focus:outline-none focus:ring-2 transition-colors resize-none`}></textarea>
                      {errors.medical_condition && <p className="text-[#E74C3C] text-sm mt-1.5 font-medium">{errors.medical_condition.message}</p>}
                    </div>
                  )}

                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      loading={loading}
                      className="w-full shadow-md shadow-red-500/20"
                      size="lg"
                    >
                      Create Account
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
