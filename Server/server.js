const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcryptjs");

const app = express();
const port = process.env.PORT || 4000;
const cors=require("cors")
app.use(cors())
app.use(express.json());

mongoose
  .connect("mongodb+srv://deepcoders0:ewGQpK7TFo40ITVN@deepviber03.vlc9q.mongodb.net/studentdb")
  .then(() => {
    console.log("CONNECTED SUCCESSFULLY");
  })
  .catch((err) => {
    console.log(err);
  });

const schema = new mongoose.Schema({
  Username: { type: String, unique: true, required: true },
  Password: { type: String, required: true },
});

const Testing = mongoose.model("Testing", schema);

app.post("/post", async (req, res) => {
  try {
    const { Username, Password } = req.body;

    if (!Username || !Password) {
      return res.status(400).json({ message: "Username and Password are required" });
    }

    // Check if the username already exists
    const existingUser = await Testing.findOne({ Username});
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Save new user
    const newUser = new Testing({
      Username,
      Password: hashedPassword,
    });

    await newUser.save();
    console.log("DATA INSERTION SUCCESSFULLY!!");
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log("DATA INSERTION FAILED!!", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

app.listen(port, () => {
  console.log(`SERVER RUNNING ON ${port}`);
});
