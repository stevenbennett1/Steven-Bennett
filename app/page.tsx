import type { Metadata } from "next";
import Link from "next/link";
import "./portfolio.css";
import PortfolioChrome from "@/components/PortfolioChrome";

export const metadata: Metadata = {
  title: "Steven Bennett | Deep Tech Investor",
  description:
    "Steven Bennett, startup builder since 2015, now backing early-stage deep tech founders in AI infrastructure, robotics, energy, and advanced hardware.",
};

export default function PortfolioPage() {
  return (
    <div className="portfolio" id="portfolio-root" suppressHydrationWarning>
      {/* Avoids a flash of the wrong theme: applies the saved preference
          before React hydrates, exactly like the original script.js did.
          suppressHydrationWarning tells React this element's data-theme
          attribute is expected to differ from the server render — this is
          the standard pattern for pre-hydration theme scripts. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('sb-theme');if(t==='light'||t==='dark'){document.currentScript.parentElement.setAttribute('data-theme',t);}}catch(e){}})();`,
        }}
      />

      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header" id="site-header">
        <div className="wrap header-inner">
          <a href="#top" className="brand">
            Steven Bennett
          </a>

          <nav className="main-nav" id="main-nav" aria-label="Primary">
            <a href="#about">About</a>
            <a href="#journey">Journey</a>
            <a href="#focus">Focus</a>
            <a href="#philosophy">Philosophy</a>
            <Link href="/blog">Blog</Link>
            <a href="#contact">Contact</a>
          </nav>

          <div className="header-actions">
            <button className="icon-btn" id="theme-toggle" type="button" aria-label="Toggle dark mode">
              <svg
                className="icon sun"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
              <svg
                className="icon moon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
              </svg>
            </button>

            <a
              className="btn btn-small btn-primary header-cta"
              href="https://www.linkedin.com/in/stevenbennettofficial/"
              target="_blank"
              rel="noopener"
            >
              Connect
            </a>

            <button
              className="icon-btn nav-toggle"
              id="nav-toggle"
              type="button"
              aria-label="Open menu"
              aria-expanded="false"
              aria-controls="main-nav"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        {/* HERO */}
        <section className="hero" id="top">
          <div className="hero-bg" aria-hidden="true" />
          <div className="wrap hero-copy">
            <h1 className="hero-title reveal">
              Hi there,
              <br />
              Steven Bennett.
            </h1>
            <p className="hero-sub reveal">
              Deep tech investor. Startup builder since 2015, now backing early-stage founders.{" "}
              <a className="inline-link" href="https://www.linkedin.com/in/stevenbennettofficial/" target="_blank" rel="noopener">
                Connect on LinkedIn ↗
              </a>
            </p>
          </div>
        </section>

        {/* ABOUT + STATS */}
        <section className="section" id="about">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="kicker">01. About</span>
              <h2>From builder to backer.</h2>
            </div>

            <div className="about-grid">
              <p className="about-lead reveal">
                Steven founded his first company in 2015 and spent the better part of a decade building, through
                zero-to-one product work, hard fundraising cycles, and the slow, unglamorous grind of getting a hard
                technology to actually ship. That founder-first perspective is now the lens he invests through:
                patient capital, technical conviction, and a bias toward problems that don&apos;t fit a neat
                pitch-deck timeline.
              </p>

              <dl className="stats reveal">
                <div className="stat">
                  <dt>2015</dt>
                  <dd>Year one, as a founder</dd>
                </div>
                <div className="stat">
                  <dt>10+</dt>
                  <dd>Years building &amp; investing</dd>
                </div>
                <div className="stat">
                  <dt>3</dt>
                  <dd>Companies built from scratch</dd>
                </div>
                <div className="stat">
                  <dt>20+</dt>
                  <dd>Deep tech investments</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* JOURNEY / TIMELINE */}
        <section className="section" id="journey">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="kicker">02. Journey</span>
              <h2>A decade in the arena.</h2>
            </div>

            <ol className="timeline">
              <li className="timeline-item reveal">
                <div className="timeline-year">2015</div>
                <div className="timeline-body">
                  <h3>Founded the first company</h3>
                  <p>Started from zero. Built the first product, the first team, and learned what it actually takes to bring a hard idea to market.</p>
                </div>
              </li>
              <li className="timeline-item reveal">
                <div className="timeline-year">2017</div>
                <div className="timeline-body">
                  <h3>Scaled through early growth</h3>
                  <p>Grew the team and product through the messy middle, the stage where most of the real lessons about building get learned.</p>
                </div>
              </li>
              <li className="timeline-item reveal">
                <div className="timeline-year">2019</div>
                <div className="timeline-body">
                  <h3>A second, harder venture</h3>
                  <p>Took on a more technically ambitious company, sharpening a focus on deep, defensible technology over quick iteration.</p>
                </div>
              </li>
              <li className="timeline-item reveal">
                <div className="timeline-year">2021</div>
                <div className="timeline-body">
                  <h3>Transition to investing</h3>
                  <p>Began writing angel checks into founders solving the same class of hard problems, bringing operator experience to the table.</p>
                </div>
              </li>
              <li className="timeline-item reveal">
                <div className="timeline-year">Today</div>
                <div className="timeline-body">
                  <h3>Full-time deep tech investor</h3>
                  <p>Now dedicated to backing early-stage founders building the infrastructure, hardware, and systems beneath the next decade of technology.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* FOCUS AREAS */}
        <section className="section" id="focus">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="kicker">03. Focus</span>
              <h2>Where the conviction is.</h2>
            </div>

            <div className="focus-grid">
              <div className="focus-card reveal">
                <svg className="focus-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <path d="M9 4v16M4 9h16" />
                </svg>
                <h3>AI Infrastructure</h3>
                <p>The compute, data, and systems layer that makes modern AI possible at scale.</p>
              </div>
              <div className="focus-card reveal">
                <svg className="focus-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="6" width="18" height="12" rx="2" />
                  <path d="M7 10h.01M11 10h.01M15 10h.01M7 14h6" />
                </svg>
                <h3>Semiconductors &amp; Compute</h3>
                <p>Chips, tooling, and architectures pushing past the limits of general-purpose compute.</p>
              </div>
              <div className="focus-card reveal">
                <svg className="focus-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="8" r="3" />
                  <path d="M5 21v-2a7 7 0 0 1 14 0v2M9 15h6" />
                </svg>
                <h3>Robotics &amp; Automation</h3>
                <p>Physical systems that take real-world labor and precision beyond human limits.</p>
              </div>
              <div className="focus-card reveal">
                <svg className="focus-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
                </svg>
                <h3>Climate &amp; Energy Systems</h3>
                <p>Generation, storage, and grid technology built for the next century, not the last one.</p>
              </div>
              <div className="focus-card reveal">
                <svg className="focus-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2 3 7l9 5 9-5-9-5ZM3 12l9 5 9-5M3 17l9 5 9-5" />
                </svg>
                <h3>Advanced Manufacturing</h3>
                <p>New materials and processes that make physical products faster and cheaper to build.</p>
              </div>
              <div className="focus-card reveal">
                <svg className="focus-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2c2.5 3 4 6.5 4 10a4 4 0 0 1-8 0c0-3.5 1.5-7 4-10Z" />
                  <path d="M9 18c-2 1-3 2.5-3 4M15 18c2 1 3 2.5 3 4" />
                </svg>
                <h3>Space &amp; Frontier Tech</h3>
                <p>Early bets on technology that expands where and how humans can operate.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section className="section" id="philosophy">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="kicker">04. Philosophy</span>
              <h2>Built to dominate, not just to compete.</h2>
            </div>

            <div className="about-grid">
              <p className="about-lead reveal">
                Steven doesn&apos;t invest in incremental improvement. He backs the founders building the layer of
                technology that decides who controls the next century of infrastructure, compute, and industry. Deep
                tech isn&apos;t a niche, it&apos;s the substrate the entire global economy gets rebuilt on, and he
                backs the founders who intend to own it.
              </p>

              <blockquote className="quote reveal">
                The next trillion dollars of value won&apos;t go to the fastest follower. It will go to whoever
                controls the hardest layer.
              </blockquote>
            </div>

            <p className="about-lead reveal philosophy-note">
              That conviction wasn&apos;t inherited, it was built one company at a time. It started with the first
              product he shipped in 2015 and ran through years of fundraising, hiring, and failing in public before
              getting it right. Every investment since has been made with that same operator&apos;s discipline: get
              in early, work alongside the founder, and stay in the room long after the term sheet is signed.
              That&apos;s how a handful of early bets compounds into a portfolio built for global scale.
            </p>

            <div className="focus-grid principle-grid">
              <div className="focus-card reveal">
                <svg className="focus-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <h3>Own the hard layer</h3>
                <p>Back technology that&apos;s difficult to copy and impossible to route around.</p>
              </div>
              <div className="focus-card reveal">
                <svg className="focus-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4v16h16M8 15l4-5 3 3 5-7" />
                </svg>
                <h3>Operate, don&apos;t spectate</h3>
                <p>Work alongside founders as a partner who has actually built, not just funded.</p>
              </div>
              <div className="focus-card reveal">
                <svg className="focus-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M17 2.1 21 6l-4 4M3 12v-2a4 4 0 0 1 4-4h14M7 21.9 3 18l4-4M21 12v2a4 4 0 0 1-4 4H3" />
                </svg>
                <h3>Compound relentlessly</h3>
                <p>Every company, every cycle, sharpens the thesis and the network for the next one.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="section contact-section" id="contact">
          <div className="wrap">
            <div className="contact-inner reveal">
              <span className="kicker">05. Contact</span>
              <h2>Building something in deep&nbsp;tech?</h2>
              <p>If you&apos;re an early-stage founder working on a hard, physical-world problem, I&apos;d like to hear about it.</p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="https://www.linkedin.com/in/stevenbennettofficial/" target="_blank" rel="noopener">
                  Connect on LinkedIn
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17 17 7M7 7h10v10" />
                  </svg>
                </a>
                <a className="btn btn-ghost" href="mailto:hello@stevenbennett.com">
                  hello@stevenbennett.com
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-inner">
          <p>
            &copy; <span id="year" /> Steven Bennett. All rights reserved.
          </p>
          <a
            href="https://www.linkedin.com/in/stevenbennettofficial/"
            target="_blank"
            rel="noopener"
            aria-label="Steven Bennett on LinkedIn"
            className="icon-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.24 8.25h4.5V23H.24V8.25ZM8.5 8.25h4.31v2.02h.06c.6-1.13 2.07-2.33 4.26-2.33 4.56 0 5.4 3 5.4 6.9V23h-4.5v-6.65c0-1.59-.03-3.63-2.21-3.63-2.22 0-2.56 1.73-2.56 3.52V23H8.5V8.25Z" />
            </svg>
          </a>
        </div>
      </footer>

      <PortfolioChrome />
    </div>
  );
}
