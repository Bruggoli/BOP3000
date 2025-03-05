import { ObjectId } from "mongodb";

export interface Klubb {
    _id?: ObjectId;
    navn: string;
    beskrivelse: string;
    admin: string;
    medlemmer: string[];
}

