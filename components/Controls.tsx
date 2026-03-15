import { useState } from 'react';

interface ControlsProps {
  startDate: string;
  endDate: string;
  forecastHorizon: number;
  onChange: (opts: { startDate: string; endDate: string; forecastHorizon: number }) => void;
}

export default function Controls({ startDate, endDate, forecastHorizon, onChange }: ControlsProps) {
  // Local UI state, quickly validated since only January 2024 is allowed.
  const JAN_START = '2024-01-01';
  const JAN_END = '2024-01-31';

  const [localStart, setLocalStart] = useState(startDate);
  const [localEnd, setLocalEnd] = useState(endDate);
  const [localHorizon, setLocalHorizon] = useState(forecastHorizon);

  // Utility for range validation
  const clamp = (date: string) => (date < JAN_START ? JAN_START : date > JAN_END ? JAN_END : date);

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 w-full py-4 px-2">
      <div className="flex flex-col gap-2">

        <div className="flex gap-2">
          <input
            type="date"
            min={JAN_START}
            max={JAN_END}
            value={localStart}
            className="rounded border px-2 py-1"
            onChange={e => {
              const value = clamp(e.target.value);
              setLocalStart(value);
              if (value > localEnd) setLocalEnd(value);
              onChange({ startDate: value, endDate: localEnd, forecastHorizon: localHorizon });
            }}
          />
          <span className="px-1">to</span>
          <input
            type="date"
            min={localStart}
            max={JAN_END}
            value={localEnd}
            className="rounded border px-2 py-1"
            onChange={e => {
              const value = clamp(e.target.value);
              setLocalEnd(value);
              if (value < localStart) setLocalStart(value);
              onChange({ startDate: localStart, endDate: value, forecastHorizon: localHorizon });
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium">Forecast Horizon (hours)</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={48}
            step={1}
            value={localHorizon}
            className="w-32"
            onChange={e => {
              const value = Number(e.target.value);
              setLocalHorizon(value);
              onChange({ startDate: localStart, endDate: localEnd, forecastHorizon: value });
            }}
          />
          <span className="min-w-[2rem] text-center">{localHorizon}h</span>
        </div>
      </div>
    </div>
  );
}
