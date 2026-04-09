/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  runTransaction 
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { useStore } from '../../store/useStore';
import { Compass, Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  const language = useStore(state => state.language);

  const t = {
    en: {
      login: 'Login',
      signup: 'Sign Up',
      email: 'Email Address',
      password: 'Password',
      username: 'Unique Username',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      welcome: 'Welcome Back',
      create: 'Create Account',
      tagline: "The Scholar's Compass",
      errorUsernameTaken: 'Username is already taken',
      errorGeneric: 'An error occurred. Please try again.',
      loading: 'Authenticating...',
      googleSignIn: 'Continue with Google'
    },
    ar: {
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      username: 'اسم المستخدم',
      noAccount: 'ليس لديك حساب؟',
      hasAccount: 'لديك حساب بالفعل؟',
      welcome: 'مرحباً بك مجدداً',
      create: 'إنشاء الحساب',
      tagline: 'بوصلة الطالب',
      errorUsernameTaken: 'اسم المستخدم مستخدم بالفعل',
      errorGeneric: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
      loading: 'جاري التحقق...',
      googleSignIn: 'المتابعة باستخدام جوجل'
    }
  }[language];

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user profile exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        // Generate a default username from email
        let baseUsername = user.email?.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'scholar';
        let username = baseUsername;
        let counter = 1;

        // Ensure uniqueness
        while (true) {
          const checkDoc = await getDoc(doc(db, 'usernames', username));
          if (!checkDoc.exists()) break;
          username = `${baseUsername}_${counter}`;
          counter++;
        }

        // Create profile
        await runTransaction(db, async (transaction) => {
          transaction.set(doc(db, 'usernames', username), { uid: user.uid });
          transaction.set(doc(db, 'users', user.uid), {
            uid: user.uid,
            username: username,
            email: user.email,
            onboarded: false,
            theme: 'Scholar\'s Sanctum',
            language: language,
            streak: { current: 0, best: 0, lastActive: new Date().toISOString() }
          });
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        // Signup logic with unique username check
        const username = formData.username.trim().toLowerCase();
        if (username.length < 3) {
          throw new Error(language === 'ar' ? 'اسم المستخدم قصير جداً' : 'Username is too short');
        }

        // 1. Pre-check username existence
        const usernameDoc = await getDoc(doc(db, 'usernames', username));
        if (usernameDoc.exists()) {
          throw new Error(t.errorUsernameTaken);
        }

        // 2. Create Auth User
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        try {
          // 3. Use a transaction to claim the username and create the profile
          await runTransaction(db, async (transaction) => {
            const usernameDocRef = doc(db, 'usernames', username);
            const checkDoc = await transaction.get(usernameDocRef);

            if (checkDoc.exists()) {
              throw new Error(t.errorUsernameTaken);
            }

            // Set username mapping
            transaction.set(usernameDocRef, { uid: user.uid });

            // Initialize user profile
            const userDocRef = doc(db, 'users', user.uid);
            transaction.set(userDocRef, {
              uid: user.uid,
              username: formData.username,
              email: user.email,
              onboarded: false,
              theme: 'Scholar\'s Sanctum',
              language: language,
              streak: { current: 0, best: 0, lastActive: new Date().toISOString() }
            });
          });

          // Update Auth profile display name
          await updateProfile(user, { displayName: formData.username });
        } catch (err) {
          // Note: In a production app, we would consider deleting the Auth user here 
          // if the Firestore transaction fails to avoid orphaned accounts.
          throw err;
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[var(--bg-primary)] -z-20" />
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--accent-primary)]/10 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent-secondary)]/10 blur-[120px] rounded-full -z-10 animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass p-8 md:p-10 rounded-[3rem] space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-primary)]/5 blur-2xl rounded-full -mr-16 -mt-16" />
          
          <div className="text-center space-y-2 relative z-10">
            <div className="w-16 h-16 bg-[var(--accent-primary)] rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-[var(--accent-primary)]/20 mb-4 animate-float">
              <Compass className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">{isLogin ? t.welcome : t.create}</h1>
            <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-[10px]">{t.tagline}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-2">{t.username}</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
                    <input 
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-all font-bold"
                      placeholder="scholar_2026"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-2">{t.email}</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-all font-bold"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-2">{t.password}</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
                <input 
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-all font-bold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--accent-primary)] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-[var(--accent-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.loading}
                </>
              ) : (
                <>
                  {isLogin ? t.login : t.signup}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-color)]"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
              <span className="bg-[var(--bg-primary)] px-4 text-[var(--text-secondary)]">Or</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full neumorph py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:neumorph-pressed transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" referrerPolicy="no-referrer" />
            {t.googleSignIn}
          </button>

          <div className="text-center relative z-10">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              {isLogin ? t.noAccount : t.hasAccount} <span className="text-[var(--accent-primary)] ml-1">{isLogin ? t.signup : t.login}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
