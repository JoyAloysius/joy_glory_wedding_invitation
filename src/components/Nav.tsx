import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { MonogramSeal } from './MonogramSeal'
import { wedding } from '@/data/wedding'

const NAV_LINKS = [
  { href: '#hero', label: 'Home' },
  { href: '#couple', label: 'Couple' },
  { href: '#our-story', label: 'Story' },
  { href: '#events', label: 'Events' },
  { href: '#venue', label: 'Venue' },
  { href: '#save-the-date', label: 'Save the Date' },
]

export function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        isScrolled ? 'bg-ivory/90 shadow-soft backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <a href="#hero" className="flex items-center gap-2 font-display text-lg text-maroon transition-opacity duration-300 hover:opacity-75">
          <MonogramSeal size={36} />
          <span className="hidden sm:inline">{wedding.couple.combinedNames}</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative py-1 font-body text-sm font-medium text-maroon/80 transition-colors hover:text-maroon"
            >
              {link.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-300 ease-out group-hover:scale-x-100" aria-hidden="true" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="rounded-full p-2 text-maroon lg:hidden"
          >
            {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.nav
            id="mobile-nav"
            aria-label="Primary"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-ivory/95 backdrop-blur-md lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 pb-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-3 font-body text-base text-maroon hover:bg-gold/10"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
