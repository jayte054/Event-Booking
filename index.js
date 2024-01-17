const express = require("express")
const bodyParser = require("body-parser")
const { graphqlHTTP } = require("express-graphql")
const mongoose = require("mongoose")
const graphqlSchema = require("./graphql/schemas/index")
const graphqlResolver = require("./graphql/resolvers/index")

const app = express();
app.use(bodyParser.json()); 


app.use("/graphql", graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true
}))

const port = 4000;

const database = (module.exports = async () => {
   
    try{
        await mongoose.connect(
            `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.mkziljg.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`

        )
        console.log("database connected successfully")
    }catch(error) {
        console.log(error);
        console.log("database connection failed")
    }
})

database()

app.listen(port, console.log("app is listening on port", port))




