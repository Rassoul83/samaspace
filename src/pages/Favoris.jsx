import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, CalendarDays } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { listFavorites, getSpace, removeFavorite } from "../firebase/spaces";
import SpaceCard from "../components/SpaceCard";

export default function Favoris() {
  const { user } = useAuth();
  const [espaces, setEspaces] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    if (!user) return;
    listFavorites(user.uid)
      .then((favs) => Promise.all(favs.map((f) => getSpace(f.spaceId))))
      .then((liste) => setEspaces(liste.filter(Boolean)))
      .catch(() => {})
      .finally(() => setChargement(false));
  }, [user]);

  async function handleRetirer(spaceId) {
    await removeFavorite(user.uid, spaceId).catch(() => {});
    setEspaces((prev) => prev.filter((e) => e.id !== spaceId));
  }

  return (
    <div className="container-page py-10">
      <p className="eyebrow mb-1">Mon compte</p>
      <h1 className="text-3xl font-display text-nuit mb-2">Mes favoris</h1>
      <p className="text-sm text-encre/50 mb-6">{espaces.length} espace{espaces.length !== 1 ? "s" : ""} enregistré{espaces.length !== 1 ? "s" : ""}</p>

      <nav className="flex gap-1 mb-8 border-b border-nuit/10 -mx-1 px-1">
        <Link to="/espace-client" className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-encre/60 hover:text-nuit transition-colors border-b-2 border-transparent -mb-px">
          <CalendarDays size={15} /> Mes demandes
        </Link>
        <span className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-nuit border-b-2 border-nuit -mb-px">
          <Heart size={15} /> Mes favoris
        </span>
      </nav>

      {chargement ? (
        <p className="text-encre/50">Chargement…</p>
      ) : espaces.length === 0 ? (
        <div className="card p-12 text-center">
          <Heart size={32} className="mx-auto mb-3 text-nuit/20" />
          <p className="text-encre/50 mb-3">Aucun espace en favori pour l'instant.</p>
          <a href="/recherche" className="btn-primary text-sm inline-flex">Explorer les espaces</a>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {espaces.map((espace) => (
            <div key={espace.id} className="relative group">
              <SpaceCard space={espace} />
              <button
                onClick={() => handleRetirer(espace.id)}
                className="absolute top-3 right-3 z-10 bg-sable-100/90 backdrop-blur-sm border border-nuit/10 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Retirer des favoris"
                title="Retirer des favoris"
              >
                <Heart size={14} className="fill-ocre text-ocre" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
