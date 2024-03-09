const { Router } = require('express');
const { upload } = require('./configs/multer')
const schemaValidator = require('./apps/middlewares/schemaValidator')

const AuthenticationController = require('./apps/controllers/AuthenticationController')
const AuthSchema = require('./schema/auth.schema.json')
const AuthenticationMiddleware = require('./apps/middlewares/authentication')

const UserController = require('./apps/controllers/UserController')
const userSchema = require('./schema/create.user.schema.json')

const FileController = require('./apps/controllers/FileController')

const SeriesController = require('./apps/controllers/SeriesController')
const seriesSchema = require('./schema/series.schema.json')

const ListsController = require('./apps/controllers/ListsController')
const listsSchema = require('./schema/lists.schema.json')

const FollowsController = require('./apps/controllers/FollowsController')
const followsSchema = require('./schema/follows.schema.json');

const FeedController = require('./apps/controllers/FeedController');

const LikeController = require('./apps/controllers/LikeController');
const likeSchema = require('./schema/likes.schema.json');

const CommentariesController = require('./apps/controllers/CommentariesController');
const commentariesSchema = require('./schema/commentaries.schema.json');

const routes = new Router();

routes.post("/user", schemaValidator(userSchema), UserController.create);
routes.post("/auth", schemaValidator(AuthSchema), AuthenticationController.authenticate);
routes.get("/health", (req, res)=>{
    return res.send({message: "Connect with success!"});
})
routes.use(AuthenticationMiddleware)
routes.get('/user', UserController.userProfile)
routes.put('/user', UserController.update)
//routes.delete('/user', UserController.delete)
routes.get('/users', UserController.allUsers)

routes.post('/upload', upload.single('image'), FileController.upload)

routes.post('/series', schemaValidator(seriesSchema), SeriesController.create)
routes.get('/series', SeriesController.listAllSeries)
routes.get('/series/:id', SeriesController.listSerie)
routes.delete('/series/:id', SeriesController.delete)

routes.post('/lists', schemaValidator(listsSchema), ListsController.create)
routes.get('/lists/:id', ListsController.getList)
routes.put('/lists/:id', ListsController.updateList)
routes.delete('/lists/:id', ListsController.delete)

routes.get('/user-list/:id', ListsController.userList)

routes.post('/follows', schemaValidator(followsSchema), FollowsController.create)
routes.delete('/follows/:id', FollowsController.delete)
routes.get('/follows/:id', FollowsController.getFollow)

routes.get('/feed', FeedController.getHome)
routes.delete('/feed/:id', FeedController.delete)

routes.post('/like', schemaValidator(likeSchema), LikeController.create)
routes.delete('/like/:id', LikeController.delete)
routes.get('/like/:id', LikeController.getLikes)
routes.get('/like-user/:id', LikeController.getUserLike)

routes.post('/commentary', schemaValidator(commentariesSchema), CommentariesController.create)
routes.get('/commentary/:id', CommentariesController.getCommentaries)
routes.delete('/commentary/:id', CommentariesController.delete)

routes.get('/commentary-size/:id', CommentariesController.getSizeCommentaries)


module.exports = routes;