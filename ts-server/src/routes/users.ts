// External dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/conn";
import klubb from "../models/klubber";

// Global config
export const klubberRouter = express.Router();

klubberRouter.use(express.json());

// GET
klubberRouter.get("/", async (_req: Request, res: Response) => {
    try {
        // @ts-ignore
        const klubber = (await collections.klubb.find({}).toArray()) as unknown as klubb[];

        res.status(200).send(klubber);
    } catch (error: any | undefined) {
        res.status(500).send(error.message);

    }
});

klubberRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {

        const query = {_id: new ObjectId(id) };
        // @ts-ignore
        const game = (await collections.klubb.findOne(query)) as unknown as klubb;

        if (klubb) {
            res.status(200).send(klubb);
        }
    } catch (error) {
        res.status(404).send(`Unable to find id: ${req.params.id}`);
    }
})
// POST
// PUT
// DELETE
