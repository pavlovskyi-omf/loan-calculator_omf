import { formatCurrency } from '../domain/currency'

interface SelectedDetailsProps {
  amount: number
  term: number
  monthlyPayment: number
  totalPaid: number
  totalInterest: number
}

export function SelectedDetails({
  amount,
  term,
  monthlyPayment,
  totalPaid,
  totalInterest,
}: SelectedDetailsProps) {
  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-white space-y-4 mt-6">
      <h3 className="text-xl font-semibold text-gray-900">Selected Scenario</h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Loan Amount:</span>
          <span className="font-medium">{formatCurrency(amount)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Term:</span>
          <span className="font-medium">{term} months</span>
        </div>

        <div className="border-t border-gray-200 my-2"></div>

        <div className="flex justify-between">
          <span className="text-gray-600">Monthly Payment:</span>
          <span className="text-2xl font-bold text-blue-600">
            {formatCurrency(monthlyPayment)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Total Paid:</span>
          <span className="font-medium">{formatCurrency(totalPaid)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Total Interest:</span>
          <span className="font-medium text-red-600">
            {formatCurrency(totalInterest)}
          </span>
        </div>
      </div>
    </div>
  )
}
