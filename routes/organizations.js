var express = require("express")
var router = express.Router();
var User = require("../models/user")
var Organization = require("../models/organization")
var middleware = require("../middleware")

// Show all Organizations
router.get("/", middleware.isLoggedIn, function(req, res) {
  Organization.find({
    members: {
      $elemMatch: {
        id: req.user._id
      }
    }
  }, function(err, myOrganizations) {
    if(err) {
      req.flash("error", "Something went wrong");
      console.log(err);
      res.render('organizations', {myOrganizations: []})
    } else {
      res.render('organizations', {myOrganizations: myOrganizations})
    }
  })
})

// Add New Organization to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
  var name = req.body.name;
  var totalBudget = req.body.budget;
  var description = req.body.description;
  var member = {
    id: req.user._id,
    username: req.user.username
  }

  var newOrg = { name: name, description: description, totalBudget: totalBudget }
  Organization.create(newOrg, function(err, newOrgCreated) {
    if(err) {
      req.flash("error", "Something went wrong");
      console.log(err);
      res.redirect('/organizations/new')
    } else {
      newOrgCreated.members.push(member);
      newOrgCreated.save();
      console.log(newOrgCreated);
      req.flash("success", "Successfully added comment");
      res.redirect('/organizations/' + newOrgCreated._id);
    }
  })
})

// Show New form to create organization
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render('neworganization')
})

// New form to invite friend
router.get("/:id/invite", middleware.isLoggedIn, function(req, res) {
  res.render('inviteToOrganization', {id: req.params.id})
})

// Add friend to organization
router.post("/:id/invite", middleware.isLoggedIn, function(req, res) {
  User.find({
    username: req.body.username
  }, function(err, foundUser) {
    if(err) {
      req.flash("error", "Something went wrong");
      console.log(err);
      res.redirect('/organizations/' + req.params.id + "/invite");
    } else if (foundUser.length == 1) {
      Organization.findById(req.params.id, function(err, foundOrganization) {
        if(err) {
          req.flash("error", "Something went wrong");
          console.log(err);
          res.redirect('/organizations/' + req.params.id + "/invite");
        } else {
          var member = {
            id: foundUser[0]._id,
            username: foundUser[0].username
          }
          foundOrganization.members.push(member);
          foundOrganization.save();
          res.redirect('/organizations/' + req.params.id);
        }
      })
    } else {
      req.flash("error", "User Does not Exist");
      console.log(err);
      res.redirect('/organizations/' + req.params.id + "/invite");
    }
  })
})


// Show info about Organization
router.get("/:id", middleware.isLoggedIn, function(req, res) {
  Organization.findById(req.params.id).populate("budgetEvent").exec(function(err, foundOrganization) {
      console.log(foundOrganization)
      foundOrganization.budgetEvent.sort(function(a, b) {
        a = new Date(a.updatedDate)
        b = new Date(b.updatedDate)
        return a > b ? 1 : a < b ? -1 : 0
      })
      foundOrganization.save();
      res.render('organizationBudget', {org: foundOrganization})
  })
})

module.exports = router;
