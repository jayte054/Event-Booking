const Event = require("../../models/event.models")
const User = require("../../models/user.model")
const {dateToString} = require("../../helpers/date")
const {theUser} = require("./merge.resolver")

const transformEvent = async (event) => {
    return {
        ...event._doc, 
        _id: event._id, 
        date: dateToString(event._doc.date),
        creator: theUser.bind(this, event.creator)
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
           
        }
    }, 

    createEvent: async ( args, req) => {
        if(!req.isAuth) {
            throw new Error("user is unauthenticated")
        }
        const event = new Event({
            title: args.EventInput.title,
            description: args.EventInput.description,
            price: args.EventInput.price,
            date:  dateToString(args.EventInput.date),
            creator: req.userId
        });
        try {
            const eventUser = async (user) => {
                user = await User.findById(req.userId)
                if(!user) {
                    throw new Error("user does not exist")
                }
                
                user.createdEvents.push(event)
                console.log(user)
                await user.save()
                return event
            }
            eventUser()
            event.save()
            
            return event;
            // return {...event._doc, id: event.id, creator: theUser.bind(this, event._doc.creator)}
        } catch(error) {
            console.log(error);
            throw error
        }  
    },

}