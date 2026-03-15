import { useState } from 'react';

export default function InfoPopover() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block ml-2">
      <button
        onClick={() => setOpen(!open)}
        aria-label="More info"
        className="rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-0.5"
        style={{ fontSize: '1rem', fontWeight: 700 }}
      >
        ?
      </button>
      {open && (
        <div className="absolute z-10 w-64 p-4 mt-2 bg-white dark:bg-zinc-900 border rounded shadow text-sm text-zinc-700 dark:text-zinc-200">
          <b>Forecast Horizon:</b> Number of hours before the target time for which the forecast was published.<br /><br />
          <b>Date Range:</b> Only January 2024 is available.<br /><br />
          <b>Chart:</b> Blue = Actual generation, Green = Forecasted generation. Gaps = missing/unknown forecasts.
        </div>
      )}
    </div>
  );
}
