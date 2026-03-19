import { TextField, Button } from '@mui/material'
import { useI18n } from '../i18n'

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
  const { t } = useI18n()
  
  return (
    <div className="space-y-4">
      <div>
        <TextField
          label={t('loanAmount.label')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          error={!!error}
          helperText={error}
          fullWidth
          placeholder={t('loanAmount.placeholder')}
          sx={{ marginBottom: 1 }}
        />
      </div>
      <Button variant="contained" onClick={onCalculate} disabled={disabled} fullWidth size="large">
        {t('loanAmount.button')}
      </Button>
    </div>
  )
}
