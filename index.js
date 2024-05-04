const express = require("express")
const bodyParser = require("body-parser")
const { graphqlHTTP } = require("express-graphql")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const graphqlPlayground = require("graphql-playground-middleware-express").default
const cors = require("cors")
const graphqlSchema = require("./graphql/schemas/index")
const graphqlResolver = require("./graphql/resolvers/index")
const isAuth = require("./middleware/is-auth")

dotenv.config()
const app = express();
app.use(bodyParser.json()); 

app.get("/playground", graphqlPlayground({endpoint: "/graphql"}))

app.use(cors())
app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
})

// setting cors policy can be done either of the ways labelled

// app.use(async (req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

//     if (req.method === "OPTIONS") {
//         return res.sendStatus(200);
//     }

//     next();
// });


app.use(isAuth)

//middleware
app.use("/graphql", graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    // graphiql: true,
}))

const port = 4000;

const database = (module.exports = async () => {
  console.log(process.env.MONGO_PASSWORD) ;
    try{
        await mongoose.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.mkziljg.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
        )
    }catch(error) {
        console.log(error, "database connection failedddd");
    }
})
console.log(process.env.MONGO_USER)
if(database()) {
    console.log("database connected successfully")
}

app.listen(port, console.log("app is listening on port", port))




