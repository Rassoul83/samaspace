import { useEffect, useState } from "react";
import { X } from "lucide-react";
import VerifiedBadge from "../components/VerifiedBadge";
import { listSpaces } from "../firebase/spaces";
import { MOCK_SPACES } from "../data/mockSpaces";

function formatFCFA(n) {
  return new Intl.NumberFormat("fr-FR").format(n || 0) + " FCFA";
}

const LIGNES = [
  { label: "Ville / quartier", get: (s) => `${s.quartier}, ${s.ville}` },
  { label: "Capacité", get: (s) => `${s.capacite} personnes` },
  { label: "Prix / heure", get: (s) => formatFCFA(s.prixHeure) },
  { label: "Prix / journée", get: (s) => formatFCFA(s.prixJournee) },
  { label: "Équipements", get: (s) => (s.equipements || []).join(", ") || "—" },
  { label: "Note", get: (s) => (s.note ? `${s.note} (${s.nombreAvis} avis)` : "Pas encore d\avis") },
  { label: "Statut", get: (s) => (s.verifie ? "Vérifiée" : "En attente de vérification") },
];

export default function Comparateur() {
  const [tous, setTous] = useState(MOCK_SPACES);
  const [selection, setSelection] = useState([]);

  useEffect(() => {
    listSpaces().then((d) => d.length && setTous(d)).catch(() => {});
  }, []);

  function toggle(id) {
    setSelection((sel) =>
      sel.includes(id) ? sel.filter((s) => s !== id) : sel.length < 4 ? [...sel, id] : sel
    );
  }

  const espaces = tous.filter((s) => selection.includes(s.id));

  return (
    <div className="container-page py-10">
      <p className="eyebrow mb-2">Comparateur</p>
      <h1 className="text-3xl font-display text-nuit mb-2">Comparez jusqu\à 4 espaces</h1>
      <p className="text-encre/65 mb-8">Sélectionnez les espaces à comparer côte à côte.</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {tous.map((s) => (
          <button
            key={s.id}
            onClick={() => toggle(s.id)}
            className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
              selection.includes(s.id) ? "bg-nuit text-sable border-nuit" : "border-nuit/15 text-encre/70"
            }`}
          >
            {s.nom}
          </button>
        ))}
      </div>

      {espaces.length === 0 ? (
        <div className="card p-10 text-center text-encre/50">Sélectionnez au moins un espace ci-dessus.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left p-3 text-xs text-nuit-400 w-40"></th>
                {espaces.map((s) => (
                  <th key={s.id} className="p-3 text-left align-top">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-nuit">{s.nom}</p>
                        {s.verifie && <div className="mt-1"><VerifiedBadge /></div>}
                      </div>
                      <button onClick={() => toggle(s.id)} className="text-encre/40 hover:text-encre" aria-label="Retirer">
                        <X size={16} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LIGNES.map((ligne, i) => (
                <tr key={ligne.label} className={i % 2 ? "bg-sable-200/50" : ""}>
                  <td className="p-3 text-sm font-medium text-nuit-400">{ligne.label}</td>
                  {espaces.map((s) => (
                    <td key={s.id} className="p-3 text-sm text-encre/80">{ligne.get(s)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
