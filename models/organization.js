var mongoose = require('mongoose');

var organizationSchema = new mongoose.Schema({
  name: String,
  description: String,
  totalBudget: Number,
  updatedDate : { type: Date, default: Date.now },
  members: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String
    }
  ],
  budgetEvent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BudgetEvent"
    }
  ]
})

module.exports = mongoose.model("Organization", organizationSchema)
