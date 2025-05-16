import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/conn";
import MReport from "../models/modelsReport";
import nodemailer from "nodemailer";

export const reportRouter = express.Router();

// Opprett en ny rapport
reportRouter.post("/", async (req: Request, res: Response): Promise<void> => {
    try {
        if (!collections.reports) {
            res.status(500).send("Database collection not initialized");
            return;
        }

        const {
            postId,
            reportedBy,
            reason,
            postTitle,
            postText,
            reporterEmail
        } = req.body;

        const nyRapport: MReport = {
            postId: new ObjectId(postId),
            reportedBy: new ObjectId(reportedBy),
            reason,
            opprettet: new Date(),
        };

        const resultat = await collections.reports.insertOne(nyRapport);

        // 👉 Send e-post til admin
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            secure: true,
        });

        const mailOptions = {
            from: '"StudentLink" <${process.env.EMAIL_USER}>',   // trygg avsender
            to: process.env.EMAIL_USER,                          // mottaker (prosjektmail)
            replyTo: reporterEmail || process.env.EMAIL_USER,    // svar går til brukeren
            subject: "Ny rapport fra bruker",
            html: `
        <h2>Ny rapport</h2>
        <p><strong>Fra:</strong> ${reporterEmail || "Ukjent e-post"}</p>
        <p><strong>Årsak:</strong> ${reason}</p>
        <p><strong>Tittel:</strong> ${postTitle}</p>
        <p><strong>Innhold:</strong> ${postText}</p>
        <p><strong>Post-ID:</strong> ${postId}</p>
    `
        };


        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("❌ Feil ved sending av e-post:", err);
            } else {
                console.log("✅ E-post sendt:", info.response);
            }
        });

        res.status(201).json({ message: "Rapport lagret og e-post sendt!", id: resultat.insertedId });
    } catch (error: any) {
        console.error("💥 Feil i rapporterings-endpoint:", error);
        res.status(500).json({ error: error.message });
    }
});

// Hent alle rapporter
reportRouter.get("/", async (_req: Request, res: Response): Promise<void> => {
    try {
        if (!collections.reports) {
            res.status(500).send("Database collection not initialized");
            return;
        }

        const rapporter = await collections.reports.find({}).toArray();
        res.status(200).json(rapporter);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});
