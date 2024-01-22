const router = require('express').Router();
const creatureService = require('../services/creatureService');
const userService = require('../services/userService');
const { extractError } = require('../utils/errorHandler');
const { isAuth } = require('../middlewares/authMiddleware');


router.get('/all', async (req, res) => {
    const creatures = await creatureService.getAll().lean();
    res.render('post/all-posts', { creatures });
});

router.get('/create', isAuth, (req, res) => {
    res.render('post/create');
});

router.post('/create',isAuth, async (req, res) => {
    const { name, species, skinColor, eyeColor, image, description } = req.body;
    const payload = {
        name,
        species,
        skinColor,
        eyeColor,
        image,
        description,
        owner: req.user
    };

    try {
        await creatureService.create(payload);
        res.redirect('/post/all');

    } catch (error) {
        const errorMessages = extractError(error);
        res.status(404).render('post/create', { errorMessages });
    }


});

router.get('/profile', isAuth, async (req, res) => {
    const ownerId = req.user._id;

    // const owner = await userService.getById(ownerId);
    // const ownerFullName = owner.fullName;

    const ownerCreatures = await creatureService.getByOwner(ownerId).lean();
    // const mappedCreatures = ownerCreatures.map(c => ({ ...c, ownerFullName }));

    console.log(ownerCreatures);

    res.render('post/my-posts', { ownerCreatures });
});

router.get('/:creatureId', async (req, res) => {
    const { creatureId } = req.params;

    const creature = await creatureService.getById(creatureId).lean();

    const owner = await userService.getById(creature.owner).lean();

    const { user } = res.locals;

    const currentIsOwner = creature.owner == user?._id;

    const hasVoted = creature.votes?.some(v => v._id?.toString() === user?._id);

    const concatenatedVoters = creature.votes?.map(v => v.email).join(' , ');

    res.render('post/details', { creature, owner, currentIsOwner, hasVoted, concatenatedVoters });

});

router.get('/edit/:creatureId', isAuth, async (req, res) => {
    const { creatureId } = req.params;

    const creature = await creatureService.getById(creatureId).lean();

    res.render('post/edit', creature);

});

router.post('/edit/:creatureId', isAuth, async (req, res) => {
    const { name, species, skinColor, eyeColor, image, description } = req.body;
    const payload = { name, species, skinColor, eyeColor, image, description };

    const { creatureId } = req.params;

    await creatureService.update(creatureId, payload);

    res.redirect(`/post/${creatureId}`);
});

router.get('/delete/:creatureId', isAuth, async (req, res) => {
    const { creatureId } = req.params;

    await creatureService.delete(creatureId);

    res.redirect('/post/all');

});

router.get('/vote/:creatureId', isAuth, async (req, res) => {
    const { creatureId } = req.params;
    const { _id } = req.user;



    await creatureService.upvote(creatureId, _id);



    res.redirect(`/post/${creatureId}`);
});


module.exports = router;