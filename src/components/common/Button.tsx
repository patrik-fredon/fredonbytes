'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none hover:scale-105 active:scale-95 min-h-[44px]',
  {
    variants: {
      variant: {
        gradient: 'relative bg-neon-purple/50 border-2 border-slate-950/35 rounded-xl shadow-lg inset-shadow-sm inset-shadow-slate-950/80 hover:shadow-slate-950 text-white font-mono',
        'neon-cyan': 'bg-neon-cyan text-terminal-dark border border-neon-cyan/70 hover:shadow-glow-cyan-strong hover:brightness-110 active:brightness-90 font-semibold',
        'neon-purple': 'bg-neon-purple text-white border border-neon-purple/70 hover:shadow-glow-purple-strong hover:brightness-110 active:brightness-90 font-semibold',
        secondary: 'bg-glass-bg backdrop-blur-glass border border-neon-cyan/20 text-terminal-light hover:border-neon-cyan/40 hover:shadow-glow-cyan-subtle hover:bg-glass-bg/90',
        ghost: 'relative bg-neon-cyan/50 border-2 border-slate-950/35 rounded-xl shadow-lg inset-shadow-sm inset-shadow-slate-950/80 hover:shadow-slate-950 text-white font-mono',
        outline: 'border border-neon-cyan/30 bg-transparent text-terminal-light hover:bg-neon-cyan/10 hover:border-neon-cyan/50 hover:shadow-glow-cyan-subtle',
        terminal: 'bg-terminal-dark text-neon-cyan border border-neon-cyan/50 hover:bg-terminal-darker hover:shadow-glow-cyan font-mono',
      },
      size: {
        default: 'h-11 px-4 py-2',
        sm: 'h-10 rounded-md px-3',
        lg: 'h-12 rounded-md px-8',
        xl: 'h-14 rounded-lg px-10 text-base',
        icon: 'h-11 w-11'
      }
    },
    defaultVariants: {
      variant: 'gradient',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Loading"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }