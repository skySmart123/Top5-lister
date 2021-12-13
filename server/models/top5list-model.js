const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5ListSchema = new Schema(
    {
        name: {type: String, required: true},
        items: {type: [String], required: true},

        // user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        user: {type: Schema.Types.ObjectId, ref: 'User', required: false},

        community: {type: Boolean, default: false, required: false,},
        votes: {type: [Number], default: [], required: false},

        comments: [{
            text: String,
            // user_id: {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            commentAt: {
                type: Date,
                default: Date.now
            },
        }],
        ups: {type: [{type: Schema.Types.ObjectId, ref: 'User'}], default: [], required: false,},
        downs: {type: [{type: Schema.Types.ObjectId, ref: 'User'}], default: [], required: false,},

        views: {type: Number, default: 0, required: false,},

        published: {type: Boolean, default: false, required: false,},
        publishedAt: {type: Date, default: null, required: false,},
    },
    {
        timestamps: true,
        // autoCreate: true,
        // toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
        // toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals
    },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
