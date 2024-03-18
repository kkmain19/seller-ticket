const db = require('../config/db.config.js')
const config = require('../config/config.js')
const User = db.user
const UserRoles = db.userRoles
const Occupied = db.occupied
const Role = db.role
const Concert = db.concert

const Op = db.Sequelize.Op

var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')

exports.signup = (req, res) => {
  // Save User to Database
  console.log("start")
  User.create({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phone: req.body.phone,
    address: req.body.address,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      })
        .then((roles) => {
          const userId = user.dataValues.id
          const roleId = roles[0].dataValues.id
          UserRoles.create({
            roleId: roleId,
            userId: userId
          }).then(() => {
            console.log("register success")
            res.send({ message: 'Registered successfully!',status:200 })
          })
        })
        .catch((err) => {
          console.log(err.message)
          res.status(500).send({ message: err.message })
        })
    })
    .catch((err) => {
      console.log(err.message)
      res.status(500).send({ message: err.message })
    })
}

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ reason: 'User Not Found.' })
      }

      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
      if (!passwordIsValid) {
        return res
          .status(401)
          .send({
            auth: false,
            accessToken: null,
            reason: 'Invalid Password!',
            username: null,
            authorities: [],
          })
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400000, // expires in 24 hours
      })

      let authorities = []
      UserRoles.findAll({
        where: { userId: user.id },
      })
        .then((userRoles) => {
          console.log(userRoles)
          return userRoles.map((userRole) => userRole.dataValues.roleId)
        })
        .then((roles) => {
          console.log('roles', roles)
          Role.findAll({
            where: { id: roles },
          }).then((role) => {
            for (let i = 0; i < role.length; i++) {
              console.log(role[i].dataValues.name)
              authorities.push('ROLE_' + role[i].dataValues.name)
              console.log(authorities)
            }

            res.status(200).send({
              auth: true,
              accessToken: token,
              username: user.username,
			  image:user.image,
              authorities: authorities,
            })
          })
        })
    })
    .catch((err) => {
      res.status(500).send({ reason: err.message })
    })
}

exports.getUserProfile = (req, res) => {
  let userId = req.userId
  User.findOne({
    where: {
      id: userId,
    },
    // attributes: ['id', 'username', 'email', 'image', ],
    attributes: ['id', 'username', 'email', 'firstname','lastname','phone','address','image','username' ],
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ reason: 'User Not Found.' })
      }
      res.status(200).send({
        user: user,
      })
    })
    .catch((err) => {
      res.status(500).send({ reason: err.message })
    })
}


exports.editUserProfile =  (req, res) => {
  let userId = req.userId
  let {firstname , lastname , phone , email , address , image , username} = req.body
  User.findOne({
    where: {
      id: userId,
    },
    // attributes: ['id', 'username', 'email', 'image', ],
    attributes: ['id', 'email', 'firstname','lastname','phone','address','image','username'],
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ reason: 'User Not Found.' })
      }
      user.firstname = firstname;
      user.lastname = lastname;
      user.phone = phone;
      user.image = image
      user.email = email;
      user.address = address;
      user.username = username;
      await user.save()
      res.status(200).send({
        user: user,
      })
    })
    .catch((err) => {
      res.status(500).send({ reason: err.message })
    })
}
