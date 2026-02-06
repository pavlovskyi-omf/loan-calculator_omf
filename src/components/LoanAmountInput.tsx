import { TextField, Button } from '@mui/material'

interface LoanAmountInputProps {
  value: string
  onChange: (value: string) => void
  onCalculate: () => void
  error?: string
  disabled: boolean
}

export function LoanAmountInput({
  value,
  onChange,
  onCalculate,
  error,
  disabled,
}: LoanAmountInputProps) {
  return (
    <div className="space-y-4">
      <div>
        <TextField
          label="Loan Amount"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          error={!!error}
          helperText={error}
          fullWidth
          placeholder="$7,000"
          sx={{ marginBottom: 1 }}
        />
      </div>
      <Button
        variant="contained"
        onClick={onCalculate}
        disabled={disabled}
        fullWidth
        size="large"
      >
        Calculate
      </Button>
    </div>
  )
}
