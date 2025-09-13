import { useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Email envoyé !
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                Si cet email existe dans notre système, vous recevrez un lien de réinitialisation dans quelques minutes.
              </p>
              
              <div className="space-y-4">
                <Link
                  href="/login"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
                >
                  Retour à la connexion
                </Link>
                
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
                >
                  Demander un autre lien
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Mot de passe oublié ?
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm transition-colors duration-300"
                placeholder="Votre adresse email"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </div>
                ) : (
                  'Envoyer le lien de réinitialisation'
                )}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="font-medium text-green-600 hover:text-green-500 transition-colors duration-300"
              >
                Retour à la connexion
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
