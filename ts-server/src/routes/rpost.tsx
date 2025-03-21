import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/conn";
import MPost from "../models/mPost";

export const postRouter = express.Router();

// Opprett et nytt innlegg og returner alle oppdaterte innlegg
// @ts-ignore
postRouter.post("/", async (req: Request, res: Response) => {
    try {
        if (!collections.poster) {
            console.error("❌ Database collection er ikke initialisert.");
            return res.status(500).send("Database collection not initialized");
        }

        console.log("📩 Mottatt post:", req.body);

        const nyttPost: MPost = {
            ...req.body,
            brukerId: req.body.brukerId, // ✅ Nå en string, ikke ObjectId
            opprettet: new Date(),
            likes: [],
            kommentarer: [],
        };

        const result = await collections.poster.insertOne(nyttPost);
        console.log("✅ Post opprettet med ID:", result.insertedId);

        const poster = await collections.poster.find({}).toArray();
        res.status(200).json(poster);
    } catch (error: any) {
        console.error("❌ Feil ved oppretting av post:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Hent alle innlegg
// @ts-ignore
postRouter.get("/", async (_req: Request, res: Response) => {
    try {
        if (!collections.poster) {
            return res.status(500).send("Database collection not initialized");
        }

        const poster = await collections.poster.find({}).toArray();
        res.status(200).json(poster);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Hent et spesifikt innlegg basert på ID
// @ts-ignore
postRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        if (!collections.poster) {
            return res.status(500).send("Database collection not initialized");
        }

        const post = await collections.poster.findOne({ _id: new ObjectId(req.params.id) });

        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).send("Post ikke funnet");
        }
    } catch (error) {
        res.status(400).send("Ugyldig ID-format");
    }
});
