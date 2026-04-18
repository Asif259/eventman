import { useQuery, useMutation } from "convex/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useConvexQuery = (query, ...args) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const result = useQuery(query, ...args);
    
    useEffect(() => {
        if (result === undefined) {
            setIsLoading(true);
        } else {
            try {
                setData(result);
                setError(null);
            } catch (error) {
                setError(error);
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        }
    }, [result]);

    return { data, isLoading, error };
}


export const useConvexMutation = (mutation) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const result = useMutation(mutation);
    
    const mutate = async (...args) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await result(...args);
            setData(response);
            return response;
        } catch (error) {
            setError(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { mutate, data, isLoading, error };
}