import { getBreedSignature } from "../utils/breedSIgnature";
import { Droplet, Truck, Layers } from "lucide-react";

const PURPOSE_ICONS = {
  dairy: Droplet,
  draft: Truck,
  dual: Layers,
};

export default function BreedCard({ breed, type, purpose, originState }) {
  const sig = getBreedSignature({ name: breed, type, purpose });
  const Icon = PURPOSE_ICONS[purpose] || Laayers;

  const positions = [
    { top: `${sig.seed % 40}%`, left: `${(sig.seed * 3) % 70}%` },
    { top: `${(sig.seed * 7) % 60}%`, left: `${(sig.seed * 11) % 80}%` },
    { top: `${(sig.seed * 13) % 50}%`, left: `${(sig.seed * 5) % 60}%` },
  ];


  return (
    <div className="bg-surface border border-line rounded-2x1 overflow-hidden transition-transform hover:scale-[1.02] hover:border-line/80">
        <div className="relative h-32 flex items-end p-4 overflow-hidden" style = {{backgroundColor: sig.color}}>
            {positions.map((pos, i) => sig.pattern === 'organic' ? (
                <div key={i} className="absolute rounded-full opactiy-25" style = {{ top: pos.top, left : pos.left, width :`${40+i*25}px`, height: `${40+i*25}px`, backgroundColor : sig.colorSoft,}} />
            ) : (
                <div key={i} className="absolute  opactiy-25" style = {{ top: pos.top, left : pos.left, width :`${50+i*20}px`, height: `${50+i*20}px`, backgroundColor : sig.colorSoft, transform: 'rotate(35deg)',}} />
            ))}
            <Icon className="absolute top-3 right-3 opacity-70" size={20} color={sig.colorSoft} />
            <span className="relative text-xs font-medium uppercase tracking-wider" style={{color : sig.colorSoft}} >
                {type} &middot; {purpose}
            </span>
        </div>

        <div className="p-4">
            <h3 className="font-display text-2x1 font-bold text-ink mb-1">
                {breed}
            </h3>
            {originState && (<p className="text-sm text-muted">{originState}</p>)}
        </div>
    </div>
  );
}
