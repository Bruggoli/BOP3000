import { ObjectId } from "mongodb";

export default interface MProfil {
    _id?: ObjectId;
    fNavn: string;
    eNavn: string;
    email: string;
    passord: string;
    icon?: string;
    følgerKlubber?: ObjectId[]; // 🔄 Nytt navn/felt
}

