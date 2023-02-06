const findDriver = require('../models/findDriverModel')
const mongoose = require('mongoose')

// get all workouts
const get_pending_ride = async (req, res) => {
    const passenger_id = req.user._id
    // sort newest ones at the top created by the user_id
    const pending_ride = await findDriver.find({ passenger_id }).sort({createdAt: -1})

    res.status(200).json(pending_ride)
}

// // get a single workout
// const getWorkout = async (req, res) => {
//     const {id} = req.params

//     if (!mongoose.Types.ObjectId.isValid(id)){
//         return res.status(404).json({error: 'No such workout'})
//     }

//     const workout = await Workout.findById(id)

//     if (!workout) {
//         return res.status(404).json({error: 'No such workout'})
//     }

//     res.status(200).json(workout)
// }

// request ride
const requestride = async (req, res) => {
    const {from, to, pick_up, destination, num_of_pass} = req.body

    let emptyFields = []

    if(!from){
        emptyFields.push('from')
    }
    if(!to){
        emptyFields.push('to')
    }
    if(!pick_up){
        emptyFields.push('pick_up')
    }
    if(!destination){
        emptyFields.push('destination')
    }
    if(!num_of_pass){
        emptyFields.push('num_of_pass')
    }
    if(emptyFields.length > 0){
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields})
    }


    // add doc to db
    try {
        const passenger_id = req.user._id
        const requestride = await findDriver.create({
            from,
            to,
            pick_up,
            destination,
            num_of_pass,
            passenger_id
        })

        res.status(200).json(requestride)
    } catch (error){

        res.status(400).json({error: error.message})

    }
}

// delete a request
const deleteRequest = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such request'})
    }

    const request = await findDriver.findOneAndDelete({_id: id})

    if (!request) {
        return res.status(404).json({error: 'No such request'})
    }

    res.status(200).json(request)
}


// update a request
const updateRequest = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such request'})
    }

    const request = await findDriver.findOneAndUpdate({_id:id}, {
        ...req.body
    })

    if (!request) {
        return res.status(404).json({error: 'No such request'})
    }

    res.status(200).json(request)
}



module.exports = {
    get_pending_ride,
    requestride,
    deleteRequest,
    updateRequest
}