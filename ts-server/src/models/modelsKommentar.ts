import { ObjectId } from "mongodb";

export default interface ModelsKommentar {
    _id?: ObjectId;
    postId: ObjectId;
    brukerId: ObjectId;
    tekst: string;
    opprettet: Date;
}
