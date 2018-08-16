let root_dir = process.cwd()
let getLocalTime

function warning(fileDir, lineNumber, infos){
    if(lineNumber === false){
        return
    }

    if(lineNumber.length < 3){
        return
    }

    let rela_file = fileDir.split(root_dir)[1]
    let today = new Date()
    console.log(require("../base/util").getLocalTime() + " [WARN] [" + rela_file + ":" + lineNumber[1] + ":" + lineNumber[2] + "]  " +  JSON.stringify(infos))
}

function debug(fileDir, lineNumber, infos){
    if(lineNumber === false){
        return
    }

    if(lineNumber.length < 3){
        return
    }

    let rela_file = fileDir.split(root_dir)[1]
    let today = new Date()
    console.log(require("../base/util").getLocalTime() + " [DEBUG] [" + rela_file + ":" + lineNumber[1] + ":" + lineNumber[2] + "]  " +  JSON.stringify(infos))
}

function info(fileDir, lineNumber, infos){
    if(lineNumber === false){
        return
    }

    if(lineNumber.length < 3){
        return
    }

    let rela_file = fileDir.split(root_dir)[1]
    let today = new Date()
    console.log(require("../base/util").getLocalTime() + " [INFO] [" + rela_file + ":" + lineNumber[1] + ":" + lineNumber[2] + "]  " +  JSON.stringify(infos))
}

function error(fileDir, lineNumber, infos){
    if(lineNumber === false){
        return
    }

    if(lineNumber.length < 3){
        return
    }
    
    let rela_file = fileDir.split(root_dir)[1]
    let today = new Date()
    console.log(require("../base/util").getLocalTime() + " [ERROR] [" + rela_file + ":" + lineNumber[1] + ":" + lineNumber[2] + "]  " +  JSON.stringify(infos))
}

// getLocalTime = getLocalTime || require("../base/util").getLocalTime //相互引用问题解决方案，或者使用dependency injection

module.exports = {
    warning,
    debug,
    error,
    info
}