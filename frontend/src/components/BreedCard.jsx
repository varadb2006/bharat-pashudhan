import { getBreedSignature } from "../utils/breedSIgnature";
import { Droplet, Truck, Layers, ArrowUpRight } from "lucide-react";

const PURPOSE_ICONS = {
  dairy: Droplet,
  draft: Truck,
  dual: Layers,
};

export default function BreedCard({ breed, type, purpose, originState, onNavigate }) {
  const sig = getBreedSignature({ name: breed, type, purpose });
  const Icon = PURPOSE_ICONS[purpose] || Laayers;

  const positions = [
    { top: `${sig.seed % 40}%`, left: `${(sig.seed * 3) % 70}%` },
    { top: `${(sig.seed * 7) % 60}%`, left: `${(sig.seed * 11) % 80}%` },
    { top: `${(sig.seed * 13) % 50}%`, left: `${(sig.seed * 5) % 60}%` },
  ];


  return (
    <div onClick = {onNavigate} className="bg-surface border border-line rounded-2xl overflow-hidden transition-all hover:translate-y-0.5 hover:border-accent/30">
        <div className="relative h-32 flex items-end p-4 overflow-hidden" style = {{backgroundColor: sig.color}}>
            {positions.map((pos, i) => sig.pattern === 'organic' ? (
                <div key={i} className="absolute rounded-full" style = {{ top: pos.top, left : pos.left, width :`${40+i*25}px`, height: `${40+i*25}px`, backgroundColor : sig.colorSoft, opacity : 0.35}} />
            ) : (
                <div key={i} className="absolute" style = {{ top: pos.top, left : pos.left, width :`${50+i*20}px`, height: `${50+i*20}px`, backgroundColor : sig.colorSoft, transform: 'rotate(35deg)', opacity : 0.35,}} />
            ))}
            <Icon className="absolute top-3 right-3" size={18} color="white"  opacity={0.8}/>
            <ArrowUpRight size={16} color="white" className="absolute top-3 left-3 opacity-0 group-hover:opacity-80 transition-opacity" />
            <span className="relative text-xs font-medium uppercase tracking-wider text-white/80">
                {type} &middot; {purpose}
            </span>
        </div>

        <div className="p-4 bg-surface">
            <h3 className="font-display text-xl font-bold text-ink mb-0.5">
                {breed}
            </h3>
            {originState && (<p className="text-sm text-muted">{originState}</p>)}
            <p className="text-xs text-accent/70 mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity"> Tap to see breed details → </p>
        </div>
    </div>
  );
}
