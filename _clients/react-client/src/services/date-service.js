export function getWeekNumber(date) {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const millisecsInDay = 86400000; // 1 day in milliseconds
    const dayOfYear = Math.ceil((date - oneJan) / millisecsInDay);
    const weekNumber = Math.ceil(dayOfYear / 7);
  
    return weekNumber;
}
  
export function getCurrentWeekNumber() {
    return getWeekNumber(new Date());
}
  
export function getDateOfWeek(w, y) {
    // if y is not passed, use current year
    y = y ?? new Date().getFullYear();
  
    var simple = new Date(y, 0, 1 + (w - 1) * 7, 24);
    var dow = simple.getDay();
    var isoWeekStart = simple;
    if (dow <= 4) isoWeekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else isoWeekStart.setDate(simple.getDate() + 8 - simple.getDay());
  
    // fix ohio time
    isoWeekStart = dateToIsoDate(isoWeekStart);
    //isoWeekStart.setTime(isoWeekStart.getTime() + 1000 * 60 * 60 * 24);
    return isoWeekStart;
}
  
function dateToStandardString(date) {
    if(!date)return undefined;
    let offset = date.getTimezoneOffset()
    date = new Date(date.getTime() - (offset*60*1000))
    return date.toISOString().split('T')[0];
}

function convertDateFormat(date) {
    return date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear();
}

function dateToIsoDate(date) {
    let offset = date.getTimezoneOffset()
    return new Date(date.getTime() - (offset*60*1000))
}

function getCurrentStartDate() {
    let date = new Date();
    date.setDate(date.getDate() - (date.getDay() || 7) + 1)
    return date;
}

function getNextWeekStartDate() {
    let date = getCurrentStartDate();
    date.setDate(date.getDate() + 7);
    return date;
}

export {dateToStandardString,dateToIsoDate,getCurrentStartDate, getNextWeekStartDate, convertDateFormat};
