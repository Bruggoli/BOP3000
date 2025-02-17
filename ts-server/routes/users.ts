import express, { Request, Response } from "express";
const router = express.Router();

// Mock database
const users: object= [
  {
    last_name: 'Doe',
    email: 'johndoe@example.com',
  },
  {
    first_name: 'Alice',
    last_name: 'Smith',
    email: 'alicesmith@example.com',
  },
];

// Getting the list of users from the mock database
router.get('/', (req: Request, res: Response) => {
    res.send(users);
});

export default router
