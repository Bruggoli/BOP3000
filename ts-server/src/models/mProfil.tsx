import { ObjectId } from "mongodb";

export default interface MProfil {
    _id?: ObjectId;
    brukernavn: string;
    email: string;
    passord: string; // Må hashes før lagring
    icon?: string;
    medlemskap?: { klubbId: ObjectId; rolle: "Admin" | "Moderator" | "Medlem" }[]; // Liste over klubber brukeren er med i
}
