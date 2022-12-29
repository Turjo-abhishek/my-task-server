const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cpby83d.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const tasksCollection = client.db("Turjos-database").collection("tasks");

    app.post("/tasks", async(req, res) => {
        const task = req.body;
        const result = await tasksCollection.insertOne(task);
        res.send(result);
    });

    app.get("/tasks", async(req, res) => {
        const query = {};
        const tasks = await tasksCollection.find(query).toArray();
        res.send(tasks);
    })
    app.get("/tasks/:id", async(req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const task = await tasksCollection.findOne(query);
        res.send(task);
    })

    app.get("/completedtasks", async(req, res) => {
        console.log(req.query);
        const isCompleted = Boolean(req.query.completed);
        const query = {completed: isCompleted};
        const tasks = await tasksCollection.find(query).toArray();
        res.send(tasks);
    })
    

    app.put("/tasks/:id", async(req, res) => {
        const id = req.params.id;
        const filter = {_id: ObjectId(id)};
        const options = { upsert: true };
        const updatedDoc = {
            $set: {
                completed: true
            }
        }
        const result = await tasksCollection.updateOne(filter, updatedDoc, options);
        res.send(result);
    });


  } finally {
  }
}
run().catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.send("my task server is running");
});

app.listen(port, () => {
  console.log(`my task server is running on port ${port}`);
});
