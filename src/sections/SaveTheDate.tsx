import { useState } from 'react'
import { CalendarPlus, Download, Share2, Check } from 'lucide-react'
import { Section } from '@/components/Section'
import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/Button'
import { MonthCalendar } from '@/components/MonthCalendar'
import { SparkleAccents } from '@/components/SparkleAccents'
import { wedding } from '@/data/wedding'
import { buildIcsContent, downloadIcs } from '@/utils/ics'
import { buildGoogleCalendarUrl, buildOutlookCalendarUrl } from '@/utils/calendarLinks'
import { shareInvitation } from '@/utils/share'

type ShareState = 'idle' | 'shared' | 'copied' | 'failed'

export function SaveTheDate() {
  const [shareState, setShareState] = useState<ShareState>('idle')
  const primaryEvent = wedding.events.find((event) => event.isPrimary) ?? wedding.events[0]

  const handleDownloadIcs = () => {
    const content = buildIcsContent(wedding.events, window.location.href)
    downloadIcs('joy-and-glory-wedding.ics', content)
  }

  const handleShare = async () => {
    const result = await shareInvitation({
      title: wedding.social.shareTitle,
      text: wedding.social.shareText,
      url: window.location.href,
    })
    setShareState(result)
    setTimeout(() => setShareState('idle'), 2500)
  }

  const shareLabel = shareState === 'copied' ? 'Link Copied!' : shareState === 'shared' ? 'Shared!' : 'Share Invitation'

  return (
    <Section id="save-the-date" tone="maroon" ariaLabel="Save the date" className="overflow-hidden">
      <SparkleAccents count={16} />
      <Container className="relative flex flex-col items-center text-center">
        <SectionHeading title="Save the Dates" tone="inverted" />

        <Reveal className="mt-4 max-w-lg font-accent text-lg italic text-ivory/80">
          <p>{wedding.messages.blessing}</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex w-full flex-col items-center">
          <MonthCalendar year={2026} month={10} highlightedDays={[25, 28]} />
        </Reveal>

        <Reveal delay={0.2} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button onClick={handleDownloadIcs} icon={<Download size={16} aria-hidden="true" />}>
            Download Calendar (.ics)
          </Button>
          <Button
            href={buildGoogleCalendarUrl(primaryEvent)}
            target="_blank"
            rel="noreferrer"
            variant="outlineLight"
            icon={<CalendarPlus size={16} aria-hidden="true" />}
          >
            Google Calendar
          </Button>
          <Button
            href={buildOutlookCalendarUrl(primaryEvent)}
            target="_blank"
            rel="noreferrer"
            variant="outlineLight"
            icon={<CalendarPlus size={16} aria-hidden="true" />}
          >
            Outlook Calendar
          </Button>
          <Button
            onClick={handleShare}
            variant="outlineLight"
            icon={shareState === 'idle' ? <Share2 size={16} aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}
          >
            {shareLabel}
          </Button>
        </Reveal>

        <p role="status" className="sr-only">
          {shareState === 'copied' ? 'Invitation link copied to clipboard' : ''}
          {shareState === 'shared' ? 'Invitation shared successfully' : ''}
        </p>

        {shareState === 'failed' ? (
          <p role="alert" className="mt-3 font-body text-sm text-rose">
            Couldn&rsquo;t share automatically — please copy the page link from your browser.
          </p>
        ) : null}
      </Container>
    </Section>
  )
}
