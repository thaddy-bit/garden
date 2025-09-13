'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from '../components/Layout';
import SocialAuthButton from '../components/SocialAuthButton';
import { AtSymbolIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({});

  // Nettoyage des callbacks globaux au démontage du composant
  useEffect(() => {
    return () => {
      if (window.handleGoogleCallback) {
        delete window.handleGoogleCallback;
      }
    };
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Fonctions pour l'authentification sociale
  const handleGoogleAuth = async () => {
    // Éviter les appels multiples
    if (socialLoading.google) return;
    
    setSocialLoading(prev => ({ ...prev, google: true }));
    setError("");
    
    try {
      // Charger Google Identity Services
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Attendre que Google soit disponible
      await new Promise((resolve) => {
        const checkGoogle = () => {
          if (window.google && window.google.accounts) {
            resolve();
          } else {
            setTimeout(checkGoogle, 100);
          }
        };
        checkGoogle();
      });

      // Créer le callback global
      window.handleGoogleCallback = async (response) => {
        try {
          const res = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: response.credential }),
          });

          const data = await res.json();

          if (res.ok) {
            toast.success(data.message);
            router.push("/");
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          console.error('Erreur callback Google:', error);
          toast.error('Erreur lors de la connexion');
        } finally {
          setSocialLoading(prev => ({ ...prev, google: false }));
        }
      };

      // Initialiser Google Sign-In
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: window.handleGoogleCallback
      });

      // Déclencher la popup de connexion
      window.google.accounts.id.prompt();
      
    } catch (error) {
      console.error('Erreur Google Auth:', error);
      toast.error('Erreur lors de la connexion Google');
      setSocialLoading(prev => ({ ...prev, google: false }));
    }
  };

  const handleFacebookAuth = async () => {
    setSocialLoading(prev => ({ ...prev, facebook: true }));
    setError("");
    
    try {
      // Charger Facebook SDK
      if (!window.FB) {
        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/fr_FR/sdk.js';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Initialiser Facebook SDK
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });

      // Déclencher la connexion Facebook
      window.FB.login(async (response) => {
        if (response.authResponse) {
          try {
            const res = await fetch("/api/auth/facebook", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ accessToken: response.authResponse.accessToken }),
            });

            const data = await res.json();

            if (res.ok) {
              toast.success(data.message);
              router.push("/");
            } else {
              toast.error(data.message);
            }
          } catch (error) {
            console.error('Erreur Facebook Auth:', error);
            toast.error('Erreur lors de la connexion Facebook');
          }
        }
        setSocialLoading(prev => ({ ...prev, facebook: false }));
      }, { scope: 'email' });
      
    } catch (error) {
      console.error('Erreur Facebook Auth:', error);
      toast.error('Erreur lors de la connexion Facebook');
      setSocialLoading(prev => ({ ...prev, facebook: false }));
    }
  };

  const handleAppleAuth = async () => {
    setSocialLoading(prev => ({ ...prev, apple: true }));
    setError("");
    
    try {
      // Charger Apple Sign In
      if (!window.AppleID) {
        const script = document.createElement('script');
        script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
        script.async = true;
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Initialiser Apple Sign In
      window.AppleID.auth.init({
        clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
        scope: 'name email',
        redirectURI: window.location.origin,
        state: 'apple-signin',
        usePopup: true
      });

      // Déclencher la connexion Apple
      const data = await window.AppleID.auth.signIn();
      
      const res = await fetch("/api/auth/apple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success(responseData.message);
        router.push("/");
      } else {
        toast.error(responseData.message);
      }
      
    } catch (error) {
      console.error('Erreur Apple Auth:', error);
      toast.error('Erreur lors de la connexion Apple');
    } finally {
      setSocialLoading(prev => ({ ...prev, apple: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      setError("Email ou mot de passe incorrect.");
      setIsLoading(false);
      return;
    }

    router.push("/"); // Redirige vers le panier après connexion
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo et branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg mb-4">
              <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Bienvenue</h1>
            <p className="text-slate-600 text-sm">Connectez-vous à votre espace professionnel</p>
          </div>

          {/* Carte de connexion */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            
            {/* Boutons d'authentification sociale */}
            <div className="p-8 pb-6 space-y-4">
              <div className="space-y-3">
                <SocialAuthButton
                  provider="google"
                  onClick={handleGoogleAuth}
                  loading={socialLoading.google}
                />
                <SocialAuthButton
                  provider="apple"
                  onClick={handleAppleAuth}
                  loading={socialLoading.apple}
                />
                <SocialAuthButton
                  provider="facebook"
                  onClick={handleFacebookAuth}
                  loading={socialLoading.facebook}
                />
              </div>
              
              {/* Séparateur */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500 font-medium">OU</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fadeIn">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Champ email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                  Adresse email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <AtSymbolIcon className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-sm"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              {/* Champ mot de passe */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Mot de passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    onChange={handleChange}
                    className="block w-full pl-12 pr-12 py-4 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="text-right">
                  <Link href="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>

              {/* Bouton de connexion */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] ${
                    isLoading ? 'opacity-75 cursor-not-allowed scale-100' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      Se connecter
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Pied de page */}
            <div className="bg-slate-50/50 px-8 py-6 text-center border-t border-slate-200/50 space-y-3">
              <p className="text-sm text-slate-600">
                Pas encore de compte ?{' '}
                <Link href="/register" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                  Créez-en un maintenant
                </Link>
              </p>
              
              <p className="text-sm text-slate-600">
                <Link href="/forgot-password" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                  Mot de passe oublié ?
                </Link>
              </p>
            </div>
          </div>

          {/* Footer avec informations supplémentaires */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              En vous connectant, vous acceptez nos{' '}
              <Link href="/terms" className="text-emerald-600 hover:text-emerald-700 underline">
                conditions d'utilisation
              </Link>
              {' '}et notre{' '}
              <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 underline">
                politique de confidentialité
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </Layout>
  );
}

/////////////////////