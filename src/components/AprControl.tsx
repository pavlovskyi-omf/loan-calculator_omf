import { Slider, IconButton } from '@mui/material'
import { Remove, Add } from '@mui/icons-material'

interface AprControlProps {
  apr: number
  onChange: (apr: number) => void
  min: number
  max: number
  step: number
}

export function AprControl({ apr, onChange, min, max, step }: AprControlProps) {
  const handleDecrement = () => {
    if (apr > min) {
      onChange(Math.max(min, apr - step))
    }
  }

  const handleIncrement = () => {
    if (apr < max) {
      onChange(Math.min(max, apr + step))
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-900">{apr}%</div>
        <div className="text-sm text-gray-600 mt-2">Annual Percentage Rate</div>
      </div>

      <div className="flex items-center gap-4">
        <IconButton
          onClick={handleDecrement}
          disabled={apr <= min}
          aria-label="Decrease APR"
        >
          <Remove />
        </IconButton>

        <Slider
          value={apr}
          onChange={(_, value) => onChange(value as number)}
          min={min}
          max={max}
          step={0.1}
          aria-label="APR Slider"
          sx={{ flex: 1 }}
        />

        <IconButton
          onClick={handleIncrement}
          disabled={apr >= max}
          aria-label="Increase APR"
        >
          <Add />
        </IconButton>
      </div>
    </div>
  )
}
