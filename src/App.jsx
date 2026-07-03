import { useState, useEffect, useRef } from 'react'

// ─── DATA ───────────────────────────────────────────────────────────────────

const SKILLS = [
  { category: 'AI & LLM', color: '#7C3AED', items: ['Claude API', 'OpenAI API', 'LangChain', 'RAG Pipelines', 'Prompt Engineering', 'ChromaDB', 'HuggingFace Embeddings'] },
  { category: 'Automation', color: '#06B6D4', items: ['n8n', 'Flowise', 'Make.com', 'RPA', 'Selenium', 'OCR', 'Web Scraping', 'Zapier'] },
  { category: 'Backend & APIs', color: '#10B981', items: ['Python', 'FastAPI', 'Django', 'NestJS', 'REST APIs', 'SQLAlchemy', 'PHP'] },
  { category: 'Cloud & DevOps', color: '#EC4899', items: ['Docker', 'GitHub Actions', 'CI/CD', 'Hugging Face Spaces', 'Git', 'Vercel'] },
]

const PROJECTS = [
  {
    tag: 'API · RAG',
    title: 'Document Q&A RAG API',
    description: 'Upload any PDF and ask natural language questions. LangChain retrieves the most relevant chunks from ChromaDB, Claude generates answers with page-level source citations.',
    tech: ['LangChain', 'ChromaDB', 'Claude API', 'FastAPI', 'Docker', 'HuggingFace'],
    live: 'https://bisma225-document-qa-api.hf.space/docs',
    code: 'https://github.com/BismaNwaz/document-qa-api',
    accent: '#7C3AED',
  },
  {
    tag: 'API · LLM',
    title: 'AI Lead Enrichment API',
    description: 'Submit a company URL, get back structured lead data — industry, summary, products, and decision-maker titles — extracted by Claude from the live website.',
    tech: ['FastAPI', 'Claude API', 'BeautifulSoup', 'Docker', 'SQLite', 'GitHub Actions'],
    live: 'https://bisma225-lead-enrichment-api.hf.space/docs',
    code: 'https://github.com/BismaNwaz/lead-enrichment-api',
    accent: '#06B6D4',
  },
  {
    tag: 'Automation · n8n',
    title: 'Amazon → Shopify Lead Generation',
    description: 'Scans Amazon listings to identify associated Shopify stores worldwide, then enriches each lead with verified CEO/CTO names, emails, and contact numbers automatically.',
    tech: ['Flowise', 'n8n', 'Web Scraping', 'Data Enrichment', 'API Integration'],
    accent: '#10B981',
  },
  {
    tag: 'Automation · AI',
    title: 'AI Video Generation Pipeline',
    description: 'Fully automated marketing video creator — scrapes website content, processes it with NLP, then feeds structured descriptions into an AI video generation platform.',
    tech: ['Python', 'n8n', 'NLP', 'Web Scraping', 'AI Video API'],
    accent: '#EC4899',
  },
  {
    tag: 'Voice AI · Deployed',
    title: 'AI Voice Chatbot — MoltyFoam',
    description: 'Production voice-enabled AI chatbot deployed at MoltyFoam. Customers get instant voice assistance for queries and product guidance via speech recognition and TTS.',
    tech: ['Python', 'Chainlit', 'Speech Recognition', 'TTS', 'LLM Integration'],
    accent: '#F59E0B',
  },
  {
    tag: 'Automation · n8n',
    title: 'LinkedIn Post Automation',
    description: 'Sources trending content via Feedly and Tavily, transforms insights into structured posts, and publishes them end-to-end — consistent, data-driven social media with zero manual work.',
    tech: ['n8n', 'Feedly API', 'Tavily', 'LLM', 'Social Automation'],
    accent: '#7C3AED',
  },
]

