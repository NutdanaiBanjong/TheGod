const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");

const { MongoClient } = require("mongodb");
const jwt_decode = require("jwt-decode");
const uri = "mongodb://admin:1234@localhost:27017";

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

app.post("/user/create", async (req, res) => {
  const users = req.body;
  // console.log(typeof users.id);
  const client = new MongoClient(uri);
  await client.connect();
  const checkUserID = await client
    .db("mydb")
    .collection("users")
    .findOne({ id: parseInt(users.id) });
  if (checkUserID) {
    await client.close();
    res.status(404).send({
      message: "User ID " + users.id + " already created",
    });
  } else {
    await client
      .db("mydb")
      .collection("users")
      .insertOne({
        id: parseInt(users.id),
        username: users.username,
        password: users.password,
      });
    await client.close();
    res.status(200).send({
      status: "ok",
      message: "User ID " + users.id + " is created",
      user: users,
    });
  }
});

app.post("/product/create", async (req, res) => {
  const products = req.body;
  const client = new MongoClient(uri);
  await client.connect();
  await client
    .db("mydb")
    .collection("products")
    .insertOne({
      id: parseInt(products.id),
      name: products.name,
      price: products.price,
    });
  await client.close();
  res.status(200).send({
    status: "ok",
    message: "Products ID " + products.id + " is created",
    products: products,
  });
});

app.get("/user", async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const users = await client.db("mydb").collection("users").find({}).toArray();
  await client.close();
  res.status(200).send({
    status: "ok",
    message: "All User is created",
    user: users,
  });
});

app.get("/product", async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const products = await client
    .db("mydb")
    .collection("products")
    .find({})
    .toArray();
  await client.close();
  res.status(200).send({
    status: "ok",
    message: "All Products is created",
    products: products,
  });
});

app.post("/login", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    // console.log(req);
    const { username, password } = req.body;
    // ตรวจสอบจาก user input
    if (!(username && password)) {
      res.status(400).send({ message: "Enter Username and Password" });
    }
    const client = new MongoClient(uri);
    await client.connect();
    // เช็คชื่อจากใน database
    const checkUser = await client
      .db("mydb")
      .collection("users")
      .findOne({ username: username });
    // console.log(checkUser, "check");
    if (checkUser !== null) {
      // create token
      const token = jwt.sign({ id: checkUser.id, username }, "Charliehehe", {
        expiresIn: "60s",
      });
      res.status(200).send({ access_token: token, message: "User Found" });
      //  res.status(200).json(token);
    }
    res.status(404).send("User Not Found");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

// app.post("/testtoken", async (req, res) => {
//   // Our login logic starts here
//   try {
//     let token = req.headers.authorization;
//     let result = token.replace("Bearer ", "");
//     console.log(result);
//     // Get user input
//     const decoded = jwt_decode(result);
//     console.log(decoded.username);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Error");
//   }
//   // Our register logic ends here
// });

app.listen(3000, () => {
  console.log("server started port 3000");
});
