import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-ink text-white mt-16">
      <div className="container py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="text-xl font-black mb-3"><span className="text-rose">GLOW</span>Naija</div>
          <p className="text-xs text-ink-3 leading-relaxed">The UK's Nigerian &amp; Afro-Caribbean beauty marketplace.</p>
          <p className="text-xs text-ink-3 mt-2">© {new Date().getFullYear()} Nexova Technologies Ltd</p>
        </div>
        {[
          ['Explore',   [['/salons','Find a Salon'],['/shop','Beauty Shop'],['/events','Events'],['/stylist','AI Stylist'],['/chat','Glow AI']]],
          ['Business',  [['/business','List Your Salon'],['/auth/signup?role=owner','Salon Owner Sign Up'],['/dashboard','Owner Dashboard']]],
          ['Company',   [['/contact','Contact Us'],['/privacy','Privacy Policy'],['/terms','Terms of Service']]],
        ].map(([title, links]) => (
          <div key={title as string}>
            <p className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-3">{title as string}</p>
            <div className="flex flex-col gap-2">
              {(links as [string,string][]).map(([href,label]) => (
                <Link key={href} href={href} className="text-sm text-white/70 hover:text-white transition-colors">{label}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  )
}
