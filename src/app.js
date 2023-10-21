// Import required modules
const express = require("express");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();
const Subscriber = require("./models/subscribers");

app.use(express.json()); // Middleware to parse JSON requests

app.use(express.static(__dirname)); // Serve static files from the current directory

// Route to serve the homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Introducing Swagger for API documentation and testing framework.
/**
 * @swagger
 * /subscribers:
 *   get:
 *     summary: Get all subscribers
 *     description: Retrieve a list of all subscribers.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - _id: 1
 *                 name: John Doe
 *                 subscribedChannel: Channel A
 *   post:
 *     summary: Create a new subscriber.
 *     description: Create a new subscriber.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               subscribedChannel:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subscriber created successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

// Code for handling various requests & responses
app.get("/subscribers", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creaate New Subscsriber with given details
app.post("/subscribers", async (req, res) => {
  try {
    const { name, subscribedChannel } = req.body;

    if (!name || !subscribedChannel) {
      return res
        .status(400)
        .json({ message: "Name and subscribedChannel are required." });
    }

    const newSubscriber = new Subscriber({ name, subscribedChannel });
    await newSubscriber.save();

    res.status(201).json(newSubscriber);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /subscribers/name:
 *   get:
 *     summary: Get subscribers' names and subscribed channels.
 *     description: Retrieve a list of subscribers' names and their subscribed channels.
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal Server Error
 *
 */
app.get("/subscribers/name", async (req, res) => {
  try {
    const subscribers = await Subscriber.find().select(
      "name subscribedChannel -_id"
    );
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /subscribers/{id}:
 *   get:
 *     summary: Get a subscriber by their ID.
 *     description: Retrieve a subscriber's information by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the subscriber to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Subscriber not found
 *
 */
app.get("/subscribers/:id", async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) {
      return res.status(400).json({ message: "Subscriber not found" });
    }
    res.json(subscriber);
  } catch (err) {
    res.status(400).json({ message: "Subscriber not found" });
  }
});

// Code for Swagger configuration
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Subscriber API",
    version: "1.0.0",
    description: "API for managing subscribers",
  },
  servers: [
    {
      url: "https://youtubesubscriber-8f2t.onrender.com",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["app.js"],
};

const swaggerSpec = swaggerJSDoc(options);

// This is to serve Swagger documentation using Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
