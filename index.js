const express = require("express")
const bodyParser = require("body-parser")
const { graphqlHTTP } = require("express-graphql")
const { buildSchema } = require("graphql")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const Event = require("./models/event.models")
const User = require("./models/user.model")

const app = express();
app.use(bodyParser.json());

const events = async (eventIds) => {
    const response = await Event.find({_id: { $in: eventIds}})
    try {
        return response.map(event => {
            return {...event._doc, 
                    _id: event.id, 
                    creator: theUser.bind(this, event.creator)
                }
        })
    } catch(error) {
        console.log(error)
        throw error
    }
}

const theUser = async (userId) => {
    const response = await User.findById(userId)
    try{
            return {...response._doc, 
                    _id: response.id,
                    createdEvents: events.bind(this, response._doc.createdEvents)
                }
    }catch(error) {
        console.log(error) 
    }
    
} 


const schema = buildSchema(`

    type Event {
        id: ID!,
        title: String!,
        description: String!,
        price: Float!,
        date: String!,
        creator: User!
    }

    type User {
        id: ID!,
        email: String!,
        password: String,
        createdEvents: [Event!]!
       }

    input EventInput {
        title: String!,
        description: String!,
        price: Float!,
        date: String!
    }

    input UserInput {
        email: String!,
        password: String!
    }

    type RootQuery {
        getEvents: [Event!]!,
        getUsers: [User!]!
    }

    type RootMutation {
        createEvent(EventInput: EventInput): Event,
        createUser(UserInput: UserInput): User
    }

    schema {
        query:RootQuery
        mutation:RootMutation
    }
`)

//resolver 
const rootValue = {
    getEvents: async () => {
        try{
           const result =  await Event.find()
            return result.map(event => {
                return {...event._doc, creator: theUser.bind(this, event._doc.creator)}
            })
        } catch(error) {
            console.log(error)
            throw error
        }
    }, 
    
    createEvent: async ( args) => {
        // const event = {
        //     id: Math.random().toString(),
        //     title: args.EventInput.title,
        //     description: args.EventInput.description,
        //     price: args.EventInput.price,
        //     date:  args.EventInput.date
        const event = new Event({
            title: args.EventInput.title,
            description: args.EventInput.description,
            price: args.EventInput.price,
            date:  new Date(args.EventInput.date),
            creator: "65a661fab0dea001a287f9eb"
        });
        try {

            const eventUser = async (user) => {
                user = await User.findById("65a661fab0dea001a287f9eb")
                if(!user) {
                    throw new Error("user does not exist")
                }
                console.log(user)
                user.createdEvents.push(event)
                return user.save()
            }
            eventUser()
            event.save()
            
            return event;
            // return {...event._doc}
        } catch(error) {
            console.log(error);
            throw error
        }  
    },

    getUsers: async () => {
        const result = await User.find().populate("createdEvents")
        try{
            return result
        } catch(error) {
            console.log(error)
            throw error
        }
    },

    createUser: async (args) => {
         await User.findOne({email: args.UserInput.email})
        .then(Email => {
            if(Email) {
                console.log("user already exists")
                throw new Error("user already exists")
            } 
            return Email
        })
          
        const hashedPassword = await bcrypt.hash(args.UserInput.password, 12)
        const user = new User({
          
            email: args.UserInput.email,
            password: hashedPassword
        });
        try{
        
         await user.save()
         console.log("user created successfully")
         return {
            email: user.email,
            password: null
            
         }
        } catch(error) {
            console.log(error)
            throw error
        }
    }
}

app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: rootValue,
    graphiql: true
}))

const port = 4000;

const database = (module.exports = async () => {
   
    try{
        await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.mkziljg.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`

        )
        console.log("database connected successfully")
    }catch(error) {
        console.log(error);
        console.log("database connection failed")
    }
})

database()

app.listen(port, console.log("app is listening on port", port))




