import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Upload, Loader2, ArrowLeft } from "lucide-react";
import BreedCard from "../components/BreedCard";

export default function Identify() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError(null);
  };

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

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line bg-surface px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-display font-bold text-ink text-lg">
            Bharat Pashudhan
          </h1>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold text-ink mb-2">
            Identify a Breed
          </h2>
          <p className="text-muted">
            Upload a clear photo. Front or side angle works the best.
          </p>
        </div>

        <label className="block border-2 border-dashed border-line bg-surface rounded-2xl p-10 text-center cursor-pointer hover:border-accent/50 transition-colors mb-6">
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          {preview ? (
            <img src={preview} alt="Selected animal" className="max-h-64 mx-auto rounded-xl object-cover" />
          ) : (
            <div className="flex flex-col items-center text-muted">
              <Upload size={32} className="mb-3 text-accent" />
              <p className="font-medium text-ink">Click to upload a photo</p>
              <p className="text-sm mt-1">JPG or PNG, up to 10MB</p>
            </div>
          )}
        </label>

        {file && !result && (
            <button onClick={handleSubmit} disabled = {loading} className="w-full bg-accent hover:bg-accent/90 text-white rounded-xl py-3 font-display font-bold text-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Thinking....
                    </>
                ) : (
                    'Identify breed'
                )}
            </button>
        )}

        {error && (
          <p className="text-center text-muted mt-4">{error}</p>
        )}

        {result && (
          <div className="mt-10">
            <h3 className="font-display text-2xl font-bold text-ink mb-1">
              {result.heading}
            </h3>
            <p className="text-muted text-sm mb-6">
              Tap a card to learn more about that breed
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.suggestions.map((s, i) => (
                <BreedCard
                  key={i}
                  breed={s.breed}
                  type={s.type}
                  purpose={s.purpose}
                />
              ))}
            </div>

            <button onClick={() => {
                setFile(null)
                setPreview(null)
                setResult(null)
              }} className="mt-6 text-sm text-muted hover:text-ink transition-colors">
              ← Scan another animal
            </button>
          </div>
        )}
      </main>
    </div>
  )
}