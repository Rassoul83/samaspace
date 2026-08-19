export default function VerifiedBadge({ size = "sm" }) {
  const isSmall = size === "sm";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-atlan-100 text-atlan-600 font-medium ${
        isSmall ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1"
      }`}
      title="Identité, adresse et équipements vérifiés par SamaSpace"
    >
      <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M10 1.5l2.24 1.62 2.76-.1.8 2.63 2.3 1.5-.9 2.6.9 2.6-2.3 1.5-.8 2.63-2.76-.1L10 18.5l-2.24-1.62-2.76.1-.8-2.63-2.3-1.5.9-2.6-.9-2.6 2.3-1.5.8-2.63 2.76.1L10 1.5z" />
        <path d="M7.2 10.2l1.8 1.8 3.8-3.8" stroke="#DCEEEC" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Salle vérifiée
    </span>
  );
}
