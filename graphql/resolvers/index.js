const authResolver = require("./auth.resolvers")
const bookingResolver = require("./booking.resolvers")
const eventResolver = require("./event.resolvers")

const rootResolver = {
    ...authResolver,
    ...bookingResolver,
    ...eventResolver
}

module.exports = rootResolver