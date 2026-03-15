"use client";
import { useState, useEffect } from "react";
import Controls from "../components/Controls";
import ForecastChart, { ActualsPoint, ForecastPoint } from "../components/ForecastChart";

const JAN_START = "2024-01-01";
const JAN_END = "2024-01-31";

export default function Home() {
  const [startDate, setStartDate] = useState(JAN_START);
  const [endDate, setEndDate] = useState(JAN_END);
  const [forecastHorizon, setForecastHorizon] = useState(4); // default 4hrs

  const [actuals, setActuals] = useState<ActualsPoint[]>([]);
  const [forecasts, setForecasts] = useState<ForecastPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        // Fetch actuals
        const acRes = await fetch(`/api/actuals?startDate=${startDate}&endDate=${endDate}`);
        const acData = await acRes.json();
        // Fetch forecasts
        const fcRes = await fetch(`/api/forecasts?startDate=${startDate}&endDate=${endDate}&forecastHorizon=${forecastHorizon}`);
        const fcData = await fcRes.json();
        setActuals(acData.actuals || []);
        setForecasts(fcData.forecasts || []);

      } catch (err: any) {
        setError("Failed to fetch data: " + (err.message || err.toString()));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, forecastHorizon]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <header className="w-full max-w-3xl pt-8 pb-2 px-4 text-center">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50 leading-snug tracking-tight">
          UK Wind Power Forecast Monitoring
        </h1>
        <p className="text-zinc-600 dark:text-zinc-300 mt-2">
          Compare actual and forecasted national wind power generation for January 2024
        </p>
      </header>
      <main className="w-full max-w-3xl flex flex-col items-center py-4 px-4">
        <Controls
          startDate={startDate}
          endDate={endDate}
          forecastHorizon={forecastHorizon}
          onChange={({ startDate, endDate, forecastHorizon }) => {
            setStartDate(startDate);
            setEndDate(endDate);
            setForecastHorizon(forecastHorizon);
          }}
        />
        <div className="w-full mt-4">
          <ForecastChart
            actuals={actuals}
            forecasts={forecasts}
            loading={loading}
            error={error || undefined}
          />
        </div>
      </main>
      <footer className="w-full max-w-3xl mt-4 px-4 pb-8 text-center text-xs text-zinc-400 dark:text-zinc-600">
        Data: Elexon BMRS | Demo app by candidate (2024)
      </footer>
    </div>
  );
}
