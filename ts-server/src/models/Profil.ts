import { ObjectId } from "mongodb";

export default interface Profil {
    _id?: ObjectId;
    fNavn: string;
    eNavn: string;
    email: string;
    passord: string; // Må hashes før lagring
    icon?: string;
    medlemskap?: { klubbId: ObjectId; rolle: string }[]; // Liste over klubber brukeren er med i
}
