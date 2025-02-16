import { useState, useEffect } from "react";



export function useMovies(query, Key) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
   

    useEffect(() => {
        // callBack?.()
        const controller = new AbortController()


        async function fetchedData() {

            try {
                setLoading(true);
                setError("")
                const res = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${Key}&s=${query}`, {
                    signal: controller.signal
                });
                if (!res.ok) throw new Error("Error occurred while fetching data");
                const data = await res.json();
                if (data.Response === "False") throw new Error("Movie not found")
                console.log(data)
                setMovies(data.Search || []); 
              
            } catch (err) {
                if (err.name !== "AbortError") setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (query.length > 3) {
            fetchedData();
          
        }
        else {
            setMovies([])
            setError("")
        }
            
            
      

        return () => {
            controller.abort()
        }
    }, [query, Key]);

    return {movies, loading, error}
}