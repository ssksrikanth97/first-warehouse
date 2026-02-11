'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Briefcase, Loader2, Lock, Phone } from 'lucide-react';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    setError('');

    try {
      const result = await login(phone, password);
      // login now returns { success: boolean, error?: string }
      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || 'Invalid credentials.');
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 group cursor-default">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-primary shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-white tracking-tight leading-none">Kirana B2B</h1>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">Wholesale Hub</span>
            </div>
          </div>
        </div>

        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-white">Welcome back</CardTitle>
            <CardDescription className="text-center text-slate-400">
              Sign in to manage your wholesale orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-slate-200">Mobile Number</Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-primary">
                    <Phone className="w-4 h-4" />
                  </div>
                  <Input
                    id="phone"
                    placeholder="Enter 10 digit number"
                    className="pl-10 bg-slate-950/50 border-slate-800 focus:border-primary focus:ring-primary/20 text-slate-200 h-11 transition-all"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    type="tel"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-200">Password</Label>
                </div>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-primary">
                    <Lock className="w-4 h-4" />
                  </div>
                  <Input
                    id="password"
                    placeholder="••••••••"
                    className="pl-10 bg-slate-950/50 border-slate-800 focus:border-primary focus:ring-primary/20 text-slate-200 h-11 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                  <p className="text-xs font-semibold text-red-500">{error}</p>
                </div>
              )}

              <Button
                className="w-full h-11 bg-gradient-to-r from-orange-500 to-primary hover:from-orange-400 hover:to-primary/90 text-white font-semibold transition-all duration-300 shadow-lg shadow-primary/20"
                type="submit"
                disabled={isSubmitLoading}
              >
                {isSubmitLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-8 pt-2">
            <div className="flex items-center w-full">
              <div className="flex-grow h-px bg-slate-800"></div>
              <span className="px-4 text-[10px] text-slate-600 uppercase tracking-widest font-bold">Secure Access</span>
              <div className="flex-grow h-px bg-slate-800"></div>
            </div>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
