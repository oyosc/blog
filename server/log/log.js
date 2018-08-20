let rootDir = process.cwd()

function warning (fileDir, lineNumber, infos) {
    if (lineNumber === false) {
        return
    }

    if (lineNumber.length < 3) {
        return
    }

    let relaFile = fileDir.split(rootDir)[1]
    console.log(require('../base/util').getLocalTime() + ' [WARN] [' + relaFile + ':' + lineNumber[1] + ':' + lineNumber[2] + ']  ' + JSON.stringify(infos))
}

function debug (fileDir, lineNumber, infos) {
    if (lineNumber === false) {
        return
    }

    if (lineNumber.length < 3) {
        return
    }

    let relaFile = fileDir.split(rootDir)[1]
    console.log(require('../base/util').getLocalTime() + ' [DEBUG] [' + relaFile + ':' + lineNumber[1] + ':' + lineNumber[2] + ']  ' + JSON.stringify(infos))
}

function info (fileDir, lineNumber, infos) {
    if (lineNumber === false) {
        return
    }

    if (lineNumber.length < 3) {
        return
    }

    let relaFile = fileDir.split(rootDir)[1]
    console.log(require('../base/util').getLocalTime() + ' [INFO] [' + relaFile + ':' + lineNumber[1] + ':' + lineNumber[2] + ']  ' + JSON.stringify(infos))
}

function error (fileDir, lineNumber, infos) {
    if (lineNumber === false) {
        return
    }

    if (lineNumber.length < 3) {
        return
    }

    let relaFile = fileDir.split(rootDir)[1]
    console.log(require('../base/util').getLocalTime() + ' [ERROR] [' + relaFile + ':' + lineNumber[1] + ':' + lineNumber[2] + ']  ' + JSON.stringify(infos))
}

// getLocalTime = getLocalTime || require("../base/util").getLocalTime //相互引用问题解决方案，或者使用dependency injection

module.exports = {
    warning,
    debug,
    error,
    info
}
