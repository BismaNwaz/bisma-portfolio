import { useState, useEffect, useRef } from 'react'

const NAV_LINKS = ['Projects', 'Skills', 'Experience', 'About', 'Contact']

const TERMINAL_LINES = [
  { text: '$ curl -X POST https://bisma225-lead-enrichment-api.hf.space/enrich \\', color: 'default', delay: 0 },
  { text: '    -d \'{"url": "https://stripe.com"}\'', color: 'default', delay: 60 },
  { text: '', color: 'default', delay: 10 },
  { text: '{', color: 'yellow', delay: 20 },
  { text: '  "company_name": "Stripe",', color: 'green', delay: 15 },
  { text: '  "industry": "Financial Technology / Payment Processing",', color: 'green', delay: 15 },
  { text: '  "summary": "Stripe provides payment infrastructure for the internet...",', color: 'green', delay: 15 },
  { text: '  "products_or_services": ["Payments", "Billing", "Connect", "Radar"],', color: 'blue', delay: 15 },
  { text: '  "likely_decision_maker_titles": ["CTO", "VP Engineering", "CFO"],', color: 'blue', delay: 15 },
  { text: '  "contact_email": null', color: 'green', delay: 15 },
  { text: '}', color: 'yellow', delay: 10 },
]

function useTypewriter(lines, started) {
  const [displayed, setDisplayed] = useState([])
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)

  useEffect(() => {
    if (!started) return
    if (lineIdx >= lines.length) return
    const line = lines[lineIdx]
    if (charIdx < line.text.length) {
      const t = setTimeout(() => setCharIdx(c => c + 1), 18)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setDisplayed(d => [...d, { text: line.text, color: line.color }])
        setLineIdx(l => l + 1)
        setCharIdx(0)
      }, line.delay)
      return () => clearTimeout(t)
    }
  }, [started, lineIdx, charIdx, lines])

  const currentPartial = started && lineIdx < lines.length
    ? { text: lines[lineIdx].text.slice(0, charIdx), color: lines[lineIdx].color }
    : null

  return { displayed, currentPartial }
}

function Terminal() {
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const { displayed, currentPartial } = useTypewriter(TERMINAL_LINES, started)

  const colorMap = { green: '#4ADE80', blue: '#60A5FA', yellow: '#FBBF24', default: '#E2E8F0' }

  return (
    <div ref={ref} style={{
      background: '#0F1117', borderRadius: 12, padding: '0',
      border: '1px solid #1E2330', overflow: 'hidden',
      fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
    }}>
      <div style={{ background: '#1A1F2E', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #1E2330' }}>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57', display: 'inline-block' }} />
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E', display: 'inline-block' }} />
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840', display: 'inline-block' }} />
        <span style={{ marginLeft: 8, color: '#6B7280', fontSize: 12 }}>lead-enrichment-api — Live Demo</span>
      </div>
      <div style={{ padding: '16px 20px', minHeight: 200 }}>
        {displayed.map((line, i) => (
          <div key={i} style={{ color: colorMap[line.color] || '#E2E8F0', marginBottom: 2, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {line.text || '\u00A0'}
          </div>
        ))}
        {currentPartial && (
          <div style={{ color: colorMap[currentPartial.color] || '#E2E8F0', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {currentPartial.text}<span style={{ animation: 'blink 1s step-end infinite', borderLeft: '2px solid #4ADE80', marginLeft: 1 }} />
          </div>
        )}
        <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
      </div>
    </div>
  )
}

function Tag({ children, accent }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
      background: accent ? '#EEF2FF' : '#F3F4F6',
      color: accent ? '#1B4FD8' : '#374151',
      border: `1px solid ${accent ? '#C7D2FE' : '#E5E7EB'}`,
    }}>
      {children}
    </span>
  )
}

function ProjectCard({ title, description, tags, liveUrl, codeUrl, badge }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '1.75rem',
      border: '1px solid #E5E7EB', transition: 'border-color 0.2s, transform 0.2s',
      display: 'flex', flexDirection: 'column', gap: '1rem',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#1B4FD8'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {badge && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ECFDF5', color: '#059669', fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 20, border: '1px solid #D1FAE5', width: 'fit-content' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
          {badge}
        </span>
      )}
      <div>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>{title}</h3>
        <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.7 }}>{description}</p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {tags.map(t => <Tag key={t} accent={['FastAPI', 'LangChain', 'Claude API', 'Docker', 'ChromaDB'].includes(t)}>{t}</Tag>)}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
        <a href={liveUrl} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px',
          background: '#1B4FD8', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 500,
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#1338B0'}
          onMouseLeave={e => e.currentTarget.style.background = '#1B4FD8'}
        >
          Live Demo ↗
        </a>
        <a href={codeUrl} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px',
          background: '#fff', color: '#374151', borderRadius: 8, fontSize: 13, fontWeight: 500,
          border: '1px solid #E5E7EB', transition: 'border-color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#9CA3AF'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
        >
          GitHub →
        </a>
      </div>
    </div>
  )
}

