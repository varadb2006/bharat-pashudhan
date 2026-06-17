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
}