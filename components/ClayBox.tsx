import React from 'react';
import { cn } from '@/lib/utils';

interface ClayBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const ClayBox = ({ children, className = '', ...props }: ClayBoxProps) => {
  return (
    <div
      className={cn(
        'bg-[#e0e5ec] shadow-[10px_10px_20px_#d1d9e6,_-10px_-10px_20px_#ffffff] rounded-[1.5rem] p-4 border border-gray-200 backdrop-blur-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

