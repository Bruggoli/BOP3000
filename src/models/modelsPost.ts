import { ObjectId } from "mongodb";

export default interface ModelsPost {
    _id?: ObjectId;
    brukerId: ObjectId; //
    tittel: string;
    innhold: string;
    likes?: ObjectId[]; // folk som har likt posten
    kommentarer?: { brukerId: ObjectId; tekst: string; opprettet: Date }[];
    opprettet: Date;
}
