import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';

interface DecodedToken {
    templateId: string;
    linkBodyDto: {
        entityId: string;
        entityName: string;
    };
    iat: number;
    exp: number;
}

const useJwtDecode = (jwtToken: string) => {
    const router = useRouter();
    const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

    useEffect(() => {
        if (!jwtToken) {
            setDecodedToken(null);
            return;
        }

        try {
            const decoded = jwt.decode(jwtToken) as DecodedToken;;
            setDecodedToken(decoded);
            if(!decoded){
                router.replace('/401')
            }
            console.log(decoded)
        } catch (error) {
            setDecodedToken(null);
            router.replace('/401')
            console.error('Error decoding JWT:', error);
        }
    }, [jwtToken, router]);

    return decodedToken;
};

export default useJwtDecode;