const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

//app installation
const app = express();
const port = process.env.PORT || 9999;

//middlewire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rzdhw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    //Database Installation
    const database = client.db("ema_jhon");
    const productCollection = database.collection("products");

    //Get Products API
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.limit(13).toArray();
      res.send(products);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(port, () => {
  console.log("Server is runnig on port: ", port);
});