const EXPERIENCE = [
  { role: 'Software Automation Engineer', company: 'Powermatch', date: 'Jan 2026 — Present', location: 'Lahore, Pakistan', desc: 'Backend development in PHP and end-to-end automation workflows using n8n, Zapier, and Adversus. Integrating internal systems and third-party platforms via APIs and webhooks.' },
  { role: 'AI Automation Engineer · Team Lead', company: 'IAU Capital', date: 'Sep 2025 — Present', location: 'UAE · Remote', desc: 'Leading the Automation Department — guiding a team of developers on end-to-end AI/LLM automation initiatives, ensuring delivery quality and technical execution.' },
  { role: 'AI Automation & LLM Application Specialist', company: 'TechnoWIS', date: 'Mar – Dec 2025', location: 'Lahore, Pakistan', desc: 'Built LLM-powered workflows for OCR, CRM automation, and document processing using n8n, Flowise, Python, and Make.com.' },
  { role: 'AI Associate Software Engineer', company: 'Crewlogix Technologies', date: 'Dec 2024 – Mar 2025', location: 'Lahore, Pakistan', desc: 'Built LLM applications with Chainlit and YOLO-based computer vision pipelines integrated with n8n for automated data processing.' },
  { role: 'Backend Developer', company: 'TechnoWIS', date: 'Mar – Dec 2025', location: 'Lahore, Pakistan', desc: 'Designed scalable APIs with NestJS and Django including CRM integrations, authentication systems, and background task queues.' },
]

const TERMINAL_LINES = [
  { text: '$ curl -X POST https://bisma225-lead-enrichment-api.hf.space/enrich \\', type: 'cmd' },
  { text: "    -d '{\"url\": \"https://stripe.com\"}'", type: 'cmd' },
  { text: '', type: 'blank' },
  { text: '{', type: 'bracket' },
  { text: '  "company_name": "Stripe",', type: 'string' },
  { text: '  "industry": "Financial Technology / Payment Processing",', type: 'string' },
  { text: '  "products_or_services": ["Payments", "Billing", "Connect"],', type: 'array' },
  { text: '  "likely_decision_makers": ["CTO", "VP Engineering", "CFO"],', type: 'array' },
  { text: '  "summary": "Stripe provides payment infrastructure for the internet..."', type: 'string' },
  { text: '}', type: 'bracket' },
]

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useTypewriter(lines, started) {
  const [displayed, setDisplayed] = useState([])
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)

  useEffect(() => {
    if (!started || lineIdx >= lines.length) return
    const line = lines[lineIdx]
    if (charIdx < line.text.length) {
      const t = setTimeout(() => setCharIdx(c => c + 1), 14)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setDisplayed(d => [...d, line])
      setLineIdx(l => l + 1)
      setCharIdx(0)
    }, line.type === 'blank' ? 5 : 30)
    return () => clearTimeout(t)
  }, [started, lineIdx, charIdx, lines])

  const currentPartial = started && lineIdx < lines.length
    ? { ...lines[lineIdx], text: lines[lineIdx].text.slice(0, charIdx) }
    : null

  return { displayed, currentPartial }
}

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────

function LiveBadge() {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(16,185,129,0.12)', color:'#10B981', fontSize:12, fontWeight:600, padding:'4px 12px', borderRadius:20, border:'1px solid rgba(16,185,129,0.25)', letterSpacing:'0.03em' }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:'#10B981', display:'inline-block', animation:'pulse 2s infinite' }} />
      Live · Deployed
    </span>
  )
}

function Tag({ children, accent }) {
  return (
    <span style={{
      display:'inline-block', padding:'3px 10px', borderRadius:6,
      fontSize:12, fontFamily:"'JetBrains Mono', monospace",
      background: accent ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.05)',
      color: accent ? '#A78BFA' : '#94A3B8',
      border:`1px solid ${accent ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.08)'}`,
    }}>{children}</span>
  )
}

function GlowDot({ color = '#7C3AED' }) {
  return <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:color, boxShadow:`0 0 8px ${color}`, animation:'pulse 2s infinite' }} />
}

// ─── TERMINAL ────────────────────────────────────────────────────────────────

