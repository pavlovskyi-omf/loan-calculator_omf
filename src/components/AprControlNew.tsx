import React from 'react';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

type Props = {
  apr: number;
  onChange: (newApr: number) => void;
  min?: number;
  max?: number;
};

export const AprControlNew: React.FC<Props> = ({ apr, onChange, min = 0, max = 36 }) => {
  const dec = () => onChange(Math.max(min, Math.round(apr) - 1));
  const inc = () => onChange(Math.min(max, Math.round(apr) + 1));

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <IconButton aria-label="decrease-apr" size="small" onClick={dec}>
          <RemoveIcon fontSize="small" />
        </IconButton>
        <div className="text-2xl font-bold" aria-live="polite" aria-atomic="true">{Math.round(apr)}%</div>
        <IconButton aria-label="increase-apr" size="small" onClick={inc}>
          <AddIcon fontSize="small" />
        </IconButton>
      </div>
      <div className="mt-2">
        <Slider
          value={Math.round(apr)}
          min={min}
          max={max}
          step={1}
          onChange={(_, val) => onChange(Number(val))}
          aria-label="apr-slider"
        />
      </div>
    </div>
  );
};

export default AprControlNew;
