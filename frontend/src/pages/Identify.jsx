import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Upload, Loader2, ArrowLeft, RefreshCw, Sparkles } from "lucide-react";
import BreedCard from "../components/BreedCard";
import { useAIStatus } from "../hooks/useAIStatus";

export default function Identify() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const aiStatus = useAIStatus();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError(null);
  };


  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if(!dropped) return;
    setFile(dropped);
    setResult(null);
    setError(null);
  }

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/predictions",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setResult(res.data);
    } catch (err) {
      setError("we couldn't process that image. Please try another photo.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top=0 z-40 border-b border-line bg-white/80 backdrop-blur-md px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate("/")} className="text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-ink text-lg leading-none">
            Bharat Pashudhan
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Breed identification
          </p>
        </div>
        <div className={`flex items-center gap-1.5 text-xs border  rounded-full px-3 py-1.5 transition-colors ${aiStatus === 'online' ? 'text-green-700 bg-green-50 border-green-200' : aiStatus === 'offline' ? 'text-red-700 bg-red-50 border-red-200' : 'text-muted bg-surfaceAlt border-line'}`}>
          <span className={`w-1.5 h-1.5 rounded-full  ${aiStatus === 'online' ? 'bg-green-500 animate-pulse' : aiStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-400 animate-pulse'} `} />
          AI Ready
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-accent" />
              <span className="text-xs uppercase tracking-widest text-accent font-medium">
                AI-Powered identification
              </span>
          </div>
          <h2 className="font-display text-4xl font-bold text-ink leading-tight mb-2">
            Identify a Breed
          </h2>
          <p className="text-muted">
            Upload a clear photo. Front or side angle works the best.
            Our model covers 66 indigenous breeds.
          </p>
        </div>

        {!result && (
          <>
          
            <label className={`block border-2 border-dashed rounded-2xl cursor-pointer transition-all mb-5 ${dragOver ? 'border-accent bg-amber-50 scale-[1.01]' : preview ? 'border-line bg-surface' : 'border-line bg-surface hover:border-accent/50'}`}
              onDragOver={(e) => {e.preventDefault(); setDragOver(true)}} onDragLeave={()=> setDragOver(false)} onDrop={handleDrop}
            >
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Selected animal" className="w-full max-h-80 mx-auto rounded-2xl object-cover" />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100">
                    <span className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-lg"> 
                      Change Photo
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center text-muted">
                  <div className="w-16 h-16 border-2 border-dashed border-line rounded-2xl flex items-center justify-center mb-4 group-hover:border-accent">
                    <Upload size={24} className="text-accent" />
                  </div>
                  <p className="font-medium text-ink mb-1">Drop a photo here or click to browse</p>
                  <p className="text-sm">JPG, WebP or PNG, up to 10MB</p>
                </div>
              )}
            </label>

            {file && (
                <button onClick={handleSubmit} disabled = {loading} className="w-full bg-accent hover:bg-amber-600 text-white rounded-xl py-4 font-display font-bold text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-amber-200 hover:shadow-amber-300 hover: -translate-y-0.5">
                    {loading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Analysing the image
                        </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        'Identify breed'
                      </>
                    )}
                </button>
            )}
            {loading && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <loader2 size={14} className="text-accent animate-spin shrink-0" />
                  <p className="text-sm font-medium text-ink"> Running AI analysis</p>
                </div>
                <div className="space-y-1.5">
                  {[
                    'Pre-processing your image...',
                    'Running through 19M parameter model...',
                    'Comparing against 66 breed signatures...'
                  ].map((step,i) => (
                    <p key={i} className="text-xs text-muted pl-5">
                      {step}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </>
        )}


        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mt-4 text-center">{error}</div>
        )}

        {result && (
          <div>
            {preview && (
              <div className="mb-8 rounded-2xl overflow-hidden border border-line">
                <img src={preview} alt="Uploaded animal"  className="w-full max-h-64 object-cover" />
              </div> 
            )}
          <div>
            <div>
              <h3 className="font-display  text-2xl font-bold text-ink mb-1">
                {result.heading}
              </h3>
              <p className="text-muted text-sm mt-1">
                Tap a card to learn more about that breed
              </p>
            </div>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted hover:text-ink border border-line rounded-lg px-3 py-2 transition-colors mt-1">
              <RefreshCw size={13} />
              New Scan
            </button>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {result.suggestions.map((s, i) => (
                <BreedCard
                  key={i}
                  breed={s.breed}
                  type={s.type}
                  purpose={s.purpose}
                  onNavigate={()=> navigate(`/breeds/${encodeURIComponent(s.breed)}`)} />
              ))}
            </div>
            <p className="text-xs text-muted mt-6 text-center leading-relaxed">
              These are suggestions based on visual similarity.
              Consult a veterinary officer for official breed certification.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}