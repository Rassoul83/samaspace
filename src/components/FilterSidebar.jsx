import { ACTIVITES, EQUIPEMENTS } from "../data/villes";

export default function FilterSidebar({ filters, onChange }) {
  function toggleEquipement(eq) {
    const set = new Set(filters.equipements || []);
    set.has(eq) ? set.delete(eq) : set.add(eq);
    onChange({ ...filters, equipements: Array.from(set) });
  }

  return (
    <aside className="card p-5 space-y-6 h-fit sticky top-24">
      <div>
        <p className="label">Budget max / heure</p>
        <input
          type="range"
          min="2000"
          max="50000"
          step="1000"
          value={filters.budgetMax || 50000}
          onChange={(e) => onChange({ ...filters, budgetMax: Number(e.target.value) })}
          className="w-full accent-atlan"
        />
        <div className="flex justify-between text-xs text-nuit-400 mt-1 font-mono">
          <span>2 000 FCFA</span>
          <span>{new Intl.NumberFormat("fr-FR").format(filters.budgetMax || 50000)} FCFA</span>
        </div>
      </div>

      <div>
        <p className="label">Capacité minimum</p>
        <input
          type="number"
          min="1"
          placeholder="Ex : 50 personnes"
          value={filters.capaciteMin || ""}
          onChange={(e) => onChange({ ...filters, capaciteMin: Number(e.target.value) || undefined })}
          className="input"
        />
      </div>

      <div>
        <p className="label">Activité</p>
        <div className="space-y-1.5">
          {ACTIVITES.map((a) => (
            <label key={a.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="activite"
                checked={filters.activite === a.id}
                onChange={() => onChange({ ...filters, activite: a.id })}
                className="accent-atlan"
              />
              {a.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="label">Équipements</p>
        <div className="space-y-1.5">
          {EQUIPEMENTS.map((eq) => (
            <label key={eq} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={(filters.equipements || []).includes(eq)}
                onChange={() => toggleEquipement(eq)}
                className="accent-atlan"
              />
              {eq}
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer pt-2 border-t border-nuit/10">
        <input
          type="checkbox"
          checked={!!filters.verifieOnly}
          onChange={(e) => onChange({ ...filters, verifieOnly: e.target.checked })}
          className="accent-atlan"
        />
        Salles vérifiées uniquement
      </label>

      <button onClick={() => onChange({})} className="btn-ghost text-xs w-full">
        Réinitialiser les filtres
      </button>
    </aside>
  );
}
