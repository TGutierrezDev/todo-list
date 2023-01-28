function dateFormatter(dateStr){
    let splits = dateStr.split("/");
    return splits[1] + "/" + splits[0] + "/" + splits[2] 
}

module.exports = {
    dateFormatter
}
