import express, { Express } from "express";
import dotenv from "dotenv";
import { klubberRouter } from "./routes/klubber";
import { profilRouter } from "./routes/profil";
import { postRouter } from "./routes/post";
import { kommentarRouter } from "./routes/kommentar";
import connectToDb from "./services/conn";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

connectToDb()
    .then(() => {
        console.log("✅ Tilkoblet til MongoDB!");

        // Registrer routes
        app.use("/klubber", klubberRouter);
        app.use("/profiler", profilRouter);
        app.use("/poster", postRouter);
        app.use("/kommentarer", kommentarRouter);

        app.listen(port, () => {
            console.log(`Server kjører på http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit(1);
    });

/*
for å kjøre databasen skriv:
"cd ts-server" for å navigere til riktig mappe
"npx ts-node scr/index.ts" for å starte serveren

For å sette inn en klubb:
curl -X POST http://localhost:3000/klubber -H "Content-Type: application/json" -d '{
  "navn": "navn på klubb",
  "beskrivelse": "beskrivelse av klubben",
  "kategori": "hvilke kategori",
  "admin": "hvem som er admin for klubben",
  "medlemmer": [],
  "createdAt": ""
}' skal prøve å gjøre tid dynamisk

for å lage en bruker:
curl -X POST http://localhost:3000/profiler -H "Content-Type: application/json" -d '{
  "fNavn": "fnavn",
  "eNavn": "enavn",
  "email": "epost",
  "passord": "passord, må hashes",
  "icon": "https://example.com/profile.jpg",
  "medlemskap": []
}'

for å lage en post:
curl -X POST http://localhost:3000/poster -H "Content-Type: application/json" -d '{
  "brukerId": "653a0c9d8f1234567890abcd(må være 24 tegn)",
  "tittel": "tittel på posten",
  "innhold": "hva inholdet i posten er",
  "likes": [],
  "kommentarer": []
}'

kommentar på en post:
curl -X POST http://localhost:3000/kommentarer -H "Content-Type: application/json" -d '{
  "postId": "653a0c9d8f1234567890abcd"(må være id til et faktisk inlegg),
  "brukerId": "653a0c9d8f1234567890efgh" (samme),
  "tekst": "tekst på kommentaren"
}'

får å se om datqaen er lagret så skriv følgende når mongodb kjører:
curl http://localhost:3000/klubber/profiler/poster
(fjern det du ikke vil se)
for å finne kommentar så trenger du mer spesifik informasjon
curl http://localhost:3000/kommentarer/post/653a0c9d8f1234567890abcd
(skriv in postid på slutten)
 */