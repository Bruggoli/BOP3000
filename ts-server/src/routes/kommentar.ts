import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/conn";
import Kommentar from "../models/Kommentar";

export const kommentarRouter = express.Router();

// Opprett en ny kommentar
// @ts-ignore
kommentarRouter.post("/", async (req: Request, res: Response) => {
    try {
        if (!collections.kommentarer) {
            return res.status(500).send("Database collection not initialized");
        }

        const nyKommentar: Kommentar = {
            ...req.body,
            postId: new ObjectId(req.body.postId), // Konverter postId til ObjectId
            brukerId: new ObjectId(req.body.brukerId), // Konverter brukerId til ObjectId
            opprettet: new Date(),
        };

        const resultat = await collections.kommentarer.insertOne(nyKommentar);

        res.status(201).json({ message: "Kommentar opprettet!", id: resultat.insertedId });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Hent alle kommentarer for et innlegg
// @ts-ignore
kommentarRouter.get("/post/:postId", async (req: Request, res: Response) => {
    try {
        if (!collections.kommentarer) {
            return res.status(500).send("Database collection not initialized");
        }

        const postId = new ObjectId(req.params.postId);
        const kommentarer = await collections.kommentarer.find({ postId }).toArray();

        res.status(200).json(kommentarer);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

// Hent en spesifikk kommentar basert på ID
// @ts-ignore
kommentarRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        if (!collections.kommentarer) {
            return res.status(500).send("Database collection not initialized");
        }

        const kommentar = await collections.kommentarer.findOne({ _id: new ObjectId(req.params.id) });

        if (kommentar) {
            res.status(200).json(kommentar);
        } else {
            res.status(404).send("Kommentar ikke funnet");
        }
    } catch (error) {
        res.status(400).send("Ugyldig ID-format");
    }
});
