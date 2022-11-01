const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const status = ['Active', 'Inactive'];
const bools = [true, false];

const UserSchema = new Schema({
    username: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    password: { type: String, required: true, index: true },
    
    status: { type: String, default: 'Active', enum: status },
    isDeleted: { type: String, default: false, enum: bools },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('user', UserSchema);