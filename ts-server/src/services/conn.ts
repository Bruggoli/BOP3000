import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoURI: string = process.env.MONGO_URI | "";
const client = new MongoClient(mongoURI);

export const collections: { klubber?: Collection; profiler?: Collection; poster?: Collection; kommentar?: Collection; reports?: Collection } = {};

export const connectToDb = async () => {
    try {
        await client.connect();
        console.log("MongoDB tilkoblet!");

        const db: Db = client.db("StudentLink"); // ADRIAN! sjekk om det er riktig database
        collections.klubber = db.collection("Klubber");
        collections.profiler = db.collection("Profil");
        collections.poster = db.collection("Post");
        collections.kommentar = db.collection("Kommentar");
        collections.reports = db.collection("Reports");


        console.log("Collection er satt opp!");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

export default connectToDb;
