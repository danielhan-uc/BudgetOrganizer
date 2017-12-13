var express = require("express")
var router = express.Router();
var Organization = require("../models/organization")
var BudgetEvent = require("../models/budgetEvent")
var middleware = require("../middleware")

// route to create new budget
router.get("/", middleware.isLoggedIn, function(req, res) {
  redirect("/budgetEvent/new")
})

// route to create new budget
router.post("/:id", middleware.isLoggedIn, function(req, res) {
  var organizationId = req.params.id;
  var name = req.body.name;
  var budgetAmount = req.body.amount;
  var updatedDate = req.body.date;
  var author = {
    id: req.user._id,
    username: req.user.username
  }

  var newBudgetEvent = {
    name: name,
    budgetAmount: budgetAmount,
    updatedDate: updatedDate,
    author: author
  }

  BudgetEvent.create(newBudgetEvent, function(err, newBudgetEventCreated) {
    if(err) {
      req.flash("error", "Something went wrong");
      console.log(err);
      res.redirect('/organizations/' + organizationId);
    } else {
      Organization.findById(organizationId, function(err, foundOrganization) {
        if(err) {

        } else {
          // console.log(newBudgetEvent)
          foundOrganization.budgetEvent.push(newBudgetEventCreated._id)
          foundOrganization.save();
          // console.log(foundOrganization);
          res.redirect('/organizations/' + organizationId);
        }
      })
    }
  })
})

// new budget form
router.get("/:id/new", middleware.isLoggedIn, function(req, res) {
  Organization.findById(req.params.id, function(err, foundOrganization) {
      res.render('newbudget', {org: foundOrganization})
  })
})

// delete budget
router.delete("/:id", middleware.isLoggedIn, function(req, res) {
  BudgetEvent.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      res.status(400).json(err);
    } else {
      res.status(200).json("");
    }
  })
})

module.exports = router;