function Terminal() {
  const { ref, inView } = useInView(0.3)
  const { displayed, currentPartial } = useTypewriter(TERMINAL_LINES, inView)

  const colorMap = {
    cmd: '#94A3B8',
    blank: 'transparent',
    bracket: '#A78BFA',
    string: '#10B981',
    array: '#06B6D4',
  }

  return (
    <div ref={ref} style={{
      background:'#060810', borderRadius:14, overflow:'hidden',
      border:'1px solid rgba(124,58,237,0.3)',
      boxShadow:'0 0 40px rgba(124,58,237,0.15), 0 20px 60px rgba(0,0,0,0.5)',
      animation: inView ? 'slideUp 0.6s ease forwards' : 'none',
    }}>
      <div style={{ background:'#0D1021', padding:'12px 16px', display:'flex', alignItems:'center', gap:8, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ width:12, height:12, borderRadius:'50%', background:'#FF5F57' }} />
        <span style={{ width:12, height:12, borderRadius:'50%', background:'#FEBC2E' }} />
        <span style={{ width:12, height:12, borderRadius:'50%', background:'#28C840' }} />
        <span style={{ marginLeft:8, color:'#475569', fontSize:12, fontFamily:"'JetBrains Mono', monospace" }}>~/lead-enrichment-api · live demo</span>
        <LiveBadge />
      </div>
      <div style={{ padding:'20px 24px', minHeight:240, fontFamily:"'JetBrains Mono', monospace", fontSize:13, lineHeight:1.7 }}>
        {displayed.map((line, i) => (
          <div key={i} style={{ color: colorMap[line.type], marginBottom:1, whiteSpace:'pre-wrap', wordBreak:'break-all' }}>
            {line.text || '\u00A0'}
          </div>
        ))}
        {currentPartial && (
          <div style={{ color: colorMap[currentPartial.type], whiteSpace:'pre-wrap', wordBreak:'break-all' }}>
            {currentPartial.text}
            <span style={{ borderLeft:'2px solid #7C3AED', marginLeft:1, animation:'blink 1s step-end infinite' }} />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PROJECT CARD ────────────────────────────────────────────────────────────

function ProjectCard({ project, index }) {
  const { ref, inView } = useInView(0.1)
  const [hovered, setHovered] = useState(false)

  return (
    <div ref={ref} style={{
      background: hovered ? '#0D1121' : '#080E1A',
      borderRadius:14, padding:'1.75rem',
      border:`1px solid ${hovered ? project.accent + '55' : 'rgba(255,255,255,0.07)'}`,
      transition:'all 0.3s',
      transform: inView ? 'translateY(0)' : 'translateY(24px)',
      opacity: inView ? 1 : 0,
      transitionDelay: `${index * 0.08}s`,
      display:'flex', flexDirection:'column', gap:'1rem',
      position:'relative', overflow:'hidden',
      boxShadow: hovered ? `0 0 30px ${project.accent}22, 0 8px 32px rgba(0,0,0,0.4)` : '0 4px 20px rgba(0,0,0,0.3)',
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, transparent, ${project.accent}, transparent)`, borderRadius:'14px 14px 0 0' }} />}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:11, color: project.accent, background:`${project.accent}18`, padding:'3px 10px', borderRadius:20, border:`1px solid ${project.accent}33`, letterSpacing:'0.05em', fontWeight:600 }}>
          {project.tag}
        </span>
        {project.live && <LiveBadge />}
      </div>
      <div>
        <h3 style={{ fontFamily:"'Space Grotesk', sans-serif", fontSize:'1.1rem', fontWeight:700, marginBottom:8, color:'#F1F5F9' }}>{project.title}</h3>
        <p style={{ color:'#64748B', fontSize:13.5, lineHeight:1.7 }}>{project.description}</p>
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
        {project.tech.map(t => <Tag key={t}>{t}</Tag>)}
      </div>
      {(project.live || project.code) && (
        <div style={{ display:'flex', gap:10, marginTop:'auto', paddingTop:4 }}>
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" style={{
              display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px',
              background: project.accent, color:'#fff', borderRadius:8, fontSize:13, fontWeight:600,
              transition:'opacity 0.2s', boxShadow:`0 4px 14px ${project.accent}44`,
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >Live Demo ↗</a>
          )}
          {project.code && (
            <a href={project.code} target="_blank" rel="noopener noreferrer" style={{
              display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px',
              background:'transparent', color:'#94A3B8', borderRadius:8, fontSize:13, fontWeight:500,
              border:'1px solid rgba(255,255,255,0.1)', transition:'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#94A3B8' }}
            >GitHub →</a>
          )}
        </div>
      )}
    </div>
  )
}

// ─── SECTION HEADER ──────────────────────────────────────────────────────────

function SectionHeader({ eyebrow, title, subtitle }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} style={{ marginBottom:'3.5rem', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)', transition:'all 0.5s' }}>
      <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:13, color:'#7C3AED', fontWeight:600, letterSpacing:'0.05em' }}>{eyebrow}</span>
      <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', fontWeight:700, letterSpacing:'-0.02em', marginTop:6, color:'#F1F5F9' }}>{title}</h2>
      {subtitle && <p style={{ color:'#64748B', marginTop:10, maxWidth:500, fontSize:15 }}>{subtitle}</p>}
    </div>
  )
}

// ─── GRID BG ────────────────────────────────────────────────────────────────

function GridBg() {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:'linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)',
        backgroundSize:'60px 60px',
      }} />
      <div style={{ position:'absolute', top:'20%', left:'10%', width:400, height:400, borderRadius:'50%', background:'rgba(124,58,237,0.06)', filter:'blur(80px)', animation:'float 8s ease-in-out infinite' }} />
      <div style={{ position:'absolute', bottom:'10%', right:'5%', width:300, height:300, borderRadius:'50%', background:'rgba(6,182,212,0.05)', filter:'blur(60px)', animation:'float 10s ease-in-out infinite reverse' }} />
    </div>
  )
}

// ─── NAV ────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:100,
      background: scrolled ? 'rgba(8,11,20,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      transition:'all 0.3s',
    }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 2rem', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:700, fontSize:'1.1rem', letterSpacing:'-0.02em' }}>
          Bisma Nawaz<span style={{ color:'#7C3AED' }}>.</span>
        </span>
        <div style={{ display:'flex', gap:'2rem', alignItems:'center' }}>
          {['Projects','Skills','Experience','About','Contact'].map(l => (
            <button key={l} onClick={() => document.getElementById(l.toLowerCase())?.scrollIntoView({ behavior:'smooth' })} style={{
              background:'none', border:'none', fontSize:14, color:'#64748B',
              fontFamily:'Inter, sans-serif', fontWeight:500, transition:'color 0.2s', padding:0,
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#F1F5F9'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
            >{l}</button>
          ))}
          <a href="mailto:bismanawaz043@gmail.com" style={{
            padding:'8px 18px', background:'#7C3AED', color:'#fff', borderRadius:8,
            fontSize:14, fontWeight:600, transition:'all 0.2s',
            boxShadow:'0 4px 14px rgba(124,58,237,0.4)',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#6D28D9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.transform = 'translateY(0)' }}
          >Hire me</a>
        </div>
      </div>
    </nav>
  )
}

// ─── APP ────────────────────────────────────────────────────────────────────

export default function App() {
  const { ref: heroRef, inView: heroIn } = useInView(0.1)

  return (
    <div style={{ minHeight:'100vh', background:'#080B14' }}>
      <Nav />

      {/* HERO */}
      <section style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', overflow:'hidden' }}>
        <GridBg />
        <div ref={heroRef} style={{ maxWidth:1100, margin:'0 auto', padding:'120px 2rem 80px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'center', position:'relative', zIndex:1, width:'100%' }}>
          <div style={{ opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(24px)', transition:'all 0.7s ease' }}>
            <h1 style={{ fontSize:'clamp(2.4rem,5vw,3.6rem)', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.08, marginBottom:'1.25rem', color:'#F1F5F9' }}>
              AI systems<br />
              <span style={{ background:'linear-gradient(135deg, #7C3AED, #06B6D4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                that ship.
              </span>
            </h1>
            <p style={{ color:'#64748B', fontSize:'1.05rem', lineHeight:1.75, marginBottom:'2rem', maxWidth:420 }}>
              Backend Developer & AI Automation Engineer. I build LLM-powered workflows, RAG pipelines, and production REST APIs — and I deploy them. Based in Pakistan, working for global teams.
            </p>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:'2.5rem' }}>
              <button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior:'smooth' })} style={{
                padding:'12px 24px', background:'#7C3AED', color:'#fff', borderRadius:8,
                fontSize:15, fontWeight:600, border:'none',
                boxShadow:'0 4px 20px rgba(124,58,237,0.5)',
                transition:'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(124,58,237,0.6)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.5)' }}
              >View projects →</button>
              <a href="https://linkedin.com/in/bisma-nawaz-6565711a1" target="_blank" rel="noopener noreferrer" style={{
                padding:'12px 24px', background:'rgba(255,255,255,0.05)', color:'#94A3B8', borderRadius:8,
                fontSize:15, fontWeight:500, border:'1px solid rgba(255,255,255,0.1)', transition:'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#94A3B8' }}
              >LinkedIn ↗</a>
            </div>
            <div style={{ display:'flex', gap:'2rem' }}>
              {[['2+', 'Years building AI systems'], ['6+', 'Projects in production'], ['2', 'Live deployed APIs']].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontFamily:"'Space Grotesk', sans-serif", fontSize:'1.6rem', fontWeight:700, color:'#7C3AED' }}>{num}</div>
                  <div style={{ fontSize:12, color:'#475569', marginTop:2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(24px)', transition:'all 0.7s ease 0.2s' }}>
            <Terminal />
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ padding:'100px 0', background:'#050709' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 2rem' }}>
          <SectionHeader eyebrow="" title="Projects" subtitle="Six production systems — from LLM APIs to voice chatbots and automation pipelines." />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(340px, 1fr))', gap:'1.25rem' }}>
            {PROJECTS.map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ padding:'100px 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 2rem' }}>
          <SectionHeader eyebrow="" title="Skills" subtitle="What I actually use, day to day." />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'1.25rem' }}>
            {SKILLS.map(({ category, color, items }) => (
              <div key={category} style={{ background:'#080E1A', borderRadius:12, padding:'1.5rem', border:'1px solid rgba(255,255,255,0.06)', transition:'border-color 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${color}44`}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
              >
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'1rem' }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:color, boxShadow:`0 0 8px ${color}` }} />
                  <h3 style={{ fontFamily:"'Space Grotesk', sans-serif", fontSize:13, fontWeight:700, color, textTransform:'uppercase', letterSpacing:'0.07em' }}>{category}</h3>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {items.map(item => (
                    <span key={item} style={{ padding:'4px 10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:6, fontSize:12.5, color:'#94A3B8' }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" style={{ padding:'100px 0', background:'#050709' }}>
        <div style={{ maxWidth:900, margin:'0 auto', padding:'0 2rem' }}>
          <SectionHeader eyebrow="" title="Experience" />
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:1, background:'linear-gradient(to bottom, #7C3AED, transparent)' }} />
            {EXPERIENCE.map((exp, i) => (
              <div key={i} style={{ paddingLeft:'2rem', paddingBottom:'2.5rem', position:'relative' }}>
                <div style={{ position:'absolute', left:-4, top:4, width:9, height:9, borderRadius:'50%', background:'#7C3AED', boxShadow:'0 0 12px rgba(124,58,237,0.8)', border:'2px solid #080B14' }} />
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:4, marginBottom:6 }}>
                  <div>
                    <h3 style={{ fontFamily:"'Space Grotesk', sans-serif", fontWeight:600, fontSize:'1rem', color:'#F1F5F9' }}>{exp.role}</h3>
                    <span style={{ fontSize:13, color:'#7C3AED', fontWeight:500 }}>{exp.company} · {exp.location}</span>
                  </div>
                  <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:12, color:'#475569', background:'rgba(255,255,255,0.04)', padding:'3px 10px', borderRadius:6, border:'1px solid rgba(255,255,255,0.06)', whiteSpace:'nowrap' }}>{exp.date}</span>
                </div>
                <p style={{ fontSize:13.5, color:'#64748B', lineHeight:1.6 }}>{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding:'100px 0' }}>
        <div style={{ maxWidth:700, margin:'0 auto', padding:'0 2rem', textAlign:'center' }}>
          <SectionHeader eyebrow="" title="A bit about me" />
          <p style={{ color:'#64748B', fontSize:'1.05rem', lineHeight:1.8, marginBottom:'1.25rem' }}>
            I'm a Backend Developer and AI Automation Engineer based in Lahore, Pakistan. Over the past two years I've built intelligent automation systems from n8n pipelines and LLM-powered workflows to production REST APIs across four roles, including leading an automation team remotely for a UAE-based company.
          </p>
          <p style={{ color:'#64748B', fontSize:'1.05rem', lineHeight:1.8, marginBottom:'2.5rem' }}>
            I'm currently building my cloud infrastructure skills (Docker, CI/CD) and expanding into RAG-based AI applications. I'm looking for remote roles with UK and US companies where I can work on meaningful AI-powered products at a senior level.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            {[
              { label:'GitHub', url:'https://github.com/BismaNwaz' },
              { label:'LinkedIn', url:'https://linkedin.com/in/bisma-nawaz-6565711a1' },
              { label:'Email', url:'mailto:bismanawaz043@gmail.com' },
            ].map(({ label, url }) => (
              <a key={label} href={url} target={url.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer" style={{
                padding:'10px 22px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8,
                fontSize:14, color:'#94A3B8', fontWeight:500, transition:'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.color = '#A78BFA'; e.currentTarget.style.background = 'rgba(124,58,237,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'transparent' }}
              >{label} ↗</a>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding:'120px 0', background:'#050709', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:300, borderRadius:'50%', background:'rgba(124,58,237,0.06)', filter:'blur(80px)', pointerEvents:'none' }} />
        <div style={{ maxWidth:700, margin:'0 auto', padding:'0 2rem', textAlign:'center', position:'relative', zIndex:1 }}>
          <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:13, color:'#7C3AED', fontWeight:600, letterSpacing:'0.05em' }}></span>
          <h2 style={{ fontSize:'clamp(2rem,5vw,3rem)', fontWeight:800, letterSpacing:'-0.03em', marginTop:8, marginBottom:'1rem', color:'#F1F5F9' }}>
            Let's build something
          </h2>
          {/* <p style={{ color:'#64748B', fontSize:'1.05rem', lineHeight:1.7, marginBottom:'2.5rem' }}>
            Open to remote AI Automation and LLM Engineering roles with UK and US companies. Drop me a line.
          </p> */}
          <a href="mailto:bismanawaz043@gmail.com" style={{
            display:'inline-block', padding:'16px 36px',
            background:'linear-gradient(135deg, #7C3AED, #5B21B6)',
            color:'#fff', borderRadius:10, fontSize:16, fontWeight:600,
            boxShadow:'0 8px 32px rgba(124,58,237,0.5)',
            transition:'all 0.3s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(124,58,237,0.65)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,0.5)' }}
          >bismanawaz043@gmail.com ↗</a>
        </div>
      </section>

      <footer style={{ background:'#030406', color:'#374151', padding:'1.5rem 2rem', textAlign:'center', fontSize:12, borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <p>© 2026 Bisma Nawaz · Built with React + Vite · Deployed on Vercel</p>
      </footer>
    </div>
  )
}
