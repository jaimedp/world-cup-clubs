(function () {

    var __super__ = Contour.connectors.Csv.prototype;

    var ChordData = Contour.connectors.Csv.extend({
        _domainFromCol: function (col) {
            var _this = this;
            var _i = function (colName) { return _this._headers.indexOf(colName); };
            return _.uniq(_.map(this._data, function (row) {
                return row[_i(col)];
            }));
        },

        _computeLinks: function () {
            var _this = this;
            var _i = function (colName) { return _this._headers.indexOf(colName); };
            // make sure we have the nodes sorted out
            this.nodes();

            return _.map(this._data, function (row) {
                var srcIndex = this._nodeIndex[row[_i('club')]];
                var targetIndex = this._nodeIndex[row[_i('country')]];

                var srcNode = this._nodes[srcIndex];
                var targetNode = this._nodes[targetIndex];

                var link = {
                    source: srcIndex,
                    target: targetIndex
                };

                srcNode.outbound.push(targetIndex);
                targetNode.inbound.push(srcIndex);

                return link;
            }, this);
        },

        _computeNodes: function () {
            this._nodeIndex = {};

            return _.map(this.countries().concat(this.clubs()), function (n, i) {
                this._nodeIndex[n] = i;

                return {
                    node: n,
                    name: n,
                    outbound: [],
                    inbound: [],
                };
            }, this);
        },

        countries: function () {
            if (!this._countries || !this._countries.length)
                this._countries = this._domainFromCol('country');
            return this._countries;
        },

        clubs: function () {
            if (!this._clubs || !this._clubs.length)
                this._clubs = this._domainFromCol('club');
            return this._clubs;
        },

        nodes: function () {
            if (!this._nodes) {
                this._nodes = this._computeNodes();
            }

            return this._nodes;
        },

        links: function () {
            if (!this._links) {
                this._links = this._computeLinks();
            }

            return this._links;
        },



        data: function () {

            // return [
            //   [11975,  5871, 8916, 2868],
            //   [ 1951, 10048, 2060, 6171],
            //   [ 8010, 16145, 8090, 8045],
            //   [ 1013,   990,  940, 6907]
            // ];


            return [
            //   A B C
                [1,10,1],  // A
                [1,1,10],  // B
                [1,1,1]   // C
            ];
        }
    });

    Contour.connectors.Chord = ChordData;

})();