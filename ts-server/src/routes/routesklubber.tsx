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
        if (!collections.klubber || !collections.profiler) {
            return res.status(500).send("Database collections not initialized");
        }

        const { brukerId, navn, beskrivelse } = req.body;
        if (!brukerId || !navn || !beskrivelse) {
            return res.status(400).send("Mangler brukerId, navn eller beskrivelse");
        }

        const brukerObjectId = new ObjectId(brukerId);

        const nyKlubb = {
            brukerId,
            navn,
            beskrivelse,
            opprettet: new Date(),
            følgere: [brukerObjectId], // ✅ første følger
        };

        // Sett inn klubben i databasen
        const resultat = await collections.klubber.insertOne(nyKlubb);
        const klubbId = resultat.insertedId;

        // Legg til klubben i brukerens følgerKlubber
        await collections.profiler.updateOne(
            { _id: brukerObjectId },
            { $addToSet: { følgerKlubber: klubbId } }
        );

        console.log(`✅ Klubb '${navn}' opprettet av ${brukerId} og lagt til som følger`);

        const klubber = await collections.klubber.find({}).toArray();
        res.status(201).json(klubber);
    } catch (error: any) {
        console.error("❌ Feil ved oppretting av klubb:", error.message);
        res.status(500).json({ error: error.message });
    }
});


// Følg en klubb
// @ts-ignore
klubberRouter.post("/folg", async (req, res) => {

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

        // 🔎 Logg før oppdatering
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

        // 🔐 Sjekk for modifiedCount
        if (klubbUpdate?.modifiedCount === 0 && brukerUpdate?.modifiedCount === 0) {
            return res.status(500).send("Ingen dokumenter ble oppdatert");
        }

        console.log(`✅ ${brukerId} følger nå ${klubbId}`);
        res.status(200).send("✅ Nå følger du klubben");
    } catch (error: any) {
        console.error("❌ Feil i /følg:", error.message);
        res.status(500).json({ error: error.message });
    }
});



// Slutt å følge
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
            { $pull: { følgere: brukerObjectId } as any}
        );

        await collections.profiler?.updateOne(
            { _id: brukerObjectId },
            { $pull: { følgerKlubber: klubbObjectId } as any}
        );

        res.status(200).send("🚫 Du følger ikke lenger klubben");
    } catch (error: any) {
        console.error("❌ Feil i /sluttfolg:", error.message);
        res.status(500).json({ error: error.message });
    }

// Sjekk om klubben har noen følgere igjen – hvis ikke, slett den
    // @ts-ignore
    const oppdatertKlubb = await collections.klubber?.findOne({ _id: klubbObjectId });
    if (!oppdatertKlubb?.følgere || oppdatertKlubb.følgere.length === 0) {
        // @ts-ignore
        await collections.klubber?.deleteOne({ _id: klubbObjectId });
        console.log("🗑️ Klubben ble slettet fordi den ikke hadde noen følgere igjen");
    }


});

