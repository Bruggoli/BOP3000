import { ObjectId } from "mongodb";

export default interface Kommentar {
    _id?: ObjectId;
    postId: ObjectId;
    brukerId: ObjectId;
    tekst: string;
    opprettet: Date;
}
