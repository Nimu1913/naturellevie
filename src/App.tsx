import { useState, useEffect } from 'react'
import logoSmall from './assets/logo-small.png'
import logoBig from './assets/logo-big.png'
import iconRocket from './assets/icon-rocket.png'
import iconChart from './assets/icon-chart.png'
import iconGears from './assets/icon-gears.png'
import logoGoogle from './assets/google.png'
import logoBMW from './assets/bmw.png'
import logoFord from './assets/ford.png'
import logoViaplay from './assets/viaplay.webp'
import logoEinfache from './assets/einfache.svg'
import heroVideo from './assets/14fb63b4-9d29-4d17-8906-12a8e08117c4-video.mp4'

function App() {
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
      title: 'Venture Building',
      description: 'From idea to launch. We co-build startups and digital products that create real value.',
    },
    {
      icon: iconChart,
      title: 'Growth & Ads',
      description: 'Performance marketing that scales. Paid media, funnels, and conversion optimization.',
    },
    {
      icon: iconGears,
      title: 'Tech Consulting',
      description: 'Strategic guidance on digital transformation, web systems, and technology decisions.',
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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-obsidian-outline text-sm"
          >
            Get in Touch
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
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
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Floating orbs - subtle obsidian glow */}
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-crystal-blue/5 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-steel-500/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
          
          <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-crystal-edge/30 bg-obsidian-800/50 mb-8">
              <span className="w-2 h-2 bg-steel-400 rounded-full animate-pulse" />
              <span className="text-sm font-mono text-steel-300">Available for new projects</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 text-steel-100">
              We Build
              <br />
              <span className="gradient-text">Digital Futures</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-steel-400 max-w-2xl mx-auto mb-12 font-light">
              Tech ventures, performance ads, and websites that move businesses forward. 
              <span className="text-steel-200"> Create and inspire - with discipline.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#services" className="btn-obsidian">
                <span>See What We Do</span>
              </a>
              <a href="#contact" className="btn-obsidian-outline">
                Start a Project
              </a>
            </div>
          </div>
        </div>

        {/* Smooth transition gradient at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-obsidian-900/80 to-obsidian-900 z-10 pointer-events-none" />
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-32 px-6 -mt-32 pt-40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="font-mono text-steel-500 text-sm uppercase tracking-widest">What We Do</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 text-steel-100">
              Three Pillars of <span className="gradient-text">Growth</span>
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
              <p className="text-steel-400 text-lg mb-6">
                Experience across{' '}
                <span className="gradient-text font-semibold">tech</span>,{' '}
                <span className="gradient-text font-semibold">automotive</span>, and{' '}
                <span className="gradient-text font-semibold">media</span>
              </p>
              <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mt-8">
                {[
                  { logo: logoGoogle, alt: 'Google', className: '' },
                  { logo: logoBMW, alt: 'BMW', className: 'logo-remove-bg' },
                  { logo: logoFord, alt: 'Ford', className: '' },
                  { logo: logoViaplay, alt: 'Viaplay', className: '' },
                  { logo: logoEinfache, alt: 'Einfache', className: '' },
                ].map((company, index) => (
                  <img 
                    key={index} 
                    src={company.logo} 
                    alt={company.alt} 
                    className={`h-8 md:h-10 w-auto opacity-80 hover:opacity-100 transition-opacity ${company.className}`}
                  />
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
            © {new Date().getFullYear()} Obsidian Peaks. Built different.
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

            <h3 className="font-display text-3xl font-bold mb-2 text-steel-100">Get in Touch</h3>
            <p className="text-steel-400 mb-6">Send us a message and we'll get back to you soon.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-steel-300 mb-2">
                  Name
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
                  Email
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
                  Message
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
                  Message sent! We'll get back to you soon.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  Something went wrong. Please try again or email us directly.
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-obsidian flex-1"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="btn-obsidian-outline"
                >
                  Cancel
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
