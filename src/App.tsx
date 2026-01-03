import { useState, useEffect } from 'react'
import { useLanguage } from './LanguageContext'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { TypingAnimation } from './components/TypingAnimation'
import logoSmall from './assets/logo-small.png'
import logoBig from './assets/logo-big.png'
import iconRocket from './assets/icon-rocket.png'
import iconChart from './assets/icon-chart.png'
import iconGears from './assets/icon-gears.png'
import heroVideo from './assets/14fb63b4-9d29-4d17-8906-12a8e08117c4-video.mp4'

function App() {
  const { t } = useLanguage()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    setIsLoaded(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('API error:', {
          status: response.status,
          error: data.error,
          details: data.details,
        })
        throw new Error(data.error || data.details || 'Failed to send message')
      }

      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setIsSubmitting(false)
      
      setTimeout(() => {
        setIsModalOpen(false)
        setSubmitStatus('idle')
      }, 2000)
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const services = [
    {
      icon: iconRocket,
      title: t.ventureBuilding,
      description: t.ventureDesc,
    },
    {
      icon: iconChart,
      title: t.growthAds,
      description: t.growthDesc,
    },
    {
      icon: iconGears,
      title: t.techConsulting,
      description: t.techDesc,
    }
  ]

  return (
    <div className="relative min-h-screen bg-obsidian-950 grid-bg">
      {/* Noise overlay */}
      <div className="noise" />
      
      {/* Mouse follow gradient - subtle steel blue */}
      <div 
        className="fixed w-[800px] h-[800px] rounded-full pointer-events-none opacity-10 blur-[150px] transition-all duration-500 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(107, 140, 173, 0.3) 0%, rgba(74, 96, 128, 0.15) 40%, transparent 70%)',
          left: mousePosition.x - 400,
          top: mousePosition.y - 400,
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 bg-obsidian-950/80 backdrop-blur-md border-b border-crystal-edge/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logoSmall} alt="Obsidian Peaks" className="h-12 w-auto" />
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-obsidian-outline text-sm"
            >
              {t.getInTouch}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden text-center">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-obsidian-900/60 z-0" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 w-full">
          {/* Floating orbs - subtle obsidian glow */}
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-crystal-blue/5 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-steel-500/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
          
          <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} flex flex-col items-center w-full`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-crystal-edge/30 bg-obsidian-800/50 mb-8">
              <span className="w-2 h-2 bg-steel-400 rounded-full animate-pulse" />
              <span className="text-sm font-mono text-steel-300">Available for new projects</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4 text-steel-100 w-full" style={{ textAlign: 'center' }}>
              {t.weBuild}
              <br />
              <span className="gradient-text">{t.digitalFutures}</span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-steel-300 mb-6 w-full" style={{ textAlign: 'center' }}>
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <TypingAnimation 
                  phrases={t.supportingLines}
                  typingSpeed={80}
                  deletingSpeed={50}
                  pauseDuration={1000}
                />
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-steel-400 max-w-2xl mx-auto mb-12 font-light text-center">
              {t.tagline}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#services" className="btn-obsidian">
                <span>{t.seeWhatWeDo}</span>
              </a>
              <a href="#contact" className="btn-obsidian-outline">
                {t.startProject}
              </a>
            </div>
          </div>
        </div>

        {/* Enhanced smooth transition gradient at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-obsidian-900/50 to-obsidian-900 z-10 pointer-events-none" />
        {/* Additional fade layer for smoother transition */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-transparent via-obsidian-900/20 to-obsidian-900/90 z-10 pointer-events-none" />
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-32 px-6 -mt-48 pt-56">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="font-mono text-steel-500 text-sm uppercase tracking-widest">{t.whatWeDo}</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 text-steel-100">
              {t.threePillars} <span className="gradient-text">{t.growth}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className={`obsidian-card opacity-0 animate-fade-up stagger-${index + 1}`}
                style={{ animationFillMode: 'forwards' }}
              >
                <div className="mb-6 icon-container">
                  <img src={service.icon} alt={service.title} className="w-48 h-48 object-contain rounded-xl icon-soft-edge" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-4 text-steel-200">{service.title}</h3>
                <p className="text-steel-400 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="crystal-border p-8 md:p-12">
            <div className="text-center">
              <p className="text-steel-400 text-xl md:text-2xl mb-6">
                {t.experience}{' '}
                <span className="gradient-text font-semibold">{t.tech}</span>,{' '}
                <span className="gradient-text font-semibold">{t.automotive}</span>, {t.and}{' '}
                <span className="gradient-text font-semibold">{t.media}</span>
              </p>
              <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mt-8">
                {['Google', 'BMW', 'Ford', 'Viaplay', 'Einfache-Reifen.de'].map((company, index) => (
                  <span 
                    key={index} 
                    className="font-display text-steel-300 text-lg md:text-xl font-medium opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-crystal-blue/5 rounded-full blur-[120px]" />
          
          {/* Big logo */}
          <img 
            src={logoBig} 
            alt="Obsidian Peaks" 
            className="w-48 md:w-64 mx-auto mb-12 opacity-80"
          />
          
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 relative text-steel-100">
            Ready to Build
            <br />
            <span className="gradient-text">Something Great?</span>
          </h2>
          
          <p className="text-xl text-steel-400 mb-10 max-w-2xl mx-auto relative">
            Let's talk about your next project. Whether it's a startup idea, a marketing campaign, or a website redesign — we're here to make it happen.
          </p>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-obsidian inline-flex items-center gap-3 text-lg relative"
          >
            <span>info@obsidianpeaks.com</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-obsidian-700 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logoSmall} alt="Obsidian Peaks" className="h-10 w-auto" />
            <span className="font-display font-medium text-steel-300">Obsidian Peaks</span>
          </div>
          
          <p className="text-steel-600 text-sm font-mono">
            © {new Date().getFullYear()} Obsidian Peaks.
          </p>
        </div>
      </footer>

      {/* Contact Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => !isSubmitting && setIsModalOpen(false)}
        >
          <div 
            className="obsidian-card max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-steel-400 hover:text-steel-200 transition-colors"
              disabled={isSubmitting}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-display text-3xl font-bold mb-2 text-steel-100">{t.getInTouch}</h3>
            <p className="text-steel-400 mb-6">{t.sendMessage}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-steel-300 mb-2">
                  {t.name}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-obsidian-800 border border-crystal-edge/20 rounded-lg text-steel-100 placeholder-steel-600 focus:outline-none focus:border-crystal-edge/50 transition-colors"
                  placeholder="Your name"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-steel-300 mb-2">
                  {t.email}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-obsidian-800 border border-crystal-edge/20 rounded-lg text-steel-100 placeholder-steel-600 focus:outline-none focus:border-crystal-edge/50 transition-colors"
                  placeholder="your@email.com"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-steel-300 mb-2">
                  {t.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-obsidian-800 border border-crystal-edge/20 rounded-lg text-steel-100 placeholder-steel-600 focus:outline-none focus:border-crystal-edge/50 transition-colors resize-none"
                  placeholder="Tell us about your project..."
                  disabled={isSubmitting}
                />
              </div>

              {submitStatus === 'success' && (
                <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  {t.success}
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {t.error}
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-obsidian flex-1"
                >
                  {isSubmitting ? t.sending : t.send}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="btn-obsidian-outline"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
