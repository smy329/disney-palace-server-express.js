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

let sortCode = 0;
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //client.connect();

    //collections
    const subCategoryCollection = client
      .db('disney-palace')
      .collection('subCategories');
    const categoryToysCollection = client
      .db('disney-palace')
      .collection('categoryToys');
    const toysCollection = client.db('disney-palace').collection('toys');

    app.get('/sub-categories', async (req, res) => {
      const result = await subCategoryCollection.find().toArray();
      res.send(result);
    });

    // app.get('/category-toys/:subCategory', async (req, res) => {
    //   const subCategory = req.params.subCategory;
    //   console.log(subCategory);
    //   const query = { subCategory: subCategory };
    //   const result = await categoryToysCollection.find(query).toArray();
    //   console.log(result);
    //   res.send(result);
    // });

    app.get('/toys', async (req, res) => {
      const result = await toysCollection.find().limit(20).toArray();
      res.send(result);
    });

    app.post('/toys', async (req, res) => {
      const toyData = req.body;
      console.log(toyData);
      const result = await toysCollection.insertOne(toyData);
      res.send(result);
    });

    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });

    app.get('/toys/subCategory/:name', async (req, res) => {
      const subCategory = req.params.name;
      //console.log(subCategory);
      const query = { subCategory: subCategory };
      const result = await toysCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });

    app.get('/my-toys/:email', async (req, res) => {
      const email = req.params.email;
      const query = { sellerEmail: email };
      const result = await toysCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });

    app.get('/my-toys/sort/:sort', async (req, res) => {
      const sortType = req.params.sort;
      let sortCode = 1;
      if (sortType === 'desc') {
        sortCode = -1;
      }
      console.log(sortType, sortCode);
      // const options = {
      //   // sort matched documents in descending order by rating
      //   sort: { price: -1 },
      // };
      //const result = await toysCollection.find(options).toArray();
      const result = await toysCollection
        .find()
        .sort({ price: sortCode })
        .toArray();
      console.log(result);
      res.send(result);
    });

    app.put('/my-toys/update/:id', async (req, res) => {
      const id = req.params.id;
      const updatedToyData = req.body;
      console.log(updatedToyData);
      const query = { _id: new ObjectId(id) };
      const updateToy = {
        $set: updatedToyData,
      };
      const result = await toysCollection.updateOne(query, updateToy);
      res.send(result);
    });

    app.delete('/my-toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.deleteOne(query);
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
