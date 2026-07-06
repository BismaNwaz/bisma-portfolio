import { useState, useEffect, useRef, useCallback } from 'react'

// ─── DATA ────────────────────────────────────────────────────────────────────

const SKILLS = [
  { category: 'AI & LLM', color: '#7C3AED', items: ['Claude API', 'OpenAI API', 'LangChain', 'RAG Pipelines', 'Prompt Engineering', 'ChromaDB', 'HuggingFace Embeddings'] },
  { category: 'Automation', color: '#06B6D4', items: ['n8n', 'Flowise', 'Make.com', 'RPA', 'Selenium', 'OCR', 'Web Scraping', 'Zapier'] },
  { category: 'Backend & APIs', color: '#10B981', items: ['Python', 'FastAPI', 'Django', 'NestJS', 'REST APIs', 'SQLAlchemy', 'PHP'] },
  { category: 'Cloud & DevOps', color: '#EC4899', items: ['Docker', 'GitHub Actions', 'CI/CD', 'Hugging Face Spaces', 'Git', 'Vercel'] },
]

const PROJECTS = [
  {
    tag: 'API · RAG', title: 'Document Q&A RAG API',
    description: 'Upload any PDF and ask natural language questions. LangChain retrieves the most relevant chunks from ChromaDB, Claude generates answers with page-level source citations.',
    fullDescription: 'A complete Retrieval-Augmented Generation pipeline built from scratch. PDFs are ingested, chunked using RecursiveCharacterTextSplitter, embedded with HuggingFace sentence transformers (all-MiniLM-L6-v2), and stored in ChromaDB. On each question, the top-4 semantically similar chunks are retrieved and passed to Claude API with a structured prompt returning accurate answers with page-level source traceability.',
    tech: ['LangChain', 'ChromaDB', 'Claude API', 'FastAPI', 'Docker', 'HuggingFace', 'Python'],
    live: 'https://bisma225-document-qa-api.hf.space/docs', code: 'https://github.com/BismaNwaz/document-qa-api', accent: '#7C3AED',
  },
  {
    tag: 'API · LLM', title: 'AI Lead Enrichment API',
    description: 'Submit a company URL, get back structured lead data industry, summary, products, and decision-maker titles extracted by Claude from the live website.',
    fullDescription: 'A production-grade lead intelligence service. Given a company URL, the API scrapes using BeautifulSoup, sends content to Claude API with a structured extraction prompt, and returns clean JSON: industry, company summary, products list, decision-maker titles, and contact info. SQLite caching prevents redundant LLM calls. Containerized with Docker, deployed with GitHub Actions CI/CD.',
    tech: ['FastAPI', 'Claude API', 'BeautifulSoup', 'Docker', 'SQLite', 'GitHub Actions', 'Python'],
    live: 'https://bisma225-lead-enrichment-api.hf.space/docs', code: 'https://github.com/BismaNwaz/lead-enrichment-api', accent: '#06B6D4',
  },
  {
    tag: 'Automation · n8n', title: 'Amazon → Shopify Lead Generation',
    description: 'Scans Amazon listings to identify associated Shopify stores worldwide, then enriches each lead with verified CEO/CTO names, emails, and contact numbers automatically.',
    fullDescription: 'An end-to-end lead generation pipeline built with Flowise and n8n. Scans Amazon product listings, identifies underlying Shopify stores globally, then runs an enrichment workflow to extract verified decision-maker details. Enabled the sales team to identify 200+ qualified stores per day, replacing hours of manual research.',
    tech: ['Flowise', 'n8n', 'Web Scraping', 'Data Enrichment', 'API Integration', 'Python'], accent: '#10B981',
  },
  {
    tag: 'Automation · AI', title: 'AI Video Generation Pipeline',
    description: 'Fully automated marketing video creator scrapes website content, processes it with NLP, then feeds structured descriptions into an AI video generation platform.',
    fullDescription: 'A zero-touch marketing automation pipeline. The workflow scrapes campaign content from company websites, processes it using NLP to extract key messages, then structures and feeds the output into an AI video generation platform. Result: ready-to-publish promotional videos generated without any manual input.',
    tech: ['Python', 'n8n', 'NLP', 'Web Scraping', 'AI Video API'], accent: '#EC4899',
  },
  {
    tag: 'Voice AI · Deployed', title: 'AI Voice Chatbot — MoltyFoam',
    description: 'Production voice-enabled AI chatbot deployed at MoltyFoam. Customers get instant voice assistance for queries and product guidance via speech recognition and TTS.',
    fullDescription: 'A production-deployed voice AI system built with Python and enhanced with Chainlit. Deployed at MoltyFoam Pakistan handling real customer interactions processing spoken queries via speech recognition, generating AI-driven responses, and delivering them via text-to-speech. Also served as voice module for Adovvy\'s customer service AI, demonstrated live at a conference.',
    tech: ['Python', 'Chainlit', 'Speech Recognition', 'TTS', 'LLM Integration'], accent: '#F59E0B',
  },
  {
    tag: 'Automation · n8n', title: 'Social Media Automation Suite',
    description: 'Sources trending content via Feedly and Tavily, transforms insights into structured posts, and auto-publishes ~1,000 targeted comments across Reddit, Twitter, and LinkedIn daily.',
    fullDescription: 'A comprehensive social media automation system. Feedly and Tavily monitor industry feeds and identify trending pain points daily. The pipeline transforms insights into structured LinkedIn posts and targeted comment responses, then auto-publishes across Reddit, Twitter, and LinkedIn delivering ~1,000 published comments and consistent post output, replacing hours of daily manual content work.',
    tech: ['n8n', 'Feedly API', 'Tavily', 'LLM', 'LinkedIn API', 'Social Automation'], accent: '#7C3AED',
  },
]

