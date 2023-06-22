var Sync = require('sync');

var TTSVFileStream = require('./TTSVFileStream.lib.js');

var fs = require('fs');

Sync(function () {
    var stream = new TTSVFileStream({
        fileNames: ['./byThe_let_sTradeSignalDaemon.js_binance_orderBooksValuesMediansSums_BTCUSDT_20220607024737.tsv']
    });

    var line = null;
    while (line = stream.getLine()) {
        fs.appendFileSync(
            __dirname + '/out00by_test00.js.log',
            line + '\n'
        );
    }
});
