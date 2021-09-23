(function() {

    var vue = new Vue({
        el: '#category-articles',
        data: {
            posts : posts,
            tags : tags,
            selectedTag : 0,
            currentPage : 1,
        },
        props:{
            size:{
                type: Number,
                required: false,
                default: 9
            },
            maxVisibleButtons: {
                type: Number,
                required: false,
                default: 3
            }
        },
        computed : {
            filterByTag: function () {
                return this.posts.filter( (function (post) {
                    var hasTag = false;
                    
                    post.tags.forEach( (function(tag) {

                        if(tag.tagID === this.selectedTag){
                            hasTag = true;
                        }

                    }).bind(this));

                    return hasTag;

                }).bind(this))
            },
            //Pagination section
            totalPages: function() {
                return Math.ceil(this.filterByTag.length/this.size);
            },
            //Posts displayed according to the current page
            paginatedData: function(){
                var start = (this.currentPage - 1) * this.size;
                var end = start + this.size;
                return this.filterByTag.slice(start, end);
            },
            //Determines the first page that is shown
            startPage: function(){
                //return Math.max(1, Math.min(this.totalPages - this.maxVisibleButtons, this.currentPage));
                if(this.currentPage === 1) {
                    return 1;
                }

                if(this.currentPage === this.totalPages) {
                    if ((this.totalPages - this.maxVisibleButtons) < 0) {
                        return 1;
                    } else {
                        return this.totalPages - this.maxVisibleButtons + 1;
                    }
                }
                return this.currentPage - 1;
            },
            lastPageRange: function(){
                return Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages);
            },
            pages: function(){
                var range = [];
                for (var i = this.startPage; i <= Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages); i+= 1) {

                    range.push({
                        name: i,
                        isDisabled: i === this.currentPage
                    });
                }
                return range;
            },
            isInFirstPage: function() {
                return this.currentPage === 1;
            },
            isInLastPage: function() {
                return this.currentPage === this.totalPages;
            }
        },
        methods: {
            nextPage: function() {
                this.currentPage++;
            },
            previousPage: function() {
                this.currentPage--;
            },
            onClickPage: function(page) {
                this.currentPage = page;
            },
            onClickFirstPage: function(){
                this.currentPage = 1;
            },
            onClickLastPage: function(){
                this.currentPage = this.totalPages;
            },
            isPageActive: function(page) {
                return this.currentPage === page;
            }
        }

    });
})();