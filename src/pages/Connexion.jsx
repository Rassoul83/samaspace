import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../firebase/auth";

export default function Connexion() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");
    try {
      await loginUser(email, password);
      navigate("/");
    } catch {
      setErreur("Email ou mot de passe incorrect.");
    }
  }

  return (
    <div className="container-page py-16 max-w-md">
      <img src="/samaspace-logo-full.png" alt="SamaSpace" className="h-10 w-auto mb-8" />
      <h1 className="text-3xl font-display text-nuit mb-2">Connexion</h1>
      <p className="text-encre/60 mb-8">Accédez à votre espace client ou propriétaire.</p>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="label">Email</label>
          <input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">Mot de passe</label>
          <input required type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {erreur && <p className="text-sm text-red-600">{erreur}</p>}
        <button type="submit" className="btn-primary w-full">Se connecter</button>
      </form>
      <p className="text-sm text-encre/60 mt-4">
        Pas encore de compte ? <Link to="/inscription" className="text-atlan-600 font-medium">Inscrivez-vous</Link>
      </p>
    </div>
  );
}
