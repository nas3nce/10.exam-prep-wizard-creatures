const Creature = require('../models/Creature');


exports.create = (creatureData) => Creature.create(creatureData);

exports.getAll = () => Creature.find();

exports.getById = (id) => Creature.findById(id).populate('votes');

exports.update = (id, creatureData) => Creature.findByIdAndUpdate(id, creatureData);

exports.delete = (id) => Creature.findByIdAndDelete(id);

exports.getByOwner = (id) => Creature.find({ owner: id }).populate('owner');

exports.upvote = async (creatureId, userId) => {
    const creature = await this.getById(creatureId);

    if (!creature.votes.includes(userId)) {
        creature.votes.push(userId);
        return creature.save();
    }
};