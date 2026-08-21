import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Users, Star, Heart, CheckCircle2 } from "lucide-react";
import VerifiedBadge from "../components/VerifiedBadge";
import { getSpace, createBooking, listReviewsBySpace } from "../firebase/spaces";
import { useAuth } from "../context/AuthContext";
import { MOCK_SPACES } from "../data/mockSpaces";
import { CONFIGURATIONS } from "../data/villes";

function formatFCFA(n) {
  return new Intl.NumberFormat("fr-FR").format(n || 0) + " FCFA";
}

export default function EspaceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [space, setSpace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ date: "", heureDebut: "", duree: "2", participants: "" });
  const [statut, setStatut] = useState(null);
  const [photoActive, setPhotoActive] = useState(null);

  useEffect(() => {
    getSpace(id)
      .then((s) => {
        const resolved = s || MOCK_SPACES.find((m) => m.id === id) || MOCK_SPACES[0];
        setSpace(resolved);
        setPhotoActive(resolved.photos?.[0] || resolved.image || null);
      })
      .catch(() => {
        const fallback = MOCK_SPACES.find((m) => m.id === id) || MOCK_SPACES[0];
        setSpace(fallback);
        setPhotoActive(fallback.photos?.[0] || fallback.image || null);
      });
    listReviewsBySpace(id).then(setReviews).catch(() => setReviews([]));
  }, [id]);

  if (!space) return <div className="container-page py-20 text-center text-encre/50">Chargement…</div>;

  async function handleDemande(e) {
    e.preventDefault();
    if (!user) return setStatut("connexion-requise");
    try {
      await createBooking({
        espaceId: space.id,
        espaceNom: space.nom,
        clientId: user.uid,
        proprietaireId: space.proprietaireId || null,
        ...form,
      });
      setStatut("envoyee");
    } catch {
      setStatut("erreur");
    }
  }

  return (
    <div className="container-page py-10">
      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        <div>
          <div className="relative h-72 rounded-lg overflow-hidden mb-3 flex items-end p-6">
            {photoActive ? (
              <>
                <img
                  src={photoActive}
                  alt={space.nom}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nuit/50 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-nuit to-atlan-600" />
            )}
            {space.verifie && (
              <div className="relative">
                <VerifiedBadge size="md" />
              </div>
            )}
          </div>

          {(space.photos?.length > 1) && (
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {space.photos.map((url, i) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setPhotoActive(url)}
                  className={`shrink-0 h-16 w-24 rounded-sm overflow-hidden border-2 transition-colors ${
                    url === photoActive ? "border-nuit" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={url} alt={`Vue ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="flex items-start justify-between gap-4 mb-1">
            <h1 className="text-3xl font-display text-nuit">{space.nom}</h1>
            <button className="btn-outline text-sm shrink-0" aria-label="Ajouter aux favoris">
              <Heart size={16} /> Favoris
            </button>
          </div>
          <p className="flex items-center gap-1.5 text-encre/60 text-sm mb-1">
            <MapPin size={14} /> {space.quartier}, {space.ville} — {space.etablissement}
          </p>
          {space.note > 0 && (
            <p className="flex items-center gap-1 text-sm text-encre/70 mb-6">
              <Star size={14} className="fill-ocre text-ocre" /> {space.note} · {space.nombreAvis} avis
            </p>
          )}

          <p className="text-encre/75 leading-relaxed mb-8">{space.description}</p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="card p-4 text-center">
              <Users size={18} className="mx-auto mb-1 text-atlan-600" />
              <p className="font-mono text-lg text-nuit">{space.capacite}</p>
              <p className="text-xs text-encre/50">personnes max</p>
            </div>
            <div className="card p-4 text-center">
              <p className="font-mono text-lg text-nuit">{formatFCFA(space.prixHeure)}</p>
              <p className="text-xs text-encre/50">par heure</p>
            </div>
            <div className="card p-4 text-center">
              <p className="font-mono text-lg text-nuit">{formatFCFA(space.prixJournee)}</p>
              <p className="text-xs text-encre/50">par journée</p>
            </div>
          </div>

          <h2 className="font-display text-xl text-nuit mb-3">Équipements</h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {(space.equipements || []).map((eq) => (
              <span key={eq} className="flex items-center gap-1.5 text-sm bg-sable-200 px-3 py-1.5 rounded-full">
                <CheckCircle2 size={14} className="text-atlan-600" /> {eq}
              </span>
            ))}
          </div>

          <h2 className="font-display text-xl text-nuit mb-3">Configurations disponibles</h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {CONFIGURATIONS.map((c) => (
              <span key={c} className="text-sm border border-nuit/15 px-3 py-1.5 rounded-full text-encre/70">{c}</span>
            ))}
          </div>

          <h2 className="font-display text-xl text-nuit mb-3">Avis</h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-encre/50">Aucun avis pour l\instant — les avis sont publiés uniquement après réservation confirmée.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="card p-4">
                  <p className="text-sm font-medium text-nuit">{r.auteurNom || "Client vérifié"}</p>
                  <p className="text-sm text-encre/70 mt-1">{r.commentaire}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="card p-6 h-fit sticky top-24">
          <h3 className="font-display text-lg text-nuit mb-4">Demander une disponibilité</h3>
          {statut === "envoyee" ? (
            <p className="text-sm text-atlan-600 bg-atlan-100 rounded-sm p-3">
              Demande envoyée. Le propriétaire vous répondra pour confirmer la disponibilité.
            </p>
          ) : (
            <form onSubmit={handleDemande} className="space-y-3">
              <div>
                <label className="label">Date</label>
                <input required type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Heure de début</label>
                  <input required type="time" className="input" value={form.heureDebut} onChange={(e) => setForm({ ...form, heureDebut: e.target.value })} />
                </div>
                <div>
                  <label className="label">Durée (h)</label>
                  <input required type="number" min="1" className="input" value={form.duree} onChange={(e) => setForm({ ...form, duree: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="label">Nombre de participants</label>
                <input required type="number" min="1" className="input" value={form.participants} onChange={(e) => setForm({ ...form, participants: e.target.value })} />
              </div>
              <button type="submit" className="btn-primary w-full mt-2">Envoyer la demande</button>
              {statut === "connexion-requise" && (
                <p className="text-xs text-ocre-600">Connectez-vous pour envoyer une demande de réservation.</p>
              )}
              {statut === "erreur" && (
                <p className="text-xs text-red-600">Une erreur est survenue, réessayez.</p>
              )}
              <p className="text-xs text-encre/40 pt-1">Réponse sous 24h en moyenne. Aucun paiement requis à ce stade.</p>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}
