import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AprControl from '../src/components/AprControlNew';

describe('AprControl', () => {
  it('displays the current APR and calls onChange when plus/minus clicked', async () => {
    const onChange = vi.fn();
    const { container } = render(<AprControl apr={5} onChange={onChange} />);

    expect(container.textContent).toContain('5%');

    const inc = screen.getByLabelText('increase-apr');
    const dec = screen.getByLabelText('decrease-apr');

    await userEvent.click(inc);
    expect(onChange).toHaveBeenCalledWith(6);

    await userEvent.click(dec);
    // dec from 5 should call 4 (note: component uses Math.round(apr))
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('calls onChange when slider is moved', async () => {
    const onChange = vi.fn();
    const { container } = render(<AprControl apr={10} onChange={onChange} />);
    const slider = container.querySelector('input[aria-label="apr-slider"]') as HTMLInputElement;

    // simulate user moving slider to 12 via change event
    if (slider) {
      fireEvent.change(slider, { target: { value: '12' } });
    }

    expect(onChange).toHaveBeenCalledWith(12);
  });
});
