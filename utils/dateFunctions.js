function dateToStandardString(date) {
    if(!date)return undefined;
    let offset = date.getTimezoneOffset()
    date = new Date(date.getTime() - (offset*60*1000))
    return date.toISOString().split('T')[0];
}

module.exports = {dateToStandardString};
