import { useEffect, useState } from "react";

const useTimeTicker = (airingNext, fetchAiringNext) => {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const intervalId = setInterval(() => {
            const newNow = Date.now();
            setNow(newNow);
            if (
                airingNext.length > 0 &&
                newNow >= airingNext[0].airingAt * 1000
            ) {
                // refetch the airing next data if the first airing has finished
                fetchAiringNext();
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [airingNext, fetchAiringNext]);

    return now;
};

export default useTimeTicker;