const EXPERIENCE = [
  { role: 'Software Automation Engineer', company: 'Powermatch', date: 'Jan 2026 — Present', location: 'Lahore, Pakistan', desc: 'Built and maintain 30+ automation workflows across recruitment, sales, and HR. Designed an AI hiring signal system, a meeting note generator that transcribes and auto-publishes to the platform, and reporting pipelines reducing agent tasks from hours to under 2 minutes.' },
  { role: 'AI Automation Engineer · Team Lead', company: 'IAU Capital', date: 'Sep 2025 — Present', location: 'UAE · Remote', desc: 'Lead a 3-person team delivering AI-powered systems for a UAE property and visa services firm. Built a fully automated CRM for visa processing with Telegram/WhatsApp integration, and an Emirates property ROI calculator replacing manual calculations.' },
  { role: 'AI Automation & LLM Application Specialist', company: 'TechnoWIS', date: 'Mar – Dec 2025', location: 'Lahore, Pakistan', desc: 'Delivered 20+ LLM automation workflows. Built a LinkedIn post generator and auto-comment system publishing ~1,000 targeted comments daily across Reddit, Twitter, and LinkedIn. Integrated Feedly for automated pain-point discovery and content sourcing.' },
  { role: 'AI Associate Software Engineer', company: 'Crewlogix Technologies', date: 'Dec 2024 – Mar 2025', location: 'Lahore, Pakistan', desc: 'Built a YOLO-based computer vision pipeline across 6 camera feeds monitoring worker presence and hours in real time demonstrated live at a conference. Developed the Adovvy voice AI module, deployed in production at MoltyFoam Pakistan.' },
  { role: 'Backend Developer', company: 'TechnoWIS', date: 'Mar – Dec 2025', location: 'Lahore, Pakistan', desc: 'Built 15–20 backend APIs with NestJS and Django. Designed a Flowise-based lead discovery agent identifying 200+ qualified Shopify stores from Amazon listings per day, replacing hours of manual research.' },
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

// ─── HOOKS ────────────────────────────────────────────────────────────────────

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
    const t = setTimeout(() => { setDisplayed(d => [...d, line]); setLineIdx(l => l + 1); setCharIdx(0) }, line.type === 'blank' ? 5 : 30)
    return () => clearTimeout(t)
  }, [started, lineIdx, charIdx, lines])
  const currentPartial = started && lineIdx < lines.length ? { ...lines[lineIdx], text: lines[lineIdx].text.slice(0, charIdx) } : null
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

