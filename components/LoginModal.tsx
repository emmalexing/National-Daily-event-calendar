import React, { useState } from 'react';
import { Lock, Mail, ChevronRight, LogIn, Eye, EyeOff, AlertCircle, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (email: string, password: string) => Promise<boolean>;
  onSignup: (user: User) => Promise<boolean>;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLogin, onSignup }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setIsLoading(true);

      if (!email.trim() || !password.trim()) {
        setError("Please enter all required fields.");
        setIsLoading(false);
        return;
      }

      if (isLoginMode) {
          const success = await onLogin(email, password);
          if (!success) {
            setError("Invalid email or password.");
          }
      } else {
          if (!name.trim()) {
              setError("Please enter your full name.");
              setIsLoading(false);
              return;
          }
          
          const newUser: User = {
              name,
              email,
              role: 'editor', // Default role for public signup
              password
          };
          
          const success = await onSignup(newUser);
          if (!success) {
              setError("Account with this email already exists.");
          }
      }
      setIsLoading(false);
  };

  const toggleMode = () => {
      setIsLoginMode(!isLoginMode);
      setError(null);
      setPassword('');
      if (isLoginMode) setName(''); // Clear name when switching to signup
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center">
          <div className="bg-naija-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-naija-green" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">
            {isLoginMode ? "Welcome Back" : "Join the Team"}
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            {isLoginMode ? "Enter your credentials to access the calendar." : "Create an account to view events and briefs."}
          </p>
        </div>

        <div className="bg-slate-50 px-8 py-6 border-t border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                    {!isLoginMode && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    required={!isLoginMode}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-naija-green/20 focus:border-naija-green text-sm transition-colors"
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-naija-green/20 focus:border-naija-green text-sm transition-colors"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-naija-green/20 focus:border-naija-green text-sm transition-colors"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center py-3 px-4 bg-slate-900 hover:bg-naija-green text-white rounded-lg font-medium transition-colors duration-200 shadow-lg shadow-slate-900/20 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span>Processing...</span>
                    ) : (
                        <>
                        <span>{isLoginMode ? "Sign In" : "Create Account"}</span>
                        <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                    {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                    <button 
                        onClick={toggleMode}
                        className="font-semibold text-naija-green hover:text-naija-dark ml-1 transition-colors focus:outline-none"
                    >
                        {isLoginMode ? "Sign up" : "Log in"}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;