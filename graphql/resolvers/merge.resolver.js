const Event = require("../../models/event.models")
const {dateToString} = require("../../helpers/date")
const User = require("../../models/user.model")

const transformEvent = async (event) => {
    return {
        ...event._doc, 
        id: event.id, 
        date: dateToString(event._doc.date),
        creator: theUser.bind(this, event.creator)
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

exports.theUser = theUser;
exports.events = events;
exports.getSingleEvent = getSingleEvent;