function useCountUp(target, started, duration = 1500) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    const num = parseInt(target); const steps = 40; const step = num / steps; const interval = duration / steps; let current = 0
    const t = setInterval(() => { current += step; if (current >= num) { setCount(num); clearInterval(t) } else setCount(Math.floor(current)) }, interval)
    return () => clearInterval(t)
  }, [started, target, duration])
  return count
}

// ─── NEURAL BURST ANIMATION ──────────────────────────────────────────────────

function NeuralBurst({ color, onDone }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width = canvas.offsetWidth
    const H = canvas.height = canvas.offsetHeight
    const cx = W / 2, cy = H / 2

    // Generate nodes radiating from center
    const nodeCount = 12
    const nodes = Array.from({ length: nodeCount }, (_, i) => {
      const angle = (i / nodeCount) * Math.PI * 2 + Math.random() * 0.3
      const dist = 40 + Math.random() * (Math.min(W, H) * 0.35)
      return {
        x: cx, y: cy,
        tx: cx + Math.cos(angle) * dist,
        ty: cy + Math.sin(angle) * dist,
        size: 3 + Math.random() * 4,
        speed: 0.04 + Math.random() * 0.04,
        progress: 0,
        pulse: 0,
        connections: [],
      }
    })

    // Add sub-nodes connected to outer nodes
    const subNodes = nodes.slice(0, 6).map(n => ({
      x: n.tx, y: n.ty,
      tx: n.tx + (Math.random() - 0.5) * 80,
      ty: n.ty + (Math.random() - 0.5) * 80,
      size: 2 + Math.random() * 2,
      speed: 0.05 + Math.random() * 0.05,
      progress: 0,
      parent: n,
    }))

    let startTime = null
    let raf

    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `${r},${g},${b}`
    }
    const rgb = hexToRgb(color)

    const draw = (ts) => {
      if (!startTime) startTime = ts
      const elapsed = ts - startTime
      const totalDuration = 900
      const globalProgress = Math.min(elapsed / totalDuration, 1)

      ctx.clearRect(0, 0, W, H)

      // Update and draw main nodes
      nodes.forEach((n, i) => {
        n.progress = Math.min(n.progress + n.speed, 1)
        const eased = 1 - Math.pow(1 - n.progress, 3)
        n.x = cx + (n.tx - cx) * eased
        n.y = cy + (n.ty - cy) * eased
        n.pulse = (n.pulse + 0.08) % (Math.PI * 2)

        const fadeOut = globalProgress > 0.7 ? 1 - (globalProgress - 0.7) / 0.3 : 1
        const alpha = n.progress * fadeOut

        // Draw connection line from center
        if (n.progress > 0.1) {
          const grad = ctx.createLinearGradient(cx, cy, n.x, n.y)
          grad.addColorStop(0, `rgba(${rgb},${0.6 * alpha})`)
          grad.addColorStop(1, `rgba(${rgb},${0.1 * alpha})`)
          ctx.beginPath()
          ctx.moveTo(cx, cy)
          ctx.lineTo(n.x, n.y)
          ctx.strokeStyle = grad
          ctx.lineWidth = 1.5
          ctx.stroke()

          // Animated dot moving along the line
          if (n.progress < 0.9) {
            const dotX = cx + (n.x - cx) * n.progress
            const dotY = cy + (n.y - cy) * n.progress
            ctx.beginPath()
            ctx.arc(dotX, dotY, 2, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${rgb},${0.8 * alpha})`
            ctx.fill()
          }
        }

        // Draw node
        const pulseSize = n.size + Math.sin(n.pulse) * 1.5
        // Outer glow
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pulseSize * 4)
        glow.addColorStop(0, `rgba(${rgb},${0.3 * alpha})`)
        glow.addColorStop(1, `rgba(${rgb},0)`)
        ctx.beginPath()
        ctx.arc(n.x, n.y, pulseSize * 4, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()
        // Core
        ctx.beginPath()
        ctx.arc(n.x, n.y, pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},${alpha})`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(n.x, n.y, pulseSize * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${0.8 * alpha})`
        ctx.fill()
      })

      // Draw connections between nearby nodes
      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < 120 && a.progress > 0.5 && b.progress > 0.5) {
            const fadeOut = globalProgress > 0.7 ? 1 - (globalProgress - 0.7) / 0.3 : 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(${rgb},${0.15 * fadeOut})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        })
      })

      // Sub-nodes
      subNodes.forEach(n => {
        if (n.parent.progress < 0.7) return
        n.progress = Math.min(n.progress + n.speed, 1)
        const eased = 1 - Math.pow(1 - n.progress, 3)
        n.x = n.parent.tx + (n.tx - n.parent.tx) * eased
        n.y = n.parent.ty + (n.ty - n.parent.ty) * eased
        const fadeOut = globalProgress > 0.7 ? 1 - (globalProgress - 0.7) / 0.3 : 1
        const alpha = n.progress * fadeOut

        ctx.beginPath()
        ctx.moveTo(n.parent.tx, n.parent.ty); ctx.lineTo(n.x, n.y)
        ctx.strokeStyle = `rgba(${rgb},${0.3 * alpha})`
        ctx.lineWidth = 0.8; ctx.stroke()

        ctx.beginPath()
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},${alpha})`
        ctx.fill()
      })

      // Center burst
      const burstAlpha = Math.max(0, 1 - globalProgress * 2)
      if (burstAlpha > 0) {
        const burst = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30 + globalProgress * 20)
        burst.addColorStop(0, `rgba(${rgb},${0.6 * burstAlpha})`)
        burst.addColorStop(1, `rgba(${rgb},0)`)
        ctx.beginPath()
        ctx.arc(cx, cy, 30 + globalProgress * 20, 0, Math.PI * 2)
        ctx.fillStyle = burst; ctx.fill()
      }

      if (globalProgress < 1) raf = requestAnimationFrame(draw)
      else onDone()
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [color, onDone])

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 10, borderRadius: 14,
    }} />
  )
}

