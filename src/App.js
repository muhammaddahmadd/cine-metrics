import { children, use, useEffect, useState } from "react";
import StarRating from "./StarRating"
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const Key = "2e04425d"

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedID, setSelectedId] = useState(null)




  function getSelectedMovie(id) {
    setSelectedId(selectedID => selectedID === id ? null : id)
  }

  function goBack(id) {
    setSelectedId("")
  }



  function handleAddWatched(movie) {
    // console.log(movie, "getting a movie here")
    //    const check = watched.some(mov=> mov.imdbID === movie.imdbID)
    // console.log(check)
    //   if(check) return
    setWatched(watched => [...watched, movie])

  }
  useEffect(() => {


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
        setMovies(data.Search || []); // Ensure it doesn't set `undefined`
        // setLoading(false)
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (query.length > 3) fetchedData();
    else {
      setError("")
      setMovies(tempMovieData)
    }

    return () => {
      controller.abort()
    }
  }, [query]); // Added `query` as a dependency


  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Results movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {loading ? <Loader /> : error ? <DisplayError/> : <MovieList movies={movies}/>} */}
          {/* {loading ? <Loader /> : <MovieList movies={movies} />}
          {error ? <DisplayError /> : <MovieList movies={movies} />} */}

          {
            !loading && !error && <MovieList getSelectedMovie={getSelectedMovie} setSelectedId={setSelectedId} setMovies={setMovies} movies={movies} />
          }
          {
            loading && <Loader />
          }
          {
            error && <DisplayError error={error} />
          }

        </Box>
        <Box>
          {selectedID ? <MovieDetails watched={watched} onAddWatched={handleAddWatched} setLoading={setLoading} loading={loading} goBack={goBack} setSelectedId={setSelectedId} selectedID={selectedID} /> :
            <>
              <WatchedSummary watched={watched} />
              <WatchedList watched={watched} setWatched={setWatched} />
            </>
          }
        </Box>
      </Main>

      {/* <button onClick={fetchedData}>getMovie</button> */}
    </>
  );
}

function Loader() {
  return <div className="loader-div">
    <p className="loader"></p>
  </div>
}

function DisplayError({ error }) {
  return <p className="error">{error}</p>

}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>CineMetrics</h1>
    </div>
  );
}

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      {children}
    </nav>
  );
}


function Results({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length ? movies.length : 0}</strong> results
    </p>
  );
}

function Search({ query, setQuery }) {
  function clearSearch() {
    setQuery("")
  }

  return (
    <div className="search-bar">
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query.length > 0 && <button className="search-close" onClick={clearSearch}>x</button>}
    </div>
  );
}

function Main({ children }) {

  return (
    <main className="main">
      {children}
    </main>
  );
}


function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return <div className="box">
    <button
      className="btn-toggle"
      onClick={() => setIsOpen((open) => !open)}
    >
      {isOpen ? "–" : "+"}
    </button>
    {isOpen && (
      children
    )}
  </div>
}

function MovieDetails({ goBack, selectedID, onAddWatched, watched, setSelectedId }) {
  const [movieDetail, setMovieDetail] = useState({})
  const [movieLoader, setMovieLoader] = useState(false)
  const [userRating, setUserRating] = useState("")
  const isWatched = watched.some(mov => mov.imdbID === selectedID)
  const watchedRating = watched.find(mov => mov.imdbID === selectedID)?.userRating
  console.log(watchedRating, "watched user rating")
  console.log(isWatched)

  const { Title: title, Genre: genre, Language: lang, Actors: actors, Poster: poster, Runtime: runTime, imdbRating: movieRating } = movieDetail;
  console.log(selectedID)
  useEffect(() => {
    async function getMovieDetail() {
      try {
        setMovieLoader(true)
        const res = await fetch(`http://www.omdbapi.com/?apikey=${Key}&i=${selectedID}`)
        if (!res.ok) throw new Error("Error occured fetching details")
        const data = await res.json()
        setMovieDetail(data)
      } catch (err) {
        console.log(err.message)
      } finally {
        setMovieLoader(false)
      }
    }
    getMovieDetail()
  }, [selectedID])




  useEffect(() => {
    // if(!title) return
    document.title = `Movie | ${title}`

    return function () {
      document.title = "CineMetrics"
    }
  }, [title])


  function handleAdd() {

    const newWatchedMovie = {
      imdbID: selectedID,
      title,
      poster,
      imdbRating: Number(movieRating), runTime: Number(runTime.split(" ").at(0)),
      userRating,

    }
    onAddWatched(newWatchedMovie)
    setSelectedId("")
  }

  useEffect(() => {
    function callBack(e) {
      if (e.code === "Escape") {
        goBack();
        console.log("Side effect running to go back");
      }
    }

    window.addEventListener("keydown", callBack);

    return () => {
      window.removeEventListener("keydown", callBack);
    };
  }, [goBack]); 

  return <div className="details">
    {movieLoader ? <Loader /> :
      <>
        <header>
          <button onClick={goBack} className="btn-back">&larr;</button>
          <img src={poster} alt="" />
          <p>Title: {title}</p>
          <p>Genre: {genre}</p>
          <p>Language: {lang}</p>
          <p>Run Time:{runTime}</p>
          <p>Actors: {actors}</p>
        </header>
        <section>

          <div className="rating">
            {
              !isWatched ?
                <>
                  <StarRating maxRating={movieRating >= 5 ? 10 : 5} onSetRating={setUserRating} />
                  {userRating > 0 ? <button className="btn-add" onClick={handleAdd}>Add to list</button> : ""}
                </>
                : <p>You have rated this movie {watchedRating}⭐</p>
            }
          </div>

        </section>
      </>}
  </div>
}



function MovieList({ movies, getSelectedMovie }) {
  return <ul className="list list-movies">
    {movies?.map((movie) => (
      <Movie key={movie.imdbID} movie={movie} handleSelected={getSelectedMovie}
      />
    ))}
  </ul>
}


function Movie({ handleSelected, movie }) {
  return <li onClick={() => handleSelected(movie.imdbID)}>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>
  </li>
}


// function WatchedBox({children}){

//   const [isOpen2, setIsOpen2] = useState(true);


//   return <div className="box">
//     <button
//       className="btn-toggle"
//       onClick={() => setIsOpen2((open) => !open)}
//     >
//       {isOpen2 ? "–" : "+"}
//     </button>
//     {isOpen2 && (
//       <>
//       {children}
//       </>
//     )}
//   </div>
// }


function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runTime));
  return <div className="summary">
    <h2>Movies you watched</h2>
    <div>
      <p>
        <span>#️⃣</span>
        <span>{watched.length} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime} min</span>
      </p>
    </div>
  </div>
}


function WatchedList({ watched, setWatched }) {
  function handleWatchedDel(id) {
    setWatched(watched => watched.filter(mov => mov.imdbID !== id))
  }

  return <ul className="list">
    {watched.map((movie) => (
      <li key={movie.imdbID}>
        <img src={movie.poster} alt={`${movie.title} poster`} />
        <h3>{movie.title}</h3>
        <div>
          <p>
            <span>⭐️</span>
            <span>{movie.imdbRating.toFixed(2)}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{movie.userRating.toFixed(2)}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{movie.runTime} min</span>
          </p>
          <button className="btn-delete" onClick={() => handleWatchedDel(movie.imdbID)}>X</button>
        </div>

      </li>
    ))}
  </ul>
}