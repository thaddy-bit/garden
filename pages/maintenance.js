import Head from 'next/head';
import Image from 'next/image';

export default function Maintenance() {
  return (
    <>
      <Head>
        <title>Maintenance en cours - Garden Dakar</title>
        <meta name="description" content="Site en maintenance, nous serons bientôt de retour" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          {/* Logo et nom de la boutique */}
          <div className="mb-12 flex flex-col items-center justify-center animate-fadeIn">
            <div className="mb-4">
              <Image
                src="/images/garden.png"
                alt="Garden Logo"
                width={120}
                height={120}
                className="object-contain"
                priority
              />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-green-700">
              Garden
            </h2>
            <p className="text-lg text-gray-600 mt-2">Dakar</p>
          </div>

          {/* Animation de chargement */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Titre principal */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 animate-fadeIn">
            Maintenance en cours
          </h1>

          {/* Sous-titre */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 animate-fadeIn delay-100">
            Nous améliorons votre expérience
          </p>

          {/* Message */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-fadeIn delay-200">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              Notre site est temporairement indisponible pour une maintenance programmée.
            </p>
            <p className="text-gray-600">
              Nous travaillons dur pour améliorer nos services et nous serons de retour très bientôt.
            </p>
          </div>

          {/* Informations supplémentaires */}
          <div className="space-y-4 text-gray-500">
            <p className="text-sm">
              Merci de votre patience et de votre compréhension.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Nous serons de retour sous peu</span>
            </div>
          </div>

          {/* Décoration */}
          <div className="mt-12 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    </>
  );
}

