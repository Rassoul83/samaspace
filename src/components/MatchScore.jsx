// Élément signature : un cadran de compatibilité inspiré des trames tissées
// (bandes de pagne) — chaque bande représente un critère de matching.
const CRITERES_DEFAUT = [
  { id: "budget", label: "Budget" },
  { id: "capacite", label: "Capacité" },
  { id: "equipements", label: "Équipements" },
  { id: "distance", label: "Distance" },
  { id: "disponibilite", label: "Disponibilité" },
];

export default function MatchScore({ score = 0, criteres = CRITERES_DEFAUT, compact = false }) {
  const size = compact ? 56 : 88;
  const stroke = compact ? 6 : 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = (score / 100) * c;

  return (
    <div className={`flex items-center ${compact ? "gap-2" : "gap-4"}`}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EFE7D6" strokeWidth={stroke} />
          {criteres.map((_, i) => {
            const seg = c / criteres.length;
            const gap = 2;
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={i * seg < filled ? "#0F6E6E" : "transparent"}
                strokeWidth={stroke}
                strokeDasharray={`${seg - gap} ${c - seg + gap}`}
                strokeDashoffset={-i * seg}
                strokeLinecap="butt"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-mono font-medium text-nuit ${compact ? "text-xs" : "text-sm"}`}>{score}%</span>
        </div>
      </div>
      {!compact && (
        <div className="text-xs text-nuit-400 leading-relaxed">
          <span className="block font-medium text-nuit">Compatibilité</span>
          {criteres.map((cr) => cr.label).join(" · ")}
        </div>
      )}
    </div>
  );
}
