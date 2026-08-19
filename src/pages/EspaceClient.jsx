import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listBookingsByClient } from "../firebase/spaces";

const STATUTS = {
  en_attente: { label: "En attente", cls: "bg-ocre/20 text-ocre-600" },
  confirmee: { label: "Confirmée", cls: "bg-atlan-100 text-atlan-600" },
  refusee: { label: "Refusée", cls: "bg-red-100 text-red-600" },
  annulee: { label: "Annulée", cls: "bg-nuit/10 text-nuit-400" },
};

export default function EspaceClient() {
  const { user, profile } = useAuth();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (user) listBookingsByClient(user.uid).then(setReservations).catch(() => {});
  }, [user]);

  return (
    <div className="container-page py-10">
      <p className="eyebrow mb-1">Espace client</p>
      <h1 className="text-3xl font-display text-nuit mb-8">Bonjour {profile?.nom || user?.displayName} 👋</h1>

      <div className="grid md:grid-cols-3 gap-5 mb-10">
        <div className="card p-5">
          <p className="text-xs text-nuit-400 uppercase tracking-wide mb-1">Demandes envoyées</p>
          <p className="text-3xl font-display text-nuit">{reservations.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-nuit-400 uppercase tracking-wide mb-1">Confirmées</p>
          <p className="text-3xl font-display text-nuit">{reservations.filter((r) => r.statut === "confirmee").length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-nuit-400 uppercase tracking-wide mb-1">Favoris</p>
          <p className="text-3xl font-display text-nuit">0</p>
        </div>
      </div>

      <h2 className="font-display text-xl text-nuit mb-4">Mes demandes de réservation</h2>
      {reservations.length === 0 ? (
        <div className="card p-8 text-center text-encre/50">
          Aucune demande pour l\instant. <a href="/recherche" className="text-atlan-600 font-medium">Trouvez un espace</a>.
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map((r) => (
            <div key={r.id} className="card p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-nuit">{r.espaceNom}</p>
                <p className="text-sm text-encre/60">{r.date} à {r.heureDebut} — {r.duree}h — {r.participants} participants</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUTS[r.statut]?.cls || ""}`}>
                {STATUTS[r.statut]?.label || r.statut}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
