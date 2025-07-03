import React from 'react';
import { cn } from '@/lib/utils';

interface ClayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const ClayButton = ({ children, className = '', ...props }: ClayButtonProps) => {
  return (
    <button
      className={cn(
        'bg-[#e0e5ec] shadow-[10px_10px_20px_#d1d9e6,_-10px_-10px_20px_#ffffff] hover:shadow-inner rounded-full px-6 py-2 text-black font-semibold transition duration-200',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
