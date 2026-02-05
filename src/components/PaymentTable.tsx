import React from 'react';
import { calculateMonthlyPayment } from '../domain/loanMath';
import { formatCurrency } from '../domain/currency';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

type Props = {
  terms: number[];
  amounts: number[]; // comparison amounts
  aprPercent: number;
  selectedAmountIndex?: number;
  selectedTerm?: number;
  onSelectTerm?: (term: number) => void;
};

const PaymentTable: React.FC<Props> = ({ terms, amounts, aprPercent, selectedAmountIndex = 0, selectedTerm, onSelectTerm }) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table aria-label="payment comparison table">
        <TableHead>
          <TableRow>
            <TableCell>Term</TableCell>
            {amounts.map((amt, idx) => (
              <TableCell key={amt} align="right" aria-current={idx === selectedAmountIndex} className={idx === selectedAmountIndex ? 'text-blue-600' : ''}>
                {formatCurrency(amt)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {terms.map((term) => (
            <TableRow
              key={term}
              hover
              selected={term === selectedTerm}
              tabIndex={0}
              onClick={() => onSelectTerm?.(term)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectTerm?.(term); } }}
              role="button"
              aria-pressed={term === selectedTerm}
              style={{ cursor: 'pointer' }}
            >
              <TableCell component="th" scope="row">{term} months</TableCell>
              {amounts.map((amt) => (
                <TableCell key={amt} align="right">{formatCurrency(Math.round(calculateMonthlyPayment(amt, aprPercent, term)))}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PaymentTable;
