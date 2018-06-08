let root_dir = process.cwd()
import {getLocalTime} from "../util"

function warning(fileDir, lineNumber, infos){
    let rela_file = fileDir.split(root_dir)[1]
    let today = new Date()
    console.log(getLocalTime() + " [WARN] [" + rela_file + ":" + lineNumber + "]  " +  infos)
}

function debug(fileDir, lineNumber, infos){
    let rela_file = fileDir.split(root_dir)[1]
    let today = new Date()
    console.log(getLocalTime() + " [DEBUG] [" + rela_file + ":" + lineNumber + "]  " +  infos)
}

function info(fileDir, lineNumber, infos){
    console.log(fileDir)
    console.log(root_dir)
    let rela_file = fileDir.split(root_dir)[1]
    let today = new Date()
    console.log(getLocalTime() + " [INFO] [" + rela_file + ":" + lineNumber + "]  " +  infos)
}

function error(fileDir, lineNumber, infos){
    let rela_file = fileDir.split(root_dir)[1]
    let today = new Date()
    console.log(getLocalTime() + " [ERROR] [" + rela_file + ":" + lineNumber + "]  " +  infos)
}

module.exports = {
    warning,
    debug,
    error,
    info
}