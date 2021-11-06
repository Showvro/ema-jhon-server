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
    const orderCollection = database.collection("orders");

    //Get Products API
    app.get("/products", async (req, res) => {
      // console.log(req.query);
      const cursor = productCollection.find({});
      const page = req.query.page;
      const size = parseInt(req.query.size);
      let products;
      const count = await cursor.count();
      if (page) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }
      res.send({ count, products });
    });

    //use post to get data by keys
    app.post("/products/bykeys", async (req, res) => {
      const keys = req.body;
      const query = { key: { $in: keys } };
      const products = await productCollection.find(query).toArray();
      res.json(products);
    });

    //add order api
    app.post("/orders", async (req, res) => {
      const orders = req.body;
      console.log(orders);
      const result = await orderCollection.insertOne(orders);
      res.json(result);
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
