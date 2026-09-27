# Moda In Europe — AI Shopping & Voice Concierge Storefront

A high-fidelity European e-commerce web application inspired by [Moda In Europe](https://modaineurope.com/), featuring real-time AI voice concierge, intelligent single-product query understanding, rich voice console product cards, multi-turn clinical expert consultation scheduling, and a verified European wakefulness medications catalog with domestic dispatch.

---

## 🌟 Key Architecture & Features

### 1. Production-Ready Free Deployment (Vercel)
* **Zero-Cost Hosting**: Optimized for Vercel Hobby Free Tier.
* **SPA Direct Navigation**: `vercel.json` wildcard rewrite (`/(.*) -> /index.html`) ensures direct deep links (such as `/product/nike-air-max-270` or `/product/modalert-100mg`) load instantly without 404 errors.
* **HTTPS Microphone Permissions**: Production `Permissions-Policy: microphone=(self), camera=(), geolocation=()` header enables clean browser audio capture across mobile, tablet, and desktop.
* **Complete Static SEO Assets**: Pre-rendered `robots.txt`, dynamic `sitemap.xml`, vector `favicon.svg`, and PWA `site.webmanifest` in `public/`.

### 2. Single-Product Query Understanding & Dynamic Rich Cards
* **Exact Identification**: AI detects single product queries by name (*"Tell me about Nike Air Max 270"*, *"Is Modalert 200mg in stock?"*, *"What sizes are available?"*).
* **Console Rich Card**: Spawns dynamic product card inside `#consoleProductDisplayArea` with category image, pricing, stock badge, review rating, bullet features, and 3 action CTAs (**View Product**, **Buy / Select Product**, **Ask About This Product**).
* **100% Reliable SVG Fallbacks**: Inline vector SVG placeholders for footwear, medications, skincare, and general products prevent broken image boxes.

### 3. Voice & Audio Quality Pipeline
* **Zero External Paid Dependencies**: Works 100% out of the box using standard browser Web Audio, Web Speech, and an intelligent client-side `MultilingualIntentRouter` supporting English, French, German, and Hindi/Hinglish.
* **Clean Microphone Capture**: Hardware-accelerated Acoustic Echo Cancellation (AEC), noise suppression, automatic gain control (AGC), and an 80Hz rumble high-pass filter.
* **Instant Barge-In**: Sub-100ms interruption cutoff when user speaks during AI playback.
* **Optional Cloud Speech**: Seamlessly switches to Vapi Web SDK if `VITE_VAPI_API_KEY` is provided in environment variables.

---

## 🧪 Automated Test Suite (90 / 90 Tests Passed — 100%)

Run all 5 acceptance and regression test suites:
```bash
npm test
```

### Test Coverage Breakdown:
1. **Audio & Voice Quality Suite** (`scripts/runTests.ts` — 11/11 Passed):
   * Quiet room speech recognition, fan noise filtering, 16 vs 60 quantity disambiguation.
   * Mobile constraints (mono, AEC, AGC, 16kHz) and headphone feedback isolation.
   * Barge-in interruption (<100ms halt) and natural hang-time turn finalization.
2. **Frontend & Voice UX Suite** (`scripts/testFrontendVoiceUx.ts` — 21/21 Passed):
   * Dynamic time-based greetings, multilingual following (EN, FR, DE, HI).
   * Contextual price memory, authentication gating, pending cart preservation.
3. **Final Refinements Suite** (`scripts/testFinalRefinements.ts` — 24/24 Passed):
   * Header navigation (exactly 5 items), 12 authentic European medications.
   * Single product PDP context awareness, site logistics & contact knowledge.
   * 10-step multi-turn consultation booking flow.
4. **Single Product Experience Suite** (`scripts/testSingleProductExperience.ts` — 15/15 Passed):
   * Specific product queries, dynamic rich cards, dedicated PDP navigation.
   * Category SVG fallback images, multi-product vs single-product distinction.
5. **Production Readiness Suite** (`scripts/testProductionReadiness.ts` — 19/19 Passed):
   * `vercel.json` SPA rewrites, permissions policy, `.env.example` hygiene.
   * Direct pathname deep linking, production SEO meta tags, zero localhost references.

---

## 🚢 Step-by-Step Free Vercel Deployment Guide

### Step 1: Push Code to GitHub
1. Initialize git and commit all project files:
   ```bash
   git add .
   git commit -m "Production release ready for free Vercel deployment"
   ```
2. Create a new repository on [GitHub](https://github.com/new) (e.g. `modaineurope-voice-store`).
3. Link and push your repository:
   ```bash
   git remote add origin https://github.com/<YOUR-USERNAME>/modaineurope-voice-store.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Import into Vercel
1. Log in to [Vercel](https://vercel.com) using your GitHub account (Hobby Free Plan).
2. Click **Add New...** $\rightarrow$ **Project**.
3. Select your GitHub repository (`modaineurope-voice-store`) and click **Import**.

### Step 3: Configure Build & Output Settings
Vercel automatically detects Vite from `package.json` and `vercel.json`:
* **Framework Preset**: Vite
* **Root Directory**: `./`
* **Build Command**: `npm run build`
* **Output Directory**: `dist`

### Step 4: Configure Environment Variables (Optional)
Under the **Environment Variables** section in the Vercel import modal, add any desired variables:
* `VITE_APP_URL`: `https://<YOUR-PROJECT-NAME>.vercel.app` (or leave blank to auto-detect).
* `VITE_SITE_NAME`: `Moda In Europe`
* `VITE_VAPI_API_KEY`: *(Optional)* Your public Vapi API key if using cloud voice; leave empty to use the built-in free browser voice engine.

### Step 5: Deploy
1. Click **Deploy**.
2. Vercel will run `tsc && vite build`, bundle assets, apply caching headers, and deploy to their global Edge CDN in ~30 seconds.
3. Once complete, you will receive your free production URL: `https://<your-project-name>.vercel.app`.
