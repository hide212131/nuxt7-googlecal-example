import moment from 'moment'
export const contains = (evts, date) => {
    return evts.find(e => isSame(e.start, date)) != null;
}

export const getByDate = (evts, date) => {
    return evts.find(e => isSame(e.start, date));
}
 
export const isSame = (d1, d2) => {
    // UTC to LocalDate
    if (typeof(d2) == 'string') d2 = new Date(d2)
    return d1.diff(d2, "days") == 0;
}
  