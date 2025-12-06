"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, Command } from 'lucide-react';

import { api } from '@/api/api';
import { useAuthCheck } from '@/hooks/use-auth-check';

export enum AuthMode {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP'
}

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [auth, setAuth] = useState({
    name: '',
    email: '',
    password: ''
  });

  const router = useRouter();

  useAuthCheck({
    redirectIfAuthenticated: '/dashboard',
    redirectIfNotAuthenticated: '/'
  })

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (mode === AuthMode.SIGNUP && !auth.name.trim()) newErrors.name = 'Name is required';

    if (!auth.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(auth.email)) newErrors.email = 'Email is invalid';

    if (!auth.password) newErrors.password = 'Password is required';
    else if (auth.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    console.log(newErrors)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      if (mode === AuthMode.SIGNUP) {
        const { data } = await api.post('/users', auth)

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        const { data } = await api.post('/users/auth', { email: auth.email, password: auth.password })
        console.log(data)
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      router.push('/dashboard');
    } catch (error) {
      const message =
        (error as any)?.response?.data?.message ||
        (error as any)?.message ||
        'Something went wrong.';

      console.log(message, 'error')
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === AuthMode.LOGIN ? AuthMode.SIGNUP : AuthMode.LOGIN);
    setErrors({});
    // Optional: clear fields on toggle
    // setName(''); setEmail(''); setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-slate-100 to-indigo-50 relative overflow-hidden">
      {/* Abstract shapes background */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
      <div className="absolute top-0 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse animation-delay-4000"></div>

      <div className="glass-panel w-full max-w-md p-8 rounded-2xl shadow-2xl border border-white/60 relative z-10 transition-all duration-500 ease-in-out">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            {mode === AuthMode.LOGIN ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500 text-sm mt-2 text-center">
            {mode === AuthMode.LOGIN
              ? 'Enter your credentials to access your account'
              : 'Sign up to get started with our platform'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === AuthMode.SIGNUP && (
            <div className="animate-fade-in-down">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Name</label>

              <Input
                placeholder="John Doe"
                type="text"
                value={auth.name}
                onChange={(e) => setAuth({ ...auth, name: e.target.value })}
              />
            </div>
          )}

          <div className="animate-fade-in-down">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Email Address</label>

            <Input
              placeholder="name@example.com"
              type="text"
              value={auth.email}
              onChange={(e) => setAuth({ ...auth, email: e.target.value })}
            />
          </div>

          <div className="animate-fade-in-down">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Password</label>

            <Input
              placeholder="••••••••"
              type="password"
              value={auth.password}
              onChange={(e) => setAuth({ ...auth, password: e.target.value })}
            />
          </div>

          {mode === AuthMode.LOGIN && (
            <div className="flex justify-end">
              <button type="button" className="text-xs font-medium text-gray-700 hover:text-gray-500 transition-colors">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full py-2.5 px-4 mt-6
              bg-gray-600 hover:bg-gray-700
              text-white font-medium rounded-lg
              shadow-lg shadow-gray-600/30
              transition-all duration-200
              flex items-center justify-center gap-2
              disabled:opacity-70 disabled:cursor-not-allowed
              active:scale-[0.98]
              cursor-pointer
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{mode === AuthMode.LOGIN ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-600">
            {mode === AuthMode.LOGIN ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={toggleMode}
              className="ml-2 font-semibold text-gray-700 hover:text-gray-500 hover:underline transition-all focus:outline-none"
            >
              {mode === AuthMode.LOGIN ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
