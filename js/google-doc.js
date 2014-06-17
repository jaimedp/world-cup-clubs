(function() {
    var gDoc = {
        loadCsv: function (docKey, callback) {
            var docUrl = this.getPath(docKey);

            $.ajax({
                url: 'http://query.yahooapis.com/v1/public/yql',
                data: {
                    q: "select * from csv where url='" + docUrl + "'",
                    format: 'json'
                },
                dataType: 'jsonp',
                success: function(resp) {
                    var res = resp.query.results;
                    var data = _.map(res.row, function(row) {
                        return _.reduce(row, function (m, cell) {
                            return m ? m += ',' + cell.replace(/,/g,'') : m = cell.replace(/,/g, '');
                        }, '');
                    }).join('\n');

                    if (callback) callback.call(null, data);
                }
            });
        },

        getPath: function (docKey) {
            return 'https://docs.google.com/spreadsheets/d/' + docKey + '/export?gid=0&format=csv';
        }
    };

    window.gDoc = gDoc;
})();
