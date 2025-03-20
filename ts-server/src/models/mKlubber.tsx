import { ObjectId } from "mongodb";

export interface Klubb {
    _id?: ObjectId;
    navn: string;
    beskrivelse: string;
    admin: ObjectId; // Admin er en referanse til bruker-ID
    medlemmer: { brukerId: ObjectId; rolle: "Admin" | "Moderator" | "Medlem" }[];
}
