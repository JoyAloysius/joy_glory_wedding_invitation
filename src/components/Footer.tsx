import { wedding } from '@/data/wedding'
import { Reveal } from './Reveal'

export function Footer() {
  return (
    <footer className="bg-maroon-dark py-8 text-center text-ivory/50">
      <Reveal viewportMargin="0px">
        <p className="font-body text-xs tracking-wide">
          &copy; {new Date().getFullYear()} {wedding.couple.combinedNames} &mdash; Made with love for our
          wedding celebrations.
        </p>
      </Reveal>
    </footer>
  )
}
