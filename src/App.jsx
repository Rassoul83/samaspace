import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Recherche from "./pages/Recherche";
import EspaceDetail from "./pages/EspaceDetail";
import TrouvezMoi from "./pages/TrouvezMoi";
import Comparateur from "./pages/Comparateur";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import EspaceClient from "./pages/EspaceClient";
import EspaceProprietaire from "./pages/EspaceProprietaire";
import AjouterEspace from "./pages/AjouterEspace";
import Admin from "./pages/Admin";
import CommentCaMarche from "./pages/CommentCaMarche";
import DevenirProprietaire from "./pages/DevenirProprietaire";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recherche" element={<Recherche />} />
          <Route path="/espaces/:id" element={<EspaceDetail />} />
          <Route path="/trouvez-moi-une-salle" element={<TrouvezMoi />} />
          <Route path="/comparateur" element={<Comparateur />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/comment-ca-marche" element={<CommentCaMarche />} />
          <Route path="/devenir-proprietaire" element={<DevenirProprietaire />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />

          <Route path="/espace-client" element={<ProtectedRoute role="client"><EspaceClient /></ProtectedRoute>} />
          <Route path="/espace-proprietaire" element={<ProtectedRoute role="proprietaire"><EspaceProprietaire /></ProtectedRoute>} />
          <Route path="/ajouter-espace" element={<ProtectedRoute role="proprietaire"><AjouterEspace /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
