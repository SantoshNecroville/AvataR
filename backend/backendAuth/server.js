import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json()); 
app.use(cookieParser()); 

app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.post('/api/defaults', async (req, res) => {
	const { title, description, image, audio } = req.body;

	try {
		const newDefault = new Default({ title, description, image, audio });
		await newDefault.save();
		res.status(201).json(newDefault);
	} catch (err) {
		res.status(500).json({ message: 'Failed to create Default', error: err.message });
	}
});

app.get('/api/defaults', async (req, res) => {
	try {
		const defaults = await Default.find();
		res.status(200).json(defaults);
	} catch (err) {
		res.status(500).json({ message: 'Failed to fetch Defaults', error: err.message });
	}
});

app.get('/api/defaults/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const defaultItem = await Default.findById(id);
		if (!defaultItem) {
			return res.status(404).json({ message: 'Default not found' });
		}
		res.status(200).json(defaultItem);
	} catch (err) {
		res.status(500).json({ message: 'Failed to fetch Default', error: err.message });
	}
});

app.listen(PORT, () => {
	connectDB();
	console.log("Server is running on port: ", PORT);
});