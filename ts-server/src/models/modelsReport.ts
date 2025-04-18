import { ObjectId } from "mongodb";

export default interface ModelsReport {
    _id?: ObjectId;
    postId: ObjectId;
    reportedBy: ObjectId;
    reason: string;
    opprettet: Date;
}
