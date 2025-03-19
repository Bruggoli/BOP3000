import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/conn";

export const klubberRouter = express.Router();

// Hent alle klubber
// @ts-ignore
klubberRouter.get("/", async (req: Request, res: Response) => {
    try {
        if (!collections.klubber) {
            return res.status(500).send("Database collection not initialized");
        }
        const klubber = await collections.klubber.find({}).toArray();
        res.status(200).json(klubber);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Opprett en ny klubb
// @ts-ignore
klubberRouter.post("/", async (req: Request, res: Response) => {
    try {
        if (!collections.klubber || !collections.profiler) {
            return res.status(500).send("Database collection not initialized");
        }

        const { navn, beskrivelse, brukerId } = req.body;

        if (!brukerId || !navn || !beskrivelse) {
            return res.status(400).send("Mangler brukerId, navn eller beskrivelse");
        }

        const brukerObjectId = new ObjectId(brukerId);

        // Sjekk om brukeren finnes
        const bruker = await collections.profiler.findOne({ _id: brukerObjectId });
        if (!bruker) {
            return res.status(404).send("Bruker ikke funnet");
        }

        // Opprett ny klubb med brukeren som admin
        const nyKlubb = {
            navn,
            beskrivelse,
            admin: brukerObjectId,
            medlemmer: [{ brukerId: brukerObjectId, rolle: "Admin" }]
        };

        const resultat = await collections.klubber.insertOne(nyKlubb);
        const klubbId = resultat.insertedId;

        // Legg til klubben i brukerens medlemskap
        await collections.profiler.updateOne(
            { _id: brukerObjectId },
            { $push: { medlemskap: { klubbId, rolle: "Admin" } } as any}
        );

        res.status(201).json({ message: "Klubb opprettet!", id: klubbId });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});


// Bli med i en klubb
// @ts-ignore
klubberRouter.post("/join", async (req: Request, res: Response) => {
    try {
        if (!collections.klubber || !collections.profiler) {
            return res.status(500).send("Database collection not initialized");
        }

        const { brukerId, klubbId } = req.body;

        if (!brukerId || !klubbId) {
            return res.status(400).send("Mangler brukerId eller klubbId");
        }

        const klubbObjectId = new ObjectId(klubbId);
        const brukerObjectId = new ObjectId(brukerId);

        // Finn klubben
        const klubb = await collections.klubber.findOne({ _id: klubbObjectId });
        if (!klubb) {
            return res.status(404).send("Klubb ikke funnet");
        }

        // Sjekk om brukeren allerede er medlem
        const alleredeMedlem = klubb.medlemmer.some((m: any) => m.brukerId.equals(brukerObjectId));
        if (alleredeMedlem) {
            return res.status(400).send("Bruker er allerede medlem av klubben");
        }

        // Legg til brukeren i klubbens medlemsliste
        await collections.klubber.updateOne(
            { _id: klubbObjectId },
            { $push: { medlemmer: { brukerId: brukerObjectId, rolle: "Medlem" } } as any }
        );

        // Legg til klubben i brukerens medlemskap
        await collections.profiler.updateOne(
            { _id: brukerObjectId },
            { $push: { medlemskap: { klubbId: klubbObjectId, rolle: "Medlem" } } as any }
        );

        res.status(200).send("✅ Bruker har blitt med i klubben!");
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});