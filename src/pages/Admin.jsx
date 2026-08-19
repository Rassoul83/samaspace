import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { updateSpace } from "../firebase/spaces";
import VerifiedBadge from "../components/VerifiedBadge";

export default function Admin() {
  const [espaces, setEspaces] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "espaces"))
      .then((snap) => setEspaces(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .catch(() => {})
      .finally(() => setChargement(false));
  }, []);

  async function verifier(id) {
    await updateSpace(id, { verifie: true });
    setEspaces((e) => e.map((x) => (x.id === id ? { ...x, verifie: true } : x)));
  }

  const enAttente = espaces.filter((e) => !e.verifie);
  const verifies = espaces.filter((e) => e.verifie);

  return (
    <div className="container-page py-10">
      <p className="eyebrow mb-1">Administration</p>
      <h1 className="text-3xl font-display text-nuit mb-8">Vérification des espaces</h1>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <div className="card p-5">
          <p className="text-xs text-nuit-400 uppercase tracking-wide mb-1">Total espaces</p>
          <p className="text-3xl font-display text-nuit">{espaces.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-nuit-400 uppercase tracking-wide mb-1">En attente</p>
          <p className="text-3xl font-display text-nuit">{enAttente.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-nuit-400 uppercase tracking-wide mb-1">Vérifiés</p>
          <p className="text-3xl font-display text-nuit">{verifies.length}</p>
        </div>
      </div>

      <h2 className="font-display text-xl text-nuit mb-4">En attente de vérification</h2>
      {chargement ? (
        <p className="text-encre/50">Chargement…</p>
      ) : enAttente.length === 0 ? (
        <div className="card p-8 text-center text-encre/50 mb-10">Rien à vérifier pour le moment.</div>
      ) : (
        <div className="space-y-3 mb-10">
          {enAttente.map((e) => (
            <div key={e.id} className="card p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-nuit">{e.nom}</p>
                <p className="text-sm text-encre/60">{e.quartier}, {e.ville} — {e.etablissement}</p>
              </div>
              <button onClick={() => verifier(e.id)} className="btn-primary text-sm">Marquer comme vérifié</button>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-display text-xl text-nuit mb-4">Espaces vérifiés</h2>
      <div className="space-y-2">
        {verifies.map((e) => (
          <div key={e.id} className="flex items-center justify-between text-sm p-3 card">
            <span>{e.nom} — {e.quartier}, {e.ville}</span>
            <VerifiedBadge />
          </div>
        ))}
      </div>

      <p className="text-xs text-encre/40 mt-8">
        Vue d\administration simplifiée du MVP — à étendre : gestion des utilisateurs, paiements, litiges, contenus et rôles (support, vérificateur terrain).
      </p>
    </div>
  );
}
