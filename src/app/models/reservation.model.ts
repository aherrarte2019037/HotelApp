export interface Reservation {
    _id          : string;
    user         : string;
    entryDateTime: Date;
    exitDateTime : Date;
    services     : any[]
}