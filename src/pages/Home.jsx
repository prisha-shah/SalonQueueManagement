import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useQueue } from '../context/QueueContext';
import { calculateWaitTime } from '../utils/waitTime';
import MarqueeTicker from '../components/MarqueeTicker';
import ServiceCard from '../components/ServiceCard';
import { 
  ArrowRight, Clock, Users, Scissors, 
  Sparkles, MapPin, Star 
} from 'lucide-react';

// Lightweight inline SVG icon for Instagram matching Lucide stroke & geometric style
function InstagramIcon({ className = "w-4 h-4", ...props }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Home() {
  const { lang, t } = useLanguage();
  const { tokens, barbers, services } = useQueue();

  const waitingTokens = tokens.filter(t => t.status === 'waiting');
  const servingTokens = tokens.filter(t => t.status === 'in_service');
  const activeBarbers = barbers.filter(b => b.status === 'on_duty');
  const estWait = calculateWaitTime(tokens, null, barbers);

  // 6 Curated Service Categories
  const editorialOfferings = [
    {
      title: t('haircutting'),
      service: services.find(s => s.category === 'HAIRCUTTING') || services[0],
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=700&auto=format&fit=crop&q=80",
      link: "/join?category=haircutting"
    },
    {
      title: t('colorServices'),
      service: services.find(s => s.category === 'COLOR SERVICES') || services[4],
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=700&auto=format&fit=crop&q=80",
      link: "/join?category=color"
    },
    {
      title: t('treatmentAndKeratin'),
      service: services.find(s => s.category === 'KERATIN SERVICES' || s.category === 'TREATMENT SERVICES') || services[2],
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&auto=format&fit=crop&q=80",
      link: "/join?category=treatment"
    },
    {
      title: t('addonServices'),
      service: services.find(s => s.category === 'ADD-ON SERVICES') || services[1],
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=700&auto=format&fit=crop&q=80",
      link: "/join?category=addon"
    },
    {
      title: t('styling'),
      service: services.find(s => s.category === 'STYLING') || services[7],
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=700&auto=format&fit=crop&q=80",
      link: "/join?category=styling"
    },
    {
      title: t('extensions'),
      service: services[5] || services[0],
      image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=700&auto=format&fit=crop&q=80",
      link: "/join?category=extensions"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8E9E7] text-[#3D2D2A] transition-colors duration-200">
      
      {/* HERO SECTION — Replicated from User's Uploaded Reference Image 1 */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-[#E8C6C2]/40">
        
        {/* Subtle Watermark */}
        <div className="absolute top-10 right-10 pointer-events-none opacity-[0.03] select-none overflow-hidden">
          <span className="font-serif text-[24vw] uppercase font-bold text-[#9B6B64]">
            VÉLORA
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 border border-[#E8C6C2] bg-[#FFF9F5]/90 rounded-full shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-[#C58B83]" />
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#9B6B64]">
                  {t('heroSubtitle')}
                </span>
              </div>

              {/* Exact Headline from Reference Image 1 */}
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#9B6B64] leading-[1.12] font-normal tracking-tight">
                Quiet luxury <br className="hidden sm:inline" />
                <span className="italic font-light text-[#3D2D2A]">for every strand</span>
              </h1>

              {/* Elegant Swirl Motif from Reference Image 1 */}
              <div className="flex items-center justify-center lg:justify-start gap-3 py-1">
                <span className="w-12 h-[1px] bg-[#E8C6C2]"></span>
                <span className="text-[#C58B83] text-sm font-serif">❖</span>
                <span className="w-12 h-[1px] bg-[#E8C6C2]"></span>
              </div>

              {/* Exact Description Subtitle from Reference Image 1 */}
              <p className="text-base sm:text-lg text-[#8C7471] font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                At VÉLORA, we believe in the art of refined beauty — where expertise, elegance, and intention come together. Join our live queue remotely and step in right when your chair is ready.
              </p>

              {/* Hero Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link 
                  to="/join" 
                  className="btn-velora-primary w-full sm:w-auto text-center py-3.5 px-8 shadow-rose text-xs"
                >
                  {lang === 'gu' ? 'કતારમાં જોડાઓ' : 'BOOK YOUR EXPERIENCE'} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
                <a 
                  href="#services-grid" 
                  className="btn-velora-outline w-full sm:w-auto text-center py-3.5 px-8 text-xs bg-[#FFF9F5]/70"
                >
                  {t('exploreServices')}
                </a>
              </div>

              {/* Trust Micro-Metrics */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-[#8C7471]">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-[#C58B83] text-[#C58B83]" />
                  <span><strong>4.9/5</strong> Rating (850+ Clients)</span>
                </div>
                <span className="text-[#E8C6C2]">·</span>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C58B83]" />
                  <span>Zero Waiting Room Chaos</span>
                </div>
              </div>

            </div>

            {/* Right Hero Image — Matches Reference Image 1 Woman Portrait */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
              <div className="relative w-full max-w-md">
                
                {/* Backing decorative blush shadow frame */}
                <div className="absolute -inset-3 bg-gradient-to-tr from-[#E8C6C2] via-[#C58B83]/30 to-[#F8E9E7] rounded-[2rem] transform rotate-1 opacity-70 filter blur-md"></div>
                
                {/* Main Hero Photo Container with soft rounded corners */}
                <div className="relative rounded-[2rem] overflow-hidden border-2 border-[#FFF9F5] shadow-2xl bg-[#FFF9F5]">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=85"
                    alt="VÉLORA Quiet luxury for every strand"
                    className="w-full h-[430px] sm:h-[480px] object-cover object-center filter brightness-[0.98] contrast-[1.03]"
                  />

                  {/* Floating Live Queue Toast Card */}
                  <div className="absolute bottom-5 inset-x-5 p-4 rounded-xl bg-[#FFF9F5]/90 backdrop-blur-md border border-[#E8C6C2] shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F8E9E7] border border-[#E8C6C2] flex items-center justify-center text-[#9B6B64]">
                        <Scissors className="w-5 h-5 text-[#C58B83]" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#9B6B64] block">
                          LIVE SALON STATUS
                        </span>
                        <span className="text-xs text-[#3D2D2A] font-medium block">
                          Now Serving: {servingTokens.length > 0 ? servingTokens.map(t => t.tokenNumber).join(', ') : 'Chairs Ready'}
                        </span>
                      </div>
                    </div>
                    <Link
                      to="/join"
                      className="px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#C58B83] text-[#FFF9F5] hover:bg-[#9B6B64] transition-colors shadow-sm"
                    >
                      Join &rarr;
                    </Link>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* REAL-TIME SALON PULSE STRIP (4 Soft Ivory Cards) */}
      <section className="py-10 sm:py-12 border-b border-[#E8C6C2]/40 bg-[#FFF9F5]/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Card 1: Waiting */}
            <div className="velora-card p-6 text-center">
              <span className="label-caps block mb-1">{t('waitingCount')}</span>
              <span className="font-serif text-3xl sm:text-4xl text-[#3D2D2A] font-normal block my-1">
                {waitingTokens.length}
              </span>
              <span className="text-xs text-[#8C7471] block font-light">
                {t('guests')} in queue
              </span>
            </div>

            {/* Card 2: Now Serving */}
            <div className="velora-card p-6 text-center">
              <span className="label-caps block mb-1">{t('nowServing')}</span>
              <span className="font-serif text-3xl sm:text-4xl text-[#C58B83] font-normal block my-1 truncate px-1">
                {servingTokens.length > 0 ? servingTokens.map(t => t.tokenNumber).join(', ') : '–'}
              </span>
              <span className="text-xs text-[#8C7471] block font-light">
                active in chair
              </span>
            </div>

            {/* Card 3: Est. Wait */}
            <div className="velora-card p-6 text-center">
              <span className="label-caps block mb-1">{t('estWaitNew')}</span>
              <span className="font-serif text-3xl sm:text-4xl text-[#9B6B64] font-normal block my-1">
                ~{estWait}m
              </span>
              <span className="text-xs text-[#8C7471] block font-light">
                for new guest arrival
              </span>
            </div>

            {/* Card 4: Active Chairs */}
            <div className="velora-card p-6 text-center">
              <span className="label-caps block mb-1">{t('activeChairs')}</span>
              <span className="font-serif text-3xl sm:text-4xl text-[#059669] font-normal block my-1">
                {activeBarbers.length} / {barbers.length}
              </span>
              <span className="text-xs text-[#8C7471] block font-light">
                stylists on duty
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* MARQUEE AMBIENT TICKER */}
      <MarqueeTicker />

      {/* MEET OUR STYLISTS SECTION — Replicated from User's Reference Image 2 */}
      <section className="py-16 sm:py-24 border-b border-[#E8C6C2]/40 bg-[#F8E9E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 sm:mb-16">
            <div>
              <span className="label-caps text-[#C58B83] block mb-1">
                ❖ ATELIER ARTISTRY ❖
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#9B6B64] uppercase tracking-wider">
                {lang === 'gu' ? 'અમારા માસ્ટર સ્ટાઈલિશ' : 'MEET OUR STYLISTS'}
              </h2>
            </div>
            
            <Link 
              to="/join"
              className="mt-4 sm:mt-0 text-xs uppercase tracking-widest font-semibold text-[#C58B83] hover:text-[#9B6B64] transition-colors inline-flex items-center gap-1.5"
            >
              {lang === 'gu' ? 'બધા જુઓ' : 'VIEW ALL'} &rarr;
            </Link>
          </div>

          {/* 4 Stylist Cards matching Reference Image 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {barbers.map((barber) => (
              <div 
                key={barber.id}
                className="velora-card p-6 text-center flex flex-col items-center justify-between group hover:border-[#C58B83] transition-all"
              >
                <div className="flex flex-col items-center">
                  
                  {/* Circular Portrait Image matching Image 2 */}
                  <div className="relative mb-5">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-[#E8C6C2] group-hover:border-[#C58B83] transition-all p-1 bg-[#FFF9F5] shadow-sm">
                      <img
                        src={barber.avatar}
                        alt={barber.name}
                        className="w-full h-full rounded-full object-cover object-top filter brightness-[0.98] group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {barber.status === 'on_duty' && (
                      <span className="absolute bottom-1 right-2 w-4 h-4 rounded-full bg-[#059669] border-2 border-[#FFF9F5] shadow-sm" title="On Duty"></span>
                    )}
                  </div>

                  {/* Stylist Name (Serif uppercase matching Image 2) */}
                  <h3 className="font-serif text-lg text-[#3D2D2A] uppercase tracking-wider font-medium group-hover:text-[#9B6B64] transition-colors">
                    {barber.name}
                  </h3>

                  {/* Specialty / Role */}
                  <p className="text-xs text-[#8C7471] font-light mt-1">
                    {lang === 'gu' ? barber.specialityGu : barber.speciality}
                  </p>

                  <span className="text-[10px] text-[#C58B83] uppercase tracking-wider font-semibold mt-1">
                    Station Chair {barber.chairNumber}
                  </span>

                </div>

                {/* Social Icon & Book Pill */}
                <div className="mt-6 pt-4 border-t border-[#E8C6C2]/40 w-full flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full border border-[#E8C6C2] flex items-center justify-center text-[#8C7471] hover:text-[#C58B83] hover:border-[#C58B83] transition-colors cursor-pointer" title="Instagram">
                    <InstagramIcon className="w-4 h-4" />
                  </span>
                  <Link
                    to={`/join?barber=${barber.id}`}
                    className="text-[11px] font-semibold uppercase tracking-wider text-[#9B6B64] hover:text-[#C58B83] transition-colors"
                  >
                    Select &rarr;
                  </Link>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SERVICE OFFERINGS (3x2 Grid in #FFF9F5 Cards) */}
      <section id="services-grid" className="py-16 sm:py-24 border-b border-[#E8C6C2]/40 bg-[#FFF9F5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 sm:mb-16">
            <span className="label-caps text-[#C58B83] block mb-2">❖ CURATED EXPERIENCES ❖</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#9B6B64] uppercase tracking-wider">
              {t('serviceOfferingsTitle')}
            </h2>
            <p className="mt-3 text-[#8C7471] text-sm sm:text-base font-light max-w-xl mx-auto">
              {t('serviceOfferingsSubtitle')}
            </p>
          </div>

          {/* 3x2 Grid with Enhanced ServiceCard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {editorialOfferings.map((item, idx) => (
              <ServiceCard
                key={idx}
                service={item.service}
                customTitle={item.title}
                customImage={item.image}
                customLink="/join"
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/join" className="btn-velora-primary text-xs py-3.5 px-8">
              {t('joinTheQueue')} · RESERVE YOUR TURN NOW
            </Link>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS (4 Soft Rounded Cards) */}
      <section className="py-16 sm:py-20 border-b border-[#E8C6C2]/40 bg-[#F8E9E7]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="label-caps text-[#C58B83] block mb-1">TRANSPARENT QUEUE FLOW</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#9B6B64] uppercase tracking-wider">
              {t('howItWorksTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            
            <div className="velora-card p-6 relative text-left">
              <span className="font-serif text-3xl text-[#E8C6C2] font-semibold block mb-3">01</span>
              <h3 className="text-sm font-semibold tracking-wider uppercase text-[#3D2D2A] mb-2 font-sans">
                {t('step1Title')}
              </h3>
              <p className="text-xs text-[#8C7471] leading-relaxed font-light">
                {t('step1Desc')}
              </p>
            </div>

            <div className="velora-card p-6 relative text-left">
              <span className="font-serif text-3xl text-[#E8C6C2] font-semibold block mb-3">02</span>
              <h3 className="text-sm font-semibold tracking-wider uppercase text-[#3D2D2A] mb-2 font-sans">
                {t('step2Title')}
              </h3>
              <p className="text-xs text-[#8C7471] leading-relaxed font-light">
                {t('step2Desc')}
              </p>
            </div>

            <div className="velora-card p-6 relative text-left">
              <span className="font-serif text-3xl text-[#E8C6C2] font-semibold block mb-3">03</span>
              <h3 className="text-sm font-semibold tracking-wider uppercase text-[#3D2D2A] mb-2 font-sans">
                {t('step3Title')}
              </h3>
              <p className="text-xs text-[#8C7471] leading-relaxed font-light">
                {t('step3Desc')}
              </p>
            </div>

            <div className="velora-card p-6 relative text-left">
              <span className="font-serif text-3xl text-[#E8C6C2] font-semibold block mb-3">04</span>
              <h3 className="text-sm font-semibold tracking-wider uppercase text-[#3D2D2A] mb-2 font-sans">
                {t('step4Title')}
              </h3>
              <p className="text-xs text-[#8C7471] leading-relaxed font-light">
                {t('step4Desc')}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* GUJARAT SALON LOCATIONS */}
      <section className="py-16 sm:py-20 border-b border-[#E8C6C2]/40 bg-[#FFF9F5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <span className="label-caps text-[#C58B83] block mb-1">GUJARAT FLAGSHIPS</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#9B6B64] uppercase tracking-wider">
              {t('branchesTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Link to="/join" className="velora-card p-6 block hover:border-[#C58B83] transition-all">
              <span className="label-caps-sm text-[#C58B83] block mb-2">FLAGSHIP 01</span>
              <h3 className="font-serif text-xl text-[#3D2D2A] mb-1">
                {t('branchSanand')}
              </h3>
              <p className="text-xs text-[#8C7471] font-light mb-4">{t('branchSanandDesc')}</p>
              <div className="flex items-center justify-between text-xs border-t border-[#E8C6C2]/40 pt-3">
                <span className="label-caps-sm text-[#8C7471]">EST. WAIT</span>
                <span className="font-semibold text-[#9B6B64]">~{estWait} {t('min')}</span>
              </div>
            </Link>

            <Link to="/join" className="velora-card p-6 block hover:border-[#C58B83] transition-all">
              <span className="label-caps-sm text-[#C58B83] block mb-2">FLAGSHIP 02</span>
              <h3 className="font-serif text-xl text-[#3D2D2A] mb-1">
                {t('branchSatellite')}
              </h3>
              <p className="text-xs text-[#8C7471] font-light mb-4">{t('branchSatelliteDesc')}</p>
              <div className="flex items-center justify-between text-xs border-t border-[#E8C6C2]/40 pt-3">
                <span className="label-caps-sm text-[#8C7471]">EST. WAIT</span>
                <span className="font-semibold text-[#9B6B64]">~{estWait + 10} {t('min')}</span>
              </div>
            </Link>

            <Link to="/join" className="velora-card p-6 block hover:border-[#C58B83] transition-all">
              <span className="label-caps-sm text-[#C58B83] block mb-2">FLAGSHIP 03</span>
              <h3 className="font-serif text-xl text-[#3D2D2A] mb-1">
                {t('branchSindhu')}
              </h3>
              <p className="text-xs text-[#8C7471] font-light mb-4">{t('branchSindhuDesc')}</p>
              <div className="flex items-center justify-between text-xs border-t border-[#E8C6C2]/40 pt-3">
                <span className="label-caps-sm text-[#8C7471]">EST. WAIT</span>
                <span className="font-semibold text-[#9B6B64]">~{Math.max(5, estWait - 5)} {t('min')}</span>
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* LUXURY FOOTER */}
      <footer className="py-12 bg-[#FFF9F5] border-t border-[#E8C6C2]/50 text-center text-xs text-[#8C7471]">
        <div className="max-w-5xl mx-auto px-4">
          <p className="font-serif tracking-super uppercase text-[#9B6B64] text-lg mb-1">
            VÉLORA
          </p>
          <p className="label-caps-sm text-[#C58B83] mb-2 tracking-widest">
            THE ART OF ELEVATION · BEAUTY · STYLE · YOU
          </p>
          <p className="font-light mb-5 text-xs text-[#8C7471]">
            Sector 12, Sānand · Satellite Road, Ahmedabad · Sindhu Bhavan Road
          </p>
          <div className="flex justify-center gap-6 label-caps-sm mb-6 flex-wrap">
            <Link to="/reception" className="hover:text-[#9B6B64]">{t('reception')}</Link>
            <Link to="/barber/lena" className="hover:text-[#9B6B64]">{t('workstations')}</Link>
            <Link to="/display" className="hover:text-[#9B6B64]">{t('wallTv')}</Link>
            <Link to="/admin" className="hover:text-[#9B6B64]">{t('admin')}</Link>
          </div>
          <p className="text-[11px] text-[#8C7471]/70">
            © {new Date().getFullYear()} VÉLORA Real-Time Queue Management System. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
