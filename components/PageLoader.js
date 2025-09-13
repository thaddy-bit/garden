import Image from "next/image";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        {/* Logo Garden avec animation */}
        <div className="relative">
          <div className="w-16 h-16 relative">
            <Image
              src="/images/garden.png"
              alt="Garden Logo"
              width={64}
              height={64}
              className="animate-spin"
              style={{ animationDuration: '2s' }}
            />
          </div>
          {/* Jauge de progression verte foncée */}
          <div className="absolute inset-0 w-16 h-16">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
              {/* Cercle de fond */}
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-gray-200"
              />
              {/* Cercle de progression */}
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray="175.9"
                strokeDashoffset="175.9"
                className="text-green-600 animate-pulse"
                style={{
                  strokeDashoffset: '87.95',
                  animation: 'progress 1.5s ease-in-out infinite'
                }}
              />
            </svg>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 font-medium">Chargement en cours...</p>
        
        <style jsx>{`
          @keyframes progress {
            0% { stroke-dashoffset: 175.9; }
            50% { stroke-dashoffset: 43.975; }
            100% { stroke-dashoffset: 175.9; }
          }
        `}</style>
      </div>
    </div>
  );
}