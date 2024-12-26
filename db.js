
import { MongoClient, ServerApiVersion } from 'mongodb';

// Connect mongo db
var client;

export function connectDB() {
    client = new MongoClient(process.env.db, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
          useNewUrlParser: true,
        }
    });
    testDB();
}


export async function getNewsCache(sources) {
    let results = [];
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        await client.db("dan").command({ ping: 1 });

        const coll = client.db('dan').collection('news360');

        const filter = {"source": {$in : sources }}
        console.log(filter);

        const cursor = coll.find(filter);
 
        // print a message if no documents were found
        // if ((await cursor.count()) === 0) {
        if (await cursor.count() === 0) {
            console.log("No documents found!", { "source": sources });
        }

        results = (await cursor.map(doc => doc.news).toArray()).flat();

    } finally {
      // Ensures that the client will close when you finish/error
      try { await client.close(); } catch (error) {}
    }
    return results;
}

export async function insertNewsToDB(type, language, news) {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        
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
      try { await client.close(); } catch (error) {}
    }
    return;
}

export async function insertAllToDB(docs) {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const coll = client.db('dan').collection('news360');
        await coll.insertMany(docs);
        return;
    } finally {
      // Ensures that the client will close when you finish/error
      try { await client.close(); } catch (error) {}
    }
    return;
}

export async function deleteAll() {
    try {
        await client.connect();
        await client.db("dan").command({ ping: 1 });

        const coll = client.db('dan').collection('news360');

        await coll.deleteMany({});
    } finally {
      // Ensures that the client will close when you finish/error
      try { await client.close(); } catch (error) {}
    }
    return;
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
        try { await client.close(); } catch (error) {}
    }
    return;
}