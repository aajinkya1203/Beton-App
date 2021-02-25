const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const couponsSchema = new mongoose.Schema({
    id:{
        type: String,
        require:true
    },
    name :{
        type: String,
        require:true,
    },
    amount :{
        type: String,
        require:true,
    },
    validity:{
        type: String,
        require: true
    },
    assigned: {
        type: Boolean,
        require: true
    },
    advertiserID: {
        type: ObjectId,
        ref: "Advertisers"
    },
    userID: {
        type: ObjectId,
        ref: "User"        
    }
});

module.exports = mongoose.model("Coupons", couponsSchema);