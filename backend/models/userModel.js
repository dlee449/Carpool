const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    isDriver: {
        type: Boolean,
        required: true
    },
    driver_info: {
        car_brand: {
            type: String
        },
        car_model: {
            type: String
        },
        car_color: {
            type: String
        },
        plate_number: {
            type: String
        },
        occupation: {
            type: String
        }
        // photo: {
        //     type: Buffer
        // },
    }
})

// static signup method
userSchema.statics.signup = async function(email, first_name, last_name, password, phone_number, isDriver, driver_info) {

    // validation
    if (!email || !password || !first_name || !last_name || !phone_number){
        throw Error('All fields must be filled')
    }
    if(!email.includes('@emory.edu', -10)) {
        throw Error('Not a valid emory email')
    }
    //minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
    if(!validator.isStrongPassword(password)){
        throw Error('Password not strong enough')
    }
    if(!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone_number)){
        throw Error('Not a valid phone number')
    }
    if(isDriver){
        if(!driver_info
            || driver_info.car_brand ===null
            || driver_info.car_model===null
            || driver_info.car_color===null 
            || driver_info.plate_number===null 
            || driver_info.occupation===null){
                throw Error('Driver info field must be filled')
            }
    }


    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ email, password: hash, first_name, last_name, phone_number, isDriver, driver_info})

    return user

}

// static login method
userSchema.statics.login = async function(email, password){
    if (!email || !password){
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({ email })

    if (!user) {
        throw Error('Incorrect email')
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match){
        throw Error('Incorrect password')
    }

    return user
}

module.exports = mongoose.model('User', userSchema)