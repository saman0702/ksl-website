import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

// Loading Spinner
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-ksl-red',
        sizeClasses[size],
        className
      )} 
    />
  );
};

// Button
export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-ksl-red text-white hover:bg-ksl-red-dark focus:ring-ksl-red shadow-ksl',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    outline: 'border border-ksl-red text-ksl-red hover:bg-ksl-red hover:text-white focus:ring-ksl-red',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

// Input
export const Input = React.forwardRef(({
  label,
  error,
  hint,
  leftIcon: LeftIcon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-dark-bg-secondary placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ksl-red focus:border-transparent transition-colors duration-200',
            LeftIcon && 'pl-10',
            error && 'border-red-300 dark:border-red-600 focus:ring-red-500',
            className
          )}
          {...props}
        />
      </div>
      {hint && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea
export const Textarea = React.forwardRef(({
  label,
  error,
  hint,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-dark-bg-secondary placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ksl-red focus:border-transparent transition-colors duration-200 resize-vertical',
          error && 'border-red-300 dark:border-red-600 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {hint && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Card
export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-dark-bg-secondary rounded-lg shadow-sm border border-gray-200 dark:border-gray-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Header
export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div
      className={cn(
        'px-6 py-4 border-b border-gray-200 dark:border-gray-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Content
export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={cn('px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Alert
export const Alert = ({ children, variant = 'info', className = '', ...props }) => {
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
  };

  return (
    <div
      className={cn(
        'border rounded-lg p-4',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Modal
export const Modal = ({ isOpen, onClose, children, size = 'max-w-4xl', className = '', title }) => {
  const [show, setShow] = useState(isOpen);
  const [animate, setAnimate] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      // Laisse le temps au composant d'être monté avant d'animer
      setTimeout(() => setAnimate(true), 10);
    } else if (show) {
      setAnimate(false);
      timeoutRef.current = setTimeout(() => setShow(false), 200); // Durée de l'animation
    }
    return () => clearTimeout(timeoutRef.current);
  }, [isOpen]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className={cn(
            'fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-200',
            animate ? 'opacity-100' : 'opacity-0'
          )}
          onClick={onClose}
        />
        <div
          className={cn(
            `relative bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl w-full ${size}`,
            'max-h-[100vh] overflow-y-auto z-50 transition-all duration-200',
            animate
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 translate-y-4',
            className
          )}
        >
          {title && (
            <div className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

// Badge
export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export * from "./Tabs";
export * from "./Select";
export * from "./ProgressBar";
export * from "./Stepper";
export { default as LocationSearch } from './LocationSearch'; 