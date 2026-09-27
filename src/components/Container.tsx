import type { ReactNode } from 'react'

export function Container({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>
}
