// React default import not required with the new JSX transform

interface RateStatusBadgeProps {
  status: 'ok' | 'cached' | 'fallback' | 'error' | ''
}

export function RateStatusBadge({ status }: RateStatusBadgeProps) {
  if (!status) return null

  let text = ''
  let classes = 'px-2 py-0.5 rounded text-xs '

  switch (status) {
    case 'ok':
      text = 'Rates: Live'
      classes += 'bg-green-100 text-green-800'
      break
    case 'cached':
      text = 'Rates: Cached'
      classes += 'bg-yellow-100 text-yellow-800'
      break
    case 'fallback':
    case 'error':
      text = 'Rates: Unavailable'
      classes += 'bg-red-100 text-red-800'
      break
    default:
      return null
  }

  return (
    <span role="status" aria-label={`exchange-rates-${status}`} title={text} className={classes}>
      {text}
    </span>
  )
}

export default RateStatusBadge
