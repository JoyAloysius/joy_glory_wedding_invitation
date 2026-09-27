import { useEffect, useState } from 'react'
import { SkipLink } from '@/components/SkipLink'
import { ScrollProgress } from '@/components/ScrollProgress'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { OpeningExperience, OPENING_CLOSE_MS } from '@/sections/OpeningExperience'
import { Hero } from '@/sections/Hero'
import { CoupleIntro } from '@/sections/CoupleIntro'
import { OurStory } from '@/sections/OurStory'
import { Countdown } from '@/sections/Countdown'
import { Events } from '@/sections/Events'
import { Venue } from '@/sections/Venue'
import { SaveTheDate } from '@/sections/SaveTheDate'
import { Closing } from '@/sections/Closing'

function App() {
  const [isRevealed, setIsRevealed] = useState(false)
  const [showOpening, setShowOpening] = useState(true)

  useEffect(() => {
    document.body.style.overflow = isRevealed ? '' : 'hidden'
  }, [isRevealed])

  // Unlocks the hero immediately (snappy interaction) and lets the closing visual play
  // for a fixed duration before unmounting — a plain timer, not animation-completion
  // detection, so the invitation always dismisses even if frames get throttled.
  const handleOpen = () => {
    setIsRevealed(true)
    window.setTimeout(() => setShowOpening(false), OPENING_CLOSE_MS)
  }

  return (
    <>
      <SkipLink />

      {showOpening ? <OpeningExperience onOpen={handleOpen} isClosing={isRevealed} /> : null}

      <div inert={!isRevealed} aria-hidden={!isRevealed}>
        <ScrollProgress />
        <Nav />
        <main id="main-content">
          <Hero isRevealed={isRevealed} />
          <CoupleIntro />
          <OurStory />
          <Countdown />
          <Events />
          <Venue />
          <SaveTheDate />
          <Closing />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App
