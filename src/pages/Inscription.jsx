import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { registerUser } from "../firebase/auth";

export default function Inscription() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get("role") === "proprietaire" ? "proprietaire" : "client");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");
    try {
      await registerUser({ nom, email, password, role });
      navigate(role === "proprietaire" ? "/espace-proprietaire" : "/espace-client");
    } catch {
      setErreur("Impossible de créer le compte. Vérifiez vos informations.");
    }
  }

  return (
    <div className="container-page py-16 max-w-md">
      <h1 className="text-3xl font-display text-nuit mb-2">Créer un compte</h1>
      <p className="text-encre/60 mb-6">Client à la recherche d\un espace, ou propriétaire souhaitant en publier un ?</p>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setRole("client")}
          className={`flex-1 btn ${role === "client" ? "bg-nuit text-sable" : "border border-nuit/15 text-encre/70"}`}
        >
          Je cherche un espace
        </button>
        <button
          type="button"
          onClick={() => setRole("proprietaire")}
          className={`flex-1 btn ${role === "proprietaire" ? "bg-nuit text-sable" : "border border-nuit/15 text-encre/70"}`}
        >
          Je propose un espace
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="label">Nom complet</label>
          <input required className="input" value={nom} onChange={(e) => setNom(e.target.value)} />
        </div>
        <div>
          <label className="label">Email</label>
          <input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">Mot de passe</label>
          <input required type="password" minLength={6} className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {erreur && <p className="text-sm text-red-600">{erreur}</p>}
        <button type="submit" className="btn-accent w-full">Créer mon compte</button>
      </form>
      <p className="text-sm text-encre/60 mt-4">
        Déjà inscrit ? <Link to="/connexion" className="text-atlan-600 font-medium">Connectez-vous</Link>
      </p>
    </div>
  );
}
