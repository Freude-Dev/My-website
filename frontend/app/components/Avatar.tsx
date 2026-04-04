import React from 'react';

interface AvatarProps {
  name: string;
  photo?: string;
  alt?: string;
  className?: string;
}

export default function Avatar({ name, photo, alt, className = "" }: AvatarProps) {
  // Get first letter of the name
  const firstLetter = name.charAt(0).toUpperCase();
  
  // Generate a consistent color based on the name
  const getColorFromName = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Check if photo exists and is a valid URL
  if (photo && photo.trim() !== '' && !photo.includes('undefined') && !photo.includes('null')) {
    return (
      <div className={`size-9 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0 ${className}`}>
        <img
          src={photo}
          alt={alt || name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, replace with letter
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.className = `size-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0 ${getColorFromName(name)} ${className}`;
              parent.innerHTML = firstLetter;
            }
          }}
        />
      </div>
    );
  }

  // Show letter avatar when no photo
  return (
    <div 
      className={`size-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0 ${getColorFromName(name)} ${className}`}
    >
      {firstLetter}
    </div>
  );
}
