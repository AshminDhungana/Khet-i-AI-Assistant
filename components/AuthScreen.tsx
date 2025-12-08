import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { LeafIcon } from './Icons';
import { generateMediaAsset } from '../services/geminiService';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Generated Assets State
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [generatingAssets, setGeneratingAssets] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [farmName, setFarmName] = useState('');

  // Generate Assets on Mount
  useEffect(() => {
    const fetchAssets = async () => {
      // Check session storage first to avoid regenerating on every reload
      const cachedHero = sessionStorage.getItem('kheti_hero_image');
      const cachedLogo = sessionStorage.getItem('kheti_logo_image');

      if (cachedHero && cachedLogo) {
        setHeroImage(cachedHero);
        setLogoImage(cachedLogo);
        return;
      }

      setGeneratingAssets(true);
      
      // Prompts optimized for gemini-2.5-flash-image
      const heroPrompt = "Photorealistic aerial view of a vibrant terraced rice farm in Nepal during golden hour, lush green fields, distant himalayas, farmers working, 4k resolution, cinematic lighting";
      const logoPrompt = "A modern minimalist vector logo for an agriculture AI app, incorporating a green leaf and digital circuit lines, flat design, white background, high contrast";

      try {
        const [hero, logo] = await Promise.all([
          generateMediaAsset(heroPrompt),
          generateMediaAsset(logoPrompt)
        ]);

        if (hero) {
          setHeroImage(hero);
          sessionStorage.setItem('kheti_hero_image', hero);
        }
        if (logo) {
          setLogoImage(logo);
          sessionStorage.setItem('kheti_logo_image', logo);
        }
      } catch (e) {
        console.error("Failed to load AI assets", e);
      } finally {
        setGeneratingAssets(false);
      }
    };

    if (process.env.API_KEY) {
       fetchAssets();
    }
  }, []);

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
      <div className="hidden lg:flex lg:w-1/2 bg-blue-800 relative overflow-hidden">
        {heroImage ? (
          <img 
            src={heroImage} 
            alt="AI Generated Farm" 
            className="absolute inset-0 w-full h-full object-cover opacity-80 animate-fade-in"
          />
        ) : (
          /* Fallback Gradient or Loading State */
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-emerald-800 opacity-90">
             {generatingAssets && (
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
               </div>
             )}
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent flex flex-col justify-end p-12 text-white z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20 shadow-lg">
               {logoImage ? (
                 <img src={logoImage} alt="Khet-i Logo" className="w-12 h-12 rounded-lg object-contain" />
               ) : (
                 <LeafIcon className="h-12 w-12 text-white" />
               )}
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-md">Khet-i AI</h1>
              {generatingAssets && <p className="text-xs text-blue-200 animate-pulse">Generating custom assets with Gemini...</p>}
            </div>
          </div>
          <p className="text-xl font-light leading-relaxed max-w-lg drop-shadow-sm text-blue-50">
            Empowering smallholder farmers with enterprise-grade satellite intelligence and predictive crop analytics.
          </p>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex lg:hidden bg-blue-600 p-3 rounded-xl mb-4 shadow-md">
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