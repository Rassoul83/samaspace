import { Link } from "react-router-dom";
import { MapPin, Users, Star } from "lucide-react";
import VerifiedBadge from "./VerifiedBadge";
import MatchScore from "./MatchScore";

const PLACEHOLDER_GRADIENTS = [
  "from-nuit to-atlan-600",
  "from-ocre-600 to-nuit",
  "from-atlan-600 to-nuit-800",
  "from-nuit-800 to-ocre-600",
];

function formatFCFA(n) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

export default function SpaceCard({ space, matchScore }) {
  const gradient = PLACEHOLDER_GRADIENTS[space.nom ? space.nom.length % PLACEHOLDER_GRADIENTS.length : 0];

  return (
    <Link
      to={`/espaces/${space.id}`}
      className="card overflow-hidden group hover:border-nuit/25 transition-colors block"
    >
      <div className={`relative h-40 overflow-hidden flex items-end p-3 ${!space.image ? `bg-gradient-to-br ${gradient}` : ""}`}>
        {space.image && (
          <>
            <img
              src={space.image}
              alt={space.nom}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-nuit/65 to-transparent" />
          </>
        )}
        {space.verifie && (
          <div className="absolute top-3 left-3">
            <VerifiedBadge />
          </div>
        )}
        {typeof matchScore === "number" && (
          <div className="absolute top-3 right-3">
            <MatchScore score={matchScore} compact />
          </div>
        )}
        <span className="relative font-display text-sable text-lg italic leading-tight drop-shadow-sm">
          {space.nom}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1.5 text-xs text-nuit-400 mb-2">
          <MapPin size={13} />
          {space.quartier}, {space.ville}
        </div>
        <p className="text-sm text-encre/70 line-clamp-2 mb-3">{space.description}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-encre/70">
            <Users size={14} />
            {space.capacite} pers.
          </div>
          {space.note > 0 && (
            <div className="flex items-center gap-1 text-encre/70">
              <Star size={13} className="fill-ocre text-ocre" />
              {space.note} <span className="text-encre/40">({space.nombreAvis})</span>
            </div>
          )}
        </div>
        <div className="mt-3 pt-3 border-t border-nuit/10 flex items-baseline justify-between">
          <span className="font-mono text-sm font-medium text-nuit">{formatFCFA(space.prixHeure)}</span>
          <span className="text-xs text-encre/50">/ heure</span>
        </div>
      </div>
    </Link>
  );
}
