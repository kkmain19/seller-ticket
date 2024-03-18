const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const db = require('../config/db.config.js');
const User = db.user;
const UserRoles = db.userRoles;

verifyToken = (req, res, next) => {
	let token = req.headers['x-access-token'];
  
	if (!token){
		return res.status(403).send({ 
			auth: false, message: 'No token provided.' 
		});
	}

	jwt.verify(token, config.secret, (err, decoded) => {
		if (err){
			return res.status(403).send({ 
					auth: false, 
					message: 'Fail to Authentication. Error -> ' + err 
				});
		}
		req.userId = decoded.id;
		next();
	});
}

isAdmin = (req, res, next) => {	
	User.findById(req.userId)
		.then(user => {
			UserRoles.findAll({
				where: {
					roleId: 2,
					userId: req.userId
				  }
			}).then((data) => {
				console.log(data)
				if(data.length > 0){
					next();
					return;
				}else{
					res.status(403).send("Require Admin Role!");
					return;
				}
			}).catch(err => {
				res.status(400).send("Error" + err);
				return;
			});
		})
}


const authJwt = {};
authJwt.verifyToken = verifyToken;
authJwt.isAdmin = isAdmin;

module.exports = authJwt;