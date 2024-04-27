const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
//midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.m73tovo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbConnect = async () => {
  try {
    client.connect();
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error.name, error.message);
  }
};
dbConnect();

//  database collection
const database = client.db("travelDB");
const databaseCollection = database.collection("travels");

app.get("/travels", async (req, res) => {
  const travels = await databaseCollection.find().toArray();
  res.send(travels);
});

app.get("/mylist/:email", async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const travels = await databaseCollection.find(query).toArray();
  res.send(travels);
});

app.get("/travels/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const travels = await databaseCollection.findOne(query);
  res.send(travels);
});

app.put("/travels/:id", async (req, res) => {
  const id = req.params.id;
  const {
    seasonality,
    country_name,
    total_visitors_per_year,
    travel_time,
    average_cost,
    short_description,
    location,
    tourists_spot_name,
    image_url,
  } = req.body;
  const query = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
      seasonality,
      country_name,
      total_visitors_per_year,
      travel_time,
      average_cost,
      short_description,
      location,
      tourists_spot_name,
      image_url,
    },
  };
  const result = await databaseCollection.updateOne(query, updateDoc);
  res.send(result);
});

app.get("/mycountry/:name", async (req, res) => {
  const name = req.params.name;
  const query = { country_name: name };
  const result = await databaseCollection.find(query).toArray();
  res.send(result);
});

app.delete("/travels/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const travels = await databaseCollection.deleteOne(query);
  res.send(travels);
});

app.post("/travels", async (req, res) => {
  const travel = req.body;
  const result = await databaseCollection.insertOne(travel);
  res.send(result);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
