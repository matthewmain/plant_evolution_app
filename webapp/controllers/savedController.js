const db = require("../models")
const mongoose = require("mongoose")

const SavedControllers = {

  saved: function(req, res) {
    console.log('\n👥 💾💾💾 🌺 Attempting get users saved games 🌺 💾💾💾 👥')
    db.User.findOne({_id: req.user._id}, "saved")
      .then(resp => {
        console.log(" - 👥 💾💾💾  🌺 return saved games manifests 🌺 💾💾💾 👥\n")
        res.json(resp.saved)
      })
      .catch(err => res.status(422).json(err) )
  },

  save: function(req, res, next) {
    console.log('\n👥 💾 🌺 Attempting user save 🌺 💾 👥')
    console.log(' - '+req.body.username+"\n"+req.body.manifest)
    req.body.user = req.user._id
    db.Saved.create(req.body)
      .then(resp => {
        resp.manifest.saved_id = resp._id
        db.User.findOneAndUpdate(
          {_id: req.body.user},
          {$push: {saved: resp.manifest }
        })
          .then(() => {
            console.log(" - 👥 💾 🌺 User saves new game 🌺 💾 👥\n")
            res.json({ message: 'Successfully saved game' })
          })
          .catch(err => res.status(422).json(err) )

      })
      .catch(err => res.status(422).json(err))
  },

  resume: function(req, res) {
    console.log(" 👤 💾 💥 🌺 attempting resume saved game 🌺 💥 💾 👤" )
    console.log(' - '+req.body)
    db.Saved.findOne({_id: req.body._id, user: req.user._id})
      .then(resp => {
        console.log(" 👤 💾 💥 🌺 sending back saved game 🌺 💥 💾 👤" )
        res.json(resp.game)
      })
      .catch(err => res.status(422).json(err))
  },

  delete: function(req, res) {
    console.log(" 👤 📛 🌺 attempting delete saved game 🌺 📛 👤" )
    db.Saved.deleteOne({_id: req.body.saved_id, user: req.user._id})
      .then(() => {
        db.User.findOneAndUpdate(
          {_id: req.user._id},
          {'$pull': {saved: {_id: req.body._id}}}
        )
          .then(resp => {
            console.log(" 👤 📛 successfully DELETED game 📛 👤" )
            res.json({ message: 'Successfully Deleted game' })
          })
          .catch(err => res.status(422).json(err))
      })
      .catch(err => res.status(422).json(err))
  },

  update: function(req, res) {
    console.log(" 👤 ☝️ 🌺 attempting UPDATE to saved game 🌺 ☝️ 👤" )
    console.log(req.body)
    db.Saved.findOneAndUpdate(
      {_id: req.body.saved_id, user: req.user._id},
      {$set: {["manifest."+req.body.field]: req.body.value}}
    )
      .then(() => {
        db.User.findOneAndUpdate(
          { _id: req.user._id, 'saved._id': req.body._id },
          { $set: {['saved.$.'+req.body.field]: req.body.value}}
        )
          .then(resp => {
            console.log(" 👤 ☝️ 🌺 successfully UPDATED game 🌺 ☝️ 👤" )
            res.json({ message: 'Successfully UPDATED game' })
          })
          .catch(err => res.status(422).json(err))
      })
      .catch(err => res.status(422).json(err))
  }

}

module.exports = SavedControllers