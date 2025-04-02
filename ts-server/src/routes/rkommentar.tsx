import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/conn";
import MKommentar from "../models/mKommentar";

export const kommentarRouter = express.Router();

// Opprett en ny kommentar
// @ts-ignore
kommentarRouter.post("/", async (req: Request, res: Response) => {
    try {
        if (!collections.kommentar) {
            return res.status(500).send("Database collection not initialized");
        }

        const nyKommentar: MKommentar = {
            ...req.body,
            postId: new ObjectId(req.body.postId), // Konverter postId til ObjectId
            brukerId: new ObjectId(req.body.brukerId), // Konverter brukerId til ObjectId
            opprettet: new Date(),
            likes: [], // Initier tom like-liste
        };

        const resultat = await collections.kommentar.insertOne(nyKommentar);

        res.status(201).json({ message: "Kommentar opprettet!", id: resultat.insertedId });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Hent alle kommentarer for et innlegg
// @ts-ignore
kommentarRouter.get("/post/:postId", async (req: Request, res: Response) => {
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

// Hent en spesifikk kommentar basert på ID
// @ts-ignore
kommentarRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        if (!collections.kommentar) {
            return res.status(500).send("Database collection not initialized");
        }

        const kommentar = await collections.kommentar.findOne({ _id: new ObjectId(req.params.id) });

        if (kommentar) {
            res.status(200).json(kommentar);
        } else {
            res.status(404).send("Kommentar ikke funnet");
        }
    } catch (error) {
        res.status(400).send("Ugyldig ID-format");
    }
});

// Like/unlike en kommentar
// @ts-ignore
kommentarRouter.patch("/:id/like", async (req: Request, res: Response) => {
    try {
        if (!collections.kommentar) {
            return res.status(500).send("Database collection not initialized");
        }

        const kommentarId = new ObjectId(req.params.id);
        const { brukerId } = req.body;

        if (!brukerId) {
            return res.status(400).json({ error: "Mangler brukerId" });
        }

        const kommentar = await collections.kommentar.findOne({ _id: kommentarId });
        if (!kommentar) {
            return res.status(404).json({ error: "Kommentar ikke funnet" });
        }

        const harLikt = kommentar.likes?.includes(brukerId);

        if (harLikt) {
            await collections.kommentar.updateOne(
                { _id: kommentarId },
                { $pull: { likes: brukerId } }
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
