import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { ArrowRight, Truck, BookOpen, MapPin } from 'lucide-react'
import heroImg from '../assets/hero.jpg'

export default function Landing() {
  const navigate   = useNavigate()
  const heroRef    = useRef(null)
  
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return
      const scrollY = window.scrollY
      heroRef.current.style.transform = `translateY(${scrollY * 0.4}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-line/60 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="font-display font-bold text-ink text-lg">
            Bharat Pashudhan
          </span>
        </div>
        <button onClick={() => navigate('/identify')} className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          Start identifying
          <ArrowRight size={15} />
        </button>
      </header>

      <section className="relative h-screen overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 w-full" style={{ height: '110%', top: '-5%' }}>
          <img src={heroImg} alt="Indigenous cattle in Indian field" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.15) 100%)'}} />
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-16">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-xs text-white/90 font-medium mb-8 tracking-wide uppercase">
            <MapPin size={11} />
            Official field identification tool · India
          </div>
          <h1 className="font-display font-bold text-white text-5xl md:text-7xl leading-[1.05] max-w-3xl mb-6 tracking-tight">
            Identify Indigenous<br />
            <span className="text-amber-400">Cattle</span>{' '}
            &amp;{' '}
            <span className="text-green-400">Buffalo</span>
          </h1>

          <p className="text-white/75 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            Upload a photo. Get instant breed suggestions across 66 indigenous breeds recognised by the Government of India.
          </p>
          <button onClick={() => navigate('/identify')} className="group bg-accent hover:bg-amber-600 text-white font-display font-bold px-10 py-4 rounded-xl text-lg transition-all flex items-center gap-3 shadow-lg shadow-amber-900/30 hover:shadow-xl hover:shadow-amber-900/40 hover:-translate-y-0.5" >
            Identify a breed
            <ArrowRight size={20}
              className="group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-white/50 text-sm mt-4">
            No account needed · Works on any mobile browser
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>
      
      <div className="border-y border-line bg-surface">
        <div className="max-w-3xl mx-auto px-6 py-8 grid grid-cols-3 divide-x divide-line">
          {[
            { value: '66',     label: 'Breeds covered',
              sub: 'ICAR recognised' },
            { value: '49',     label: 'Cattle breeds',
              sub: 'Bos indicus'     },
            { value: '17',     label: 'Buffalo breeds',
              sub: 'Bubalus bubalis' },
          ].map(stat => (
            <div key={stat.label} className="text-center px-4">
              <p className="font-display font-bold text-3xl text-ink">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-ink mt-0.5">
                {stat.label}
              </p>
              <p className="text-xs text-muted mt-0.5 italic">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      <section className="bg-canvas py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-accent font-medium mb-3">
            How it works
          </p>
          <h2 className="font-display font-bold text-3xl text-ink mb-10">
            Three steps to identification
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step : '01',
                title: 'Photograph the animal',
                desc : 'Take a clear photo from the front or side. Good lighting helps.'
              },
              {
                step : '02',
                title: 'Upload to the tool',
                desc : 'Our AI analyses the image against 14,876 training examples.'
              },
              {
                step : '03',
                title: 'Review suggestions',
                desc : 'Three possible breeds appear. Tap any card to see full breed details.'
              },
            ].map(item => (
              <div key={item.step} className="bg-surface border border-line rounded-2xl p-6 relative overflow-hidden">
                <span className="absolute top-3 right-4 font-display font-bold text-6xl text-line select-none">
                  {item.step}
                </span>
                <h3 className="font-display font-bold text-ink text-lg mb-2 relative z-10">
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed relative z-10">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surfaceAlt border-t border-line py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-accent font-medium mb-3">
            What's inside
          </p>
          <h2 className="font-display font-bold text-3xl text-ink mb-10">
            Built for the field
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon : Truck,
                title: 'All indigenous breeds',
                desc : 'Every cattle and buffalo breed officially recognised by ICAR and NBAGR — not just the popular ones.',
                accent: 'text-accent'
              },
              {
                icon : BookOpen,
                title: 'Breed encyclopedia',
                desc : 'Origin state, purpose, physical traits, and conservation status for all 66 breeds.',
                accent: 'text-accentAlt'
              },
              {
                icon : MapPin,
                title: 'Field-ready design',
                desc : 'Designed for real field conditions — large touch targets, clear typography, fast results.',
                accent: 'text-accent'
              },
            ].map(feature => (
              <div key={feature.title} className="bg-surface border border-line rounded-2xl p-6 group hover:border-accent/30 hover:shadow-md transition-all">
                <feature.icon size={22} className={`${feature.accent} mb-4`} />
                <h3 className="font-display font-bold text-ink mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

     <footer className="border-t border-line px-6 py-5 bg-surface flex items-center justify-between text-xs text-muted">
        <span>Bharat Pashudhan</span>
        <span>Indigenous breed conservation</span>
      </footer>
    </div>
  )
}