(function () {
    var vm = new Vue({
        el: '#search-app',
        data: {
            posts: [],
            search: '',
            formFilters: {
                search: '',
                location: [],
                industry: [],
                apm_type: [],
                order: {name: 'Popular', query: 'orderby=nuv_order&order=desc'},
            },
            locationSpreadData: {},
            orderOptions: [
                {name: 'Popular', query: 'orderby=nuv_order&order=desc'},
                {name: 'A to Z', query: 'orderby=title&order=asc'},
                {name: 'Z to A', query: 'orderby=title&order=desc'},
            ],
        },
        mounted: function () {
            //    this.fetchPosts();
        },

        created: function () {
            //this.setSortCriterion(this.orderOptions[0]);
            this.setLocationSpreadData();
            this.debouncedFetchPosts = npDebounce(this.fetchPosts, 600);
            this.renderResults(false);
        },
        watch: {

            // Separate check for Search (we want 2 chars at least)
            'formFilters.search': function (newVal) {
                if ((newVal.length == 0) || (newVal.length > 1)) {
                    this.renderResults(true);
                }
            },
            'formFilters.location': function () {
                this.renderResults(false);
            },
            'formFilters.industry': function () {
                this.renderResults(false);
            },
            'formFilters.apm_type': function () {
                this.renderResults(false);
            },
            'formFilters.order': function () {
                this.renderResults(false);
            },
        },

        methods: {
            fetchPosts() {
                document.getElementById("apm-list-preloader").style.opacity = "1";
                document.getElementById("apm-list").style.opacity = "0.4";

                let query = '?per_page=1000&lang=en-ca&search=' + this.formFilters.search +

                    '&location=' + this.formFilters.location +
                    '&industry=' + this.formFilters.industry +
                    '&apm_type=' + this.formFilters.apm_type +
                    '&' + this.formFilters.order.query;

                var url = 'https://' + document.location.host + '/wp-json/wp/v2/apms' + query;
                fetch(url).then((response) => {
                    return response.json()
                }).then((data) => {
                    //this.posts = data;
                    this.posts = [{
                        'locationId': 0,
                        'posts': data,
                    }];

                    if (data.length == 0) {
                        document.getElementById("empty-result").style.opacity = "1";
                    } else {


                        // Fragmented Response
                        if (this.formFilters.location.length > 0) {

                            let postsByLocation = [];
                            this.formFilters.location.forEach(function (locationId) {
                                //console.log(locationId);
                                postsByLocation.push({
                                    'locationId': locationId,
                                    'posts': data.filter(function (el) {
                                        return el.location.indexOf(Number(locationId)) >= 0;
                                    })
                                });

                            });
                            //console.log(postsByLocation);
                            this.posts = postsByLocation;
                        }

                        //console.log(this.posts);
                        document.getElementById("empty-result").style.opacity = "0";
                    }
                    document.getElementById("apm-list").style.opacity = "1";
                    document.getElementById("apm-list-preloader").style.opacity = "0";
                })
            },
            setSortCriterion(criterion) {
                this.formFilters.order = criterion;
            },
            renderResults(debounced = false) {
                if (debounced == true) {
                    this.debouncedFetchPosts();
                } else {
                    this.fetchPosts();
                }
            },

            setLocationSpreadData() {
                // Set from Global var
                this.locationSpreadData = locationSpreadData;
            },


        }
    });
})();


function npDebounce(fn, delay) {
    let timeoutID = null;
    return function () {
        clearTimeout(timeoutID);
        let args = arguments;
        let that = this;
        timeoutID = setTimeout(function () {
            fn.apply(that, args);
        }, delay);
    }
}