const bcrypt = require("bcryptjs")
const Event = require("../../models/event.models")
const User = require("../../models/user.model")
const Booking = require("../../models/bookings.model")
const {dateToString} = require("../../helpers/date")

const transformEvent = async (event) => {
    return {
        ...event._doc, 
        id: event.id, 
        date: dateToString(event._doc.date),
        creator: theUser.bind(this, event.creator)
    }
}

const events = async (eventIds) => {
    const response = await Event.find({_id: { $in: eventIds}})
    try {
        return response.map(event => {
            return transformEvent(event)
        })
    } catch(error) {
        console.log(error)
        throw error
    }
}

const getSingleEvent= async (eventId) => {
    const event = await Event.findById(eventId);
    try{
        return transformEvent(event)
    }catch(error) {
        throw error
    }
}

const theUser = async (userId) => {
    const response = await User.findById(userId)
    try{
            return {...response._doc, 
                    id: response.id,
                    createdEvents: events.bind(this, response._doc.createdEvents)
                }
    }catch(error) {
        console.log(error) 
    }
    
} 

module.exports = {
    getEvents: async () => {
        try{
           const result =  await Event.find()
            return result.map(event => {
                return transformEvent(event)
            })
        } catch(error) {
            console.log(error)
            throw error
        }
    }, 

    
    createEvent: async ( args) => {
        const event = new Event({
            title: args.EventInput.title,
            description: args.EventInput.description,
            price: args.EventInput.price,
            date:  dateToString(args.EventInput.date),
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
            
            // return event;
            return {...event._doc, creator: theUser.bind(this, event._doc.creator)
        }} catch(error) {
            console.log(error);
            throw error
        }  
    },

    getUsers: async () => {
        const result = await User.find().populate("createdEvents")
        try{
            return result.map((user) => {
                return{...user._doc, createdEvents: events.bind(this, user._doc.createdEvents)}
            })
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
    },

    getBookings : async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {
                    ...booking.doc,
                    id: booking.id,
                    user: theUser.bind(this, booking._doc.user),
                    event: getSingleEvent.bind(this, booking._doc.event),
                    createdAt: dateToString(booking._doc.createdAt),
                    updatedAt: dateToString(booking._doc.updatedAt)
                }
            })
        } catch(error) {
            console.log(error)
            throw error
        }
    },

    bookEvent: async (args) => {
        const fetchedEvent = await Event.findOne({
            _id: args.eventId
        })
        const booking = new Booking({
            user: "65a661fab0dea001a287f9eb",
            event: fetchedEvent
        });
        const result = await booking.save()
        return {
            ...result._doc,
            id: result.id,
            user: theUser.bind(this, booking._doc.user),
            event: getSingleEvent.bind(this, booking._doc.event),
            createdAt: dateToString(result._doc.createdAt),
            updatedAt: dateToString(result._doc.updatedAt)
        }
    },

    cancelBooking: async (args) => {
        const booking = await Booking.findById(args.bookingId).populate("event")
        const event = transformEvent(booking.event)
        try{
            await Booking.deleteOne({_id: args.bookingId})
            return event
        } catch(error) {
            throw error
        }
    }
}