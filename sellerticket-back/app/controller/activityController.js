const db = require('../config/db.config.js')
const config = require('../config/config.js')
const User = db.user
const UserRoles = db.userRoles
const Role = db.role
const Activity = db.activity
const Museum = db.museum
const Op = db.Sequelize.Op

var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')

exports.getActivity = (req, res) => {
    Activity.findAll()
      .then((data) => {
        if (!data) {
          return res.status(404).send({ reason: 'Data Not Found.' })
        }
        res.status(200).send({
          activity: data,
        })
      })
      .catch((err) => {
        res.status(500).send({ reason: err.message })
      })
}


exports.getActivitiesByUserId = (req, res) => {
    const userId = req.userId;

    // Find museums associated with userId
    Museum.findAll({
        where: {
            userId: userId,
        }
    })
        .then((museums) => {
            if (!museums || museums.length === 0) {
                return res.status(404).send({ message: 'No museums found for the provided userId' });
            }

            const museumIds = museums.map(museum => museum.museumId);

            // Find activities associated with museumIds
            Activity.findAll({
                where: {
                    id: museumIds
                }
            })
                .then((activities) => {
                    if (!activities || activities.length === 0) {
                        return res.status(404).send({ message: 'No activities found for the provided userId' });
                    }
                    
                    // Customizing the response

                    const customResponse = activities.map(activity => ({
                        activityname: activity.activityname,
                        date: museums.find(museum => museum.museumId === activity.id).date
                    }));

                    res.status(200).send({ activities: customResponse });
                })
                .catch((err) => {
                    res.status(500).send({ message: 'Error retrieving activities', error: err.message });
                });
        })
        .catch((err) => {
            res.status(500).send({ message: 'Error retrieving museums', error: err.message });
        });
};
