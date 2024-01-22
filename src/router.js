const router = require('express').Router();
const homeController = require('./controllers/homeController');
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');


//add endpoints with controllers
router.use(homeController);
router.use('/user', userController);
router.use('/post', postController);



router.get('*', (req, res) => {
    res.redirect('/404');
});

module.exports = router;