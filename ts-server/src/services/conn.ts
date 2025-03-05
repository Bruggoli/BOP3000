import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI || "mongodb+srv://dbAdmin:12345@cluster0.1e71y.mongodb.net/";
const client = new MongoClient(mongoURI);

export const collections: { klubber?: Collection; profiler?: Collection; poster?: Collection; kommentarer?: Collection } = {};

export const connectToDb = async () => {
    try {
        await client.connect();
        console.log("MongoDB tilkoblet!");

        const db: Db = client.db("StudentLink"); // ADRIAN! sjekk om det er riktig database
        collections.klubber = db.collection("Klubber");
        collections.profiler = db.collection("Profil");
        collections.poster = db.collection("Post");
        collections.kommentarer = db.collection("Kommentar");

        console.log("Collection er satt opp!");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

export default connectToDb;
