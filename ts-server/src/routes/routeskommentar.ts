import express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/conn";
import MKommentar from "../models/modelsKommentar";

export const kommentarRouter = express.Router();

// Opprett en ny kommentar
kommentarRouter.post("/", async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        if (!collections.kommentar) {
            res.status(500).send("Database collection not initialized");
            return;
        }

        const nyKommentar: MKommentar = {
            ...req.body,
            postId: new ObjectId(req.body.postId),
            brukerId: new ObjectId(req.body.brukerId),
            opprettet: new Date(),
            likes: [],
        };

        const resultat = await collections.kommentar.insertOne(nyKommentar);
        res.status(201).json({ message: "Kommentar opprettet!", id: resultat.insertedId });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Hent alle kommentarer for et innlegg
kommentarRouter.get("/post/:postId", async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        if (!collections.kommentar) {
            res.status(500).send("Database collection not initialized");
            return;
        }

        const postId = new ObjectId(req.params.postId);
        const kommentarer = await collections.kommentar.find({ postId }).toArray();
        res.status(200).json(kommentarer);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

// Like/unlike en kommentar
kommentarRouter.patch("/:id/like", async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        if (!collections.kommentar) {
            res.status(500).send("Database collection not initialized");
            return;
        }

        const kommentarId = new ObjectId(req.params.id);
        const brukerId = new ObjectId(req.body.brukerId);

        const kommentar = await collections.kommentar.findOne({ _id: kommentarId });
        if (!kommentar) {
            res.status(404).json({ error: "Kommentar ikke funnet" });
            return;
        }

        const harLikt = (kommentar.likes || []).some((id: any) => id.toString() === brukerId.toString());

        if (harLikt) {
            await collections.kommentar.updateOne(
                { _id: kommentarId },
                { $pull: { likes: brukerId as any } }
            );
        } else {
            await collections.kommentar.updateOne(
                { _id: kommentarId },
                { $addToSet: { likes: brukerId } }
            );
        }

        res.status(200).json({ message: harLikt ? "Unliket" : "Liket" });
    } catch (error: any) {
        console.error("Feil ved like/unlike kommentar:", error.message);
        res.status(500).json({ error: error.message });
    }
});
