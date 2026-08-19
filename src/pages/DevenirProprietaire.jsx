import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const AVANTAGES = [
  "Inscription gratuite pendant le lancement",
  "Un canal commercial supplémentaire, sans remplacer vos réservations actuelles",
  "Fiche professionnelle complète avec photos, tarifs et disponibilités",
  "Demandes qualifiées reçues directement dans votre tableau de bord",
  "Badge « Salle vérifiée » pour renforcer la confiance des clients",
];

export default function DevenirProprietaire() {
  return (
    <div className="container-page py-16 grid lg:grid-cols-2 gap-12 items-start">
      <div>
        <p className="eyebrow mb-2">Propriétaires</p>
        <h1 className="text-3xl md:text-4xl font-display text-nuit mb-5">
          Publiez votre espace, recevez des demandes qualifiées.
        </h1>
        <p className="text-encre/70 mb-8 leading-relaxed">
          SamaSpace s'adresse aux hôtels, centres de formation, coworkings, restaurants, maisons d'hôtes et domaines qui louent des espaces à Dakar et Saly.
        </p>
        <ul className="space-y-3 mb-8">
          {AVANTAGES.map((a) => (
            <li key={a} className="flex items-start gap-2.5 text-sm text-encre/80">
              <CheckCircle2 size={16} className="text-atlan-600 mt-0.5 shrink-0" />
              {a}
            </li>
          ))}
        </ul>
        <Link to="/inscription?role=proprietaire" className="btn-accent">Créer mon compte propriétaire</Link>
      </div>
      <div className="card p-8 bg-nuit text-sable">
        <p className="eyebrow text-ocre mb-3">Objectif pilote</p>
        <p className="text-3xl font-display mb-2">50 à 100 espaces</p>
        <p className="text-sable/70 text-sm leading-relaxed">
          vérifiés à Dakar et Saly pour le lancement, avant extension vers Mbour, Thiès et Diamniadio.
        </p>
      </div>
    </div>
  );
}
