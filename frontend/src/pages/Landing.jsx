import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, MapPin, Tractor } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <header className="border-b border-line bg-surface px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 roundd-full bg-accent" />
          <span className="font-display font-bold-text-ink text-lg">
            Bharat Pashudhan
          </span>
        </div>
        <button
          onClick={() => navigate("/identify")}
          className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
        >
          Start Identifying
          <ArrowRight size={16} />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-surfaceAlt  border border-line rounded-full px-4 py-1.5 text-xs text-muted font-medium mb-8">
          <MapPin size={12} />
          For Indian field-level agriculture workers
        </div>

        <h1 className="font-display text-bold text-ink text-4xl md:text-6xl leading-tight max-w-2xl mb-6">
          Indentify Indigenous <br />
          <span className="text-accent"> Cattle</span> &{" "}
          <span className="text-accentAlt"> Buffalo</span> Breeds
        </h1>

        <p className="text-muted text-lg max-w-xl mb-10 leading-relaxed">
          Upload a photo of any indigenous cattle or buffalo and get instant
          breed suggestions, covering all 66 breeds recognized by the Government
          of India.
        </p>

        <button
          onClick={() => navigate("/identify")}
          className="bg-accent hover:bg-accent/90 text-white font-display font-bold px-8 py-4 rounded-xl text-lg transition-colors flex items-center gap-3"
        >
          Identify a breed
          <ArrowRight size={20} />
        </button>

        <p className="text-sm text-muted mt-4">
          No account needed · Works on any device
        </p>
      </main>

      <div className="border-t border-line bg-surface">
        <div className="max-w-3xl mx-auto px-6 py-6 grid grid-cols-3 divide-x divide-line">
          {[
            { values: "66", label: "Breeds Covered" },
            { values: "49", label: "Cattle Breeds" },
            { values: "17", label: "Buffalo Breeds" },
          ].map((stat) => (
            <div key={stat.label} className="text-center px-4">
              <p className="font-display font-bold text-2xl text-ink">
                {stat.values}
              </p>
              <p className="text-sm text-muted mt-0.5"> {stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-surfaceAlt border-t border-line">
        <div className="max-w-3xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Tractor,
              title: "All indigenous breeds",
              desc: "Every cattle and buffalo breed officially recognised by ICAR ang NBGAR",
            },
            {
              icon: BookOpen,
              title: "Breed Encyclopedia",
              desc: "Origin, purpose, physical traits and regional distributions for each breed",
            },
            {
              icon: MapPin,
              title: "Field-Ready",
              desc: "Designed for use in the field. Simple, Fast and works on a mobile browser ",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-surface border border-line rounded-el p-5"
            >
              <feature.icon size={20} className="text-accent mb-3" />
              <h3 className="font-display font-bold text-ink mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-line px-6 py-4 text-center text-xs text-muted bg-surface">
        Bharat Pashudhan · Built for indigenous breed conservation
      </footer>
    </div>
  );
}
