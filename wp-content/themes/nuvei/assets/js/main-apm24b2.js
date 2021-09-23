function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

jQuery(function ($) {

    // Fade in Search form
    $('#apmTypeSelect').on('rendered.bs.select', function (e) {
        $('.search-apm-form-field').addClass('shown');
    });

    // Popups global
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    window.addEventListener("earthjsload", function () {
        var myearth = new Earth("bgearth", {
            location: {lat: 20, lng: 20},
            draggable: false,
            light: 'none',
            mapImage: pathArray.themeUrl + '/assets/img/hologram.svg',
            transparent: true,
            autoRotate: true,
            autoRotateSpeed: 1.2,
            autoRotateDelay: 100,
            autoRotateStart: 2000,
            autoRotateSpeed: .75,

        });


        myearth.addEventListener("ready", function () {

            this.startAutoRotate();

            // add random stars
            var star_count = 800;
            var stars = [];

            for (var i = 0; i < star_count; i++) {

                stars.push({
                    location: {lat: getRandomInt(-50, 50), lng: getRandomInt(-180, 180)},
                    offset: getRandomInt(35, 60),
                    opacity: getRandomInt(20, 80) / 100,
                    color: 'rgb(' + getRandomInt(180, 255) + ',' + getRandomInt(180, 255) + ',' + getRandomInt(180, 255) + ')',
                });

            }

            this.addPoints({
                points: stars,
                scale: 0.1 + window.innerWidth / 2000
            });

        });

    });
});