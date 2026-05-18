import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => (
  <Loader2 className={clsx('animate-spin text-blue-600', sizeMap[size], className)} />
);

export const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Spinner size="lg" />
  </div>
);
