const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, minLength: 3 },
    lastName: { type: String, required: true, minLength: 3 },
    email: { type: String, required: true, unique: true, minLength: 10 },
    password: { type: String, required: true, minLength: 4 },
    fullName: { type: String }
});

// userSchema.path('email').validate(function (email) {
//     const user = mongoose.model('User').findOne({ email });
//     return !!email;
// / / }, 'E-mail already exist!');     

userSchema.virtual('repeatPassword').set(function (value) {
    if (value !== this.password) {
        throw new Error('Password Mismatch');
    }
});

userSchema.pre('save', async function () {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
});

userSchema.pre('save', async function () {
    this.fullName = `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model('User', userSchema);

module.exports = User;