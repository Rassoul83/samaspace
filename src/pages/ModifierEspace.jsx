import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getSpace, updateSpace } from "../firebase/spaces";
import { uploadImage } from "../lib/cloudinary";
import { VILLES, ACTIVITES, EQUIPEMENTS } from "../data/villes";

export default function ModifierEspace() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [envoi, setEnvoi] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getSpace(id)
      .then((s) => {
        if (!s) return navigate("/espace-proprietaire");
        setForm({
          nom: s.nom || "",
          etablissement: s.etablissement || "",
          ville: s.ville || "Dakar",
          quartier: s.quartier || "",
          description: s.description || "",
          capacite: s.capacite ?? "",
          prixHeure: s.prixHeure ?? "",
          prixJournee: s.prixJournee ?? "",
          activites: s.activites || [],
          equipements: s.equipements || [],
          photos: s.photos || (s.image ? [s.image] : []),
        });
      })
      .catch(() => navigate("/espace-proprietaire"));
  }, [id, navigate]);

  async function handlePhotos(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadImage));
      setForm((f) => ({ ...f, photos: [...f.photos, ...urls] }));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function retirerPhoto(index) {
    setForm((f) => ({ ...f, photos: f.photos.filter((_, i) => i !== index) }));
  }

  function toggleListe(champ, valeur) {
    const set = new Set(form[champ]);
    set.has(valeur) ? set.delete(valeur) : set.add(valeur);
    setForm({ ...form, [champ]: Array.from(set) });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setEnvoi(true);
    try {
      await updateSpace(id, {
        ...form,
        capacite: Number(form.capacite),
        prixHeure: Number(form.prixHeure),
        prixJournee: Number(form.prixJournee),
        image: form.photos[0] || "",
      });
      navigate("/espace-proprietaire");
    } catch {
      setEnvoi(false);
    }
  }

  if (!form) return <div className="container-page py-20 text-center text-encre/50">Chargement…</div>;

  return (
    <div className="container-page py-10 max-w-3xl">
      <p className="eyebrow mb-2">Modifier l'espace</p>
      <h1 className="text-3xl font-display text-nuit mb-2">Mettre à jour la fiche</h1>
      <p className="text-encre/60 mb-8">
        Les modifications sont visibles immédiatement. Le badge « Salle vérifiée » reste acquis si l'espace était déjà vérifié.
      </p>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Nom de la salle</label>
            <input required className="input" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
          </div>
          <div>
            <label className="label">Établissement</label>
            <input required className="input" value={form.etablissement} onChange={(e) => setForm({ ...form, etablissement: e.target.value })} />
          </div>
          <div>
            <label className="label">Ville</label>
            <select className="input" value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })}>
              {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Quartier</label>
            <input required className="input" value={form.quartier} onChange={(e) => setForm({ ...form, quartier: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="label">Description</label>
          <textarea required rows={4} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Capacité max</label>
            <input required type="number" min="1" className="input" value={form.capacite} onChange={(e) => setForm({ ...form, capacite: e.target.value })} />
          </div>
          <div>
            <label className="label">Prix / heure (FCFA)</label>
            <input required type="number" min="0" className="input" value={form.prixHeure} onChange={(e) => setForm({ ...form, prixHeure: e.target.value })} />
          </div>
          <div>
            <label className="label">Prix / journée (FCFA)</label>
            <input required type="number" min="0" className="input" value={form.prixJournee} onChange={(e) => setForm({ ...form, prixJournee: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="label">Activités adaptées</label>
          <div className="flex flex-wrap gap-2">
            {ACTIVITES.map((a) => (
              <button type="button" key={a.id} onClick={() => toggleListe("activites", a.id)}
                className={`text-sm px-3 py-1.5 rounded-full border ${form.activites.includes(a.id) ? "bg-nuit text-sable border-nuit" : "border-nuit/15 text-encre/70"}`}>
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Équipements disponibles</label>
          <div className="flex flex-wrap gap-2">
            {EQUIPEMENTS.map((eq) => (
              <button type="button" key={eq} onClick={() => toggleListe("equipements", eq)}
                className={`text-sm px-3 py-1.5 rounded-full border ${form.equipements.includes(eq) ? "bg-atlan text-white border-atlan" : "border-nuit/15 text-encre/70"}`}>
                {eq}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Photos de l'espace</label>
          <label className={`flex items-center gap-2 cursor-pointer w-fit px-4 py-2.5 rounded-sm border border-dashed border-nuit/25 text-sm text-encre/60 hover:border-nuit/50 hover:text-encre transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
            {uploading ? "Upload en cours…" : "Ajouter des photos"}
            <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} disabled={uploading} />
          </label>
          {form.photos.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
              {form.photos.map((url, i) => (
                <div key={url} className="relative group aspect-video rounded-sm overflow-hidden">
                  <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => retirerPhoto(i)}
                    className="absolute top-1 right-1 bg-nuit/70 text-sable rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Retirer cette photo"
                  >
                    <X size={12} />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 text-[10px] bg-ocre text-nuit-900 px-1.5 py-0.5 rounded-full font-mono">
                      principale
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={envoi || uploading} className="btn-accent w-full">
          {envoi ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}
