import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/conn";
import ModelsProfil from "../models/modelsProfil";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const profilRouter = express.Router();

// oppretter en profil
profilRouter.post("/", async (req: Request, res: Response): Promise<void> => {
    try {
        if (!collections.profiler) {
            res.status(500).send("Database collection not initialized");
            return;
        }

        const { username, password, email, icon, medlemskap } = req.body;

        if (!email.endsWith("@usn.no")) {
            res.status(400).json({ error: "Kun @usn.no-adresser er tillatt" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verifyToken = crypto.randomBytes(32).toString("hex");

        const nyProfil: ModelsProfil = {
            brukernavn: username,
            email,
            passord: hashedPassword,
            icon: icon || "avatar.png",
            medlemskap: medlemskap || [],
            verified: false,
            verifyToken: verifyToken,
        };

        const resultat = await collections.profiler.insertOne(nyProfil);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            secure: true,
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
profilRouter.get("/verify/:token", async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params;

    try {
        const bruker = await collections.profiler?.findOne({ verifyToken: token });
        console.log("🔑 Bekrefter token:", token);
        console.log("📦 Bruker funnet:", bruker);

        if (!bruker) {
            const alleredeBekreftet = await collections.profiler?.findOne({
                verified: true,
                verifyToken: { $exists: false },
            });

            if (alleredeBekreftet) {
                console.log("ℹ️ Brukeren er allerede bekreftet.");
                res.send("✅ E-posten din er allerede bekreftet.");
                return;
            }

            res.status(400).send("Ugyldig eller utløpt verifikasjonslenke.");
            return;
        }

        await collections.profiler?.updateOne(
            { _id: bruker._id },
            { $set: { verified: true }, $unset: { verifyToken: "" } }
        );

        console.log("✅ Verifisert bruker med ID:", bruker._id);
        res.send("✅ E-posten er bekreftet! Du kan nå logge inn.");
    } catch (error) {
        res.status(500).send("Noe gikk galt under verifisering.");
    }
});

// Hent alle profiler
profilRouter.get("/", async (_req: Request, res: Response): Promise<void> => {
    try {
        if (!collections.profiler) {
            res.status(500).send("Database collection not initialized");
            return;
        }

        const profiler = await collections.profiler.find({}).toArray();
        res.status(200).json(profiler);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

// Hent bruker basert på ID
profilRouter.get("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        if (!collections.profiler) {
            res.status(500).send("Database collection ikke tilgjengelig");
            return;
        }

        const id = new ObjectId(req.params.id);
        const profil = await collections.profiler.findOne({ _id: id });

        if (!profil) {
            res.status(404).send("Profil ikke funnet");
            return;
        }

        res.status(200).json(profil);
    } catch (error: any) {
        if (error instanceof Error) {
            res.status(400).send("Ugyldig ID-format");
        } else {
            res.status(500).send("Ukjent feil");
        }
    }
});


// Oppdater profilens ikon
profilRouter.patch("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        if (!collections.profiler) {
            res.status(500).send("Database collection not initialized");
            return;
        }

        const id = new ObjectId(req.params.id);
        const { icon } = req.body;

        const result = await collections.profiler.updateOne(
            { _id: id },
            { $set: { icon } }
        );

        if (result.modifiedCount === 0) {
            res.status(404).send("Profil ikke oppdatert");
            return;
        }

        res.status(200).json({ message: "Profil oppdatert" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Slett en brukerprofil og relaterte data
profilRouter.delete("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const { profiler, kommentar, poster, klubber } = collections;

        if (!profiler) {
            res.status(500).send("Profil-collection ikke tilgjengelig");
            return;
        }

        const id = new ObjectId(req.params.id);
        const slettKommentarer = req.query.slettKommentarer === "true";
        const slettPoster = req.query.slettPoster === "true";

        // Slett kommentarer
        if (slettKommentarer && kommentar) {
            await kommentar.deleteMany({ brukerId: id });
        }

        // Slett poster
        if (slettPoster && poster) {
            await poster.deleteMany({ brukerId: id });
        }

        // Fjern bruker fra klubb-medlemskap
        if (klubber) {
            // Fjern fra medlemslisten
            await klubber.updateMany(
                { "medlemmer.brukerId": id },
                { $pull: { medlemmer: { brukerId: id } } as any }
            );

            // Fjern admin-feltet hvis bruker var admin
            await klubber.updateMany(
                { admin: id },
                { $unset: { admin: "" } }
            );
        }

        // Slett selve profilen
        const resultat = await profiler.deleteOne({ _id: id });

        if (resultat.deletedCount === 0) {
            res.status(404).send("Fant ikke bruker å slette.");
            return;
        }

        res.status(200).send("✅ Bruker og valgte data slettet.");
    } catch (error) {
        console.error("Feil ved sletting:", error);
        res.status(500).send("Noe gikk galt ved sletting av bruker.");
    }
});


// Login med sjekk av verifisering
profilRouter.post("/login", async (req: Request, res: Response): Promise<void> => {
    console.log("🛂 Login route triggered");
    console.log("📦 req.headers:", req.headers);
    console.log("📦 req.body:", req.body);

    try {
        let { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: "E-post og passord må fylles ut" });
            return;
        }

        email = email.trim();

        const user = await collections.profiler?.findOne({
            email: { $regex: `^${email}$`, $options: "i" }
        });

        console.log("🔍 Bruker funnet:", user);

        if (!user) {
            res.status(401).json({ error: "Ugyldig e-post eller passord" });
            return;
        }

        if (!user.verified) {
            res.status(401).json({ error: "E-posten er ikke bekreftet." });
            return;
        }

        const isValid = await bcrypt.compare(password, user.passord);

        if (!isValid) {
            res.status(401).json({ error: "Ugyldig e-post eller passord" });
            return;
        }

        res.status(200).json({ userId: user._id });
    } catch (error: any) {
        console.error("💥 Login error:", error);
        res.status(500).json({ error: error.message || "Ukjent feil ved innlogging." });
    }
});