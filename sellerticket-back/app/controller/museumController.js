const db = require('../config/db.config.js')
const config = require('../config/config.js')
const nodemailer = require('nodemailer');
const User = db.user
const Sequelize = require('sequelize');
const UserRoles = db.userRoles
const Role = db.role
const ActivityMethod = db.activityMethod

const Activity = db.activity
const Museum = db.museum
const Op = db.Sequelize.Op

var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')

exports.createMuseumActivity = (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'Jamecr745@gmail.com',
      pass: 'rnvh tqgy bxvv rlpg' 
    }
  });

    // Extract data from request body
    let userId = req.userId
    const {
      date,
      museumId,
      ticket,
      type,
      round,
      childMethod,
      studentMethod,
      adultMethod,
      ageChild,
      ageStudent,
      ageAdult,
      fullname,
      phone,
      email,
      position,
      school,
      address,
      paymentmethod,
      slip,
      ticketId,
      total
    } = req.body;
    let mailOptions = {
      from: 'Jamecr745@gmail.com',               
      to: ['Kunakron_aa@kkumail.com' , email ],                
      subject: 'แจ้งเตือนการสั่งซื้อ',              
      html: ` 
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f8f8;">
      <h2 style="color: #1E90FF;">แจ้งเตือนการสั่งซื้อ</h2>
      <hr style="border: 1px solid #ddd;">
      <p>
        <strong>ชื่อตั๋ว:</strong> ${ticket}<br>
        <strong>Ticket ID:</strong> ${ticketId}<br>
        <strong>ชื่อ:</strong> ${fullname}<br>
        <strong>ประเภท:</strong> ${type}<br>
        <strong>เบอร์ติดต่อ:</strong> ${phone}<br>
        <strong>อีเมล:</strong> ${email}<br>
        <strong>รอบ:</strong> ${round}<br>
        <strong>จำนวนเด็ก:</strong> ${childMethod} คน, ช่วงอายุ ${ageChild}<br>
        <strong>จำนวนนักศึกษา:</strong> ${studentMethod} คน, ช่วงอายุ ${ageStudent}<br>
        <strong>จำนวนผู้ใหญ่:</strong> ${adultMethod} คน, ช่วงอายุ ${ageAdult}<br>
        <strong>ราคารวม:</strong> ${total} บาท
      </p>
    </div>`   
    };
    let status = "Pending"
    let ticketquantity = parseInt(childMethod) +  parseInt(studentMethod) + parseInt(adultMethod)
    // Create a new activity record
    Activity.findByPk(museumId).then((data) => {
      if(data){
          data.ticketquantity = parseInt(data.ticketquantity) - parseInt(ticketquantity)
          if(data.ticketquantity < 1){
            res.status(200).send({
              message: 'Cant edit ticket is full',
              status: 400
            });
          }else{
            data.save()
            ActivityMethod.create({
              round,
              childMethod,
              studentMethod,
              adultMethod,
              ageChild,
              ageStudent,
              ageAdult
            })
              .then((activity) => {
                // Use the generated activity ID to save museum activity
                Museum.create({
                  date,
                  museumId,
                  ticket,
                  type,
                  activityMethod: activity.id, // Use the generated activity ID here
                  fullname,
                  phone,
                  email,
                  position,
                  school,
                  address,
                  paymentmethod,
                  slip,
                  ticketId,
                  userId,
                  total,
                  status,
                  ticketquantity
                })
                .then((museumActivity) => {
                  
                  res.status(201).send({
                    message: 'Museum activity created successfully',
                    museumActivity
                  });
                  transporter.sendMail(mailOptions, function (err, info) {
                    if(err){
                      console.log(err)
                    }else{
                      console.log(info);
                    }
                 });
                })
                .catch((err) => {
                  res.status(500).send({
                    message: 'Error creating museum activity',
                    error: err.message
                  });
                });
              })
              .catch((err) => {
                res.status(500).send({
                  message: 'Error creating activity',
                  error: err.message
                });
              });
          }
      }
    })
  
  };

  exports.getMuseumById = (req, res) => {
    const museumId = req.params.id; // Extract museum ID from request parameters
  
    // Find the museum by ID in the database
    Museum.findByPk(museumId)
      .then((museum) => {
        if (!museum) {
          return res.status(404).send({
            message: 'Museum not found'
          });
        }

        ActivityMethod.findByPk(museum.activityMethod)
        .then((activity) => {
          if (!activity) {
            return res.status(404).send({ message: 'Activity method not found' });
          }
          res.status(200).send({
            message: 'Museum found',
            museum,
            activity
          });
        })
  
      })
      .catch((err) => {
        // Error occurred while querying the database
        res.status(500).send({
          message: 'Error retrieving museum',
          error: err.message
        });
      });
  };


  exports.getMuseumDeleteById = (req, res) => {
    const museumId = req.params.id; // Extract museum ID from request parameters

    // Find the museum by ID in the database
    Museum.findByPk(museumId)
        .then((museum) => {
            if (!museum) {
                return res.status(404).send({
                    message: 'Museum not found'
                });
            }

            // Update the status of the museum to "cancel"
            museum.status = 'Cancel';

            // Save the changes to the database
            museum.save()
                .then(() => {
                  const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'Jamecr745@gmail.com',
                      pass: 'rnvh tqgy bxvv rlpg' 
                    }
                  });

                  let mailOptions = {
                    from: 'Jamecr745@gmail.com',               
                    to: ['Kunakron_aa@kkumail.com' , museum.email ],                
                    subject: 'แจ้งเตือนยกเลิกการสั่งซื้อ',              
                    html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f8f8;">
                    <h2 style="color: #FF0000;">ยกเลิกตั๋ว</h2>
                    <hr style="border: 1px solid #ddd;">
                    <p>
                      <strong>ชื่อตั๋ว:</strong> ${museum.ticket}<br>
                      <strong>Ticket ID:</strong> ${museum.ticketId}<br>
                      <strong>ชื่อ:</strong> ${museum.fullname}<br>
                      <strong>ประเภท:</strong> ${museum.type}<br>
                      <strong>เบอร์ติดต่อ:</strong> ${museum.phone}<br>
                      <strong>อีเมล:</strong> ${museum.email}<br>
                      <strong>รอบ:</strong> ${museum.round}<br>
                      <strong>จำนวนเด็ก:</strong> ${museum.childMethod} คน, ช่วงอายุ ${museum.ageChild}<br>
                      <strong>จำนวนนักศึกษา:</strong> ${museum.studentMethod} คน, ช่วงอายุ ${museum.ageStudent}<br>
                      <strong>จำนวนผู้ใหญ่:</strong> ${museum.adultMethod} คน, ช่วงอายุ ${museum.ageAdult}<br>
                      <strong>ราคารวม:</strong> ${museum.total} บาท
                    </p>
                  </div>`   
                  };

                  transporter.sendMail(mailOptions, function (err, info) {
                    if(err){
                      console.log(err)
                    }else{
                      console.log(info);
                    }
                 });
                    res.status(200).send({
                        message: 'Museum status updated to cancel',
                        status:200
                    });
                })
                .catch((err) => {
                    // Error occurred while saving the changes
                    res.status(500).send({
                        message: 'Error updating museum status',
                        error: err.message,
                        status:400
                    });
                });
        })
        .catch((err) => {
            // Error occurred while querying the database
            res.status(500).send({
                message: 'Error retrieving museum',
                error: err.message
            });
        });
};

  exports.getMuseumActivitiesByUserAndTicket = (req, res) => {
    const  userId  = req.userId;
  
    // Query museum activities based on userId and ticketId
    Museum.findAll({
      where: {
        userId: userId,
      }
    })
    .then((museumActivities) => {
        console.log("userId",userId)
        console.log("museumActivities",museumActivities)
      if (!museumActivities || museumActivities.length === 0) {
        return res.status(404).send({ message: 'No museum activities found for the provided user and ticket' });
      }
      res.status(200).send({ "data":museumActivities });
    })
    .catch((err) => {
      res.status(500).send({ message: 'Error retrieving museum activities', error: err.message });
    });
  };


  exports.getMuseumIndex = (req, res) => {
    const  userId  = req.userId;
    let hashMap = new Map();
    // Query museum activities based on userId and ticketId
    Museum.findAll( {        
      status: {
      [Sequelize.Op.ne]: 'Cancel' 
      }
    })
    .then((museumActivities) => {
      console.log(museumActivities)
      if (!museumActivities || museumActivities.length === 0) {
        return res.status(404).send({ message: 'No museum activities found for the provided user and ticket' });
      }
      let ticketMuseum = ''
      museumActivities.forEach(el => {
        if(hashMap.has(el.ticket)){
          let data = hashMap.get(el.ticket)
          hashMap.set(el.ticket , data + parseInt(el.ticketquantity))
        }else{
          ticketMuseum = el.museumId
          hashMap.set(el.ticket , parseInt(el.ticketquantity))
        }
      });
      const arrayOfObjects = Array.from(hashMap.entries()).map(([name, total]) => ({ name, total }));
      res.status(200).send({ "data":arrayOfObjects });
    })
    .catch((err) => {
      res.status(500).send({ message: 'Error retrieving museum activities', error: err.message });
    });
  };


  exports.getMuseumIndexFilterDate = (req, res) => {
    const  userId  = req.userId;
    let date = req.query.date
    let hashMap = new Map();
    // Query museum activities based on userId and ticketId
    Museum.findAll({
      where: {
          date: date,
          status: {
            [Sequelize.Op.ne]: 'Cancel' // Filter out activities where status is not 'cancel'
        }
      }
    })
    .then((museumActivities) => {
      console.log(museumActivities)
      if (!museumActivities || museumActivities.length === 0) {
        return res.status(404).send({ message: 'No museum activities found for the provided user and ticket' });
      }
      let ticketMuseum = 0
      museumActivities.forEach(el => {
        console.log("dataPost",el)
        if(hashMap.has(el.ticket)){
          let data = hashMap.get(el.ticket)
          hashMap.set(el.ticket , data + parseInt(el.ticketquantity))
        }else{
          ticketMuseum = el.museumId
          hashMap.set(el.ticket , parseInt(el.ticketquantity))
        }
        console.log("hashMap",hashMap)
      });

      const arrayOfObjects = Array.from(hashMap.entries()).map(([name, total]) => ({ name, total }));
      console.log(arrayOfObjects);
      res.status(200).send({ "data":arrayOfObjects });
      
    })
    .catch((err) => {
      res.status(500).send({ message: 'Error retrieving museum activities', error: err.message });
    });
  };

  

  exports.getPost = (req, res) => {
    const  userId  = req.userId;
  
    // Query museum activities based on userId and ticketId
    Museum.findAll({
      where: {
        userId: userId,
      }
    })
    .then((museumActivities) => {
        console.log("userId",userId)
        console.log("museumActivities",museumActivities)
      if (!museumActivities || museumActivities.length === 0) {
        return res.status(404).send({ message: 'No museum activities found for the provided user and ticket' });
      }
      res.status(200).send({ "data":museumActivities });
    })
    .catch((err) => {
      res.status(500).send({ message: 'Error retrieving museum activities', error: err.message });
    });
  };


  exports.editActivityMethod = (req, res) => {
    const { activityMethodId } = req.params; // Extract activity method ID from request parameters
    const {
      round,
      childMethod,
      studentMethod,
      adultMethod,
      ageChild,
      ageStudent,
      ageAdult,
      customerName
    } = req.body;
  
    let oldData = 0
    // Find the activity method by ID in the database
    ActivityMethod.findByPk(activityMethodId)
      .then((activity) => {
        if (!activity) {
          return res.status(404).send({ message: 'Activity method not found' });
        }
  
        // Update the activity method fields
        oldData = parseInt(activity.childMethod) + parseInt(activity.studentMethod) + parseInt(activity.adultMethod)
        activity.round = round;
        activity.childMethod = childMethod;
        activity.studentMethod = studentMethod;
        activity.adultMethod = adultMethod;
        activity.ageChild = ageChild;
        activity.ageStudent = ageStudent;
        activity.ageAdult = ageAdult;
        // Save the updated activity method
        activity.save()
          .then((updatedActivity) => {
            res.status(200).send({
              message: 'Activity method updated successfully',
              activity: updatedActivity
            });
          })
          .catch((err) => {
            res.status(500).send({ message: 'Error updating activity method', error: err.message });
          });
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error finding activity method', error: err.message });
      });

      if(customerName){
        Museum.findOne({ where: { activityMethod: activityMethodId } })
        .then((museum) => {
          if (!museum) {
            return res.status(404).send({
              message: 'Museum not found'
            });
          }
          museum.fullname = customerName
          museum.total = (childMethod * 80) + (studentMethod * 120) + (adultMethod * 160)
          museum.ticketquantity = parseInt(childMethod) + parseInt(studentMethod) + parseInt(adultMethod)
          Activity.findByPk(museum.museumId).then((data) => {
            if(data){
                data.ticketquantity = parseInt(data.ticketquantity) - parseInt(museum.ticketquantity) + oldData
                if(data.ticketquantity < 1){
                  res.status(200).send({
                    message: 'Cant edit ticket is full',
                    status: 400
                  });
                }else{
                  data.save()
                }
            }
          })
          museum.save()
          .then((updatedActivity) => {
            res.status(200).send({
              message: 'Activity method updated successfully',
              activity: updatedActivity
            });
          })
          .catch((err) => {
            res.status(500).send({ message: 'Error updating activity method', error: err.message });
          });
        })
        .catch((err) => {
          // Error occurred while querying the database
          res.status(500).send({
            message: 'Error retrieving museum',
            error: err.message
          });
        });
      }
    
    
  };
  