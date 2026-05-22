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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="glass-panel w-full max-w-md p-8 rounded-2xl relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-linear-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
            <UserIcon className="text-white w-10 h-10" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            Hello, {user.name}
          </h1>
          
          <div className="min-h-20 flex items-center justify-center mb-8">
            {loading ? (
              <div className="flex items-center text-indigo-600 gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                <span className="text-sm font-medium">Asking Gemini for a greeting...</span>
              </div>
            ) : (
              <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 animate-fade-in">
                <div className="flex items-center justify-center gap-2 mb-2 text-indigo-600">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">AI Insight</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  "{greeting}"
                </p>
              </div>
            )}
          </div>

          <div className="w-full space-y-3">
             <div className="p-4 bg-card rounded-lg border border-border shadow-sm text-left">
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Account Email</p>
                <p className="text-foreground font-medium">{user.email}</p>
             </div>

            <button
              onClick={onLogout}
              className="w-full mt-6 py-2.5 px-4 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg border border-border transition-colors duration-200 flex items-center justify-center gap-2 group"
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
