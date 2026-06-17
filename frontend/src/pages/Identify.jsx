import {useState} from 'react';
import axios from 'axios';
import {Upload, Loader2} from 'lucide-react';
import BreedCard from '../components/BreedCard';

export  default function Identify() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const[loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if(!selected) return;
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
        formData.append('image', file);
        try {
            const res = await axios.post('http://localhost:5000/api/predictions',
            formData, {headers: {'Content-Type': 'multipart/form-data'}}
            );
            setResult(res.data);
        } catch (err) {
            setError("we couldn't process that image. Please try another photo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="mb-10">
                <h2 className='font-display text-4xl font-bold text-ink mb-2'>
                    Identify a breed 
                </h2>
                <p className='text-muted'>
                    Upload a clear photo of the animal ( Front or side angle works best).
                </p>
            </div>

            <label className='black  border-2 border-dashed border-line rounded-2xl p-10 text-center cursor-pointer hover:border-muted transition-colors mb-6'>
                <input type='file' accept='image/*' onChange={handleFileChange} className='hidden' />
                    {preview ? (
                        <img src={preview} alt="Selected Animal" className='max-h-64 mx-auto rounded-xl object-cover' />
                    ) : (
                        <div className='flex flex-col items-center text-muted'>
                            <Upload size={32} className='mb-3' />
                            <p className='font-medium'> Click to upload a photo</p>
                            <p className='text-sm mt-1'> JPG or PNG up to 10MB</p>
                        </div>
                    )}
            </label>

            {file && !result && (
                <button onClick={handleSubmit} disabled={loading} className='w-full bg-surfaceAlt border border-line rounded-xl py-3 font-display font-bold text-ink hover:border-muted transition-colors disabled: opaced-50 flex items-center justify-center gap-2'>
                    {loading ? (
                        <>
                            <Loader2 size={18} className='animate-spin' />
                            Thinking
                        </>
                    ) : (
                        'Identify Breed'
                    )}
                </button>
            )}

            {error && (
                <p className='text-center text-muted mt-4'>{error}</p>
            )}

            {result && (
                <div className='mt-10'>
                    <h3 className='font-display text-3xl font-bold text-ink mb-1'>
                        {result.heading}
                    </h3>
                    <p className='text-muted text-sm mb-6'>
                        Tap a card to learn more about the breed
                    </p>

                    <div className='grid grid-cols-1 md:grid-cols- gap-4'>
                        {result.suggestions.map((s,i) => (
                            <BreedCard key={i} breed={s.breed} type={s.type} purpose={s.purpose}  />
                        ))}
                    </div>

                    <button onClick={() => { setFile(null); setPreview(null); setResult(null);}} className='mt-6 text-sm text-muted hover:text-ink transition-colors'>
                        Scan another animal
                    </button>
                </div>
            )}
        </div>
    );
}