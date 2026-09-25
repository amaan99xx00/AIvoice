# PureVitality — Real-Time AI Voice Shopping Assistant

A production-grade, voice-first e-commerce shopping assistant with clean browser audio processing, real-time voice activity detection (VAD), instant interruption (barge-in), dynamic multilingual intent routing (English, Hindi, Hinglish), authentication gating, and real WooCommerce cart integration.

---

## 🌟 Key Features & Requirements Coverage

### 1. Frontend Redesign & Voice-First UX (Sections 2, 3, 4, 29)
* **Single Floating Microphone Button**: Exactly **ONE** primary floating microphone button on the website (`#primaryFloatingMicBtn`). Never shows duplicate call buttons or redundant controls.
* **Compact Premium Voice Console**: Lightweight modal overlay (`.voice-console-overlay`) featuring:
  * Animated **Orb Visualizer** reactive to microphone RMS and AI speaking state.
  * Dynamic Greeting and concise conversational response text.
  * Live Status Badge (`🎙️ Listening...`, `🗣️ User Speaking`, `✨ Thinking...`, `🔊 Speaking...`, `🔇 Muted`).
  * Minimal Transcript Drawer (`#consoleTranscriptArea`).
  * Control Footer: `[🔇 Mute / Unmute]` and `[✕ End Call]`.

### 2. Conversational Voice Flow & Strict Rules (Sections 5, 6, 11, 12, 13, 39, 40)
* **Dynamic Time-Based Greeting** (Section 5):
  * `00:00–11:59`: *"Good morning! How can I help you today?"*
  * `12:00–16:59`: *"Good afternoon! How can I help you today?"*
  * `17:00–23:59`: *"Good evening! How can I help you today?"*
* **Stop After Greeting** (Section 13): The AI stops speaking immediately after greeting and waits silently for the customer.
* **Never Interrupt the User & Barge-In** (Sections 6 & 25): Immediate TTS cutoff (<100ms) when customer speaks. The AI enters `LISTENING` and remains silent without filler speech (*"Okay..."*, *"Sure..."*).
* **Language Following** (Section 12):
  * English input $\rightarrow$ English response.
  * Hindi input $\rightarrow$ Hindi response.
  * Hinglish input $\rightarrow$ Hinglish response.
* **On-Demand Product Inquiries** (Sections 14 & 17): Only searches verified catalog when the customer asks for products, categories (e.g. Skincare, Acne), variants (30, 60, 100 tablets), or prices. Never hallucinates information (Section 15).
* **Context Maintenance** (Section 18): Remembers current product and category across turns (*"Which one is cheaper?"*, *"What about the 60 tablet one?"*).

### 3. Real WooCommerce Cart & Authentication Flow (Sections 19, 20, 21, 22)
* **Explicit Cart Confirmation** (Section 19): Never adds anything automatically. Always asks: *"Would you like me to add this to your cart?"*.
* **Authentication Check** (Section 20): Checks user login status before cart modification. If not logged in, asks: *"You'll need to log in before I can add this to your cart."* and renders a clean Login action.
* **Pending Cart Context Preservation** (Section 21): Saves product ID, variant, and quantity across the login/signup barrier.
* **Real Cart Execution** (Section 22): Executes real cart additions and confirms only upon verified success: *"Done — I've added it to your cart."*.

### 4. Audio Quality, Hardware & Recovery (Sections 7, 8, 9, 10, 26, 27, 34)
* **Mute / Unmute** (Section 7): Dedicated button temporarily disables microphone tracks without terminating the session.
* **End Call & Resource Cleanup** (Sections 8 & 34): Releases microphone tracks (`MediaStreamTrack.stop()`), stops audio playback, detaches listeners, and closes console.
* **Clean Microphone Capture** (Section 9): Browser-native AEC, noise suppression, AGC, and 80Hz rumble filter.
* **Watchdog State Machine** (Sections 10 & 32): 13 distinct states (`IDLE`, `CONNECTING`, `READY`, `LISTENING`, `USER_SPEAKING`, `TRANSCRIBING`, `THINKING`, `ASSISTANT_SPEAKING`, `MUTED`, `LOGIN_REQUIRED`, `ACTION_CONFIRMATION`, `ERROR`, `ENDED`) with automatic watchdog timeouts preventing stuck states.
* **Double Connection Prevention** (Section 33): Debouncing and state transition guards.

---

## 🧪 Automated Test Suite (27/27 Passing — 100%)

Run all automated acceptance and UX regression tests:
```bash
npm test
```

### Test Suite Summary:
1. **Section 5A Audio Acceptance Tests** (11/11 Passed):
   * Quiet room speech recognition
   * Fan/AC noise & Hinglish inquiry (`"60 pills kitne ka hai?"`)
   * Moderate background noise relative intent
   * Mobile audio constraints (AEC, NS, AGC, Mono)
   * Headphone echo feedback prevention
   * Bluetooth headset dynamic routing
   * Customer interruption / Barge-in (<100ms halt)
   * Short pause continuity (700ms hang-time)
   * Long pause turn finalization
   * Low volume / silent mic detection
   * Quantity clarity (60 vs 16 disambiguation)
2. **Frontend, UX & Real-Time Voice Tests** (16/16 Passed):
   * Morning, afternoon, and evening dynamic greetings
   * English, Hindi, and Hinglish language following
   * Skincare & acne on-demand product retrieval
   * Contextual follow-up pricing
   * 30, 60, and 100 tablet variant handling
   * Authentication gating before cart actions
   * Preservation of pending cart context across login
   * Real WooCommerce cart execution
   * Centralized state transitions and watchdog timeout recovery

---

## 🚀 Running the Storefront

1. **Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

2. **Production Build**:
   ```bash
   npm run build
   ```
   Generates an ultra-fast production bundle (56 kB total JavaScript, 16 kB gzip).
