import { useEffect, useRef, useState } from 'react';
import Sculpture from './Sculpture';
import { profile } from './content';

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h16m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function useMotion() {
  const [motion, setMotion] = useState(() => {
    try { const saved = localStorage.getItem('vmel-motion'); if (saved) return saved === 'on'; } catch { /* Storage can be unavailable in privacy mode. */ }
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? 'on' : 'off';
    try { localStorage.setItem('vmel-motion', motion ? 'on' : 'off'); } catch { /* Motion still works without storage. */ }
  }, [motion]);
  return [motion, setMotion] as const;
}

function LocalTime() {
  const format = () => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Helsinki', hour: '2-digit', minute: '2-digit' }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => { const timer = setInterval(() => setTime(format()), 30000); return () => clearInterval(timer); }, []);
  return <span>FINLAND <span className="time-separator">/</span> {time}</span>;
}

export default function App() {
  const [motion, setMotion] = useMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButton.current?.focus(); }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [menuOpen]);
  useEffect(() => () => clearTimeout(toastTimeout.current), []);

  async function copyContact() {
    try {
      await navigator.clipboard.writeText(profile.email || profile.linkedin);
      setCopied(true); setCopyError(false);
      clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setCopied(false), 3500);
    } catch { setCopyError(true); }
  }

  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="header">
      <a className="wordmark" href="#" aria-label="vmel home">vmel<span className="wordmark-dot">.</span><span className="wordmark-slash">/</span></a>
      <nav id="navigation" className={`navigation ${menuOpen ? 'navigation-open' : ''}`} aria-label="Main navigation">
        <a href="#expertise" onClick={() => setMenuOpen(false)}>Expertise <span>01</span></a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About <span>02</span></a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>Contact <span>03</span></a>
      </nav>
      <div className="header-actions">
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="header-contact">Let’s talk <Arrow diagonal /></a>
        <button ref={menuButton} className="menu-button" aria-expanded={menuOpen} aria-controls="navigation" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      </div>
    </header>

    <main id="main">
      <section className="hero container" aria-labelledby="hero-heading">
        <div className="hero-top mono"><span className="eyebrow"><span className="signal-dot" /> {profile.role.toUpperCase()}</span><span className="hero-edition">PERSONAL PORTFOLIO — VOL. 01 / 2026</span></div>
        <div className="hero-content">
          <div className="hero-copy">
            <div className="hero-intro mono">VALENTYN MELNYCHENKO</div>
            <h1 id="hero-heading"><span className="hero-line">Code meets</span><span className="hero-line hero-serif">character<span className="heading-period">.</span></span></h1>
            <p className="hero-description">Thoughtful interfaces. Dependable systems.<br />A little unexpected.</p>
            <a href="#expertise" className="pill-button hero-cta">Explore what I do <span className="button-icon"><Arrow /></span></a>
          </div>
          <div className="hero-art">
            <div className="art-cross art-cross-top">+</div><div className="art-cross art-cross-bottom">+</div>
            <div className="art-orbit" />
            <Sculpture motion={motion} wireframe={wireframe} />
            <div className="art-caption mono"><span>FIG. 001 — CONTINUOUS FORM</span><button onClick={() => setWireframe(!wireframe)} aria-pressed={wireframe}>{wireframe ? 'SOLID VIEW' : 'WIREFRAME'} <span>↗</span></button></div>
            <span className="art-side-label mono">A DIFFERENT PERSPECTIVE</span>
          </div>
        </div>
        <div className="hero-bottom"><a className="scroll-link mono" href="#expertise"><span className="scroll-arrow">↓</span> SCROLL TO EXPLORE</a><p>Building for people.<br /><span>From first idea to production.</span></p><span className="hero-location mono"><LocalTime /></span></div>
      </section>

      <div className="skills-band" aria-label="Technology stack"><div className="container skills-inner"><span className="mono skills-label">TOOLS OF THE TRADE</span><div className="skills-list"><span>React</span><i>+</i><span>Next.js</span><i>+</i><span>TypeScript</span><i>+</i><span>WordPress</span><i>+</i><span>Node.js</span><i>+</i><span>CI/CD</span></div></div></div>

      <section id="expertise" className="expertise container section" aria-labelledby="expertise-heading">
        <div className="section-kicker reveal"><span className="mono">01 / EXPERTISE</span><span className="mono section-note">DESIGNED WITH INTENT. BUILT TO LAST.</span></div>
        <div className="section-heading reveal"><h2 id="expertise-heading">Built for the<br /><em>real world.</em></h2><p>From the details you see<br />to the systems you don’t.<br /><span>Full-stack, all the way through.</span></p></div>
        <div className="feature-grid">
          <article className="feature feature-interface reveal">
            <div className="feature-visual interface-visual" aria-hidden="true"><div className="visual-topline mono"><span>THE INTERFACE LAYER</span><span>↗</span></div><div className="interface-art"><span className="interface-small mono">LESS NOISE. MORE INTENT.</span><span className="interface-word">Hello,<br /><em>possibility.</em></span><span className="interface-rule"/><div className="interface-bottom"><span>Every detail<br />has a purpose.</span><span className="interface-circle">↗</span></div></div><div className="visual-bottomline mono"><span>FORM × FUNCTION</span><span>01 — UI</span></div></div>
            <div className="feature-meta"><span className="mono">01 / FRONTEND DEVELOPMENT</span><span className="feature-mark">↗</span></div><h3>Interfaces that feel right.</h3><p>Responsive experiences with careful typography, meaningful interaction, and attention to the smallest detail.</p><div className="tags"><span>React</span><span>Next.js</span><span>TypeScript</span></div>
          </article>
          <article className="feature feature-systems reveal">
            <div className="feature-visual systems-visual" aria-hidden="true"><div className="visual-topline mono"><span>THE SYSTEMS LAYER</span><span>↗</span></div><div className="system-diagram"><div className="system-outer-ring"/><div className="system-inner-ring"/><div className="system-core">&lt;/&gt;</div><span className="system-node node-one">API</span><span className="system-node node-two">DATA</span><span className="system-node node-three">UI</span><span className="system-node node-four">CI</span><div className="system-line line-one"/><div className="system-line line-two"/></div><div className="visual-bottomline mono"><span>CONNECTED BY DESIGN</span><span>02 — SYSTEMS</span></div></div>
            <div className="feature-meta"><span className="mono">02 / FULL-STACK ENGINEERING</span><span className="feature-mark">↗</span></div><h3>Systems that hold up.</h3><p>Reliable foundations, connected services, and a delivery process that supports a product beyond its launch.</p><div className="tags"><span>Node.js</span><span>APIs</span><span>CI/CD</span></div>
          </article>
        </div>
        <div className="capability-list reveal">
          <details><summary><span className="mono capability-number">03</span><h3>Commerce & content</h3><span className="capability-summary">WordPress · BigCommerce</span><span className="details-icon">+</span></summary><p>Custom WordPress development and BigCommerce storefronts. Content structures and interfaces shaped around the people who manage and use them.</p></details>
          <details><summary><span className="mono capability-number">04</span><h3>Delivery & automation</h3><span className="capability-summary">CI/CD · AI workflows</span><span className="details-icon">+</span></summary><p>Deployment pipelines and AI-assisted workflows that make repetitive work simpler, with a focus on dependable delivery and maintainable code.</p></details>
        </div>
        <a className="text-link experience-link reveal" href={profile.linkedin} target="_blank" rel="noopener noreferrer">Explore my professional experience <Arrow diagonal /></a>
      </section>

      <section id="about" className="about section" aria-labelledby="about-heading"><div className="container">
        <div className="section-kicker reveal"><span className="mono">02 / THE PERSON BEHIND THE CODE</span><span className="mono section-note">ENGINEERING WITH A POINT OF VIEW</span></div>
        <div className="about-grid">
          <div className="about-heading reveal"><h2 id="about-heading">A developer.<br />A problem solver.<br /><em>Always curious.</em></h2><span className="about-asterisk" aria-hidden="true">✳</span></div>
          <div className="about-copy reveal"><p className="about-lead">{profile.introduction}</p><p>My work spans modern frontend development, commerce, content platforms, and the workflows that bring everything together.</p><p>I care about the whole picture: how a product feels, how it works, and how well it holds up when real people depend on it.</p><div className="about-facts"><div><span className="fact-value">6<span>+</span></span><span className="mono fact-label">YEARS IN DEVELOPMENT</span></div><div><span className="fact-value fact-location">Finland<span>↗</span></span><span className="mono fact-label">BASED IN LAHTI</span></div></div><a className="text-link" href={profile.linkedin} target="_blank" rel="noopener noreferrer">More about me on LinkedIn <Arrow diagonal /></a></div>
        </div>
      </div></section>

      <section className="approach container section" aria-labelledby="approach-heading"><div className="section-kicker reveal"><span className="mono">A FEW THINGS I BELIEVE IN</span><span className="mono section-note">THE APPROACH</span></div><h2 className="sr-only" id="approach-heading">My approach to development</h2><div className="principles"><article className="reveal"><span className="mono">[ 01 ]</span><h3>Purpose before pixels.</h3><p>Understand the problem first.<br />The right solution follows.</p></article><article className="reveal"><span className="mono">[ 02 ]</span><h3>Details make the difference.</h3><p>The small things are the experience.<br />They deserve the same care.</p></article><article className="reveal"><span className="mono">[ 03 ]</span><h3>Build for what’s next.</h3><p>Clear code. Thoughtful foundations.<br />Room for a product to grow.</p></article></div></section>

      <section id="contact" className="contact section" aria-labelledby="contact-heading"><div className="container"><div className="section-kicker reveal"><span className="mono">03 / NEXT CHAPTER</span><span className="mono section-note">GOOD THINGS START WITH A CONVERSATION</span></div><div className="contact-main reveal"><h2 id="contact-heading">Have something<br /><em>in mind?</em></h2><a className="contact-orb" href={profile.email ? `mailto:${profile.email}` : profile.linkedin} target={profile.email ? undefined : '_blank'} rel="noopener noreferrer" aria-label={profile.email ? 'Send Valentyn an email' : 'Connect with Valentyn on LinkedIn'}><Arrow diagonal /></a></div><div className="contact-bottom reveal"><p>A product to build. A problem to solve.<br />Or just a good conversation.</p><div className="contact-links"><a className="text-link" href={profile.linkedin} target="_blank" rel="noopener noreferrer">Let’s connect on LinkedIn <Arrow diagonal /></a><button className="copy-link mono" onClick={copyContact}>{copied ? 'COPIED ✓' : 'COPY CONTACT LINK'} <span aria-hidden="true">⧉</span></button><span className="copy-status" role="status">{copyError ? 'Please use the LinkedIn link above.' : copied ? 'Contact link copied to clipboard.' : ''}</span></div></div></div></section>
    </main>

    <footer className="footer container"><div className="footer-top"><a href="#" className="wordmark" aria-label="Back to top">vmel<span className="wordmark-dot">.</span><span className="wordmark-slash">/</span></a><p>Code with care.<br /><span>Build with character.</span></p><a href="#" className="back-top mono">BACK TO TOP <span>↑</span></a></div><div className="footer-bottom mono"><span>© {new Date().getFullYear()} VALENTYN MELNYCHENKO</span><button className="motion-toggle" onClick={() => setMotion(!motion)} aria-pressed={motion} aria-label="Enable animations"><span className={`motion-indicator ${motion ? 'active' : ''}`} /> MOTION {motion ? 'ON' : 'OFF'}</button><span>LAHTI, FINLAND <span className="footer-plus">+</span></span></div></footer>
  </>;
}
