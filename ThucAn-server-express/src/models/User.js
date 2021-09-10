// Quản lý người dùng/ khách hàng
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        fullName: String,
        avatar: String,
        dateOfBirth: String,
        male: Boolean,
        address: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('users', UserSchema)