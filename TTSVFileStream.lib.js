//ver alt0_3WAlt0test0W

const readline = require('readline');

const fs = require('fs');

const myUtil = require('./myUtil.lib.js');

const SETTINGS = require('./TTSVFileStream.cfg.js');

module.exports = function (
    params/*={
		fileNames: [/ * ... * /]
	}*/
) {
    let vm = this;

    let _fileNames = params.fileNames;

    let _currFileNameIdx = 0;

    let _accum = '';

    let _fd = null;

    let _buffer = Buffer.allocUnsafe(SETTINGS.fileReadBuffer.size);

    vm.getLine = function ()/*ver alt0_1WAlt0test0W .*/ {
        let newLineIdx = -1;
        while ((newLineIdx = _accum.indexOf('\n')) === -1) {
            let chunk = getChunk();
            if (!chunk) {
                return parseLine(_accum);
            }
            _accum += chunk;
        }
        let line = _accum.slice(0, newLineIdx);
        _accum = _accum.slice(newLineIdx + 1);
        return parseLine(line);
    };

    function getChunk() {
        /*< ...(1)>*/
        var bytesRead = (
            myUtil.isDefined(_fd)
                ? fs.readSync(
                    _fd,
                    _buffer,
                    0,
                    _buffer.length,
                    null
                )
                : 0
        );
        /*</...(1)>*/
        if (bytesRead === 0) {
            return reinitFd() ? getChunk() : null;
        }
        return _buffer.slice(0, bytesRead).toString();
    }

    function reinitFd() {
        if (myUtil.isDefined(_fd)) {
            fs.closeSync(_fd);
            _fd = null;
        }
        if (_currFileNameIdx < _fileNames.length) {
            _fd = fs.openSync(_fileNames[_currFileNameIdx++], 'r');
            return true;
        }
        return false;
    }

    function parseLine(line) {
        if (myUtil.isDefined(line) && !!line) {
            return line.split('\t');
        }
        return null;
    }

    vm.cleanup = function ()/*ver alt0_0WAlt0test0W .*/ {
        if (myUtil.isDefined(_fd)) {
            fs.closeSync(_fd);
            _fd = null;
        }
        _buffer = null;
    };

    reinitFd();
};
