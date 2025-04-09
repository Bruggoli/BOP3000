import { ObjectId } from "mongodb";

export default interface ModelsProfil {
    _id?: ObjectId;
    brukernavn: string;
    email: string;
    passord: string;
    icon?: string;
    verified?: boolean;
    verifyToken?: string;
    medlemskap?: { klubbId: ObjectId; rolle: "Admin" | "Moderator" | "Medlem" }[]; // Liste over klubber brukeren er med i
    følgerKlubber?: ObjectId[];
}

