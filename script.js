const app = new Vue({
    el: '#root',
    data: {
        apiKey: '4d36ecbf5868a91e4711e736491b2ad9',
        textToSearch: '',
        searchedArray: [],
    },
    methods: {
        searchText() {
            axios.get('https://api.themoviedb.org/3/search/movie', {
                params: {
                    api_key: '4d36ecbf5868a91e4711e736491b2ad9',
                    query: this.textToSearch,
                    language: 'it-IT'
                }
            })
                .then((resp) => {
                    console.log(resp.data.results);
                    this.searchedArray = resp.data.results
                })

        },
        getLang(isoLang) {
            if (flagMap.hasOwnProperty(isoLang)) {
                return flagMap[isoLang]
            } else{
                return false
            }
        }
    },
    mounted() {

    }
})
