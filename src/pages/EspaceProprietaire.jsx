import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { listSpacesByOwner, listBookingsByOwner, updateBookingStatus, deleteSpace } from "../firebase/spaces";
import VerifiedBadge from "../components/VerifiedBadge";

export default function EspaceProprietaire() {
  const { user, profile } = useAuth();
  const [espaces, setEspaces] = useState([]);
  const [demandes, setDemandes] = useState([]);

  useEffect(() => {
    if (!user) return;
    listSpacesByOwner(user.uid).then(setEspaces).catch(() => {});
    listBookingsByOwner(user.uid).then(setDemandes).catch(() => {});
  }, [user]);

  async function supprimer(id) {
    if (!window.confirm("Supprimer cet espace ? Cette action est irréversible.")) return;
    await deleteSpace(id);
    setEspaces((prev) => prev.filter((e) => e.id !== id));
  }

  async function repondre(id, statut) {
    await updateBookingStatus(id, statut);
    setDemandes((d) => d.map((x) => (x.id === id ? { ...x, statut } : x)));
  }

  const revenusEstimes = demandes
    .filter((d) => d.statut === "confirmee")
    .length;

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="eyebrow mb-1">Espace propriétaire</p>
          <h1 className="text-3xl font-display text-nuit">Bonjour {profile?.nom || user?.displayName} 👋</h1>
        </div>
        <Link to="/ajouter-espace" className="btn-accent">
          <Plus size={16} /> Ajouter un espace
        </Link>
      </div>

      <div className="grid sm:grid-cols-4 gap-5 mb-10">
        <div className="card p-5">
          <p className="text-xs text-nuit-400 uppercase tracking-wide mb-1">Espaces publiés</p>
          <p className="text-3xl font-display text-nuit">{espaces.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-nuit-400 uppercase tracking-wide mb-1">Demandes reçues</p>
          <p className="text-3xl font-display text-nuit">{demandes.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-nuit-400 uppercase tracking-wide mb-1">En attente</p>
          <p className="text-3xl font-display text-nuit">{demandes.filter((d) => d.statut === "en_attente").length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-nuit-400 uppercase tracking-wide mb-1">Confirmées</p>
          <p className="text-3xl font-display text-nuit">{revenusEstimes}</p>
        </div>
      </div>

      <h2 className="font-display text-xl text-nuit mb-4">Demandes récentes</h2>
      {demandes.length === 0 ? (
        <div className="card p-8 text-center text-encre/50 mb-10">Aucune demande reçue pour l\instant.</div>
      ) : (
        <div className="space-y-3 mb-10">
          {demandes.map((d) => (
            <div key={d.id} className="card p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-nuit">{d.espaceNom}</p>
                <p className="text-sm text-encre/60">{d.date} à {d.heureDebut} — {d.participants} participants</p>
              </div>
              {d.statut === "en_attente" ? (
                <div className="flex gap-2">
                  <button onClick={() => repondre(d.id, "confirmee")} className="btn-primary text-xs py-1.5">Confirmer</button>
                  <button onClick={() => repondre(d.id, "refusee")} className="btn-outline text-xs py-1.5">Refuser</button>
                </div>
              ) : (
                <span className="text-xs font-medium text-encre/50 capitalize">{d.statut.replace("_", " ")}</span>
              )}
            </div>
          ))}
        </div>
      )}

      <h2 className="font-display text-xl text-nuit mb-4">Mes espaces</h2>
      {espaces.length === 0 ? (
        <div className="card p-8 text-center text-encre/50">
          Vous n\avez pas encore publié d\espace. <Link to="/ajouter-espace" className="text-atlan-600 font-medium">Ajoutez-en un</Link>.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {espaces.map((e) => (
            <div key={e.id} className="card p-4">
              <div className="flex items-start justify-between">
                <p className="font-display text-nuit">{e.nom}</p>
                {e.verifie && <VerifiedBadge />}
              </div>
              <p className="text-sm text-encre/60 mt-1">{e.quartier}, {e.ville}</p>
              {!e.verifie && <p className="text-xs text-ocre-600 mt-2">Vérification en attente</p>}
              <div className="flex gap-2 mt-4 pt-3 border-t border-nuit/10">
                <Link to={`/modifier-espace/${e.id}`} className="btn-outline text-xs py-1.5 flex-1 text-center">
                  Modifier
                </Link>
                <button onClick={() => supprimer(e.id)} className="btn-outline text-xs py-1.5 flex-1 text-red-600 border-red-200 hover:bg-red-50">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
