(function () {
    var vm = new Vue({
        el: '#search-app',
        data: {
            posts: [],
            search: '',
            formFilters: {
                search: '',
                partnerType: [],
                businessType: [],
                industry: [],
                location: [],
                order: {},
            },
            orderOptions: [
                {name: 'Popular', query: 'orderby=np_order&order=desc'},
                {name: 'A to Z', query: 'orderby=title&order=asc'},
                {name: 'Z to A', query: 'orderby=title&order=desc'},
            ],
        },
        mounted: function () {
            //this.fetchPosts();
        },

        created: function () {
            this.sortResults(this.orderOptions[0]);
            this.debouncedFetchPosts = npDebounce(this.fetchPosts, 300);
        },
        watch: {
            formFilters: {
                handler(newVal, oldVal) {
                    //console.log(newVal);
                    document.getElementById("partner-list").style.opacity = "0.5";
                    this.debouncedFetchPosts();
                },
                deep: true,
            },
        },

        methods: {
            fetchPosts() {
                let query = '?per_page=99&lang=en-ca&search=' + this.formFilters.search +
                    '&partner_type=' + this.formFilters.partnerType +
                    '&business_type=' + this.formFilters.businessType +
                    '&partner_industry=' + this.formFilters.industry +
                    '&partner_location=' + this.formFilters.location +
                    '&' + this.formFilters.order.query;

                var url = 'https://' + document.location.host + '/wp-json/wp/v2/partners' + query;
                fetch(url).then((response) => {
                    return response.json()
                }).then((data) => {
                    this.posts = data;
                    document.getElementById("partner-list").style.opacity = "1";
                })
            },
            sortResults(criterion) {
                this.formFilters.order = criterion;
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

function parseHtmlEntities(str) {
    return str.replace(/&#([0-9]{1,3});/gi, function(match, numStr) {
        var num = parseInt(numStr, 10); // read num as normal number
        return String.fromCharCode(num);
    });
}