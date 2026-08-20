import { useState, useEffect } from "react";

const SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1744095407215-66e40734e23a?auto=format&fit=crop&w=1600&q=80",
    label: "Formations & réunions",
    text: "Des espaces vérifiés, réservables à l'heure ou à la journée, au cœur de Dakar.",
  },
  {
    url: "https://images.unsplash.com/photo-1762765685319-fdaf8d22085d?auto=format&fit=crop&w=1600&q=80",
    label: "Événements & cérémonies",
    text: "Dakar ou Saly : des adresses sur mesure pour vos moments importants.",
    objectPosition: "center 85%",
  },
  {
    url: "https://images.unsplash.com/photo-1716703373229-b0e43de7dd5c?auto=format&fit=crop&w=1600&q=80",
    label: "Coworking & ateliers",
    text: "Capacité modulable, wifi, équipements vérifiés — tout est prêt avant votre arrivée.",
  },
];

export default function HeroSlider({ children }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative overflow-hidden min-h-[620px] md:min-h-[700px] flex flex-col border-b border-nuit/20">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.label}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.url}
            alt={slide.label}
            className="w-full h-full object-cover"
            style={slide.objectPosition ? { objectPosition: slide.objectPosition } : undefined}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-loom opacity-25" />
      <div className="absolute inset-0 bg-nuit/45" />

      <div className="relative z-10 flex-1 flex flex-col justify-center">
        {children}
      </div>

      <div className="absolute bottom-5 left-5 sm:left-8 z-10 max-w-[260px] sm:max-w-xs">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ocre mb-1">
          {SLIDES[index].label}
        </p>
        <p className="text-sable/70 text-sm font-display leading-snug">
          {SLIDES[index].text}
        </p>
      </div>

      <div className="absolute bottom-6 right-5 sm:right-8 flex gap-2 z-10">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.label}
            onClick={() => setIndex(i)}
            aria-label={`Voir : ${slide.label}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-ocre" : "w-2 bg-sable/40 hover:bg-sable/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
