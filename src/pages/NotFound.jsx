import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="eyebrow mb-3">404</p>
      <h1 className="text-3xl font-display text-nuit mb-4">Cette page n'existe pas</h1>
      <Link to="/" className="btn-primary">Retour à l'accueil</Link>
    </div>
  );
}
