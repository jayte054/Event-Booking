const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const User = require("../../models/user.model")
const {events} = require("./merge.resolver")

const transformUser = (user) => {
    return{...user._doc, 
        id: user.id, 
        password: null,
        createdEvents: events.bind(this, user._doc.createdEvents)}
}


module.exports = {
    getUsers: async (req) => {
        if(req.isAuth) {
            throw new Error("user is not admin")
        }
        const result = await User.find().populate("createdEvents")
        try{
            return result.map((user) => {
            //     return{...user._doc, 
            //             id: user.id, 
            //             password: null,
            //             createdEvents: events.bind(this, user._doc.createdEvents)}
            return transformUser(user)
            })
        } catch(error) {
            console.log(error)
            throw error
        }
    },

    createUser: async (args) => {
        try{
        const existingUser = await User.findOne({email: args.UserInput.email})
        if(existingUser){
            throw new Error("user already exists")
        }
          
        const hashedPassword = await bcrypt.hash(args.UserInput.password, 12)
        const user = new User({
          
            email: args.UserInput.email,
            password: hashedPassword
        });
        
        
         await user.save()
         console.log("user created successfully")
         return {
            id: user.id,
            email: user.email,
            password: null
            
         }
        } catch(error) {
            console.log(error)
            throw error
        }
    },

    userLogin: async ({email, password}) => {
        const user = await User.findOne({email: email});
        if(!user){
            throw new Error ("User does not exist")
        }
        const truePassword = await bcrypt.compare(password, user.password);
        if(!truePassword) {
            throw new Error("incorrectPassword")
        }

        const token = jwt.sign({userId: user.id, email: user.email}, "mySecretKey123",{ 
            expiresIn: "1h"
        })
        return{
            userId: user.id,
            token: token,
            tokenExpiration: 1
        }
    }
}