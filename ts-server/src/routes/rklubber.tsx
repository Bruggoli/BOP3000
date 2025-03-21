import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/conn";

export const klubberRouter = express.Router();

// Hent alle klubber eller søk etter en klubb
// @ts-ignore
klubberRouter.get("/", async (req: Request, res: Response) => {
    try {
        if (!collections.klubber) {
            return res.status(500).send("Database collection not initialized");
        }

        const searchQuery = req.query.q as string; // Henter søketeksten fra frontend
        let filter = {};

        if (searchQuery) {
            filter = { navn: { $regex: searchQuery, $options: "i" } }; // Case-insensitiv søk
        }

        const klubber = await collections.klubber.find(filter).toArray();
        res.status(200).json(klubber);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});


// Opprett en ny klubb
// @ts-ignore
klubberRouter.post("/", async (req: Request, res: Response) => {
    try {
        if (!collections.klubber) {
            return res.status(500).send("Database collection not initialized");
        }

        const { brukerId, navn, beskrivelse } = req.body;
        if (!brukerId || !navn || !beskrivelse) {
            return res.status(400).send("Mangler brukerId, navn eller beskrivelse");
        }

        const nyKlubb = {
            brukerId,
            navn,
            beskrivelse,
            opprettet: new Date(),
        };

        await collections.klubber.insertOne(nyKlubb);
        const klubber = await collections.klubber.find({}).toArray();
        res.status(200).json(klubber);
    } catch (error: any) {
        console.error("❌ Feil ved oppretting av klubb:", error.message);
        res.status(500).json({ error: error.message });
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