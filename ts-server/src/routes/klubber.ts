import express, { Request, Response } from "express";
import { collections } from "../services/conn";

export const klubberRouter = express.Router();

// Hent alle klubber
// @ts-ignore
klubberRouter.get("/", async (_req: Request, res: Response) => {
    try {
        if (!collections.klubber) {
            return res.status(500).send("Database collection not initialized");
        }

        const klubber = await collections.klubber.find({}).toArray();
        res.status(200).json(klubber);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});
