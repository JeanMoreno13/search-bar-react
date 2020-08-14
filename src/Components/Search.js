import React from "react";
import "../Search.css";
import axios from "axios";
import loader from "../img/loader.gif";

class Search extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            query:'',
            results:{},
            loading:false,
            message:'',
        }
        this.cancel = '';
    }

    // Récupère la valeur de l'input et l'envoie à fetchSearchResults() qui éxécutera la requête
    handleOnInputChange = event => {
        const query = event.target.value;

        // Si il n'ya pas de recherche on set le state à vide
        // Sinon on set le state en passant le loading à true et on appel la méthode de recherche
        if (!query) {
            this.setState({ query, results: {}, message: '' } );
        } else {
            this.setState({ query, loading: true, message: '' }, () => {
                this.fetchSearchResults(1, query);
            });
        }
    }

    /**
     * Execute la requête avec l'utilisation de "axios"
     * @param {int} page
     * @param {String} Query search
     **/

    fetchSearchResults = (page = '', query) => {
        const pageNumber = page ? `&page=${page}` : '';
        const searchUrl = `https://pixabay.com/api/?key=17779784-d7450e11fa616769e7bb6df36&q=${query}${pageNumber}`;

        // Annule la requête précedente avant d'en faire une nouvelle
        if (this.cancel) this.cancel.cancel();        
        this.cancel = axios.CancelToken.source();

        // On Get sur l'API => Stock la réponse dans le state et on traite l'erreur si il y en a une
        axios
            .get(searchUrl)
            .then(res => {
                const resultNotFoundMsg = (!res.data.hits.length) ? 'Aucun résultat' : '';
                this.setState({ 
                    results: res.data.hits,
                    message: resultNotFoundMsg,
                    loading: false
                })
            })
            .catch((error) => {
                if(axios.isCancel(error) || error){
                    this.setState({ 
                        loading:false,
                        message:'Erreur dans la recherche'
                    })
                }
            })
    }
 
    // Affiche les résultats de la requête
    renderSearchResult = () => {
        const { results } = this.state;
        
        if(Object.keys(results).length && results.length){
            return(
                <div className="container-results">
                    { results.map( result => {
                        return(
                            <a key={ result.id } href={ result.previewURL } className="result-item">
                                <h6 className="image-username">{ result.user }</h6>
                                <div className="image-wrapper">
                                    <img className="image" src={ result.previewURL } alt="preview"/>
                                </div>
                            </a>
                        )
                    })}
                </div>
            )
        }
    }

    // Affichage de notre header contenant la search-bar et les résultats de recherche par renderSearchResult()
    render(){
        const { loading, message, query } = this.state;
        return(
            <div className="container">
                <div className="container-search">
                    <h2>Images libres de droits & gratuites</h2>
                    <p>Découvrez plus de 1.8 millions d'images gratuites et de haute qualitées partagées par notre talentueuse communauté.</p>
                    <label htmlFor="search-input">
                        <input
                            type="text"
                            id="search-input"
                            value={query}
                            placeholder="Search..."
                            onChange={this.handleOnInputChange}
                        />
                        <i className="fas fa-search"></i>
                    </label>
                    {message && <p className="message">{message}</p>}
                    <img src={loader} className = {`search-loading ${loading ? 'show' : 'hide'}`} alt="Loading"/>
                </div> 
                <div>{this.renderSearchResult()}</div>
            </div>          
        )
    }
}

export default Search;