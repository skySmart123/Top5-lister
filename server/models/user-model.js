const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const UserSchema = new Schema(
    {
        username: {type: String, required: true, index: true, unique: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true, index: true, unique: true},
        passwordHash: {type: String, required: true}
    },
    {
        timestamps: true,
        toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
        toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals
    }
)

// https://mongoosejs.com/docs/populate.html#populate-virtuals
// Specifying a virtual with a `ref` property is how you enable virtual population
UserSchema.virtual('lists', {
    ref: 'Top5List',
    localField: '_id',
    foreignField: 'user'
});

module.exports = mongoose.model('User', UserSchema)
