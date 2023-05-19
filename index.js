const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pcfhua9.mongodb.net/?retryWrites=true&w=majority`;

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
    client.connect();

    //collections
    const subCategoryCollection = client
      .db('disney-palace')
      .collection('subCategories');
    const categoryToysCollection = client
      .db('disney-palace')
      .collection('categoryToys');

    app.get('/sub-categories', async (req, res) => {
      const result = await subCategoryCollection.find().toArray();
      res.send(result);
    });

    app.get('/category-toys/:subCategory', async (req, res) => {
      const subCategory = req.params.subCategory;
      console.log(subCategory);
      const query = { subCategory: subCategory };
      const result = await categoryToysCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Disney Palace server running');
});

app.listen(port, () => {
  console.log(`Disney Palace is running on port: ${port}`);
});
