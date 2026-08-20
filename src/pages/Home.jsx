import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShieldCheck, SlidersHorizontal, MessagesSquare, ArrowRight } from "lucide-react";
import SearchBar from "../components/SearchBar";
import SpaceCard from "../components/SpaceCard";
import HeroSlider from "../components/HeroSlider";
import { listSpaces } from "../firebase/spaces";
import { MOCK_SPACES } from "../data/mockSpaces";

const PILIERS = [
  {
    icon: ShieldCheck,
    titre: "Salle vérifiée",
    texte: "Identité du propriétaire, adresse, photos et équipements contrôlés avant publication.",
  },
  {
    icon: SlidersHorizontal,
    titre: "Matching intelligent",
    texte: "Décrivez votre besoin, on classe les espaces selon budget, capacité et équipements réels.",
  },
  {
    icon: MessagesSquare,
    titre: "Avis vérifiés",
    texte: "Seuls les clients ayant réellement réservé peuvent laisser un avis sur une salle.",
  },
];

export default function Home() {
  const [spaces, setSpaces] = useState(MOCK_SPACES);

  useEffect(() => {
    listSpaces()
      .then((data) => data.length && setSpaces(data))
      .catch(() => {});
  }, []);

  return (
    <div>
      <HeroSlider>
        <div className="container-page py-16 pb-24 md:py-24 md:pb-28">
          <p className="eyebrow text-ocre mb-4">Dakar · Saly — bientôt tout le Sénégal</p>
          <h1 className="text-4xl md:text-6xl font-display text-sable max-w-3xl leading-[1.1]">
            Trouvez, comparez et réservez <span className="italic text-ocre-400">le bon espace</span>, au bon moment.
          </h1>
          <p className="mt-5 text-sable/75 max-w-xl text-lg">
            La marketplace sénégalaise dédiée aux salles de réunion, formation, séminaires et événements — pas un simple annuaire.
          </p>
          <div className="mt-8">
            <SearchBar />
          </div>
        </div>
      </HeroSlider>

      <section className="container-page py-16 grid md:grid-cols-3 gap-6">
        {PILIERS.map((p) => (
          <div key={p.titre} className="card p-6">
            <p.icon size={22} className="text-atlan-600 mb-3" />
            <h3 className="font-display text-lg text-nuit mb-1.5">{p.titre}</h3>
            <p className="text-sm text-encre/65 leading-relaxed">{p.texte}</p>
          </div>
        ))}
      </section>

      <section className="container-page py-8 pb-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="eyebrow mb-1">Sélection</p>
            <h2 className="text-2xl font-display text-nuit">Salles populaires</h2>
          </div>
          <Link to="/recherche" className="btn-ghost text-sm">
            Voir toutes les salles <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {spaces.slice(0, 4).map((s) => (
            <SpaceCard key={s.id} space={s} />
          ))}
        </div>
      </section>

      <section className="bg-nuit text-sable">
        <div className="container-page py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="eyebrow text-ocre mb-3">Propriétaires d'espaces</p>
            <h2 className="text-3xl font-display mb-3">Un canal commercial en plus, pas un remplacement.</h2>
            <p className="text-sable/70 leading-relaxed">
              Inscription gratuite au lancement. Publiez votre espace, recevez des demandes qualifiées, gardez vos autres canaux de vente.
            </p>
          </div>
          <div className="flex md:justify-end">
            <Link to="/devenir-proprietaire" className="btn-accent">
              Devenir propriétaire <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
