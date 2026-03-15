# UK Wind Power Forecast Monitoring & Analysis

A full stack application and analysis suite to monitor, compare, and critically evaluate national wind power forecasts against actual generation in the United Kingdom. Delivers both an interactive dashboard for end users and industry-quality analytical notebooks.

---

## Contents
- [Features](#features)
- [Directory Structure](#directory-structure)
- [How to Run the App](#how-to-run-the-app)
- [Analysis (Jupyter Notebooks)](#analysis-jupyter-notebooks)
- [Deployment](#deployment)
- [AI Tooling Notice](#ai-tooling-notice)

---

## Features

**Forecast Monitoring Application**
- Visualize & compare actual vs forecasted wind power (Jan 2024).
- Configurable date range and forecast horizon.
- Chart with tooltips, download and loading states.
- Responsive, accessible UI (mobile & desktop).
- Robust backend fetches real Elexon BMRS API data (FUELHH for actuals, WINDFOR for forecast).

**Professional Analysis**
- Jupyter notebooks for open-ended statistical error analysis and wind power reliability.
- Step-by-step markdown commentary, exploration, recommendations.

---

## Directory Structure
```plaintext
/ (project root)
│
├─ app/                 # Next.js app directory (frontend, API routes)
│   ├─ api/actuals/     # Server route for actual wind generation
│   ├─ api/forecasts/   # Server route for forecasted generation
│   └─ ...
├─ components/          # UI components (React/TypeScript)
├─ notebooks/           # Jupyter notebooks for statistical analysis
├─ public/              # Static assets
├─ package.json         # Dependencies + scripts
└─ README.md            # (This file)
```

---

## How to Run the App

### **Locally (Development)**

1. **Install dependencies**
```bash
npm install
```

2. **Run the app**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### **API Endpoints Used**
- Actuals: [Elexon FUELHH](https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH/stream?publishDateTimeFrom=2024-01-01T00:00:00Z&publishDateTimeTo=2024-01-31T23:59:59Z&fuelType=WIND)
- Forecasts: [Elexon WINDFOR](https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR/stream?publishDateTimeFrom=2024-01-01&publishDateTimeTo=2024-01-31)

### **Environment Variables**
- No secrets needed for public dataset, but you may use `NEXT_PUBLIC_API_ROOT` for custom deployments if desired.

---

## Analysis (Jupyter Notebooks)

Jupyter notebooks are provided in `/notebooks/` for:

- **Forecast Error Analysis:**
  - Loads Jan 2024 actual and forecast data
  - Computes mean/median/p99 error, error vs horizon, time-of-day effects
  - Markdown explanations & visualizations

- **Wind Reliability Analysis:**
  - Assesses minimum, median, and high-percentile available wind capacity
  - Recommends reliable MW for meeting demand
  - Fully explained thought process

### **To run notebooks**
You can:
- Use [Google Colab](https://colab.research.google.com/) (simply upload or open from GitHub repo)
- Or run locally:
  ```bash
  cd notebooks/
  jupyter lab
  # then open the notebook in browser
  ```

---

## Deployment

- **Recommended:** [Vercel](https://vercel.com/) for zero-config Next.js deployment.
- Or use Heroku/Netlify, ensure Node 18+ and public internet access.
- Add resulting deploy URL here:
  - PROD: `https://forecast-monitoring-smoky.vercel.app/`

---

## AI Tooling Notice
- AI tools (such as ChatGPT, Copilot, or others) were used primarily for code scaffolding, best practice reference, and error fixing, in line with project guidance.
- Final analysis, notebook logic, and all reasoning/reflection are 100% original and explained by the candidate.

---

## Contact
**Candidate:** _<Swaraj Mhashakhetri>_

---

**© UK Wind Power Forecast Monitoring Challenge**
