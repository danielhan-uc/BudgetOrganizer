var mongoose = require('mongoose')

var budgetEventSchema = new mongoose.Schema({
  name: String,
  budgetAmount: Number,
  updatedDate : { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
})

module.exports = mongoose.model("BudgetEvent", budgetEventSchema)
