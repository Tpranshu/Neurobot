import express from 'express'
import cors from "cors";
import ImageKit from 'imagekit';
import mongoose from 'mongoose';
import chat from './collection/chat.js';
import user_chat from './collection/user_chat.js';
import { ClerkExpressRequireAuth, createClerkClient } from '@clerk/clerk-sdk-node';


const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

const port = process.env.PORT || 3000;
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}))




const connect = async () => {
  try {
    `mongoose.connect((process.env.MONGO))`;
    console.log("Connected to the MongoDB");
  } catch (err) {
    console.log(err);
  }
};


app.get("/api/upload", ClerkExpressRequireAuth(), (req, res) => {
  res.send(result);
})


app.post("/api/chat", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;

  try {
    const newChat = new chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    const user_chat = await user_chat.find({ userId: userId });

    if (!user_chat.length) {
      const newUserChats = new newUserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });

      await newUserChats.save();
    } else {
      await user_chat.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );

      res.status(201).send(newChat._id);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating chat!");
  }
});









app.get("/api/user_chat", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const user_chat = await user_chat.find({ userId });

    res.status(200).send(user_chat[0].chats);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching userchats!");
  }
});






app.get("/api/chat/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const chat = await chat.findOne({ _id: req.params.id, userId });

    res.status(200).send(chat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching chat!");
  }
});

app.put("/api/chat/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  const { question, answer, img } = req.body;

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(200).send(updatedChat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding conversation!");
  }
});




app.listen(port, () => {
  connect();
  console.log("pranshu tiwari");
})