import { useEffect } from 'react'

interface NotificationsProps {
  message: string | null
  onClose: () => void
}

export function Notifications({ message, onClose }: NotificationsProps) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => onClose(), 5000)
    return () => clearTimeout(t)
  }, [message, onClose])

  if (!message) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 right-4 bg-white border border-gray-200 shadow px-4 py-2 rounded"
    >
      <div className="text-sm text-gray-800">{message}</div>
    </div>
  )
}

export default Notifications
