const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6iad9fh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // creating db
    const db = client.db("coffeesDB");
    const coffeeCollection = db.collection("coffes");
    // reading
    app.get("/coffees", async (req, res) => {
      const result = coffeeCollection.find();
      const coffees = await result.toArray();
      res.send(coffees);
    });
    // reading one data
    app.get("/coffees/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const coffee = await coffeeCollection.findOne(query);
      res.send(coffee);
    });
    // creating
    app.post("/coffees", async (req, res) => {
      const result = await coffeeCollection.insertOne(req.body);
      res.send(result);
    });
    // updating
    app.put("/coffees/:id", async (req, res) => {
      const filter = { _id: new ObjectId(req.params.id) };
      const updatedCoffee = {
        $set: {
          name: req.body.name,
          price: req.body.price,
          supplier: req.body.supplier,
          taste: req.body.taste,
          category: req.body.category,
          details: req.body.details,
          photo: req.body.photo,
        },
      };
      const result = await coffeeCollection.updateOne(filter, updatedCoffee);

      res.send(result);
    });
    // deleting
    app.delete("/coffees/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server is runnig at ${port}`);
});
