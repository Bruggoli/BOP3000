import { ObjectId } from "mongodb";

export default interface Klubb {
    _id?: ObjectId;
    navn: string;
    beskrivelse: string;
    admin: ObjectId;
    følgere: ObjectId[];
    farge: string; // 👈 NY!
}

