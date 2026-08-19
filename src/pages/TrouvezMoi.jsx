import { useState } from "react";
import { Wand2 } from "lucide-react";
import SpaceCard from "../components/SpaceCard";
import { VILLES, ACTIVITES, EQUIPEMENTS } from "../data/villes";
import { listSpaces } from "../firebase/spaces";
import { MOCK_SPACES } from "../data/mockSpaces";

function computeScore(space, besoin) {
  let total = 0;
  let max = 0;

  max += 25;
  if (space.capacite >= Number(besoin.personnes || 0)) total += 25;

  max += 25;
  if (!besoin.budget || space.prixHeure <= Number(besoin.budget)) total += 25;

  max += 20;
  if (!besoin.activite || (space.activites || []).includes(besoin.activite)) total += 20;

  max += 20;
  const requis = besoin.equipements || [];
  if (requis.length === 0) total += 20;
  else {
    const ratio = requis.filter((e) => (space.equipements || []).includes(e)).length / requis.length;
    total += Math.round(ratio * 20);
  }

  max += 10;
  if (!besoin.ville || space.ville === besoin.ville) total += 10;

  return Math.round((total / max) * 100);
}

export default function TrouvezMoi() {
  const [besoin, setBesoin] = useState({
    ville: "Dakar", activite: "formation", personnes: "", budget: "", equipements: [],
  });
  const [resultats, setResultats] = useState(null);

  function toggleEquipement(eq) {
    const set = new Set(besoin.equipements);
    set.has(eq) ? set.delete(eq) : set.add(eq);
    setBesoin({ ...besoin, equipements: Array.from(set) });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let spaces = MOCK_SPACES;
    try {
      const live = await listSpaces({ ville: besoin.ville });
      if (live.length) spaces = live;
    } catch {}
    const scored = spaces
      .map((s) => ({ space: s, score: computeScore(s, besoin) }))
      .sort((a, b) => b.score - a.score);
    setResultats(scored);
  }

  return (
    <div className="container-page py-10 max-w-4xl">
      <p className="eyebrow mb-2">Matching intelligent</p>
      <h1 className="text-3xl font-display text-nuit mb-2">Trouvez-moi une salle</h1>
      <p className="text-encre/65 mb-8">
        Décrivez votre besoin, par exemple : formation de 80 personnes à Dakar, budget maximum 100 000 FCFA avec climatisation et projecteur. On classe les espaces qui correspondent le mieux, et on vous montre pourquoi.
      </p>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5 mb-10">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Ville</label>
            <select className="input" value={besoin.ville} onChange={(e) => setBesoin({ ...besoin, ville: e.target.value })}>
              {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Activité</label>
            <select className="input" value={besoin.activite} onChange={(e) => setBesoin({ ...besoin, activite: e.target.value })}>
              {ACTIVITES.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Nombre de personnes</label>
            <input type="number" min="1" className="input" placeholder="Ex : 80" value={besoin.personnes} onChange={(e) => setBesoin({ ...besoin, personnes: e.target.value })} />
          </div>
          <div>
            <label className="label">Budget maximum / heure (FCFA)</label>
            <input type="number" min="0" className="input" placeholder="Ex : 20000" value={besoin.budget} onChange={(e) => setBesoin({ ...besoin, budget: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="label">Équipements requis</label>
          <div className="flex flex-wrap gap-2">
            {EQUIPEMENTS.map((eq) => (
              <button
                type="button"
                key={eq}
                onClick={() => toggleEquipement(eq)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  besoin.equipements.includes(eq)
                    ? "bg-atlan text-white border-atlan"
                    : "border-nuit/15 text-encre/70 hover:border-nuit/30"
                }`}
              >
                {eq}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="btn-accent">
          <Wand2 size={16} /> Trouver les meilleurs espaces
        </button>
      </form>

      {resultats && (
        <div>
          <h2 className="font-display text-xl text-nuit mb-4">
            {resultats.length} résultat{resultats.length > 1 ? "s" : ""}, classés par compatibilité
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {resultats.map(({ space, score }) => (
              <SpaceCard key={space.id} space={space} matchScore={score} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
