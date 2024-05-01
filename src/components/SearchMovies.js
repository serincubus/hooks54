import React, { useState, useEffect, useRef } from 'react';
import noPoster from '../assets/images/no-poster.jpg';

function SearchMovies(){

    const [movies, setMovies] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [apiKey, setApiKey] = useState('4dbf870a');
    const searchInputRef = useRef(null); // Referencia al campo de búsqueda
    const defaultMessage = '';

    useEffect(() => {
        // Lógica para realizar la llamada a la API cuando el keyword cambie
        const fetchData = async () => {
            try {
                const response = await fetch(`http://www.omdbapi.com/?s=${keyword}&apikey=${apiKey}`);
                const data = await response.json();
                if (data.Search) {
                    setMovies(data.Search);
                } else {
                    setMovies([]);
                }
            } catch(error) {
                console.error('Error fetching data:', error);
            }
        };

        // Llamar a fetchData solo si apiKey y keyword están definidos
        if (apiKey && keyword) {
            fetchData();
        } else {
            setMovies([]); // Limpiar los resultados si no hay keyword o apiKey
        }
    }, [apiKey, keyword]); // Dependencias del useEffect

    const handleChange = (event) => {
        const searchKeyword = event.target.value.trim(); // Eliminar espacios en blanco al principio y al final
        if (searchKeyword === '') {
            setKeyword(defaultMessage); // Restablecer el estado de la palabra clave al mensaje por defecto si el campo de búsqueda está vacío
            setMovies([]); // Limpiar los resultados si el campo de búsqueda está vacío
        } else {
            setKeyword(searchKeyword); // Actualizar el estado de la palabra clave de búsqueda
        }
    };

    return(
        <div className="container-fluid" data-testid="searchMovies">
            {
                apiKey !== '' ?
                <>
                    <div className="row my-4">
                        <div className="col-12 col-md-6">
                            {/* Formulario de búsqueda */}
                            <div className="form-group">
                                <label htmlFor="">Buscar por título:</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    ref={searchInputRef} 
                                    value={keyword} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <h2>Películas para la palabra: {keyword}</h2>
                        </div>
                        {/* Lista de películas */}
                        {
                            movies.length > 0 ? (
                                movies.map((movie, i) => (
                                    <div className="col-sm-6 col-md-3 my-4" key={i}>
                                        <div className="card shadow mb-4">
                                            <div className="card-header py-3">
                                                <h5 className="m-0 font-weight-bold text-gray-800">{movie.Title}</h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="text-center">
                                                    <img 
                                                        className="img-fluid px-3 px-sm-4 mt-3 mb-4" 
                                                        src={movie.Poster !== 'N/A' ? movie.Poster : noPoster} 
                                                        alt={movie.Title} 
                                                        style={{ width: '90%', height: '400px', objectFit: 'cover' }} 
                                                    />
                                                </div>
                                                <p>{movie.Year}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12">
                                    <p>No se encontraron películas</p>
                                </div>
                            )
                        }
                    </div>
                </>
                :
                <div className="alert alert-danger text-center my-4 fs-2">Eyyyy... ¿PUSISTE TU APIKEY?</div>
            }
        </div>
    )
}

export default SearchMovies;
