---
layout: default
title: Home
description: Automate image personalization with text overlays using a YAML or JSON config and Sharp.
---

<!-- Hero Section -->
<section class="hero">
  <div class="hero__container">
    <div class="hero__badge">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
      CLI Tool · Node.js 20+
    </div>
    
    <h1>
      <span class="gradient-text">Add text to images</span><br>
      with a simple config
    </h1>
    
    <p class="hero__subtitle">
      Composite text layers onto images from a YAML or JSON config file. 
      No GUI required. Powered by Sharp's blazing-fast pipeline.
    </p>
    
    <div class="hero__actions">
      <a href="https://www.npmjs.com/package/pixeltxt-cli" class="btn btn--primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        Install from npm
      </a>
      <a href="https://github.com/djom202/pixeltxt" class="btn btn--secondary">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        View on GitHub
      </a>
    </div>
    
    <div class="hero__visual">
      <div class="hero__demo">
        <div class="hero__demo-flow">
          <div class="hero__demo-step">
            <img src="{{ site.baseurl }}/examples/sample.jpg" alt="Sample image" />
            <span>Input Image</span>
          </div>
          <div class="hero__demo-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
          <div class="hero__demo-step">
            <div class="step__code" style="text-align: left;">base: sample.jpg<br>layers:<br>&nbsp;&nbsp;- text: "Hello"</div>
            <span>Config File</span>
          </div>
          <div class="hero__demo-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
          <div class="hero__demo-step">
            <img src="{{ site.baseurl }}/examples/result.png" alt="Result image" />
            <span>Output Image</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- How It Works -->
<section class="section section--alt">
  <div class="section__container">
    <div class="section__header">
      <span class="section__label">How it works</span>
      <h2 class="section__title">Three steps to image magic</h2>
      <p class="section__description">
        No complex setup. Just create a config file and run the command.
      </p>
    </div>
    
    <div class="steps-grid">
      <div class="step">
        <div class="step__number">1</div>
        <h3 class="step__title">Create config</h3>
        <p class="step__description">
          Place a <code>pixeltxt.yaml</code> next to your image with text positions, fonts, and colors.
        </p>
        <div class="step__code">pixeltxt.yaml</div>
      </div>
      
      <div class="step">
        <div class="step__number">2</div>
        <h3 class="step__title">Add layers</h3>
        <p class="step__description">
          Define text overlays with precise positioning using x, y coordinates and anchor points.
        </p>
        <div class="step__code">layers: [...]</div>
      </div>
      
      <div class="step">
        <div class="step__number">3</div>
        <h3 class="step__title">Run command</h3>
        <p class="step__description">
          Execute <code>pixeltxt run</code> and get your processed image instantly.
        </p>
        <div class="step__code">pixeltxt run</div>
      </div>
    </div>
  </div>
</section>

<!-- Features -->
<section class="section">
  <div class="section__container">
    <div class="section__header">
      <span class="section__label">Features</span>
      <h2 class="section__title">Built for developers</h2>
      <p class="section__description">
        Designed to fit seamlessly into your existing workflow.
      </p>
    </div>
    
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        </div>
        <h3 class="feature-card__title">Config-first</h3>
        <p class="feature-card__description">
          Plain YAML or JSON validated with Zod. Easy to diff, version control, and automate in CI/CD pipelines.
        </p>
      </div>
      
      <div class="feature-card">
        <div class="feature-card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        </div>
        <h3 class="feature-card__title">Blazing fast</h3>
        <p class="feature-card__description">
          Sharp's optimized image processing pipeline handles SVG text rasterization and compositing efficiently.
        </p>
      </div>
      
      <div class="feature-card">
        <div class="feature-card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
        </div>
        <h3 class="feature-card__title">Programmatic API</h3>
        <p class="feature-card__description">
          Import <code>processImage</code>, loaders, and schema directly from the package for custom workflows.
        </p>
      </div>
      
      <div class="feature-card">
        <div class="feature-card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </div>
        <h3 class="feature-card__title">Flexible positioning</h3>
        <p class="feature-card__description">
          Precise control over text placement with x/y coordinates, anchor points, and rotation support.
        </p>
      </div>
      
      <div class="feature-card">
        <div class="feature-card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>
        <h3 class="feature-card__title">Custom fonts</h3>
        <p class="feature-card__description">
          Use any TTF, OTF, or WOFF font files. Load from local paths or URLs.
        </p>
      </div>
      
      <div class="feature-card">
        <div class="feature-card__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        <h3 class="feature-card__title">Type-safe</h3>
        <p class="feature-card__description">
          Built with TypeScript. Configuration validated with Zod schemas for runtime safety.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Code Example -->
<section class="section section--alt">
  <div class="section__container">
    <div class="section__header">
      <h2 class="section__title">Simple yet powerful</h2>
      <p class="section__description">
        A complete configuration example with all available options.
      </p>
    </div>
    
    <div class="code-window">
      <div class="code-window__header">
        <div class="code-window__dot code-window__dot--red"></div>
        <div class="code-window__dot code-window__dot--yellow"></div>
        <div class="code-window__dot code-window__dot--green"></div>
        <span class="code-window__title">pixeltxt.yaml</span>
      </div>
      <div class="code-window__content">
        <pre><code><span class="comment"># Input and output paths</span>
<span class="key">base</span>: <span class="string">./images/photo.jpg</span>
<span class="key">output</span>: <span class="string">./output/result.png</span>

<span class="comment"># Text layers with positioning</span>
<span class="key">layers</span>:

- <span class="key">id</span>: <span class="string">title</span>
  <span class="key">text</span>: <span class="string">Summer Vibes</span>
  <span class="key">font</span>: <span class="string">./fonts/Bold.ttf</span>
  <span class="key">fontSize</span>: <span class="number">64</span>
  <span class="key">color</span>: <span class="string">#ffffff</span>
  <span class="key">x</span>: <span class="number">100</span>
  <span class="key">y</span>: <span class="number">80</span>
  <span class="key">anchor</span>: <span class="string">start</span>

- <span class="key">id</span>: <span class="string">subtitle</span>
<span class="key">text</span>: <span class="string">August 2024</span>
<span class="key">font</span>: <span class="string">./fonts/Regular.ttf</span>
<span class="key">fontSize</span>: <span class="number">32</span>
<span class="key">color</span>: <span class="string">#e2e8f0</span>
<span class="key">x</span>: <span class="number">100</span>
<span class="key">y</span>: <span class="number">140</span></code></pre>
</div>
</div>
  </div>
</section>

<!-- CTA Section -->
<section class="cta-section">
  <h2 class="cta-section__title">Ready to get started?</h2>
  <p class="cta-section__description">
    Install Pixeltxt and start creating beautiful image compositions in minutes.
  </p>
  <div class="cta-section__actions">
    <a href="https://www.npmjs.com/package/pixeltxt-cli" class="btn btn--primary">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
      npm install -g pixeltxt-cli
    </a>
    <a href="https://github.com/djom202/pixeltxt" class="btn btn--secondary">
      Read the Docs
    </a>
  </div>
</section>
