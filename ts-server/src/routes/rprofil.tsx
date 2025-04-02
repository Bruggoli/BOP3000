import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/conn";
import MProfil from "../models/mProfil";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const profilRouter = express.Router();

// Opprett en ny profil
// @ts-ignore
profilRouter.post("/", async (req: Request, res: Response) => {
    try {
        if (!collections.profiler) {
            return res.status(500).send("Database collection not initialized");
        }

        const { username, password, email, icon, medlemskap } = req.body;

        if (!email.endsWith("@usn.no")) {
            return res.status(400).json({ error: "Kun @usn.no-adresser er tillatt" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verifyToken = crypto.randomBytes(32).toString("hex");

        const nyProfil: MProfil = {
            brukernavn: username,
            email,
            passord: hashedPassword,
            icon: icon || "avatar.png",
            medlemskap: medlemskap || [],
            verified: false,
            verifyToken: verifyToken,
        };

        const resultat = await collections.profiler.insertOne(nyProfil);

        // Send verifikasjonsmail
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const verifyLink = `http://localhost:3000/profil/verify/${verifyToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Bekreft din e-postadresse",
            html: `<h3>Velkommen til appen!</h3>
                   <p>Vennligst bekreft e-postadressen din ved å trykke på lenken under:</p>
                   <a href="${verifyLink}">Bekreft e-posten</a>`,
        };

        console.log("🔧 Prøver å sende e-post til:", email);
        console.log("📨 Sender fra:", process.env.EMAIL_USER);
        console.log("🔗 Verifikasjonslink:", verifyLink);

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("❌ FEIL ved sending av e-post:", err);
            } else {
                console.log("✅ Verifikasjonsmail sendt:", info.response);
            }
        });


        res.status(201).json({ message: "Profil opprettet! Bekreft e-posten din.", id: resultat.insertedId });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Verifiser e-post
// @ts-ignore
profilRouter.get("/verify/:token", async (req: Request, res: Response) => {
    const { token } = req.params;

    try {
        const bruker = await collections.profiler?.findOne({ verifyToken: token });
        console.log("🔑 Bekrefter token:", token);
        console.log("📦 Bruker funnet:", bruker);

        if (!bruker) {
            // Kanskje brukeren allerede er bekreftet
            const alleredeBekreftet = await collections.profiler?.findOne({
                verified: true,
                verifyToken: { $exists: false },
            });

            if (alleredeBekreftet) {
                console.log("ℹ️ Brukeren er allerede bekreftet.");
                return res.send("✅ E-posten din er allerede bekreftet.");
            }

            return res.status(400).send("Ugyldig eller utløpt verifikasjonslenke.");
        }


        await collections.profiler?.updateOne(
            { _id: bruker._id },
            { $set: { verified: true }, $unset: { verifyToken: "" } }
        );
        console.log("✅ Verifisert bruker med ID:", bruker._id);
        console.log("✅ Verifisert og lagret:", {
            email: bruker.email,
            verified: true

        });


        res.send("✅ E-posten er bekreftet! Du kan nå logge inn.");
    } catch (error) {
        res.status(500).send("Noe gikk galt under verifisering.");
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

// Login med sjekk av verifisering
// @ts-ignore
profilRouter.post("/login", async (req: Request, res: Response) => {
    console.log("🛂 Login request:", req.body);

    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "E-post og passord må fylles ut" });
        }

        email = email.trim().toLowerCase();

        const user = await collections.profiler?.findOne({ email });
        console.log("Bruker ved innlogging:", user);

        if (!user) {
            return res.status(401).json({ error: "Ugyldig e-post eller passord" });
        }

        if (!user.verified) {
            return res.status(401).json({ error: "E-posten er ikke bekreftet." });
        }

        const isValid = await bcrypt.compare(password, user.passord);

        if (!isValid) {
            return res.status(401).json({ error: "Ugyldig e-post eller passord" });
        }
        console.log("🔍 Bruker ved innlogging:", user);


        res.status(200).json({ userId: user._id });
    } catch (error: any) {
        console.error("💥 Login error:", error);
        res.status(500).json({ error: error.message });
    }
});
