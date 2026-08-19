import { useState } from "react";
import { ChevronDown } from "lucide-react";

const QUESTIONS = [
  { q: "SamaSpace facture-t-il des frais aux clients ?", r: "Non, la recherche et la demande de réservation sont gratuites pour les clients." },
  { q: "Comment un espace devient-il \"vérifié\" ?", r: "Notre équipe contrôle l'identité du propriétaire, l'adresse, l'existence réelle du lieu, les photos, la capacité et les équipements avant d'attribuer le badge." },
  { q: "Faut-il payer en ligne pour réserver ?", r: "Au lancement, la demande de réservation ne nécessite aucun paiement en ligne. Le paiement intégré (Wave, Orange Money, cartes) arrive en version 2." },
  { q: "Est-ce que SamaSpace remplace mes autres canaux de vente ?", r: "Non. SamaSpace est un canal commercial supplémentaire pour les propriétaires, qui gardent tous leurs autres canaux." },
  { q: "Dans quelles villes SamaSpace est-il disponible ?", r: "Le lancement pilote couvre Dakar et Saly, avec une extension prévue vers Mbour, Thiès et Diamniadio." },
];

export default function FAQ() {
  const [ouvert, setOuvert] = useState(0);

  return (
    <div className="container-page py-16 max-w-2xl">
      <p className="eyebrow mb-2">FAQ</p>
      <h1 className="text-3xl font-display text-nuit mb-8">Questions fréquentes</h1>
      <div className="space-y-2">
        {QUESTIONS.map((item, i) => (
          <div key={item.q} className="card overflow-hidden">
            <button
              onClick={() => setOuvert(ouvert === i ? -1 : i)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="font-medium text-nuit text-sm">{item.q}</span>
              <ChevronDown size={16} className={`text-nuit-400 transition-transform ${ouvert === i ? "rotate-180" : ""}`} />
            </button>
            {ouvert === i && <p className="px-4 pb-4 text-sm text-encre/70 leading-relaxed">{item.r}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
