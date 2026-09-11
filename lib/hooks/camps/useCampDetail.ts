
import { ResponseGetCampDetail } from "@/lib/types/camps/response";
import { useEffect, useState } from "react";


function useCampDetail(mapX: string, mapY: string) {
    const [campDetail, setCampDetail] = useState<ResponseGetCampDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCampDetail = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(`/api/camps/detail/${mapX}/${mapY}`);
                if (!response.ok) {
                    throw new Error(`Error fetching camp detail: ${response.statusText}`);
                }
                const data: ResponseGetCampDetail = await response.json();
                setCampDetail(data);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        if (mapX && mapY) {
            fetchCampDetail();
        }
    }, [mapX, mapY]);

    return { campDetail, isLoading, error };
}
export default useCampDetail;