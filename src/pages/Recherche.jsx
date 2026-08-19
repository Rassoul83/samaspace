import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterSidebar from "../components/FilterSidebar";
import SpaceCard from "../components/SpaceCard";
import { listSpaces } from "../firebase/spaces";
import { MOCK_SPACES } from "../data/mockSpaces";

export default function Recherche() {
  const [params] = useSearchParams();
  const [spaces, setSpaces] = useState(MOCK_SPACES);
  const [filters, setFilters] = useState({
    activite: params.get("activite") || undefined,
    verifieOnly: params.get("verifie") === "1",
  });

  useEffect(() => {
    listSpaces({ ville: params.get("ville") })
      .then((data) => data.length && setSpaces(data))
      .catch(() => {});
  }, [params]);

  const filtered = useMemo(() => {
    return spaces.filter((s) => {
      if (filters.activite && !(s.activites || []).includes(filters.activite)) return false;
      if (filters.capaciteMin && s.capacite < filters.capaciteMin) return false;
      if (filters.budgetMax && s.prixHeure > filters.budgetMax) return false;
      if (filters.verifieOnly && !s.verifie) return false;
      if ((filters.equipements || []).length) {
        const has = filters.equipements.every((eq) => (s.equipements || []).includes(eq));
        if (!has) return false;
      }
      return true;
    });
  }, [spaces, filters]);

  const ville = params.get("ville");

  return (
    <div className="container-page py-10">
      <p className="eyebrow mb-1">{ville || "Toutes les villes"}</p>
      <h1 className="text-2xl md:text-3xl font-display text-nuit mb-8">
        {filtered.length} espace{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}
      </h1>

      <div className="grid md:grid-cols-[260px_1fr] gap-8">
        <FilterSidebar filters={filters} onChange={setFilters} />
        <div>
          {filtered.length === 0 ? (
            <div className="card p-10 text-center text-encre/60">
              Aucun espace ne correspond à ces critères pour le moment. Essayez d\élargir vos filtres.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((s) => (
                <SpaceCard key={s.id} space={s} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
