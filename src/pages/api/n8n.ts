import express from "express";
const app = express();

app.get("/api/v1/workflows", async (req, res) => {
  const response = await fetch("http://localhost:5678/api/v1/workflows", {
    headers: {
      "X-N8N-API-KEY": process.env.N8N_API_KEY || "",
    },
  });
  const data = await response.json();
  res.json(data);
});

app.listen(3001, () => {
  console.log("Proxy API running on http://localhost:3001");
});
