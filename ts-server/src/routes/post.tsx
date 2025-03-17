import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/conn";
import Post from "../models/Post";

export const postRouter = express.Router();

// Opprett et nytt innlegg
// @ts-ignore
postRouter.post("/", async (req: Request, res: Response) => {
    try {
        if (!collections.poster) {
            return res.status(500).send("Database collection not initialized");
        }

        const nyttPost: Post = {
            ...req.body,
            brukerId: new ObjectId(req.body.brukerId), // Konverter brukerId til ObjectId
            opprettet: new Date(),
            likes: [],
            kommentarer: [],
        };

        const resultat = await collections.poster.insertOne(nyttPost);

        res.status(201).json({ message: "Post opprettet!", id: resultat.insertedId });
    } catch (error: any) {
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
        res.status(500).send(error.message);
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