// ─── PARTICLES ────────────────────────────────────────────────────────────────

function Particles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = canvas.width = window.innerWidth, h = canvas.height = window.innerHeight
    const particles = Array.from({ length: 50 }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, size: Math.random() * 1.2 + 0.4, opacity: Math.random() * 0.35 + 0.08 }))
    let raf
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139,92,246,${p.opacity})`; ctx.fill()
      })
      particles.forEach((a, i) => particles.slice(i + 1).forEach(b => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y)
        if (dist < 100) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.strokeStyle = `rgba(139,92,246,${0.05 * (1 - dist / 100)})`; ctx.lineWidth = 0.5; ctx.stroke() }
      }))
      raf = requestAnimationFrame(draw)
    }
    draw()
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.5 }} />
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function LiveBadge() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.12)', color: '#10B981', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(16,185,129,0.25)', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
      Live · Deployed
    </span>
  )
}

// ─── PROJECT MODAL ────────────────────────────────────────────────────────────

function ProjectModal({ project, onClose }) {
  const [visible, setVisible] = useState(false)
  const [tagIdx, setTagIdx] = useState(0)

  useEffect(() => {
    setTimeout(() => setVisible(true), 10)
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [])

  // Stagger-compile tags
  useEffect(() => {
    if (!visible) return
    const t = setInterval(() => setTagIdx(i => { if (i >= project.tech.length) { clearInterval(t); return i } return i + 1 }), 120)
    return () => clearInterval(t)
  }, [visible, project.tech.length])

  const handleClose = () => { setVisible(false); setTimeout(onClose, 350) }

  return (
    <div onClick={handleClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: visible ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0)', backdropFilter: visible ? 'blur(10px)' : 'blur(0px)', transition: 'all 0.35s ease', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#0A0D1A', borderRadius: '20px 20px 0 0', border: `1px solid ${project.accent}44`, borderBottom: 'none', maxWidth: 720, width: '100%', padding: '2.5rem', transform: visible ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)', maxHeight: '85vh', overflowY: 'auto', position: 'relative', boxShadow: `0 -20px 80px ${project.accent}22, 0 -4px 40px rgba(0,0,0,0.6)` }}>

        {/* animated top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)`, borderRadius: 2, animation: 'scanline 2s linear infinite' }} />

        {/* circuit header decoration */}
        <div style={{ position: 'absolute', top: 12, right: 60, opacity: 0.15 }}>
          <svg width="80" height="40" viewBox="0 0 80 40">
            <path d="M0 20 H20 V5 H40 V20 H60 V35 H80" stroke={project.accent} strokeWidth="1.5" fill="none" strokeDasharray="4 2" style={{ animation: 'dash 3s linear infinite' }} />
            <circle cx="20" cy="5" r="3" fill={project.accent} />
            <circle cx="40" cy="20" r="3" fill={project.accent} />
            <circle cx="60" cy="35" r="3" fill={project.accent} />
          </svg>
        </div>

        {/* drag handle */}
        <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 2, margin: '0 auto 2rem' }} />

        {/* close */}
        <button onClick={handleClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: 32, height: 32, color: '#94A3B8', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94A3B8' }}
        >×</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: project.accent, background: `${project.accent}18`, padding: '3px 10px', borderRadius: 20, border: `1px solid ${project.accent}33`, fontWeight: 600 }}>{project.tag}</span>
          {project.live && <LiveBadge />}
        </div>

        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.6rem', fontWeight: 800, color: '#F1F5F9', marginBottom: '1rem', letterSpacing: '-0.02em' }}>{project.title}</h2>
        <p style={{ color: '#94A3B8', fontSize: 15, lineHeight: 1.8, marginBottom: '1.75rem' }}>{project.fullDescription || project.description}</p>

        {/* compile-in tech tags */}
        <div style={{ marginBottom: '1.75rem' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#475569', marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>// compiling dependencies</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {project.tech.map((t, i) => (
              <span key={t} style={{ padding: '5px 12px', background: i < tagIdx ? `${project.accent}18` : 'rgba(255,255,255,0.03)', border: `1px solid ${i < tagIdx ? project.accent + '44' : 'rgba(255,255,255,0.06)'}`, borderRadius: 8, fontSize: 13, color: i < tagIdx ? project.accent : '#475569', fontFamily: "'JetBrains Mono', monospace", transition: 'all 0.2s' }}>
                {i < tagIdx ? t : '░░░░'}
              </span>
            ))}
            {tagIdx < project.tech.length && (
              <span style={{ padding: '5px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, fontSize: 13, color: project.accent, fontFamily: "'JetBrains Mono', monospace", animation: 'blink 0.8s step-end infinite' }}>▊</span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: project.accent, color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 600, transition: 'all 0.2s', boxShadow: `0 4px 20px ${project.accent}55` }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)' }}
            >Open Live Demo ↗</a>
          )}
          {project.code && (
            <a href={project.code} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'transparent', color: '#94A3B8', borderRadius: 10, fontSize: 14, fontWeight: 500, border: '1px solid rgba(255,255,255,0.12)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#94A3B8' }}
            >View on GitHub →</a>
          )}
        </div>
      </div>
      <style>{`
        @keyframes scanline { 0%{background-position:-100% 0} 100%{background-position:200% 0} }
        @keyframes dash { to{stroke-dashoffset:-20} }
      `}</style>
    </div>
  )
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────