const SKILLS = [
  { category: 'AI & LLM', items: ['Claude API', 'OpenAI API', 'LangChain', 'RAG Pipelines', 'Prompt Engineering', 'ChromaDB', 'HuggingFace'] },
  { category: 'Automation', items: ['n8n', 'Flowise', 'Make.com', 'RPA', 'Selenium', 'OCR', 'Web Scraping'] },
  { category: 'Backend', items: ['Python', 'FastAPI', 'Django', 'NestJS', 'REST APIs', 'SQLAlchemy', 'SQLite'] },
  { category: 'Cloud & DevOps', items: ['Docker', 'GitHub Actions', 'CI/CD', 'Hugging Face Spaces', 'Git'] },
]

const EXPERIENCE = [
  { role: 'Software Automation Engineer', company: 'Powermatch', date: 'Jan 2026 — Present', location: 'Lahore, Pakistan', desc: 'Backend development in PHP and end-to-end automation workflows using n8n, Zapier, and Adversus.' },
  { role: 'AI Automation Engineer (Team Lead)', company: 'IAU Capital', date: 'Sep 2025 — Present', location: 'UAE (Remote)', desc: 'Leading the Automation Department — guiding developers on AI/LLM integration into business workflows.' },
  { role: 'AI Automation & LLM Application Specialist', company: 'TechnoWIS', date: 'Mar 2025 — Dec 2025', location: 'Lahore, Pakistan', desc: 'Built LLM-powered workflows for OCR, CRM automation, and document processing using n8n, Flowise, and Python.' },
  { role: 'AI Associate Software Engineer', company: 'Crewlogix Technologies', date: 'Dec 2024 — Mar 2025', location: 'Lahore, Pakistan', desc: 'Built LLM applications with Chainlit and YOLO-based computer vision pipelines integrated with n8n.' },
  { role: 'Backend Developer', company: 'TechnoWIS', date: 'Mar 2025 — Dec 2025', location: 'Lahore, Pakistan', desc: 'Designed scalable APIs with NestJS and Django including CRM integrations and background task queues.' },
]

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(249,248,246,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #E5E7EB' : 'none',
        transition: 'all 0.3s',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
            Bisma<span style={{ color: '#1B4FD8' }}>.</span>
          </span>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())} style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 14,
                color: '#6B7280', fontFamily: 'Inter, sans-serif', fontWeight: 500,
                transition: 'color 0.2s', padding: 0,
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#111'}
                onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
              >{l}</button>
            ))}
            <a href="mailto:bismanawaz043@gmail.com" style={{
              padding: '8px 18px', background: '#111', color: '#fff', borderRadius: 8,
              fontSize: 14, fontWeight: 500, transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#333'}
              onMouseLeave={e => e.currentTarget.style.background = '#111'}
            >Hire me</a>
          </div>
        </div>
      </nav>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '140px 2rem 100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#ECFDF5', color: '#059669', fontSize: 13, fontWeight: 500, padding: '5px 14px', borderRadius: 20, border: '1px solid #D1FAE5', marginBottom: '1.5rem' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#059669', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Open to remote UK / US roles
          </div>
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
            I build AI systems<br />
            <span style={{ color: '#1B4FD8' }}>that actually work</span>
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 440 }}>
            Backend Developer and AI Automation Engineer specializing in LLM-powered workflows, RAG pipelines, and production-ready REST APIs. Based in Pakistan, working remotely for global teams.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => scrollTo('projects')} style={{
              padding: '12px 24px', background: '#1B4FD8', color: '#fff', borderRadius: 8,
              fontSize: 15, fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#1338B0'}
              onMouseLeave={e => e.currentTarget.style.background = '#1B4FD8'}
            >View projects →</button>
            <a href="https://linkedin.com/in/bisma-nawaz-6565711a1" target="_blank" rel="noopener noreferrer" style={{
              padding: '12px 24px', background: '#fff', color: '#374151', borderRadius: 8,
              fontSize: 15, fontWeight: 500, border: '1px solid #E5E7EB', transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#9CA3AF'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
            >LinkedIn ↗</a>
          </div>
        </div>
        <div>
          <Terminal />
        </div>
      </section>

      <section id="projects" style={{ background: '#fff', padding: '100px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#1B4FD8', fontWeight: 500 }}>// portfolio</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', marginTop: 8 }}>Featured projects</h2>
            <p style={{ color: '#6B7280', marginTop: 8, maxWidth: 500 }}>Two original, fully deployed AI systems — not just GitHub repos.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem' }}>
            <ProjectCard
              title="AI Lead Enrichment API"
              badge="Live · Deployed"
              description="Scrapes a company website and uses Claude API to extract structured lead data — industry, summary, products, and likely decision-maker titles — as clean JSON via a REST API."
              tags={['FastAPI', 'Claude API', 'BeautifulSoup', 'Docker', 'SQLite', 'GitHub Actions', 'Python']}
              liveUrl="https://bisma225-lead-enrichment-api.hf.space/docs"
              codeUrl="https://github.com/BismaNwaz/lead-enrichment-api"
            />
            <ProjectCard
              title="Document Q&A RAG API"
              badge="Live · Deployed"
              description="Upload any PDF and ask natural language questions about it. Uses LangChain, ChromaDB vector store, and HuggingFace embeddings for retrieval — Claude API generates answers with page-level source citations."
              tags={['LangChain', 'ChromaDB', 'Claude API', 'FastAPI', 'Docker', 'HuggingFace', 'RAG']}
              liveUrl="https://bisma225-document-qa-api.hf.space/docs"
              codeUrl="https://github.com/BismaNwaz/document-qa-api"
            />
          </div>
        </div>
      </section>

      <section id="skills" style={{ padding: '100px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#1B4FD8', fontWeight: 500 }}>// stack</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', marginTop: 8 }}>Skills</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {SKILLS.map(({ category, items }) => (
              <div key={category} style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: '#1B4FD8', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{category}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {items.map(item => (
                    <span key={item} style={{
                      padding: '4px 10px', background: '#F9F8F6', border: '1px solid #E5E7EB',
                      borderRadius: 6, fontSize: 13, color: '#374151', fontFamily: "'Inter', sans-serif",
                    }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" style={{ background: '#fff', padding: '100px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ marginBottom: '3rem' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#1B4FD8', fontWeight: 500 }}>// history</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', marginTop: 8 }}>Experience</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {EXPERIENCE.map((exp, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem', paddingBottom: '2.5rem', marginBottom: '2.5rem', borderBottom: i < EXPERIENCE.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                <div>
                  <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{exp.date}</p>
                  <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>{exp.location}</p>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1rem' }}>{exp.role}</h3>
                    <span style={{ fontSize: 13, color: '#1B4FD8', fontWeight: 500 }}>{exp.company}</span>
                  </div>
                  <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" style={{ padding: '100px 0' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#1B4FD8', fontWeight: 500 }}>// about</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', marginTop: 8, marginBottom: '1.5rem' }}>A bit about me</h2>
          <p style={{ color: '#6B7280', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1rem' }}>
            I'm a Backend Developer and AI Automation Engineer based in Lahore, Pakistan. Over the past two years I've built intelligent automation systems — from n8n pipelines and LLM-powered workflows to production REST APIs — across four different roles, including leading an automation team remotely for a UAE-based company.
          </p>
          <p style={{ color: '#6B7280', fontSize: '1.05rem', lineHeight: 1.8 }}>
            I'm currently expanding into cloud infrastructure and RAG-based AI applications, and looking for remote roles with UK and US companies where I can work on meaningful AI-powered products at a senior level.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: '2rem' }}>
            {[
              { label: 'GitHub', url: 'https://github.com/BismaNwaz' },
              { label: 'LinkedIn', url: 'https://linkedin.com/in/bisma-nawaz-6565711a1' },
              { label: 'Email', url: 'mailto:bismanawaz043@gmail.com' },
            ].map(({ label, url }) => (
              <a key={label} href={url} target={url.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer" style={{
                padding: '8px 20px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14,
                color: '#374151', fontWeight: 500, transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1B4FD8'; e.currentTarget.style.color = '#1B4FD8' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151' }}
              >{label} ↗</a>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" style={{ background: '#111', color: '#fff', padding: '100px 0' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Let's work together
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            I'm open to remote AI Automation and LLM Engineering roles with UK and US companies. If you're building something interesting, I'd love to hear about it.
          </p>
          <a href="mailto:bismanawaz043@gmail.com" style={{
            display: 'inline-block', padding: '14px 32px', background: '#1B4FD8', color: '#fff',
            borderRadius: 8, fontSize: 16, fontWeight: 500, transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#1338B0'}
            onMouseLeave={e => e.currentTarget.style.background = '#1B4FD8'}
          >bismanawaz043@gmail.com</a>
        </div>
      </section>

      <footer style={{ background: '#0A0A0A', color: '#6B7280', padding: '1.5rem 2rem', textAlign: 'center', fontSize: 13 }}>
        <p>© 2026 Bisma Nawaz · Built with React + Vite · Deployed on Vercel</p>
      </footer>
    </div>
  )
}
