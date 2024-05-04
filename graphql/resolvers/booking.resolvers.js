const Booking = require("../../models/bookings.model")
const Event = require("../../models/event.models")
const {dateToString} = require("../../helpers/date")
const {theUser, getSingleEvent} = require("./merge.resolver")

const transformBooking = async (booking) => {
    return {
        ...booking.doc,
                    _id: booking._id,
                    user: theUser.bind(this, booking._doc.user),
                    event: getSingleEvent.bind(this, booking._doc.event),
                    createdAt: dateToString(booking._doc.createdAt),
                    updatedAt: dateToString(booking._doc.updatedAt)
    }
}

const transformEvent = async (event) => {
    return {
        ...event._doc, 
        id: event.id, 
        date: dateToString(event._doc.date),
        creator: theUser.bind(this, event.creator)
    }
}

module.exports = {
    getBookings : async (args, req) => {
        if(!req.isAuth) {
            throw new Error("user is unauthenticated")
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking)
            })
        } catch(error) {
            console.log(error)
            throw error
        }
    },

    bookEvent: async (args, req) => {
        if(!req.isAuth) {
            throw new Error("user is unathenticated")
        }
        const fetchedEvent = await Event.findOne({
            _id: args.eventId
        })
        const booking = new Booking({
            user: req.userId,
            event: fetchedEvent
        });
        const result = await booking.save()
        return transformBooking(result)
    },

    cancelBooking: async (args, req) => {
        if(!req.isAuth){
            throw new Error("user is unathenticated")
        }
        const booking = await Booking.findById(args.bookingId).populate("event")
        const event = transformEvent(booking.event)
        try{
            await Booking.deleteOne({_id: args.bookingId})
            return event
        } catch(error) {
            console.log(error)
            throw error
        }
    }
}
