
import { MongoClient, ServerApiVersion } from 'mongodb';

// Connect mongo db
const client = new MongoClient(process.env.db, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

export async function insertNewsToDB(type, language, news) {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        
        // Send a ping to confirm a successful connection
        // await client.db("dan").command({ ping: 1 });

        const coll = client.db('dan').collection('news360');

        const result = await coll.findOne({ "source": type, "language": language });
        if (result == null){
            const doc = {
                "source": type,
                "language": language,
                "news": news,
            }
            await coll.insertOne(doc);
        } else {
            await coll.updateOne({ _id: result._id}, { $set: {"news": news}}, { upsert: true });
        }
        // console.log("DB transaction successful");

    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}

async function testDB() {
    try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("dan").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    }
}
testDB();