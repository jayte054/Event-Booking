const { buildSchema } = require("graphql")

module.exports = buildSchema(`

type Booking {
    id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

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
    getUsers: [User!]!,
    getBookings: [Booking!]!
}

type RootMutation {
    createEvent(EventInput: EventInput): Event,
    createUser(UserInput: UserInput): User,
    bookEvent(eventId: ID!): Booking!,
    cancelBooking(bookingId: ID!): Event! 
}

schema {
    query:RootQuery
    mutation:RootMutation
}
`)