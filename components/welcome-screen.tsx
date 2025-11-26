"use client"

import { useEffect, useState } from 'react';
import { Sparkles, LogOut, Loader2, User as UserIcon } from 'lucide-react';
import { User } from './auth-form';

interface WelcomeScreenProps {
  user: User;
  onLogout: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ user, onLogout }) => {
  const [greeting, setGreeting] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    
    const fetchGreeting = async () => {
      try {
        const msg = console.log(user.name);
        if (mounted) setGreeting('msg');
      } catch (err) {
        if (mounted) setGreeting(`Welcome, ${user.name}!`);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchGreeting();

    return () => {
      mounted = false;
    };
  }, [user.name]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-indigo-50 via-slate-50 to-purple-50">
      <div className="glass-panel w-full max-w-md p-8 rounded-2xl shadow-xl border border-white/50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-linear-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
            <UserIcon className="text-white w-10 h-10" />
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Hello, {user.name}
          </h1>
          
          <div className="min-h-20 flex items-center justify-center mb-8">
            {loading ? (
              <div className="flex items-center text-indigo-600 gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                <span className="text-sm font-medium">Asking Gemini for a greeting...</span>
              </div>
            ) : (
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 animate-fade-in">
                <div className="flex items-center justify-center gap-2 mb-2 text-indigo-600">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">AI Insight</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  "{greeting}"
                </p>
              </div>
            )}
          </div>

          <div className="w-full space-y-3">
             <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm text-left">
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Account Email</p>
                <p className="text-slate-700 font-medium">{user.email}</p>
             </div>

            <button
              onClick={onLogout}
              className="w-full mt-6 py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-200 transition-colors duration-200 flex items-center justify-center gap-2 group"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
