const express = require("express")
const app = express ()
const Port = 8000
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = 'mongodb+srv://Golden:theboyGolden%402004@backendlessons.8uxzy.mongodb.net/?retryWrites=true&w=majority&appName=backendLessons'
const { ObjectId } = require('mongodb');

app.get('/', (req, res)=>{
    res.send('Hello, World!')
})

app.use(express.json());





// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }


    try {
    
        const database = client.db('userdata');
        const collection = database.collection('users');
        
        
        app.post('/adduser', async (req, res)=>{
            const newDocument = req.body; // The new document to insert
            try {
                const result = await collection.insertOne(newDocument);
                res.status(200).json({ message: 'Document inserted successfully', result });
            } catch (error){
                res.status(500).json({message: 'Failed to insert document', error})
            }
        })

        app.get('/getuser/:_id', async (req, res) => {
            const id = req.params._id; // Get the _id from the URL
            try {
                // Find a document by _id, converting the id string to ObjectId
                const result = await collection.findOne({ _id: new ObjectId(id) });
                
                if (result) {
                    res.status(200).json({ message: 'Document found', result });
                } else {
                    res.status(404).json({ message: 'Document not found' });
                }
            } catch (error) {
                res.status(500).json({ message: 'Failed to get user', error });
            }
        });

        app.delete('/deleteuser/:id', (req, res)=>{
            const id = req.params.id; // Get the _id from the URL
            collection.deleteOne({ _id: new ObjectId(id) }, (err, result) => {
                if (err) {
                    res.status(500).json({ message: 'Failed to delete user', error: err });
                } else {
                    res.status(200).json({ message: 'User deleted successfully' });
                }
            });
        });


        app.put('/modifyuser/:id', (req, res)=>{
            const id = req.params.id; // Get the _id from the URL
            const newDocument = req.body; // The new document to update
            collection.updateOne({ _id: new ObjectId(id) }, { $set: newDocument },
            (err, result) => {
                if (err) {
                    res.status(500).json({ message: 'Failed to update user', error: err });
                } else {
                    res.status(200).json({ message: 'User updated successfully' });
                }
            });
        })

    } catch (error) {
        console.log(`Error: ${error}`)
    }
    
}
run().catch(console.dir);

app.listen(Port, ()=>{
   console.log(`Server running on ${Port}`) 
})