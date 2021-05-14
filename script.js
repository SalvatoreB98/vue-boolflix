const app = new Vue({
    el: '#root',
    data: {
        apiKey: '4d36ecbf5868a91e4711e736491b2ad9',
        textToSearch: '',
        movieList: [],
        tvSerieslist: []
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
                    api_key: '4d36ecbf5868a91e4711e736491b2ad9',
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
        /**
         * 
         * @param {float} vote 
         */
        roundVote(vote) {
            vote = vote / 2;
            return Math.round(vote);
        }
    },
    mounted() {

    }
})
