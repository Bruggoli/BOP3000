import express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/conn";
import ModelsPost from "../models/modelsPost";

export const postRouter = express.Router();

// Opprett et nytt innlegg
postRouter.post("/", async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        if (!collections.poster) {
            res.status(500).send("Database collection not initialized");
            return;
        }

        const nyttPost: ModelsPost = {
            ...req.body,
            brukerId: new ObjectId(req.body.brukerId),
            opprettet: new Date(),
            likes: [],
            kommentarer: [],
        };

        const result = await collections.poster.insertOne(nyttPost);
        res.status(201).json({ message: "Post opprettet", id: result.insertedId });
    } catch (error: any) {
        console.error("Feil ved oppretting av post:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Hent alle innlegg
postRouter.get("/", async (_req: express.Request, res: express.Response): Promise<void> => {
    try {
        if (!collections.poster) {
            res.status(500).send("Database collection not initialized");
            return;
        }

        const poster = await collections.poster.find({}).toArray();
        res.status(200).json(poster);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Hent ett spesifikt innlegg
postRouter.get("/:id", async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        if (!collections.poster) {
            res.status(500).send("Database collection not initialized");
            return;
        }

        const post = await collections.poster.findOne({ _id: new ObjectId(req.params.id) });

        if (!post) {
            res.status(404).json({ error: "Innlegg ikke funnet" });
            return;
        }

        res.status(200).json(post);
    } catch (error: any) {
        res.status(400).json({ error: "Ugyldig ID-format" });
    }
});

// Like/unlike et innlegg
postRouter.patch("/:id/like", async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        if (!collections.poster) {
            res.status(500).send("Database collection not initialized");
            return;
        }

        const postId = new ObjectId(req.params.id);
        const brukerId = new ObjectId(req.body.brukerId);

        const post = await collections.poster.findOne({ _id: postId });
        if (!post) {
            res.status(404).json({ error: "Post ikke funnet" });
            return;
        }

        // 🔧 Sammenlign som string for å unngå .equals-feil
        const harLikt = (post.likes || []).some((id: any) => id.toString() === brukerId.toString());

        if (harLikt) {
            await collections.poster.updateOne(
                { _id: postId },
                { $pull: { likes: brukerId as any } }
            );
        } else {
            await collections.poster.updateOne(
                { _id: postId },
                { $addToSet: { likes: brukerId } }
            );
        }

        res.status(200).json({ message: harLikt ? "Unliket" : "Liket" });
    } catch (error: any) {
        console.error("Feil ved like/unlike:", error.message);
        res.status(500).json({ error: error.message });
    }
});