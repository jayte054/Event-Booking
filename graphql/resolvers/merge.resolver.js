const Event = require("../../models/event.models")
const {dateToString} = require("../../helpers/date")
const User = require("../../models/user.model")



const transformEvent = async (event) => {
    return {
        ...event._doc, 
        _id: event._id, 
        date: dateToString(event._doc.date),
        creator: theUser.bind(this, event.creator)
    }
}

const theUser = async (userId) => {
    
    try{
        const response = await User.findById(userId)
        console.log("rr", response)
        // if (!response) {
        //     // If response is null (user not found), return null or handle the error as appropriate
        //     // console.log(null);
        //     return null
        // }
            return {
                    ...response._doc, 
                    _id: response._id,
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
exports.transformEvent = transformEvent;