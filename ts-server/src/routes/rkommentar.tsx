import express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/conn";
import MKommentar from "../models/mKommentar";

export const kommentarRouter = express.Router();

// Opprett en ny kommentar
// @ts-ignore
kommentarRouter.post("/", async (req, res) => {
    try {
        if (!collections.kommentar) {
            return res.status(500).send("Database collection not initialized");
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
// @ts-ignore
kommentarRouter.get("/post/:postId", async (req, res) => {
    try {
        if (!collections.kommentar) {
            return res.status(500).send("Database collection not initialized");
        }

        const postId = new ObjectId(req.params.postId);
        const kommentarer = await collections.kommentar.find({ postId }).toArray();
        res.status(200).json(kommentarer);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

// Like/unlike en kommentar
// @ts-ignore
kommentarRouter.patch("/:id/like", async (req, res) => {
    try {
        if (!collections.kommentar) {
            return res.status(500).send("Database collection not initialized");
        }

        const kommentarId = new ObjectId(req.params.id);
        const brukerId = new ObjectId(req.body.brukerId);

        const kommentar = await collections.kommentar.findOne({ _id: kommentarId });
        if (!kommentar) {
            return res.status(404).json({ error: "Kommentar ikke funnet" });
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
        console.error("❌ Feil ved like/unlike kommentar:", error.message);
        res.status(500).json({ error: error.message });
    }
});
