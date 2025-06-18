import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/v1/workflows", async (req, res) => {
  try {
    const response = await fetch("http://localhost:5678/api/v1/workflows", {
      headers: {
        "X-N8N-API-KEY": process.env.N8N_API_KEY!,
      },
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
