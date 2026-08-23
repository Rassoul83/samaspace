import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { updateSpace, getHeroSlides, updateHeroSlides } from "../firebase/spaces";
import { uploadImage } from "../lib/cloudinary";
import VerifiedBadge from "../components/VerifiedBadge";
import { Plus, Trash2, ImagePlus } from "lucide-react";

const DEFAULT_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1771270759486-1f7703945072?auto=format&fit=crop&w=1600&q=80",
    objectPosition: "center 40%",
    label: "Formations & réunions",
    text: "Des salles équipées pour vos formations, séminaires et réunions d'entreprise.",
  },
  {
    image: "https://images.unsplash.com/photo-1762765685319-fdaf8d22085d?auto=format&fit=crop&w=1600&q=80",
    objectPosition: "center 85%",
    label: "Événements & cérémonies",
    text: "Des espaces vérifiés pour vos mariages, cocktails et événements d'envergure.",
  },
  {
    image: "https://images.unsplash.com/photo-1716703373229-b0e43de7dd5c?auto=format&fit=crop&w=1600&q=80",
    label: "Coworking & ateliers",
    text: "Des lieux flexibles pour travailler, collaborer ou organiser un atelier.",
  },
];

const BLANK_NEW = { image: "", label: "", text: "" };

export default function Admin() {
  // --- Vérification espaces ---
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

  // --- Bannière hero ---
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [ajouterOuvert, setAjouterOuvert] = useState(false);
  const [newSlide, setNewSlide] = useState(BLANK_NEW);
  const [uploadingNew, setUploadingNew] = useState(false);
  const newFileRef = useRef(null);

  useEffect(() => {
    getHeroSlides().then((s) => { if (s) setSlides(s); }).catch(() => {});
  }, []);

  async function handleReplacePhoto(e, idx) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIdx(idx);
    try {
      const url = await uploadImage(file);
      setSlides((prev) => prev.map((s, i) => i === idx ? { ...s, image: url } : s));
      setSaved(false);
    } catch {
      alert("Échec de l'upload, réessayez.");
    } finally {
      setUploadingIdx(null);
      e.target.value = "";
    }
  }

  function supprimerSlide(idx) {
    setSlides((prev) => prev.filter((_, i) => i !== idx));
    setSaved(false);
  }

  async function handleNewPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingNew(true);
    try {
      const url = await uploadImage(file);
      setNewSlide((s) => ({ ...s, image: url }));
    } catch {
      alert("Échec de l'upload, réessayez.");
    } finally {
      setUploadingNew(false);
      e.target.value = "";
    }
  }

  function ajouterSlide() {
    setSlides((prev) => [...prev, { image: newSlide.image, label: newSlide.label, text: newSlide.text }]);
    setNewSlide(BLANK_NEW);
    setAjouterOuvert(false);
    setSaved(false);
  }

  async function enregistrer() {
    setSaving(true);
    try {
      await updateHeroSlides(slides);
      setSaved(true);
    } catch {
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container-page py-10">
      <p className="eyebrow mb-1">Administration</p>
      <h1 className="text-3xl font-display text-nuit mb-8">Tableau de bord</h1>

      {/* Stats */}
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

      {/* Vérification espaces */}
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
      <div className="space-y-2 mb-14">
        {verifies.map((e) => (
          <div key={e.id} className="flex items-center justify-between text-sm p-3 card">
            <span>{e.nom} — {e.quartier}, {e.ville}</span>
            <VerifiedBadge />
          </div>
        ))}
      </div>

      {/* Bannière hero */}
      <h2 className="font-display text-xl text-nuit mb-1">Bannière d'accueil</h2>
      <p className="text-sm text-encre/50 mb-6">{slides.length} slide{slides.length > 1 ? "s" : ""} · max 5</p>

      <div className="space-y-3 mb-5">
        {slides.map((slide, i) => (
          <div key={i} className="card p-4 flex gap-4 items-start">
            <div className="shrink-0 h-20 w-32 rounded overflow-hidden bg-nuit/10">
              {slide.image && (
                <img
                  src={slide.image}
                  alt={slide.label}
                  className="h-full w-full object-cover"
                  style={slide.objectPosition ? { objectPosition: slide.objectPosition } : undefined}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-nuit text-sm">{slide.label}</p>
              <p className="text-xs text-encre/60 mt-0.5 line-clamp-2">{slide.text}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <label className={`btn-outline text-xs py-1.5 cursor-pointer flex items-center gap-1.5 ${uploadingIdx !== null ? "opacity-50 pointer-events-none" : ""}`}>
                <ImagePlus size={13} />
                {uploadingIdx === i ? "Upload…" : "Remplacer"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleReplacePhoto(e, i)}
                  disabled={uploadingIdx !== null}
                />
              </label>
              <button
                onClick={() => supprimerSlide(i)}
                disabled={slides.length === 1}
                className="btn-outline text-xs py-1.5 text-red-500 border-red-200 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Supprimer ce slide"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Formulaire nouveau slide */}
      {slides.length < 5 && (
        ajouterOuvert ? (
          <div className="card p-5 mb-5 space-y-3">
            <p className="font-medium text-nuit text-sm">Nouveau slide</p>
            <div>
              <label className="label">Photo</label>
              <div className="flex items-center gap-3">
                {newSlide.image ? (
                  <img src={newSlide.image} className="h-16 w-24 object-cover rounded" alt="aperçu" />
                ) : (
                  <div className="h-16 w-24 rounded bg-nuit/10 flex items-center justify-center text-encre/30 text-xs">Aucune</div>
                )}
                <label className={`btn-outline text-xs py-1.5 cursor-pointer flex items-center gap-1.5 ${uploadingNew ? "opacity-50 pointer-events-none" : ""}`}>
                  <ImagePlus size={13} /> {uploadingNew ? "Upload…" : "Choisir une photo"}
                  <input ref={newFileRef} type="file" accept="image/*" className="hidden" onChange={handleNewPhoto} disabled={uploadingNew} />
                </label>
              </div>
            </div>
            <div>
              <label className="label">Label</label>
              <input
                type="text"
                className="input"
                placeholder="Ex : Événements & cérémonies"
                value={newSlide.label}
                onChange={(e) => setNewSlide((s) => ({ ...s, label: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Texte</label>
              <input
                type="text"
                className="input"
                placeholder="Courte description affichée sur le slide"
                value={newSlide.text}
                onChange={(e) => setNewSlide((s) => ({ ...s, text: e.target.value }))}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={ajouterSlide}
                disabled={!newSlide.image || !newSlide.label.trim()}
                className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Ajouter
              </button>
              <button onClick={() => { setAjouterOuvert(false); setNewSlide(BLANK_NEW); }} className="btn-outline text-sm">
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAjouterOuvert(true)} className="btn-outline text-sm flex items-center gap-1.5 mb-5">
            <Plus size={15} /> Ajouter un slide
          </button>
        )
      )}

      {/* Enregistrer */}
      <div className="flex items-center gap-3">
        <button onClick={enregistrer} disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>
        {saved && <span className="text-sm text-atlan-600">Modifications enregistrées.</span>}
      </div>

      <p className="text-xs text-encre/40 mt-10">
        Vue d\administration simplifiée du MVP — à étendre : gestion des utilisateurs, paiements, litiges, contenus et rôles (support, vérificateur terrain).
      </p>
    </div>
  );
}
