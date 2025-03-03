// External dependencies
import { MongoClient, Db, Collection } from "mongodb";
import * as dotenv from "dotenv";
// Global variables

export const collections: {klubb?: Collection} = {};

// Initialize connection
async function connectToDb () {
    const connectionString = process.env.ATLAS_URI || "";
    const client: MongoClient = new MongoClient(connectionString);
    await client.connect();

    const db: Db = client.db("StudentLink");
    const collection: Collection = db.collection("Klubber");

    collections.klubb = collection;
}
export default connectToDb;

