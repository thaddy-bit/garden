import React from 'react';
import { 
  Chrome, 
  Apple, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail,
  Loader2
} from 'lucide-react';

const SocialAuthButton = ({ 
  provider, 
  onClick, 
  loading = false, 
  disabled = false,
  className = ""
}) => {
  const getProviderConfig = (provider) => {
    const configs = {
      google: {
        name: 'Google',
        icon: Chrome,
        bgColor: 'bg-white',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-300',
        hoverColor: 'hover:bg-gray-50',
        iconColor: 'text-red-500'
      },
      apple: {
        name: 'Apple',
        icon: Apple,
        bgColor: 'bg-black',
        textColor: 'text-white',
        borderColor: 'border-black',
        hoverColor: 'hover:bg-gray-900',
        iconColor: 'text-white'
      },
      facebook: {
        name: 'Facebook',
        icon: Facebook,
        bgColor: 'bg-blue-600',
        textColor: 'text-white',
        borderColor: 'border-blue-600',
        hoverColor: 'hover:bg-blue-700',
        iconColor: 'text-white'
      },
      twitter: {
        name: 'Twitter',
        icon: Twitter,
        bgColor: 'bg-sky-500',
        textColor: 'text-white',
        borderColor: 'border-sky-500',
        hoverColor: 'hover:bg-sky-600',
        iconColor: 'text-white'
      },
      linkedin: {
        name: 'LinkedIn',
        icon: Linkedin,
        bgColor: 'bg-blue-700',
        textColor: 'text-white',
        borderColor: 'border-blue-700',
        hoverColor: 'hover:bg-blue-800',
        iconColor: 'text-white'
      },
      microsoft: {
        name: 'Microsoft',
        icon: Mail,
        bgColor: 'bg-gray-600',
        textColor: 'text-white',
        borderColor: 'border-gray-600',
        hoverColor: 'hover:bg-gray-700',
        iconColor: 'text-white'
      }
    };
    return configs[provider] || configs.google;
  };

  const config = getProviderConfig(provider);
  const IconComponent = config.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        w-full flex items-center justify-center gap-3 px-6 py-4 
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        border-2 rounded-xl font-semibold text-sm
        ${config.hoverColor} transition-all duration-200
        transform hover:scale-[1.02] hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2
        focus:ring-emerald-500/50
        ${disabled || loading ? 'opacity-50 cursor-not-allowed scale-100' : ''}
        ${className}
      `}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
      )}
      <span>
        {loading ? 'Connexion...' : `Se connecter avec ${config.name}`}
      </span>
    </button>
  );
};

export default SocialAuthButton;


