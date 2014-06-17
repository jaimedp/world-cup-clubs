(function () {
    var docKey = '12ZJ5U_eBvoUj1Oip6WtMpsfg1WDDwkOI1LwzbkM_hNI';
    gDoc.loadCsv(docKey, ready);

    function ready(data) {
        window.csv = new Contour.connectors.Chord(data);
        new Contour({
            el: '.chart',
            chart: {
            }
        })
        .sankey(csv)
        .render();
    }

    Contour.export('chord', function (data, layer, options) {
        var chord = d3.layout.chord()
            .padding(0.05)
            .sortSubgroups(d3.descending)
            .matrix(data.rel);

        console.log(chord);

        var width = options.chart.plotWidth,
            height = options.chart.plotHeight,
            innerRadius = Math.min(width, height) * 0.41,
            outerRadius = innerRadius * 1.1;

        var fill = d3.scale.ordinal()
            .domain(d3.range(4))
            .range(['#000000', '#FFDD89', '#957244', '#F26223']);

        layer
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        layer.append('g').selectAll('path')
            .data(chord.groups)
          .enter().append('path')
            .style('fill', function(d) { return fill(d.index); })
            .style('stroke', function(d) { return fill(d.index); })
            .attr('d', d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius));

        var ticks = layer.append('g').selectAll('g')
            .data(chord.groups)
          .enter().append('g').selectAll('g')
            .data(groupTicks)
          .enter().append('g')
            .attr('transform', function(d) {
                return 'rotate(' + (d.angle * 180 / Math.PI - 90) + ')' + 'translate(' + outerRadius + ',0)';
            });

        ticks.append('text')
            .attr('x', 8)
            .attr('dy', '.35em')
            .attr('transform', function(d) { return d.angle > Math.PI ? 'rotate(180)translate(-16)' : null; })
            .style('text-anchor', function(d) { return d.angle > Math.PI ? 'end' : null; })
            .text(function(d) { return d.label; });

        layer.append('g')
            .attr('class', 'chord')
          .selectAll('path')
            .data(chord.chords)
          .enter().append('path')
            .attr('d', d3.svg.chord().radius(innerRadius))
            .style('fill', function(d) { return fill(d.target.index); })
            .style('opacity', 1);

        // Returns an array of tick angles and labels, given a group.
        function groupTicks(d) {
            var k = (d.endAngle - d.startAngle) / d.value;
            return d3.range(0, d.value, 1000).map(function(v) {
                return {
                    angle: v * k + d.startAngle,
                    label: v
                };
            });
        }
    });
})();