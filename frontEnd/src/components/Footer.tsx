import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/ac.png";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <img src={logo} alt="ACEEMUB" className="h-12 w-12 rounded-xl bg-background/95 p-1 object-contain" />
              <span className="font-serif text-2xl">ACEEMUB</span>
            </div>
            <p className="mt-3 max-w-md text-sm text-background/70">
              Association des Élèves et Étudiants Musulmans du Bénin. Science et efficacité 
              au service de l'Islam.
            </p>
            <div className="mt-5 flex gap-2">
              <a href="#" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full border border-background/20 hover:bg-background/10">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full border border-background/20 hover:bg-background/10">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg">Navigation</h4>
            <ul className="mt-3 space-y-2 text-sm text-background/70">
              <li><Link to="/blog" className="hover:text-background">Blog</Link></li>
              <li><Link to="/evenements" className="hover:text-background">Événements</Link></li>
              <li><Link to="/annonces" className="hover:text-background">Annonces</Link></li>
              <li><Link to="/rejoindre" className="hover:text-background">Devenir membre</Link></li>
              <li><Link to="/faq" className="hover:text-background">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-background/70">
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" /> Cotonou, Bénin</li>
              <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 flex-shrink-0" /> +229 00 00 00 00</li>
              <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 flex-shrink-0" /> contact@aceemub.org</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-background/15 pt-5 text-xs text-background/60">
          © {new Date().getFullYear()} ACEEMUB. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
