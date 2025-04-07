import { ObjectId } from "mongodb";

export default interface MReport {
    _id?: ObjectId;
    postId: ObjectId;
    reportedBy: ObjectId;
    reason: string;
    opprettet: Date;
}
