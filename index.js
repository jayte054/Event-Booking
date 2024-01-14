const express = require("express")
const bodyParser = require("body-parser")
const { graphqlHTTP } = require("express-graphql")
const { buildSchema } = require("graphql")

const app = express();
app.use(bodyParser.json());
const eventListings = []
const schema = buildSchema(`

    type Event {
        id: ID!,
        title: String!,
        description: String!,
        price: Float!,
        date: String!
    }

    input EventInput {
        title: String!,
        description: String!,
        price: Float!,
        date: String!
    }

    type RootQuery {
        events: [Event!]!
    }

    type RootMutation {
        createEvent(EventInput: EventInput): Event
    }

    schema {
        query:RootQuery
        mutation:RootMutation
    }
`)

const rootValue = {
    events: () => {
        return eventListings;
    },
    
    createEvent: ( args) => {
        const event = {
            id: Math.random().toString(),
            title: args.EventInput.title,
            description: args.EventInput.description,
            price: args.EventInput.price,
            date:  args.EventInput.date
        };
        eventListings.push(event)
        return event;
    }
}

app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: rootValue,
    graphiql: true
}))

const port = 4000;

app.listen(port, console.log("app is listening on port", port))
