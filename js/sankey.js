(function () {


    Contour.export('sankey', function (ds, layer, options) {

        var links = ds.links();
        var nodes = ds.nodes();
        var countries = _.filter(nodes, function (n) { return n.inbound.length > 0; });
        var clubs = _.filter(nodes, function (n) { return n.outbound.length > 2; });
        var numClubs = clubs.length;
        var lineHeight = 16;
        var padding = 7;
        var half = options.chart.plotWidth / 2;
        var countriesIndex = {};
        var clubIndex = {};

        _.each(countries, function (c, i) {
            countriesIndex[c.node] = _.extend({}, c, { index: i });
        });

        _.each(clubs, function (c, i) {
            clubIndex[c.node] = _.extend({}, c, { index: i });
        });

        var countryY = function (d, i) { return i * (lineHeight + padding) + lineHeight; };

        var clubY = function (d, i) { return (i/2) * (lineHeight + padding)  + lineHeight; };
        var clubX = function (d, i) {return i % 2 === 0 ? options.chart.plotWidth - 150 : 150; };

        var path = function(d) {
            var club = clubIndex[nodes[d.source].node];
            var country = countriesIndex[nodes[d.target].node];
            if (!club || !country) return;
            return ['M',clubX(d,club.index), ',', clubY(d,club.index), 'L', half, ',',  countryY(d, country.index)].join('');
        };

        var highlight = function () {
            var node = this.__data__.node.replace(/[\s\d\.]/g, '_');
            layer.selectAll('.club, .link, .country').classed('active', false);
            d3.selectAll('.' + node).classed('active', true);
        };


        layer.selectAll('.link').data(links)
            .enter().append('path')
                .attr('class', function (d) {
                    var src = nodes[d.source];
                    var dst = nodes[d.target];

                    return ['link', src.node.replace(/[\s\d\.]/g, '_'), dst.node.replace(/[\s\d\.]/g, '_')].join(' ');
                })
                .attr('d', path)
                .on('mouseover', function () {
                    var _this = d3.event.target;
                    layer.selectAll('.link, .club, .country').classed('active', false);
                    d3.select(_this).classed('active', true);
                });

        layer.selectAll('.country').data(countries)
            .enter().append('text')
                .attr('class', function (d) { return 'country ' + d.node.replace(/[\s\d\.]/g, '_'); })
                .attr('x', half)
                .attr('y', countryY)
                .text(function (d) { return d.name; })
                .on('mouseover', highlight);

        layer.selectAll('.club').data(clubs)
            .enter().append('text')
                .attr('class', function (d) { return 'club '  + d.node.replace(/[\s\d\.]/g, '_'); })
                .attr('x', clubX)
                .attr('y', clubY)
                .attr('style', function (d, i) {
                    var anchor = i % 2 === 0 ? 'start' : 'end';
                    return 'text-anchor: ' + anchor;
                })
                .text(function (d) { return d.name; })
                .on('mouseover', highlight);

    });

})();