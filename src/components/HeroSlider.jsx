import { useEffect, useState } from "react";
import { getHeroSlides } from "../firebase/spaces";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1771270759486-1f7703945072?auto=format&fit=crop&w=1600&q=80",
    objectPosition: "center 40%",
    label: "Formations & réunions",
    text: "Des salles équipées pour vos formations, séminaires et réunions d'entreprise.",
  },
  {
    image: "https://images.unsplash.com/photo-1762765685319-fdaf8d22085d?auto=format&fit=crop&w=1600&q=80",
    objectPosition: "center 85%",
    label: "Événements & cérémonies",
    text: "Des espaces vérifiés pour vos mariages, cocktails et événements d'envergure.",
  },
  {
    image: "https://images.unsplash.com/photo-1716703373229-b0e43de7dd5c?auto=format&fit=crop&w=1600&q=80",
    label: "Coworking & ateliers",
    text: "Des lieux flexibles pour travailler, collaborer ou organiser un atelier.",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState(SLIDES);

  useEffect(() => {
    getHeroSlides()
      .then((s) => { if (s?.length) setSlides(s); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-[420px] md:h-[520px] w-full overflow-hidden rounded-lg">
      {slides.map((slide, i) => (
        <div
          key={slide.label}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.label}
            className="h-full w-full object-cover"
            style={slide.objectPosition ? { objectPosition: slide.objectPosition } : undefined}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-nuit-900/85 via-nuit-900/20 to-transparent" />
          <div className="absolute bottom-8 left-6 md:left-10 right-6 md:right-10">
            <p className="eyebrow text-ocre-400 mb-2">{slide.label}</p>
            <p className="text-sable text-lg md:text-2xl font-display max-w-lg leading-snug">
              {slide.text}
            </p>
          </div>
        </div>
      ))}

      <div className="absolute bottom-6 right-6 flex gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.label}
            onClick={() => setIndex(i)}
            aria-label={`Voir : ${slide.label}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-ocre" : "w-2 bg-sable/50 hover:bg-sable/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
