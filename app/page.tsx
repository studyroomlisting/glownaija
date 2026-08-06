// @ts-nocheck
export const dynamic = 'force-dynamic'
import { createClient }  from '@/lib/supabase/server'
import Link              from 'next/link'
import Image             from 'next/image'
import Header            from '@/components/layout/Header'
import Footer            from '@/components/layout/Footer'
import SalonCard         from '@/components/salon/SalonCard'
import ProductCard       from '@/components/shop/ProductCard'

export const revalidate = 3600 // revalidate hourly

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { data: featured  },
    { data: topSalons },
    { data: products  },
    { data: events    },
    { count: salonCount },
    { count: userCount  },
  ] = await Promise.all([
    supabase.from('salons').select('*').eq('listing_status','approved').eq('is_active',true).eq('is_featured',true).order('rating',{ascending:false}).limit(6),
    supabase.from('salons').select('*').eq('listing_status','approved').eq('is_active',true).order('rating',{ascending:false}).limit(8),
    supabase.from('products').select('*').eq('is_active',true).order('rating',{ascending:false}).limit(4),
    supabase.from('events').select('*').eq('is_active',true).gte('event_date', new Date().toISOString().split('T')[0]).order('event_date').limit(3),
    supabase.from('salons').select('*',{count:'exact',head:true}).eq('is_active',true),
    supabase.from('profiles').select('*',{count:'exact',head:true}),
  ])

  const cities = ['London','Birmingham','Manchester','Leeds','Bristol','Nottingham','Leicester','Glasgow','Liverpool','Newcastle']
  const categories = [
    { slug:'braids',   label:'Braids',     emoji:'✂️',  desc:'Knotless, box braids & more' },
    { slug:'locs',     label:'Locs',       emoji:'🌿',  desc:'Starter locs & maintenance' },
    { slug:'wigs',     label:'Wigs',       emoji:'👑',  desc:'Custom & ready-to-wear wigs' },
    { slug:'nails',    label:'Nails',      emoji:'💅',  desc:'Gel, acrylic & nail art' },
    { slug:'makeup',   label:'Makeup',     emoji:'💄',  desc:'Bridal, glam & everyday' },
    { slug:'skincare', label:'Skincare',   emoji:'🧴',  desc:'Melanin-focused treatments' },
    { slug:'barber',   label:'Barber',     emoji:'💈',  desc:'Afro cuts & fades' },
    { slug:'bridal',   label:'Bridal',     emoji:'💍',  desc:'Full wedding packages' },
  ]

  const howItWorks = [
    { step:'01', title:'Search & Discover', desc:'Browse hundreds of Nigerian and Afro-Caribbean salons by city, service, or style.', icon:'🔍' },
    { step:'02', title:'Book Instantly',    desc:'Choose your service, pick a slot, and pay a small deposit to secure your appointment.', icon:'📅' },
    { step:'03', title:'Experience & Review', desc:'Enjoy your appointment and share your experience to help other clients find great salons.', icon:'⭐' },
  ]

  const testimonials = [
    { name:'Adaeze O.', city:'London', text:'Finally found a braider who understands 4C hair! Booked through GlowNaija and the experience was seamless.', rating:5, service:'Knotless Braids' },
    { name:'Funmi B.', city:'Birmingham', text:'The salon I found does the most beautiful locs installations. GlowNaija made it so easy to find and book.', rating:5, service:'Starter Locs' },
    { name:'Kezia M.', city:'Manchester', text:'Brilliant platform. I\'ve discovered so many amazing Afro-Caribbean salons near me I didn\'t know existed.', rating:5, service:'Wig Installation' },
  ]

  return (
    <>
      <Header />
      <main>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative bg-gradient-to-br from-ink via-purple-950 to-ink overflow-hidden py-24">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'radial-gradient(circle at 25% 50%, #E8607A 0%, transparent 50%), radial-gradient(circle at 75% 50%, #D4AF37 0%, transparent 50%)' }}/>

          <div className="container text-center relative z-10">
            <div className="inline-block bg-rose/20 border border-rose/30 rounded-full px-4 py-1.5 text-rose text-xs font-bold uppercase tracking-widest mb-6">
              The UK's #1 Afro &amp; Caribbean Beauty Platform
            </div>
            <h1 className="text-white font-black text-5xl md:text-7xl mb-5 leading-tight tracking-tight">
              Find Your<br/>
              <span className="text-rose italic font-light">Perfect Glow</span>
            </h1>
            <p className="text-white/60 text-xl mb-10 max-w-xl mx-auto leading-relaxed">
              Book top-rated Nigerian and Afro-Caribbean hair and beauty salons across the UK. Instant booking, verified reviews.
            </p>

            {/* Search bar */}
            <form action="/search" className="flex max-w-xl mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl mb-8">
              <span className="pl-5 flex items-center text-ink-3">🔍</span>
              <input name="q" className="flex-1 px-4 py-4 text-sm outline-none text-ink placeholder:text-ink-3 bg-transparent"
                placeholder="Search salons, services, cities…"/>
              <button type="submit" className="px-7 bg-rose text-white font-bold text-sm hover:bg-rose-dark transition-colors">
                Search
              </button>
            </form>

            {/* City pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {cities.map(c => (
                <Link key={c} href={`/location/${c.toLowerCase()}`}
                  className="px-3 py-1.5 border border-white/20 text-white/60 rounded-full text-xs font-medium hover:text-white hover:border-white/50 hover:bg-white/10 transition-all">
                  📍 {c}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS BAR ─────────────────────────────────────────────────── */}
        <section className="bg-white border-b border-bdr py-6">
          <div className="container">
            <div className="flex flex-wrap justify-center gap-10 md:gap-16">
              {[
                ['🏪', `${salonCount || 100}+`, 'Verified Salons'],
                ['👥', `${userCount  || 500}+`, 'Happy Clients'],
                ['⭐', '4.9★',                  'Average Rating'],
                ['📅', 'Instant',               'Booking Confirmation'],
                ['🇬🇧', 'UK-wide',              'Coverage'],
              ].map(([icon, val, label]) => (
                <div key={label as string} className="text-center">
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="font-black text-xl text-ink">{val}</div>
                  <div className="text-xs text-ink-3 font-semibold uppercase tracking-wide">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ────────────────────────────────────────────────── */}
        <section className="container section">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-rose mb-1">Browse by Style</p>
              <h2 className="text-3xl font-black">Every Service, Every Style</h2>
            </div>
            <Link href="/salons" className="text-rose text-sm font-bold hover:underline hidden sm:block">View all salons →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map(({ slug, label, emoji, desc }) => (
              <Link key={slug} href={`/category/${slug}`}
                className="card card-body text-center group hover:border-rose hover:shadow-lg transition-all">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{emoji}</div>
                <div className="font-bold text-sm mb-1">{label}</div>
                <div className="text-xs text-ink-3">{desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── FEATURED SALONS ───────────────────────────────────────────── */}
        {(featured?.length || 0) > 0 && (
          <section className="bg-page-2 py-12">
            <div className="container">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold mb-1">Handpicked</p>
                  <h2 className="text-3xl font-black">⭐ Featured Salons</h2>
                </div>
                <Link href="/salons?featured=1" className="text-rose text-sm font-bold hover:underline hidden sm:block">View all →</Link>
              </div>
              <div className="grid-3">
                {featured!.map(s => <SalonCard key={s.id} salon={s} />)}
              </div>
            </div>
          </section>
        )}

        {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
        <section className="container section">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-rose mb-2">Simple &amp; Fast</p>
            <h2 className="text-3xl font-black">How GlowNaija Works</h2>
          </div>
          <div className="grid-3">
            {howItWorks.map(({ step, title, desc, icon }) => (
              <div key={step} className="text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-rose/10 flex items-center justify-center text-3xl mx-auto mb-4">
                  {icon}
                </div>
                <div className="text-xs font-black text-rose mb-2 uppercase tracking-widest">Step {step}</div>
                <h3 className="font-black text-lg mb-2">{title}</h3>
                <p className="text-ink-3 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TOP RATED SALONS ──────────────────────────────────────────── */}
        <section className="bg-page-2 py-12">
          <div className="container">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-rose mb-1">Client Favourites</p>
                <h2 className="text-3xl font-black">Top Rated Salons</h2>
              </div>
              <Link href="/salons" className="text-rose text-sm font-bold hover:underline hidden sm:block">See all →</Link>
            </div>
            <div className="grid-3 md:grid-cols-4">
              {topSalons?.map(s => <SalonCard key={s.id} salon={s} />)}
            </div>
          </div>
        </section>

        {/* ── AI STYLIST PROMO ──────────────────────────────────────────── */}
        <section className="container section">
          <div className="bg-gradient-to-r from-purple-900 to-ink rounded-3xl p-10 md:p-14 text-center text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 30% 50%, #E8607A 0%, transparent 60%)'}}/>
            <div className="relative z-10">
              <div className="text-5xl mb-4">✨</div>
              <h2 className="text-3xl md:text-4xl font-black mb-3">Meet Glow AI</h2>
              <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">
                Your personal Afro &amp; Caribbean beauty assistant. Ask about hair care, get salon recommendations, and discover products perfect for your hair type.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/chat" className="btn bg-rose text-white px-8 py-3.5 hover:bg-rose-dark">
                  Chat with Glow AI →
                </Link>
                <Link href="/stylist" className="btn border-2 border-white/30 text-white px-8 py-3.5 hover:bg-white/10">
                  Take the Stylist Quiz
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── SHOP SECTION ──────────────────────────────────────────────── */}
        {(products?.length || 0) > 0 && (
          <section className="bg-page-2 py-12">
            <div className="container">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-rose mb-1">Beauty Shop</p>
                  <h2 className="text-3xl font-black">🛍️ Shop Top Products</h2>
                  <p className="text-ink-3 text-sm mt-1">Afro &amp; Caribbean hair care, skincare and beauty</p>
                </div>
                <Link href="/shop" className="text-rose text-sm font-bold hover:underline hidden sm:block">Shop all →</Link>
              </div>
              <div className="grid-4">
                {products!.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </section>
        )}

        {/* ── EVENTS ────────────────────────────────────────────────────── */}
        {(events?.length || 0) > 0 && (
          <section className="container section">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-rose mb-1">Upcoming</p>
                <h2 className="text-3xl font-black">🎉 Beauty Events</h2>
              </div>
              <Link href="/events" className="text-rose text-sm font-bold hover:underline hidden sm:block">All events →</Link>
            </div>
            <div className="grid-3">
              {events!.map(e => (
                <Link key={e.id} href={`/events/${e.id}`} className="card">
                  <div className="h-36 bg-gradient-to-br from-ink to-purple-800 relative overflow-hidden">
                    {e.image_url
                      ? <img src={e.image_url} alt={e.title} className="w-full h-full object-cover opacity-80"/>
                      : <div className="absolute inset-0 flex items-center justify-center text-5xl">{e.emoji}</div>
                    }
                    <span className="absolute top-3 left-3 badge-pill bg-rose text-white text-[10px]">{e.event_type}</span>
                  </div>
                  <div className="p-4">
                    <p className="font-black text-sm mb-1 line-clamp-2">{e.title}</p>
                    <p className="text-xs text-ink-3 mb-1">
                      📅 {new Date(e.event_date).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})} · {e.time_start?.substring(0,5)}
                    </p>
                    <p className="text-xs text-ink-3">📍 {e.venue}, {e.city}</p>
                    <p className="font-black text-sm mt-2">
                      {e.is_free ? <span className="text-gn">Free</span> : `£${(e.price/100).toFixed(2)}`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
        <section className="bg-page-2 py-12">
          <div className="container">
            <div className="text-center mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-rose mb-2">Real Clients</p>
              <h2 className="text-3xl font-black">What Our Community Says</h2>
            </div>
            <div className="grid-3">
              {testimonials.map(({ name, city, text, rating, service }) => (
                <div key={name} className="card card-body">
                  <div className="text-gold text-lg mb-3">{'★'.repeat(rating)}</div>
                  <p className="text-ink-2 text-sm leading-relaxed mb-4 italic">"{text}"</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-bdr">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose to-gold flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                      {name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{name}</p>
                      <p className="text-xs text-ink-3">{service} · {city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CITY GRID ─────────────────────────────────────────────────── */}
        <section className="container section">
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-rose mb-2">Nationwide</p>
            <h2 className="text-3xl font-black">Salons Near You</h2>
            <p className="text-ink-3 mt-2">GlowNaija covers salons across the UK</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {cities.map(c => (
              <Link key={c} href={`/location/${c.toLowerCase()}`}
                className="card card-body text-center py-5 hover:border-rose hover:text-rose transition-all">
                <div className="text-2xl mb-1">📍</div>
                <div className="font-bold text-sm">{c}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── SALON OWNER CTA ───────────────────────────────────────────── */}
        <section className="bg-gradient-to-r from-rose to-purple-700 py-16">
          <div className="container text-center px-4">
            <div className="text-5xl mb-4">🏪</div>
            <h2 className="text-white font-black text-3xl md:text-4xl mb-3">
              Own a Salon?<br/>List It Free Today
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">
              Join hundreds of Nigerian and Afro-Caribbean salon owners already growing their business on GlowNaija. Free to list, instant visibility.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/business" className="btn bg-white text-rose hover:bg-white/90 font-bold px-8 py-3.5">
                List My Salon Free →
              </Link>
              <Link href="/salons" className="btn border-2 border-white/40 text-white hover:bg-white/10 px-8 py-3.5">
                Browse All Salons
              </Link>
            </div>
            <div className="flex gap-8 justify-center mt-10 flex-wrap">
              {['Free to list','Instant bookings','No commission','24/7 visibility'].map(f => (
                <div key={f} className="flex items-center gap-2 text-white/70 text-sm">
                  <span className="text-gn">✓</span> {f}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
