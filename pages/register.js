'use client';

import { useState } from "react";
import { useRouter } from "next/router";
import Layout from '../components/Layout';
import { UserIcon, PhoneIcon, AtSymbolIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Register() {

  const [form, setForm] = useState({ nom: "", prenom: "", telephone: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation des mots de passe
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    // Validation de la longueur du mot de passe
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setIsLoading(false);
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      setError("Erreur d'inscription. Veuillez vérifier vos informations.");
      setIsLoading(false);
      return;
    }

    router.push("/login");
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
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Créer un compte</h1>
            <p className="text-slate-600 text-sm">Rejoignez notre communauté professionnelle</p>
          </div>

          {/* Carte d'inscription */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
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

              {/* Champs nom et prénom */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="prenom" className="block text-sm font-semibold text-slate-700">
                    Prénom
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      id="prenom"
                      name="prenom"
                      type="text"
                      required
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-sm"
                      placeholder="Votre prénom"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="nom" className="block text-sm font-semibold text-slate-700">
                    Nom
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      id="nom"
                      name="nom"
                      type="text"
                      required
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-sm"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
              </div>

              {/* Champ téléphone */}
              <div className="space-y-2">
                <label htmlFor="telephone" className="block text-sm font-semibold text-slate-700">
                  Téléphone
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    required
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-sm"
                    placeholder="+221 78 867 78 76"
                  />
                </div>
              </div>

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
                    autoComplete="new-password"
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
                <p className="text-xs text-slate-500">Minimum 6 caractères</p>
              </div>

              {/* Champ confirmation mot de passe */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700">
                  Confirmez le mot de passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    onChange={handleChange}
                    className="block w-full pl-12 pr-12 py-4 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Bouton d'inscription */}
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
                      Création du compte...
                    </>
                  ) : (
                    <>
                      Créer mon compte
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Pied de page */}
            <div className="bg-slate-50/50 px-8 py-6 text-center border-t border-slate-200/50">
              <p className="text-sm text-slate-600">
                Déjà un compte ?{' '}
                <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                  Connectez-vous
                </Link>
              </p>
            </div>
          </div>

          {/* Footer avec informations supplémentaires */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              En créant un compte, vous acceptez nos{' '}
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
    </Layout>
  );
}

///////////////////////////