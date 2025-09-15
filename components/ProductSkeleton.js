import React from 'react';

export default function ProductSkeleton({ type = 'medium' }) {
  const getHeight = () => {
    switch (type) {
      case 'large': return 'h-80';
      case 'medium': return 'h-64';
      case 'small': return 'h-48';
      default: return 'h-64';
    }
  };

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse ${
      type === 'large' ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1'
    }`}>
      {/* Image skeleton */}
      <div className={`${getHeight()} bg-gray-200`}></div>
      
      {/* Content skeleton */}
      <div className={`p-6 ${type === 'large' ? 'p-8' : ''}`}>
        {/* Brand */}
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        
        {/* Title */}
        <div className={`bg-gray-200 rounded mb-3 ${
          type === 'large' ? 'h-8' : 'h-6'
        }`}></div>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        
        {/* Price */}
        <div className={`bg-gray-200 rounded mb-4 ${
          type === 'large' ? 'h-8 w-32' : 'h-6 w-24'
        }`}></div>
        
        {/* Stock */}
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
}



