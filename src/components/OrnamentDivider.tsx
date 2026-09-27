import { asset } from '@/utils/asset'

export function OrnamentDivider({ className = '' }: { className?: string }) {
  return (
    <img
      src={asset('assets/images/ornament-divider.webp')}
      alt=""
      aria-hidden="true"
      width={900}
      height={45}
      loading="lazy"
      className={`h-auto w-28 opacity-80 sm:w-36 ${className}`}
    />
  )
}
