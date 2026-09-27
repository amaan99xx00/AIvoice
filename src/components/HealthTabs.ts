export class HealthTabsComponent {
  public static render(): string {
    return `
      <section class="health-tabs-section" id="health">
        <div class="moda-container">
          <div style="text-align: center; margin-bottom: 2.5rem;">
            <p class="section-pretitle">SLEEP & WAKEFULNESS</p>
            <h2 class="section-title">Understand what may be affecting your day</h2>
            <p class="section-lead-text" style="margin-left: auto; margin-right: auto;">
              Sleep plays a major role in how we think, work, concentrate, and feel. When the body’s natural sleep-wake rhythm is disrupted, daytime alertness and everyday performance can be affected.
            </p>
          </div>

          <!-- Navigation Tabs -->
          <div class="tabs-navigation" role="tablist">
            <button class="tab-btn active" data-tab-target="tab-apnea" role="tab" aria-selected="true">
              Obstructive Sleep Apnea
            </button>
            <button class="tab-btn" data-tab-target="tab-narcolepsy" role="tab" aria-selected="false">
              Narcolepsy
            </button>
            <button class="tab-btn" data-tab-target="tab-shift" role="tab" aria-selected="false">
              Shift Worker Sleep Disorder
            </button>
            <button class="tab-btn" data-tab-target="tab-attention" role="tab" aria-selected="false">
              Attention Support
            </button>
          </div>

          <!-- Tab Content Panes -->
          <!-- Tab 1: Obstructive Sleep Apnea -->
          <div class="tab-pane active" id="tab-apnea" role="tabpanel">
            <div class="tab-image-col">
              <img
                src="https://modaineurope.com/wp-content/uploads/2026/09/Obstructive-Sleep-Apnea.webp"
                alt="Obstructive Sleep Apnea medical analysis"
                loading="lazy"
              />
            </div>
            <div class="tab-content-col">
              <h3>Obstructive Sleep Apnea (OSA)</h3>
              <p class="tab-desc">
                Obstructive sleep apnea can repeatedly interrupt normal breathing during sleep, affecting the quality of rest. The effects may continue into the following day through tiredness, reduced alertness, and difficulty concentrating. Common symptoms include loud snoring accompanied by choking, fatigue, and excessive daytime sleepiness.
              </p>
              <h4 class="challenges-title">Common Challenges</h4>
              <ul class="challenges-list">
                <li class="challenge-item"><span class="challenge-bullet"></span> Repeated nighttime interruptions</li>
                <li class="challenge-item"><span class="challenge-bullet"></span> Unrefreshing sleep</li>
                <li class="challenge-item"><span class="challenge-bullet"></span> Morning tiredness</li>
                <li class="challenge-item"><span class="challenge-bullet"></span> Daytime sleepiness</li>
              </ul>
            </div>
          </div>

          <!-- Tab 2: Narcolepsy -->
          <div class="tab-pane" id="tab-narcolepsy" role="tabpanel">
            <div class="tab-image-col">
              <img
                src="https://modaineurope.com/wp-content/uploads/2026/09/Narcolepsy.webp"
                alt="Narcolepsy condition overview"
                loading="lazy"
              />
            </div>
            <div class="tab-content-col">
              <h3>Narcolepsy & Daytime Wakefulness</h3>
              <p class="tab-desc">
                Narcolepsy is a chronic neurological disorder that disrupts the brain’s ability to regulate sleep-wake cycles. It can cause persistent daytime sleepiness and unexpected episodes of falling asleep, making it difficult to stay alert throughout the workday.
              </p>
              <h4 class="challenges-title">Common Challenges</h4>
              <ul class="challenges-list">
                <li class="challenge-item"><span class="challenge-bullet"></span> Persistent daytime sleepiness</li>
                <li class="challenge-item"><span class="challenge-bullet"></span> Disrupted daily routine</li>
                <li class="challenge-item"><span class="challenge-bullet"></span> Difficulty maintaining attention</li>
                <li class="challenge-item"><span class="challenge-bullet"></span> Unexpected sleep episodes</li>
              </ul>
            </div>
          </div>

          <!-- Tab 3: Shift Worker Sleep Disorder -->
          <div class="tab-pane" id="tab-shift" role="tabpanel">
            <div class="tab-image-col">
              <img
                src="https://modaineurope.com/wp-content/uploads/2026/09/Shift-work-Sleep-Disorder-1.webp"
                alt="Shift Worker Sleep Disorder management"
                loading="lazy"
              />
            </div>
            <div class="tab-content-col">
              <h3>Shift Worker Sleep Disorder (SWSD)</h3>
              <p class="tab-desc">
                Working nights or rotating shifts disrupts circadian rhythms. This may lead to difficulty sleeping during daytime hours, severe fatigue during working shifts, and cognitive issues like memory lapses, irritability, and reduced concentration.
              </p>
              <h4 class="challenges-title">Common Challenges</h4>
              <ul class="challenges-list">
                <li class="challenge-item"><span class="challenge-bullet"></span> Difficulty sleeping during the day</li>
                <li class="challenge-item"><span class="challenge-bullet"></span> Fatigue during working hours</li>
                <li class="challenge-item"><span class="challenge-bullet"></span> Reduced concentration & focus</li>
                <li class="challenge-item"><span class="challenge-bullet"></span> Irregular sleep-wake patterns</li>
              </ul>
            </div>
          </div>

          <!-- Tab 4: Attention Support -->
          <div class="tab-pane" id="tab-attention" role="tabpanel">
            <div class="tab-image-col">
              <img
                src="https://modaineurope.com/wp-content/uploads/2026/09/Attention-Support.webp"
                alt="Attention and cognitive support"
                loading="lazy"
              />
            </div>
            <div class="tab-content-col">
              <h3>Attention & Focus Support</h3>
              <p class="tab-desc">
                Maintaining mental stamina and continuous attention throughout prolonged work hours can become difficult when fatigue builds up. Clinical wakefulness medications support daytime alertness so you can stay fully engaged with your demanding obligations.
              </p>
              <h4 class="challenges-title">Common Challenges</h4>
              <ul class="challenges-list">
                <li class="challenge-item"><span class="challenge-bullet"></span> Difficulty staying focused on complex tasks</li>
                <li class="challenge-item"><span class="challenge-bullet"></span> Mental brain fog during peak hours</li>
                <li class="challenge-item"><span class="challenge-bullet"></span> Reduced executive concentration</li>
                <li class="challenge-item"><span class="challenge-bullet"></span> Trouble staying mentally engaged</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  public static initListeners(): void {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab-target');
        if (!targetId) return;

        tabBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        tabPanes.forEach((p) => p.classList.remove('active'));

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const activePane = document.getElementById(targetId);
        if (activePane) {
          activePane.classList.add('active');
        }
      });
    });
  }
}
