import { Link } from "wouter";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import logoWhite from "@assets/JUNTARHK_logo-2_white_1774785779222.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { ObfuscatedEmail } from "@/components/ObfuscatedEmail";

export function Footer() {
  const { t } = useLanguage();
  const f = t.footer;

  return (
    <footer className="bg-[#1A3D4A] text-white pt-16 pb-8 border-t border-primary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">

          {/* Brand */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="inline-flex">
              <img src={logoWhite} alt="JuntarHK" className="h-14 w-auto object-contain" />
            </Link>
            <p className="text-sm leading-relaxed text-white/70 mt-4">
              {f.tagline}<br />
              <span className="text-primary font-semibold italic">Live Life to the Fullest</span>
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://www.facebook.com/juntarhk" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/juntarhk" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://wa.me/85297289412" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#25D366] transition-colors text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-lg text-white mb-4">{f.quickLinks}</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-white/70 hover:text-primary transition-colors">{t.nav.home}</Link></li>
              <li><Link href="/photography" className="text-white/70 hover:text-primary transition-colors">{t.nav.photography}</Link></li>
              <li><Link href="/ai-education" className="text-white/70 hover:text-primary transition-colors">{t.nav.aiEducation}</Link></li>
              <li><Link href="/corporate-team-building" className="text-white/70 hover:text-primary transition-colors">{t.nav.corporateTeamBuilding}</Link></li>
              <li><Link href="/about" className="text-white/70 hover:text-primary transition-colors">{t.nav.about}</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-primary transition-colors">{t.nav.contact}</Link></li>
              <li>
                <a href="https://www.bulahk.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors">
                  {f.bulaLand}
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-bold text-lg text-white mb-4">{f.categories}</h3>
            <ul className="space-y-3">
              <li><Link href="/photography" className="text-white/70 hover:text-primary transition-colors">{f.catPhoto}</Link></li>
              <li><Link href="/ai-education" className="text-white/70 hover:text-primary transition-colors">{f.catEcology}</Link></li>
              <li><Link href={`/activities?category=${encodeURIComponent('中華文化活動')}`} className="text-white/70 hover:text-primary transition-colors">{f.catCulture}</Link></li>
              <li><Link href={`/activities?category=${encodeURIComponent('歷奇及戶外活動')}`} className="text-white/70 hover:text-primary transition-colors">{f.catAdventure}</Link></li>
              <li><Link href="/activities" className="text-white/70 hover:text-primary transition-colors">{f.catOutdoor}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold text-lg text-white mb-4">{f.contactInfo}</h3>
            <ul className="space-y-4 text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm whitespace-pre-line">{f.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+85297289412" className="text-sm hover:text-white transition-colors">+852 9728 9412</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <ObfuscatedEmail user="info" domain="juntarhk.com" className="text-sm hover:text-white transition-colors" />
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} JuntarHK. {f.rights}.</p>
          <div className="flex gap-4 items-center">
            <a href="https://www.juntarhk.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">www.juntarhk.com</a>
            <Link href="/admin" className="hover:text-white/80 transition-colors opacity-40 hover:opacity-70">{f.admin}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
