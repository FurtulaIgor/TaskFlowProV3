import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
        ghost: 'hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',
        link: 'underline-offset-4 hover:underline text-blue-600 focus:ring-blue-500',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md text-sm',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, children, disabled, ...props }, ref) => {
    const Comp = 'button';
    const buttonClasses = cn(buttonVariants({ variant, size, fullWidth, className }));

    return (
      <Comp
        className={buttonClasses}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner size="sm" className="mr-2" />
            {children}
          </div>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };