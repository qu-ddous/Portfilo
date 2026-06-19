import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';
import { Loader2, Droplet, Zap } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password required')
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const authData = await login(data.email, data.password);
      toast.success('Logged in successfully!');
      navigate(`/${authData.user.role}/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (email) => {
    setLoading(true);
    try {
      const authData = await login(email, 'test1234'); // Seeded users bypass pwd for now
      toast.success(`Logged in as ${authData.user.role}!`);
      navigate(`/${authData.user.role}/dashboard`);
    } catch (err) {
      toast.error('Quick login failed. Ensure database is seeded.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#2C3E50]/90 via-[#2C3E50]/70 to-[#C0392B]/60 backdrop-blur-sm z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[32px] shadow-2xl p-10 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#C0392B] rounded-full flex items-center justify-center shadow-lg">
              <Droplet className="text-white w-8 h-8 fill-current" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#2C3E50]">Welcome Back</h2>
          <p className="text-[#7F8C8D] mt-2">Sign in to continue to BloodLink</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email Address"
            placeholder="you@example.com"
            register={register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            register={register('password')}
            error={errors.password?.message}
          />

          <div className="pt-2">
            <Button type="submit" loading={loading} className="w-full shadow-md mb-4">Log In</Button>
            
            <div className="relative mb-6 mt-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-bold tracking-widest">Developer Quick Login</span></div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button 
                type="button" 
                onClick={() => quickLogin('admin@bloodlink.com')}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-gray-100 text-xs font-bold text-slate-600 flex flex-col items-center gap-1 transition-all"
              >
                <Zap className="w-4 h-4 text-orange-400" /> Admin Access
              </button>
              <button 
                type="button" 
                onClick={() => quickLogin('staff@bloodlink.com')}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-gray-100 text-xs font-bold text-slate-600 flex flex-col items-center gap-1 transition-all"
              >
                <Zap className="w-4 h-4 text-orange-400" /> Staff Access
              </button>
              <button 
                type="button" 
                onClick={() => quickLogin('donor@example.com')}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-gray-100 text-xs font-bold text-slate-600 flex flex-col items-center gap-1 transition-all"
              >
                <Zap className="w-4 h-4 text-orange-400" /> Donor Side
              </button>
              <button 
                type="button" 
                onClick={() => quickLogin('patient@example.com')}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-gray-100 text-xs font-bold text-slate-600 flex flex-col items-center gap-1 transition-all"
              >
                <Zap className="w-4 h-4 text-orange-400" /> Patient Side
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[#7F8C8D]">
            New here? Register as a{' '}
            <Link to="/signup?role=donor" className="text-[#C0392B] hover:underline font-medium">Donor</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
