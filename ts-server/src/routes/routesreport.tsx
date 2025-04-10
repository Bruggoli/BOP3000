import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/conn";
import ModelsReport from "../models/modelsReport";

export const reportRouter = express.Router();

// Opprett en ny rapport
// @ts-ignore
reportRouter.post("/", async (req: Request, res: Response) => {
    try {
        if (!collections.reports) {
            return res.status(500).send("Database collection not initialized");
        }

        const { postId, reportedBy, reason } = req.body;

        const nyRapport: ModelsReport = {
            postId: new ObjectId(postId),
            reportedBy: new ObjectId(reportedBy),
            reason,
            opprettet: new Date(),
        };

        const resultat = await collections.reports.insertOne(nyRapport);
        res.status(201).json({ message: "Rapport lagret!", id: resultat.insertedId });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Hent alle rapporter
// @ts-ignore
reportRouter.get("/", async (_req: Request, res: Response) => {
    try {
        if (!collections.reports) {
            return res.status(500).send("Database collection not initialized");
        }

        const rapporter = await collections.reports.find({}).toArray();
        res.status(200).json(rapporter);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});