function ProjectCard({ project, index, onClick }) {
  const { ref, inView } = useInView(0.1)
  const [hovered, setHovered] = useState(false)
  const [bursting, setBursting] = useState(false)

  const handleClick = useCallback(() => {
    if (bursting) return
    setBursting(true)
  }, [bursting])

  const handleBurstDone = useCallback(() => {
    setBursting(false)
    onClick(project)
  }, [project, onClick])

  return (
    <div ref={ref} onClick={handleClick} style={{
      background: hovered ? '#0D1121' : '#080E1A',
      borderRadius: 14, padding: '1.75rem',
      border: `1px solid ${hovered || bursting ? project.accent + '66' : 'rgba(255,255,255,0.07)'}`,
      transition: 'all 0.3s',
      transform: inView ? 'translateY(0)' : 'translateY(28px)',
      opacity: inView ? 1 : 0,
      transitionDelay: `${index * 0.08}s`,
      display: 'flex', flexDirection: 'column', gap: '1rem',
      position: 'relative', overflow: 'hidden', cursor: 'pointer',
      boxShadow: bursting
        ? `0 0 60px ${project.accent}55, 0 0 20px ${project.accent}33`
        : hovered ? `0 0 30px ${project.accent}22, 0 8px 32px rgba(0,0,0,0.4)` : '0 4px 20px rgba(0,0,0,0.3)',
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)`, opacity: hovered || bursting ? 1 : 0, transition: 'opacity 0.3s', borderRadius: '14px 14px 0 0' }} />

      {/* NEURAL BURST ANIMATION */}
      {bursting && <NeuralBurst color={project.accent} onDone={handleBurstDone} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: project.accent, background: `${project.accent}18`, padding: '3px 10px', borderRadius: 20, border: `1px solid ${project.accent}33`, letterSpacing: '0.05em', fontWeight: 600 }}>{project.tag}</span>
        {project.live && <LiveBadge />}
      </div>

      <div>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: '#F1F5F9' }}>{project.title}</h3>
        <p style={{ color: '#64748B', fontSize: 13.5, lineHeight: 1.7 }}>{project.description}</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {project.tech.map(t => <span key={t} style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", background: 'rgba(255,255,255,0.05)', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.08)' }}>{t}</span>)}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 4, display: 'flex', alignItems: 'center', gap: 6, color: project.accent, fontSize: 12, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", opacity: hovered ? 1 : 0.4, transition: 'opacity 0.2s' }}>
        <span style={{ animation: hovered ? 'pulse 1.5s infinite' : 'none', width: 6, height: 6, borderRadius: '50%', background: project.accent, display: 'inline-block' }} />
        click to activate
        <span style={{ transform: hovered ? 'translateX(3px)' : 'translateX(0)', transition: 'transform 0.2s' }}>→</span>
      </div>
    </div>
  )
}

// ─── STAT COUNTER ─────────────────────────────────────────────────────────────

function StatCounter({ num, suffix, label, started }) {
  const count = useCountUp(num, started)
  return (
    <div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.8rem', fontWeight: 800, color: '#7C3AED', lineHeight: 1 }}>{count}{suffix}</div>
      <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{label}</div>
    </div>
  )
}

// ─── TERMINAL ─────────────────────────────────────────────────────────────────

function Terminal() {
  const { ref, inView } = useInView(0.3)
  const { displayed, currentPartial } = useTypewriter(TERMINAL_LINES, inView)
  const colorMap = { cmd: '#94A3B8', blank: 'transparent', bracket: '#A78BFA', string: '#10B981', array: '#06B6D4' }
  return (
    <div ref={ref} style={{ background: '#060810', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(124,58,237,0.3)', boxShadow: '0 0 40px rgba(124,58,237,0.15), 0 20px 60px rgba(0,0,0,0.5)', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
      <div style={{ background: '#0D1021', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }} />
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
        <span style={{ marginLeft: 8, color: '#475569', fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>~/lead-enrichment-api · live demo</span>
        <LiveBadge />
      </div>
      <div style={{ padding: '20px 24px', minHeight: 240, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 1.7 }}>
        {displayed.map((line, i) => <div key={i} style={{ color: colorMap[line.type], marginBottom: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{line.text || '\u00A0'}</div>)}
        {currentPartial && <div style={{ color: colorMap[currentPartial.type], whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{currentPartial.text}<span style={{ borderLeft: '2px solid #7C3AED', marginLeft: 1, animation: 'blink 1s step-end infinite' }} /></div>}
      </div>
    </div>
  )
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} style={{ marginBottom: '3.5rem', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)', transition: 'all 0.5s' }}>
      <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#F1F5F9' }}>{title}</h2>
      {subtitle && <p style={{ color: '#64748B', marginTop: 10, maxWidth: 500, fontSize: 15 }}>{subtitle}</p>}
    </div>
  )
}

// ─── NAV ──────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 40); window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn) }, [])
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(8,11,20,0.88)' : 'transparent', backdropFilter: scrolled ? 'blur(16px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none', transition: 'all 0.3s' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>Bisma Nawaz<span style={{ color: '#7C3AED' }}>.</span></span>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {['Projects', 'Skills', 'Experience', 'About', 'Contact'].map(l => (
            <button key={l} onClick={() => document.getElementById(l.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'none', border: 'none', fontSize: 14, color: '#64748B', fontFamily: 'Inter, sans-serif', fontWeight: 500, transition: 'color 0.2s', padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = '#F1F5F9'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
            >{l}</button>
          ))}
          <a href="mailto:bismanawaz043@gmail.com" style={{ padding: '8px 18px', background: '#7C3AED', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600, transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(124,58,237,0.4)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#6D28D9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.transform = 'translateY(0)' }}
          >Hire me</a>
        </div>
      </div>
    </nav>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const { ref: heroRef, inView: heroIn } = useInView(0.1)
  const { ref: statsRef, inView: statsIn } = useInView(0.5)
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <div style={{ minHeight: '100vh', background: '#080B14' }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.9)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      `}</style>

      <Nav />
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(124,58,237,0.06)', filter: 'blur(80px)', animation: 'float 8s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(6,182,212,0.05)', filter: 'blur(60px)', animation: 'float 10s ease-in-out infinite reverse' }} />
          <Particles />
        </div>
        <div ref={heroRef} style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 2rem 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center', position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(24px)', transition: 'all 0.7s ease' }}>
            <h1 style={{ fontSize: 'clamp(2.4rem,5vw,3.6rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '1.25rem', color: '#F1F5F9' }}>
              AI systems<br />
              <span style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>that ship.</span>
            </h1>
            <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '2rem', maxWidth: 420 }}>Backend Developer & AI Automation Engineer. I build LLM-powered workflows, RAG pipelines, and production REST APIs and I deploy them. Based in Pakistan, working for global teams.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} style={{ padding: '12px 24px', background: '#7C3AED', color: '#fff', borderRadius: 8, fontSize: 15, fontWeight: 600, border: 'none', boxShadow: '0 4px 20px rgba(124,58,237,0.5)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(124,58,237,0.6)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.5)' }}
              >View projects →</button>
              <a href="https://linkedin.com/in/bisma-nawaz-6565711a1" target="_blank" rel="noopener noreferrer" style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.05)', color: '#94A3B8', borderRadius: 8, fontSize: 15, fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#94A3B8' }}
              >LinkedIn ↗</a>
            </div>
            <div ref={statsRef} style={{ display: 'flex', gap: '2.5rem' }}>
              <StatCounter num={30} suffix="+" label="Automation workflows" started={statsIn} />
              <StatCounter num={6} suffix="+" label="Projects in production" started={statsIn} />
              <StatCounter num={2} suffix="" label="Live deployed APIs" started={statsIn} />
            </div>
          </div>
          <div style={{ opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(24px)', transition: 'all 0.7s ease 0.2s' }}>
            <Terminal />
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ padding: '100px 0', background: '#050709' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
          <SectionHeader title="Projects" subtitle="Click any card to activate — a neural network burst will fire before the project opens." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {PROJECTS.map((p, i) => <ProjectCard key={p.title} project={p} index={i} onClick={setSelectedProject} />)}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ padding: '100px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
          <SectionHeader title="Skills" subtitle="What I actually use, day to day." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {SKILLS.map(({ category, color, items }) => {
              const { ref, inView } = useInView(0.2)
              return (
                <div key={category} ref={ref} style={{ background: '#080E1A', borderRadius: 12, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.06)', transition: 'border-color 0.3s', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(16px)', transitionProperty: 'opacity,transform,border-color', transitionDuration: '0.5s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `${color}44`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{category}</h3>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {items.map((item, idx) => (
                      <span key={item} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, fontSize: 12.5, color: '#94A3B8', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(6px)', transition: `opacity 0.3s ${0.05 + idx * 0.04}s, transform 0.3s ${0.05 + idx * 0.04}s` }}>{item}</span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" style={{ padding: '100px 0', background: '#050709' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 2rem' }}>
          <SectionHeader title="Experience" />
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, #7C3AED, transparent)' }} />
            {EXPERIENCE.map((exp, i) => {
              const { ref, inView } = useInView(0.2)
              return (
                <div key={i} ref={ref} style={{ paddingLeft: '2rem', paddingBottom: '2.5rem', position: 'relative', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateX(-12px)', transition: `all 0.5s ${i * 0.1}s` }}>
                  <div style={{ position: 'absolute', left: -4, top: 4, width: 9, height: 9, borderRadius: '50%', background: '#7C3AED', boxShadow: '0 0 12px rgba(124,58,237,0.8)', border: '2px solid #080B14' }} />
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                    <div>
                      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1rem', color: '#F1F5F9' }}>{exp.role}</h3>
                      <span style={{ fontSize: 13, color: '#7C3AED', fontWeight: 500 }}>{exp.company} · {exp.location}</span>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#475569', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>{exp.date}</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: '#64748B', lineHeight: 1.7 }}>{exp.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: '100px 0' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <SectionHeader title="A bit about me" />
          <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>I'm a Backend Developer and AI Automation Engineer based in Lahore, Pakistan. Over the past two years I've built 30+ automation systems from n8n pipelines and LLM-powered workflows to production REST APIs across four roles, including leading an automation team remotely for a UAE-based company.</p>
          {/* <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2.5rem' }}></p> */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[{ label: 'GitHub', url: 'https://github.com/BismaNwaz' }, { label: 'LinkedIn', url: 'https://linkedin.com/in/bisma-nawaz-6565711a1' }, { label: 'Email', url: 'mailto:bismanawaz043@gmail.com' }].map(({ label, url }) => (
              <a key={label} href={url} target={url.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer" style={{ padding: '10px 22px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 14, color: '#94A3B8', fontWeight: 500, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.color = '#A78BFA'; e.currentTarget.style.background = 'rgba(124,58,237,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'transparent' }}
              >{label} ↗</a>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: '120px 0', background: '#050709', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 300, borderRadius: '50%', background: 'rgba(124,58,237,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 2rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem', color: '#F1F5F9' }}>Let's build something</h2>
          {/* <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>Open to remote AI Automation and LLM Engineering roles with UK and US companies. Drop me a line.</p> */}
          <a href="mailto:bismanawaz043@gmail.com" style={{ display: 'inline-block', padding: '16px 36px', background: 'linear-gradient(135deg, #7C3AED, #5B21B6)', color: '#fff', borderRadius: 10, fontSize: 16, fontWeight: 600, boxShadow: '0 8px 32px rgba(124,58,237,0.5)', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(124,58,237,0.65)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,0.5)' }}
          >bismanawaz043@gmail.com ↗</a>
        </div>
      </section>

      <footer style={{ background: '#030406', color: '#374151', padding: '1.5rem 2rem', textAlign: 'center', fontSize: 12, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p>© 2026 Bisma Nawaz · Built with React + Vite · Deployed on Vercel</p>
      </footer>
    </div>
  )
}