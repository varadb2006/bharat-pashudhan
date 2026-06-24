import {useState, useEffect} from 'react';
import axios from 'axios';

export function useAIStatus() {
    const [status, setStatus] = useState('checking');
    useEffect(() => {
        let cancelled = false;
        const check = async () => {
            try {
                await axios.get('http://localhost:8000/health', {timeout: 3000});
                if(!cancelled) setStatus('online');
            } catch {
                if(!cancelled) setStatus('offline');
            }
        }

        check();


        const interval = setInterval(check, 3000)

        return () => {
            cancelled = true;
            clearInterval(interval);
        }
    }, [])

    return status;
}