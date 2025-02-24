import { ObjectId } from "mongodb";

export default class Klubb{
    constructor(
        public navn: String,
        public beskrivelse: String,
        public admin: String,
        public medlemmer: String[],
        public id?: ObjectId
    ) {}
    
}
