const app = new Vue({
    el: '#root',
    data: {
        apiKey: '4d36ecbf5868a91e4711e736491b2ad9',
        textToSearch: '',
        movieList: [],
        moviesFiltered: [],
        tvSeriesList: [],
        tvSeriesFiltered: [],
        activeContent: {},
        isContentOpened: false,
        genresListTv: [],
        genresListMovie: [],
        isFilterOpen: false,
        selectedGenre: '',
        typeSelected: ''
    },
    methods: {
        searchText() {
            this.movieList = [];
            this.getByQuery('movie');
            this.getByQuery('tv');
            this.moviesChecked = true;
            this.seriesChecked = true;

        },
        getLang(isoLang) {
            if (flagMap.hasOwnProperty(isoLang)) {
                return flagMap[isoLang]
            } else {
                return false
            }
        },
        /**
         * 
         * @param {string} movie 
         */
        getByQuery(typeOfSearch) {
            axios.get('https://api.themoviedb.org/3/search/' + typeOfSearch, {
                params: {
                    api_key: this.apiKey,
                    query: this.textToSearch,
                    language: 'it-IT'
                }
            })
                .then((resp) => {
                    if (typeOfSearch == 'movie') {
                        console.log(resp.data.results);
                        this.movieList = resp.data.results
                        this.moviesFiltered = resp.data.results
                    } else if (typeOfSearch == 'tv') {
                        this.tvSeriesList = resp.data.results.map((tvShow) => {
                            tvShow.title = tvShow.name;
                            tvShow.original_title = tvShow.original_name;
                            return tvShow;
                        });
                        this.tvSeriesFiltered = resp.data.results.map((tvShow) => {
                            tvShow.title = tvShow.name;
                            tvShow.original_title = tvShow.original_name;
                            return tvShow;
                        });
                    }

                })
        },
        getCast(typeOfContent, movieId) {

            axios.get(`https://api.themoviedb.org/3/${typeOfContent}/${movieId}/credits`, {
                params: {
                    api_key: this.apiKey,
                }
            }
            ).then((resp) => {

                Vue.set(this.activeContent, 'cast', resp.data.cast)
                console.log(this.activeContent)
            })
        },
        /**
         * 
         * @param {String} typeOfContent tipo di content se tv o movie
         * @param {Int} movieId id dell'elemento da cui prendere i generi
         * @param {Object} element elemento da modificare
         */
        getGenresbyId(typeOfContent, movieId, element) {
            axios.get(`https://api.themoviedb.org/3/${typeOfContent}/${movieId}`, {
                params: {
                    api_key: this.apiKey,
                    language: 'it-IT'
                }
            }
            ).then((resp) => {
                Vue.set(element, 'genres', resp.data.genres)
                console.log(element)
            })
        },
        getAllGenres(typeOfContent, element) {
            axios.get(`https://api.themoviedb.org/3/genre/${typeOfContent}/list`, {
                params: {
                    api_key: this.apiKey,
                    language: 'it-IT'
                }
            }
            ).then((resp) => {
                element.push(...resp.data.genres)
            })
        },
        /**
         * 
         * @param {float} vote 
         */
        roundVote(vote) {
            vote = vote / 2;
            return Math.round(vote);
        },
        setActiveContent(element) {
            this.activeContent = element;
            this.isContentOpened = true;
        },
        closeWindow() {
            this.isContentOpened = false
        },
        openCloseFilters() {
            this.isFilterOpen = !this.isFilterOpen
        },
        onChangeGenre() {
            // INITIAL RESET
            this.moviesFiltered = [...this.movieList]
            this.moviesFiltered = this.moviesFiltered.filter((element) => {
                if (element.genre_ids.length > 0) {
                    if (element.genre_ids.includes(this.selectedGenre)) {
                        return true;
                    } else {
                        return false
                    }
                }
            })
            // INITIAL RESET
            this.tvSeriesFiltered = [...this.tvSeriesList]
            this.tvSeriesFiltered = this.tvSeriesFiltered.filter((element) => {
                if (element.genre_ids.length > 0) {
                    if (element.genre_ids.includes(this.selectedGenre)) {
                        return true;
                    } else {
                        return false
                    }

                }
            })
        },
    },
    mounted() {
        this.getAllGenres('tv', this.genresListTv);
        this.getAllGenres('movie', this.genresListMovie);
    }
})
