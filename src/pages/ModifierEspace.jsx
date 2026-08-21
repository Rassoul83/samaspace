import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getSpace, updateSpace } from "../firebase/spaces";
import { VILLES, ACTIVITES, EQUIPEMENTS } from "../data/villes";

export default function ModifierEspace() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [envoi, setEnvoi] = useState(false);

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
        });
      })
      .catch(() => navigate("/espace-proprietaire"));
  }, [id, navigate]);

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

        <button type="submit" disabled={envoi} className="btn-accent w-full">
          {envoi ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}
