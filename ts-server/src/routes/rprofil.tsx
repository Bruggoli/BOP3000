import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/conn";
import MProfil from "../models/mProfil";

export const profilRouter = express.Router();

// Opprett en ny profil
// @ts-ignore
profilRouter.post("/", async (req: Request, res: Response) => {
    try {
        if (!collections.profiler) {
            return res.status(500).send("Database collection not initialized");
        }

        const nyProfil: MProfil = req.body;
        const resultat = await collections.profiler.insertOne(nyProfil);

        res.status(201).json({ message: "Profil opprettet!", id: resultat.insertedId });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Hent alle profiler
// @ts-ignore
profilRouter.get("/", async (_req: Request, res: Response) => {
    try {
        if (!collections.profiler) {
            return res.status(500).send("Database collection not initialized");
        }

        const profiler = await collections.profiler.find({}).toArray();
        res.status(200).json(profiler);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

// Hent en spesifikk profil basert på ID
// @ts-ignore
profilRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        if (!collections.profiler) {
            return res.status(500).send("Database collection ikke tilgjengelig");
        }

        const id = new ObjectId(req.params.id);
        const profil = await collections.profiler.findOne({ _id: id });

        if (!profil) {
            return res.status(404).send("Profil ikke funnet");
        }

        res.status(200).json(profil);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send("Ugyldig ID-format");
        } else {
            res.status(500).send("Ukjent feil");
        }
    }
});

// Oppdater profilens ikon
// @ts-ignore
profilRouter.patch("/:id", async (req: Request, res: Response) => {
    try {
        if (!collections.profiler) {
            return res.status(500).send("Database collection not initialized");
        }

        const id = new ObjectId(req.params.id);
        const { icon } = req.body;

        const result = await collections.profiler.updateOne(
            { _id: id },
            { $set: { icon } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send("Profil ikke oppdatert");
        }

        res.status(200).json({ message: "Profil oppdatert" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});
