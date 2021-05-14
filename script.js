const app = new Vue({
    el: '#root',
    data: {
        apiKey: '4d36ecbf5868a91e4711e736491b2ad9',
        textToSearch: '',
        movieList: [],
        tvSerieslist: [],
        activeContent: { cast: [] },
        isContentOpened: false,
        genresList: [],
        moviesChecked: false,
        seriesChecked: false
    },
    methods: {
        searchText() {
            this.movieList = [];
            this.getByQuery('movie');
            this.getByQuery('tv');
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
                    } else if (typeOfSearch == 'tv') {
                        this.tvSerieslist = resp.data.results.map((tvShow) => {
                            tvShow.title = tvShow.name;
                            tvShow.original_title = tvShow.original_name;
                            return tvShow;
                        })
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
        getGenresbyId(typeOfContent,movieId) {
            axios.get(`https://api.themoviedb.org/3/${typeOfContent}/${movieId}`, {
                params: {
                    api_key: this.apiKey,
                    language: 'it-IT'
                }
            }
            ).then((resp) => {
                Vue.set(this.activeContent, 'genres', resp.data.genres)
                console.log(this.activeContent)
            })
        },
        getAllGenres(){
            axios.get(`https://api.themoviedb.org/3/genre/movie/list`, {
                params: {
                    api_key: this.apiKey,
                    language: 'it-IT'
                }
            }
            ).then((resp) => {
                this.genresList = resp.data.genres
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
        }
    },
    mounted() {
        this.getAllGenres();
    }
})
