import { asset } from '@/utils/asset'

interface MonogramSealProps {
  className?: string
  size?: number
}

/** The couple's gold "JG" monogram crest — used in the opening envelope, hero, and footer. */
export function MonogramSeal({ className = '', size = 96 }: MonogramSealProps) {
  return (
    <img
      src={asset('assets/images/monogram-jg.webp')}
      alt="Joy and Glory monogram"
      width={size}
      height={Math.round(size * (745 / 720))}
      loading="eager"
      className={className}
      style={{ width: size, height: 'auto' }}
    />
  )
}
