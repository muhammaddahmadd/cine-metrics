import { children, use, useEffect, useState } from "react";

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
    setSelectedId(selectedID => selectedID === id? null: id)
  }

  function goBack(id) {
    setSelectedId("")
  }

 

  useEffect(() => {
    async function fetchedData() {

      try {
        setLoading(true);
        setError("")
        const res = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${Key}&s=${query}`);
        if (!res.ok) throw new Error("Error occurred while fetching data");
        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found")
        console.log(data)
        setMovies(data.Search || []); // Ensure it doesn't set `undefined`
        // setLoading(false)
      } catch (err) {
        console.log(err.message);
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (query.length > 3) fetchedData();
    else {
      setError("")
      setMovies(tempMovieData)
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
            !loading && !error && <MovieList getSelectedMovie={getSelectedMovie} setSelectedId={setSelectedId}  setMovies={setMovies} movies={movies} />
          }
          {
            loading && <Loader />
          }
          {
            error && <DisplayError error={error} />
          }

        </Box>
        <Box>
          {selectedID ? <MovieDetails goBack={goBack} setSelectedId={setSelectedId} selectedID={selectedID}/> :
          <>
          <WatchedSummary watched={watched} />
          <WatchedList watched={watched} />
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

function MovieDetails({ goBack, selectedID }){
  return <div className="details">
    <button onClick={goBack} className="btn-back">&larr;</button>
    {selectedID}
  </div>
}



function MovieList({ movies, getSelectedMovie }) {
  // const [{ Title: title }] = selectedMovie?.Title
  // function handleSelected(id){
  //   if(!movies.length) return
  //   setSelectedMovie(movies.filter(mov=> mov.imdbID === id? mov : ""))
  // }



  return <ul className="list list-movies">
    {movies?.map((movie) => (
      <Movie key={movie.imdbID} movie={movie} handleSelected={getSelectedMovie}
      />
    ))}
  </ul>
}

function Movie({ handleSelected, movie }){

  return <li  onClick={() => handleSelected(movie.imdbID)}>
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
  const avgRuntime = average(watched.map((movie) => movie.runtime));
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


function WatchedList({ watched }) {
  return <ul className="list">
    {watched.map((movie) => (
      <li key={movie.imdbID}>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>⭐️</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{movie.runtime} min</span>
          </p>
        </div>
      </li>
    ))}
  </ul>
}