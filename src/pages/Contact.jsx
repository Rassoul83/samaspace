import { useState } from "react";
import { Mail, Phone } from "lucide-react";

export default function Contact() {
  const [envoye, setEnvoye] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setEnvoye(true);
  }

  return (
    <div className="container-page py-16 grid md:grid-cols-2 gap-12">
      <div>
        <p className="eyebrow mb-2">Contact</p>
        <h1 className="text-3xl font-display text-nuit mb-5">Une question ?</h1>
        <p className="text-encre/70 mb-8 leading-relaxed">
          Client, propriétaire d'espace ou partenaire — écrivez-nous, notre équipe basée à Dakar vous répond rapidement.
        </p>
        <div className="space-y-3 text-sm text-encre/75">
          <p className="flex items-center gap-2"><Mail size={16} className="text-atlan-600" /> contact@samaspace.sn</p>
          <p className="flex items-center gap-2"><Phone size={16} className="text-atlan-600" /> +221 XX XXX XX XX</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4 h-fit">
        {envoye ? (
          <p className="text-sm text-atlan-600 bg-atlan-100 rounded-sm p-3">Merci, votre message a bien été envoyé.</p>
        ) : (
          <>
            <div>
              <label className="label">Nom</label>
              <input required className="input" />
            </div>
            <div>
              <label className="label">Email</label>
              <input required type="email" className="input" />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea required rows={5} className="input" />
            </div>
            <button type="submit" className="btn-primary w-full">Envoyer</button>
          </>
        )}
      </form>
    </div>
  );
}
