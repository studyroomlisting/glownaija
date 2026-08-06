// @ts-nocheck
export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createSalon } from '@/lib/actions/salons'

export default async function BusinessPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')
  const { data: existing } = await supabase.from('salons').select('id').eq('owner_id',user.id).single()
  if (existing) redirect('/dashboard')

  const bTypes = ['Hair Salon','Locs Specialist','Wig Studio','Nail Bar','Makeup Artist','Skincare Studio','Mobile Stylist','Beauty Spa','Barbershop','Afro Barber','Threading & Waxing','Eyebrow Studio','Eyelash Studio','Bridal Studio','Other']
  const cities  = ['London','Birmingham','Manchester','Leeds','Bristol','Sheffield','Nottingham','Leicester','Liverpool','Newcastle','Glasgow','Edinburgh','Cardiff','Other']

  return (
    <div className="container py-10 max-w-2xl">
      <div className="text-center mb-8"><h1 className="text-3xl font-black mb-2">List Your Salon 🏪</h1><p className="text-ink-3">Takes 2 minutes · Goes live immediately</p></div>
      <div className="card card-body">
        <form action={createSalon} className="space-y-5">
          <div><label className="label">Salon Name *</label><input name="business_name" className="input" placeholder="e.g. Adaeze Natural Hair Studio" required/></div>
          <div><label className="label">Business Type *</label><select name="business_type" className="input">{bTypes.map(t=><option key={t}>{t}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">City *</label><select name="city" className="input">{cities.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label className="label">Area / Neighbourhood *</label><input name="area" className="input" placeholder="e.g. Peckham" required/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Postcode</label><input name="postcode" className="input" placeholder="SE15 5DT"/></div>
            <div><label className="label">Phone</label><input name="phone" type="tel" className="input" placeholder="+44 7700 900000"/></div>
          </div>
          <div><label className="label">Contact Email *</label><input name="email" type="email" className="input" required/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Instagram</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3">@</span><input name="instagram" className="input pl-7" placeholder="yoursalon"/></div></div>
            <div><label className="label">Website</label><input name="website" className="input" placeholder="https://yoursalon.co.uk"/></div>
          </div>
          <div><label className="label">Description <span className="font-normal text-ink-3">(recommended)</span></label><textarea name="description" className="input" rows={4} placeholder="Tell customers what makes you special — your experience, specialties, and approach…"/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Years Experience</label><input name="years_active" type="number" className="input" min="0" max="50" defaultValue="0"/></div>
            <div><label className="label">Plan</label><select name="plan" className="input"><option value="starter">Starter — Free</option><option value="growth">Growth — £29/mo</option><option value="pro">Pro — £59/mo</option></select></div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer"><input name="accepts_online_bookings" type="checkbox" defaultChecked className="w-4 h-4"/><span className="text-sm">Accept online bookings via GlowNaija</span></label>
          <button type="submit" className="btn btn-primary w-full justify-center text-base py-4">List My Salon →</button>
        </form>
      </div>
    </div>
  )
}