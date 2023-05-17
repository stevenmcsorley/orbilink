

export class DateHelper{
    dateToJday(date: Date){
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const hour = date.getUTCHours();
        const minute = date.getUTCMinutes();
        const second = date.getUTCSeconds();

        const M = month <= 2 ? -1 : 0;
        const A = Math.floor(year / 100);
        const B = 2 - A + Math.floor(A / 4);

        const jd = Math.floor(365.25 * (year + 4716)) +
            Math.floor(30.6001 * (month + 1 + M * 12)) +
            day +
            B -
            1524.5 +
            hour / 24 +
            minute / (24 * 60) +
            second / (24 * 60 * 60);

        return jd;
    };
}
