import { useQuery, useMutation } from "convex/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useConvexQuery = (query, ...args) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    let result;
    let queryError = null;

    try {
        result = useQuery(query, ...args);
    } catch (err) {
        queryError = err;
    }
    
    useEffect(() => {
        if (queryError) {
            setError(queryError);
            toast.error(queryError.message || "An error occurred");
            setIsLoading(false);
        } else if (result === undefined) {
            setIsLoading(true);
        } else {
            setData(result);
            setError(null);
            setIsLoading(false);
        }
    }, [result, queryError]);

    return { data, isLoading, error };
}


export const useConvexMutation = (mutation) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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