import moment from 'moment'

export const contains = (evts, date) => {
    return evts.find(e => sameDate(e.start, date)) != null;
}

export const getByDate = (evts, date) => {
    return evts.find(e => sameDate(e.start, date));
}

export const sameDate = (d1, d2) => {
    if (d1.diff == undefined) {
        d1 = moment(d1)
    }
    // UTC to LocalDate
    if (typeof (d2) == 'string') d2 = new Date(d2)
    return d1.diff(d2, "days") == 0;
}

export const remove = (evts, date) => {
    evts.splice(evts.findIndex(e => sameDate(e.start, date)), 1);
    return evts;
}