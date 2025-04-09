import express, { Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/conn";

export const klubberRouter: Router = express.Router();

// Hent alle klubber eller søk etter en klubb
// @ts-ignore
klubberRouter.get("/", async (req: Request, res: Response) => {
    try {
        if (!collections.klubber) return res.status(500).send("Database collection not initialized");

        const searchQuery = req.query.q as string;
        let filter = {};

        if (searchQuery) {
            filter = { navn: { $regex: searchQuery, $options: "i" } };
        }

        const klubber = await collections.klubber.find(filter).toArray();
        res.status(200).json(klubber);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// ✅ Opprett en ny klubb og legg til som følger
// @ts-ignore
klubberRouter.post("/", async (req: Request, res: Response) => {
    try {
        if (!collections.klubber || !collections.profiler) {
            return res.status(500).send("Database collection not initialized");
        }

        const { brukerId, navn, beskrivelse, farge } = req.body;

        if (!brukerId || !navn || !beskrivelse || !farge) {
            return res.status(400).send("Mangler brukerId, navn, beskrivelse eller farge");
        }

        const brukerObjectId = new ObjectId(brukerId);

        const nyKlubb = {
            admin: brukerObjectId,
            navn,
            beskrivelse,
            følgere: [brukerObjectId], // 👈 automatisk følger
            farge,
            opprettet: new Date(),
        };

        const insertResult = await collections.klubber.insertOne(nyKlubb);
        const klubbId = insertResult.insertedId;

        await collections.profiler.updateOne(
            { _id: brukerObjectId },
            { $addToSet: { følgerKlubber: klubbId } }
        );

        const klubber = await collections.klubber.find({}).toArray();
        res.status(200).json(klubber);
    } catch (error: any) {
        console.error("❌ Feil ved oppretting av klubb:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Følg en klubb
// @ts-ignore
klubberRouter.post("/folg", async (req: Request, res: Response) => {
    try {
        const { brukerId, klubbId } = req.body;
        console.log("📥 Følg forespørsel mottatt:", { brukerId, klubbId });

        if (!brukerId || !klubbId) return res.status(400).send("Mangler brukerId eller klubbId");
        if (!ObjectId.isValid(brukerId) || !ObjectId.isValid(klubbId)) {
            return res.status(400).send("Ugyldig ID-format");
        }

        const brukerObjectId = new ObjectId(brukerId);
        const klubbObjectId = new ObjectId(klubbId);

        const klubb = await collections.klubber?.findOne({ _id: klubbObjectId });
        const bruker = await collections.profiler?.findOne({ _id: brukerObjectId });

        if (!klubb) return res.status(404).send("Klubb ikke funnet");
        if (!bruker) return res.status(404).send("Bruker ikke funnet");

        console.log("➡️ Oppdaterer klubbens følgere...");
        const klubbUpdate = await collections.klubber?.updateOne(
            { _id: klubbObjectId },
            { $addToSet: { følgere: brukerObjectId } }
        );
        console.log("📦 klubbUpdate:", klubbUpdate);

        console.log("➡️ Oppdaterer brukerens følgerKlubber...");
        const brukerUpdate = await collections.profiler?.updateOne(
            { _id: brukerObjectId },
            { $addToSet: { følgerKlubber: klubbObjectId } }
        );
        console.log("📦 brukerUpdate:", brukerUpdate);

        if (klubbUpdate?.modifiedCount === 0 && brukerUpdate?.modifiedCount === 0) {
            return res.status(500).send("Ingen dokumenter ble oppdatert");
        }

        console.log(`✅ ${brukerId} følger nå ${klubbId}`);
        res.status(200).send("✅ Nå følger du klubben");
    } catch (error: any) {
        console.error("❌ Feil i /folg:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Slutt å følge
// Slutt å følge en klubb
// @ts-ignore
klubberRouter.post("/sluttfolg", async (req: Request, res: Response) => {
    try {
        const { brukerId, klubbId } = req.body;

        if (!ObjectId.isValid(brukerId) || !ObjectId.isValid(klubbId)) {
            return res.status(400).send("Ugyldig ID-format");
        }

        const brukerObjectId = new ObjectId(brukerId);
        const klubbObjectId = new ObjectId(klubbId);

        await collections.klubber?.updateOne(
            { _id: klubbObjectId },
            { $pull: { følgere: brukerObjectId } as any }
        );

        await collections.profiler?.updateOne(
            { _id: brukerObjectId },
            { $pull: { følgerKlubber: klubbObjectId } as any }
        );

        const klubb = await collections.klubber?.findOne({ _id: klubbObjectId });
        console.log("📦 Klubb etter unfollow:", klubb);

        const følgere = Array.isArray(klubb?.følgere) ? klubb.følgere : [];
        if (følgere.length === 0) {
            const slettRes = await collections.klubber?.deleteOne({ _id: klubbObjectId });
            console.log("🗑️ Klubb slettet? =>", slettRes?.deletedCount === 1);
        }

        res.status(200).send("🚫 Du følger ikke lenger klubben");
    } catch (error: any) {
        console.error("❌ Feil i /sluttfolg:", error.message);
        res.status(500).json({ error: error.message });
    }
    // burde overføre admin posisjon til neste i reken
});

