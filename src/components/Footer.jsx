import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-nuit text-sable/80 mt-24">
      <div className="container-page py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display italic text-xl text-sable mb-3">SamaSpace</p>
          <p className="text-sm text-sable/60 leading-relaxed">
            La plateforme sénégalaise pour trouver, comparer et réserver le bon espace au bon moment.
          </p>
        </div>
        <div>
          <p className="eyebrow text-ocre mb-3">Espaces</p>
          <ul className="space-y-2 text-sm text-sable/70">
            <li><Link to="/recherche">Toutes les salles</Link></li>
            <li><Link to="/recherche?ville=Dakar">Salles à Dakar</Link></li>
            <li><Link to="/recherche?ville=Saly">Salles à Saly</Link></li>
            <li><Link to="/recherche?verifie=1">Salles vérifiées</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-ocre mb-3">Propriétaires</p>
          <ul className="space-y-2 text-sm text-sable/70">
            <li><Link to="/devenir-proprietaire">Devenir propriétaire</Link></li>
            <li><Link to="/espace-proprietaire">Espace propriétaire</Link></li>
            <li><Link to="/comment-ca-marche">Comment ça marche</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-ocre mb-3">SamaSpace</p>
          <ul className="space-y-2 text-sm text-sable/70">
            <li><Link to="/a-propos">À propos</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sable/10 py-5 text-center text-xs text-sable/40">
        © {new Date().getFullYear()} SamaSpace — un produit Dalitech, Dakar.
      </div>
    </footer>
  );
}
