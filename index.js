// for server connection step1
const express = require("express");
// MongoDB connection
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

// for server connection step2
const app = express();
// for server connection step3
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wz4lj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("Place");
    const userCollection = database.collection("user");
    const orderCollection = database.collection("orders");

    // get api jokhon database theke data display korbo

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    // order dekhar jonno
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // user er details dekhar jonno API
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("load user with id:", id);
      const query = {
        _id: ObjectId(id),
      };
      const result = await userCollection.findOne(query);
      // res.send er moddo error code deya jay
      res.send(result);
    });

    // post api

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      console.log("got new user", result);
      console.log("hitting the post", req.body);
      res.json(result);
    });

    // update API
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          description: updatedUser.description,
          price: updatedUser.price,
          img: updatedUser.img,
          statusValuse: updatedUser.statusValuse,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      console.log("updating user", req);
      res.json(result);
    });

    // delet api

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);

      console.log("delete user with id", result);
      res.json(result);
    });

    // delet order api

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);

      console.log("delete user with id", result);
      res.json(result);
    });

    // add order API
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      console.log("oeder", order);
      res.json(result);
    });

    // order dekhar jonno
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running my passage to peace server");
});

app.listen(port, () => {
  console.log("running server on port", port);
});
