const verifySignUp = require('./verifySignUp')
const authJwt = require('./verifyJwtToken')
// [authJwt.verifyToken , authJwt.isAdmin]
module.exports = function (app) {
  const userController = require('../controller/userController.js')
  const activityController = require('../controller/activityController.js')
  const museumController = require('../controller/museumController.js')
  // const adminController = require('../controller/adminController.js')


  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })

  // Manage user

  app.post(
    '/api/auth/signup',
    [
      verifySignUp.checkDuplicateUserNameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    userController.signup
  )

  app.post('/api/auth/signin', userController.signin)

  app.get('/api/auth/getUserProfile',[authJwt.verifyToken], userController.getUserProfile)

  app.post('/api/auth/editUserProfile',[authJwt.verifyToken],userController.editUserProfile)

  app.get('/api/activityall',[authJwt.verifyToken],activityController.getActivity)

  app.get('/api/activityall2',[authJwt.verifyToken],museumController.getMuseumIndex)

  app.get('/api/activityallfilter',[authJwt.verifyToken],museumController.getMuseumIndexFilterDate)

  app.post('/api/savemuseum',[authJwt.verifyToken],museumController.createMuseumActivity)
  
  app.get('/api/getmuseum',[authJwt.verifyToken],museumController.getMuseumActivitiesByUserAndTicket)

  app.get('/api/gethistoryactivity',[authJwt.verifyToken],activityController.getActivitiesByUserId)

  app.post('/api/deleteMuseum/:id',[authJwt.verifyToken],museumController.getMuseumDeleteById)
  
  app.get('/api/getdetailticket/:id',[authJwt.verifyToken],museumController.getMuseumById)

  app.post('/api/editActivityMethod/:activityMethodId',[authJwt.verifyToken],museumController.editActivityMethod)
}
