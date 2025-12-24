// ការតំឡើង និង Import Library
//read bot_token & chat_id from .envfile // create web server
// create path for calling file // call api from telegram bot
// catch port for run on port 5000
require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
// កំណត់ Port និង Server
const PORT = 5000;
const app = express();

// អាន env Variable
// CHAT_ID → Telegram chat/group/channel ដែលអ្នកចង់ផ្ញើ BOT_TOKEN → Token របស់ Telegram Bot
const CHAT_ID = process.env.CHAT_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;

// for req and res
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ទទួល data ពី form when submit
app.post("/submit", async (req, res) => {
  try {
    const { productname, price, qty, description, created_date, CategoryName } = req.body;

    // validation 
    // catch error if no data
    if (!productname || !price || !qty) {
      return res.status(400).send("Product name, price, and quantity are required.");
    }

    // escape special chars
    const escape = (s = "") =>
      String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");

    // format message to telegram
    const text = `<b>New Product 🆕</b>
<b>Product:</b> ${escape(productname)}
<b>Price:</b> ${escape(price)}
<b>Quantity:</b> ${escape(qty)}
<b>Description:</b> ${escape(description || "N/A")}
<b>Created Date:</b> ${escape(created_date || new Date().toLocaleDateString())}
<b>Category:</b> ${escape(CategoryName || "N/A")}`;

// Call Telegram API
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const resp = await axios.post(url, null, {
      params: {
        chat_id: CHAT_ID,
        text: text,
        parse_mode: "HTML",
      },
    });

    // catch tele success & error
    if (resp.data.ok) {
      // Instead of redirect, send JSON
      return res.json({ success: true });
    } else {
      console.error("Telegram error:", resp.data);
      return res.status(500).json({ success: false, error: "Failed to send notification." });
    }
// err.message or err.response.data
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
