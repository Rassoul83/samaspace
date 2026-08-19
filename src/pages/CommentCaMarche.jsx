import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, CalendarCheck, MessageCircle } from "lucide-react";

const ETAPES = [
  { icon: Search, titre: "Décrivez votre besoin", texte: "Ville, activité, capacité, budget et équipements — via la recherche ou « Trouvez-moi une salle »." },
  { icon: SlidersHorizontal, titre: "Comparez les espaces", texte: "Filtrez, comparez jusqu'à 4 espaces côte à côte, repérez les salles vérifiées." },
  { icon: CalendarCheck, titre: "Vérifiez la disponibilité", texte: "Envoyez une demande de réservation directement depuis la fiche de l'espace." },
  { icon: MessageCircle, titre: "Confirmez et laissez un avis", texte: "Le propriétaire confirme la disponibilité. Après votre événement, partagez votre avis." },
];

export default function CommentCaMarche() {
  return (
    <div className="container-page py-16">
      <p className="eyebrow mb-2">Guide</p>
      <h1 className="text-3xl md:text-4xl font-display text-nuit mb-10 max-w-2xl">Comment fonctionne SamaSpace ?</h1>
      <div className="grid sm:grid-cols-2 gap-6 mb-14">
        {ETAPES.map((e, i) => (
          <div key={e.titre} className="card p-6">
            <span className="eyebrow">Étape {i + 1}</span>
            <e.icon size={22} className="text-atlan-600 my-3" />
            <h3 className="font-display text-lg text-nuit mb-1.5">{e.titre}</h3>
            <p className="text-sm text-encre/65 leading-relaxed">{e.texte}</p>
          </div>
        ))}
      </div>
      <div className="card p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-display text-lg text-nuit">Prêt à trouver votre espace ?</p>
        <Link to="/recherche" className="btn-accent">Commencer la recherche</Link>
      </div>
    </div>
  );
}
