const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require("../lib/jwt");
const { SECRET } = require("../constants");

async function validatePassword(password, userPassword) {
    const isValid = await bcrypt.compare(password, userPassword);

    if (!isValid) {
        throw new Error('Invalid inputs');
    }

}

async function getToken(user) {
    const payload = { _id: user._id, email: user.email };

    const token = await jwt.sigh(payload, SECRET, { expiresIn: '3d' });
    return token;
}

exports.register = async (userData) => {
    const user = await User.create(userData);

    await validatePassword(userData.password, user.password);

    const token = getToken(user);
    return token;
};


exports.login = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid inputs');
    }

    await validatePassword(password, user.password);

    const token = getToken(user);
    return token;

};

exports.getById = (id) => User.findById(id)