export interface ShareOptions {
  title: string
  text: string
  url: string
}

/** Uses the Web Share API when available (mainly mobile), else copies the link. */
export async function shareInvitation(options: ShareOptions): Promise<'shared' | 'copied' | 'failed'> {
  if (navigator.share) {
    try {
      await navigator.share(options)
      return 'shared'
    } catch {
      // Fall through to clipboard copy (e.g. the user cancelled the share sheet is not
      // an error worth surfacing, but an unsupported/blocked share should still try).
    }
  }

  try {
    await navigator.clipboard.writeText(options.url)
    return 'copied'
  } catch {
    return 'failed'
  }
}
