import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../firebase/auth";

const LINKS = [
  { to: "/recherche", label: "Toutes les salles" },
  { to: "/trouvez-moi-une-salle", label: "Trouvez-moi une salle" },
  { to: "/comparateur", label: "Comparateur" },
  { to: "/comment-ca-marche", label: "Comment ça marche" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, profile } = useAuth();

  const dashboardLink = profile?.role === "proprietaire" ? "/espace-proprietaire" : "/espace-client";

  return (
    <header className="sticky top-0 z-40 bg-sable-100/90 backdrop-blur border-b border-nuit/10">
      <div className="container-page flex items-center justify-between h-16">
        <Link to="/" className="shrink-0">
          <img src="/samaspace-logo-full.png" alt="SamaSpace" className="h-10 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-sm text-sm transition-colors ${
                  isActive ? "text-nuit font-medium" : "text-encre/70 hover:text-nuit"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <>
              <Link to={dashboardLink} className="btn-ghost text-sm">Mon espace</Link>
              <button onClick={logoutUser} className="btn-outline text-sm">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/connexion" className="btn-ghost text-sm">Connexion</Link>
              <Link to="/devenir-proprietaire" className="btn-accent text-sm">Devenir propriétaire</Link>
            </>
          )}
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Ouvrir le menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-nuit/10 bg-sable-100 px-5 py-4 space-y-1">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block py-2 text-sm text-encre/80">
              {l.label}
            </Link>
          ))}
          <div className="pt-3 mt-3 border-t border-nuit/10 flex flex-col gap-2">
            {user ? (
              <>
                <Link to={dashboardLink} onClick={() => setOpen(false)} className="btn-ghost text-sm w-full">Mon espace</Link>
                <button onClick={logoutUser} className="btn-outline text-sm w-full">Déconnexion</button>
              </>
            ) : (
              <>
                <Link to="/connexion" onClick={() => setOpen(false)} className="btn-outline text-sm w-full">Connexion</Link>
                <Link to="/devenir-proprietaire" onClick={() => setOpen(false)} className="btn-accent text-sm w-full">Devenir propriétaire</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
