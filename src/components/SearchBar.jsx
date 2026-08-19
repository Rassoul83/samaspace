import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Users, Calendar } from "lucide-react";
import { VILLES, ACTIVITES } from "../data/villes";

export default function SearchBar({ compact = false }) {
  const navigate = useNavigate();
  const [ville, setVille] = useState("Dakar");
  const [activite, setActivite] = useState("");
  const [personnes, setPersonnes] = useState("");
  const [date, setDate] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (ville) params.set("ville", ville);
    if (activite) params.set("activite", activite);
    if (personnes) params.set("personnes", personnes);
    if (date) params.set("date", date);
    navigate(`/recherche?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-sable-100 rounded-lg border border-nuit/10 shadow-sm p-2 flex flex-col md:flex-row gap-2 ${
        compact ? "" : "md:p-2.5"
      }`}
    >
      <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-sm hover:bg-nuit/5">
        <MapPin size={16} className="text-nuit-400 shrink-0" />
        <select value={ville} onChange={(e) => setVille(e.target.value)} className="w-full bg-transparent text-sm outline-none">
          {VILLES.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>
      <div className="hidden md:block w-px bg-nuit/10 my-2" />
      <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-sm hover:bg-nuit/5">
        <Search size={16} className="text-nuit-400 shrink-0" />
        <select value={activite} onChange={(e) => setActivite(e.target.value)} className="w-full bg-transparent text-sm outline-none">
          <option value="">Quelle activité ?</option>
          {ACTIVITES.map((a) => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </select>
      </div>
      <div className="hidden md:block w-px bg-nuit/10 my-2" />
      <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-sm hover:bg-nuit/5">
        <Users size={16} className="text-nuit-400 shrink-0" />
        <input
          type="number"
          min="1"
          placeholder="Combien de personnes ?"
          value={personnes}
          onChange={(e) => setPersonnes(e.target.value)}
          className="w-full bg-transparent text-sm outline-none placeholder:text-encre/40"
        />
      </div>
      <div className="hidden md:block w-px bg-nuit/10 my-2" />
      <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-sm hover:bg-nuit/5">
        <Calendar size={16} className="text-nuit-400 shrink-0" />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
      <button type="submit" className="btn-accent shrink-0">
        <Search size={16} />
        Rechercher
      </button>
    </form>
  );
}
