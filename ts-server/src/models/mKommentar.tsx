import { ObjectId } from "mongodb";

export default interface MKommentar {
    _id?: ObjectId;
    postId: ObjectId;
    brukerId: ObjectId;
    tekst: string;
    opprettet: Date;
}
