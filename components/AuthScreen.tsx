
import React, { useState } from 'react';
import { User } from '../types';
import { LeafIcon } from './Icons';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [farmName, setFarmName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));

    // CHECK FOR SUPERUSER CREDENTIALS
    if (email === 'superuser' && password === 'admin') {
      const adminUser: User = {
        id: 'admin-master',
        name: 'System Administrator',
        email: 'admin@kheti.ai',
        farmName: 'Khet-i Admin Portal',
        avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=dc2626&color=fff',
        role: 'admin'
      };
      onLogin(adminUser);
      setLoading(false);
      return;
    }

    // Mock Authentication Logic for standard users
    const mockUser: User = {
      id: Date.now().toString(),
      name: isLogin ? (email.includes('@') ? email.split('@')[0] : email) : name,
      email: email,
      farmName: isLogin ? 'Himalayan Organic Farm' : farmName,
      avatarUrl: `https://ui-avatars.com/api/?name=${isLogin ? email : name}&background=0D8ABC&color=fff`,
      role: 'user'
    };

    onLogin(mockUser);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel: Imagery (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1625246333195-58f214f76326?q=80&w=2574&auto=format&fit=crop" 
          alt="Agriculture" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex flex-col justify-end p-12 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
               <LeafIcon className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Khet-i AI</h1>
          </div>
          <p className="text-xl font-light leading-relaxed max-w-md">
            Empowering smallholder farmers with enterprise-grade satellite intelligence and predictive crop analytics.
          </p>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex lg:hidden bg-blue-600 p-3 rounded-xl mb-4">
               <LeafIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {isLogin 
                ? 'Enter your credentials to access your farm dashboard.' 
                : 'Join thousands of farmers using AI to improve yields.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 focus:bg-white"
                    placeholder="Ram Sharma"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Farm Name</label>
                  <input 
                    type="text" 
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 focus:bg-white"
                    placeholder="Sharma Agro"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Email or Username</label>
              <input 
                type="text" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 focus:bg-white"
                placeholder="farmer@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 focus:bg-white"
                placeholder="••••••••"
              />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700">
                  Forgot password?
                </button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-blue-700 active:scale-[0.98] transition disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="font-bold text-blue-600 hover:underline"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
