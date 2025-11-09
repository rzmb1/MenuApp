const mongoose = require('mongoose');
const { Schema } = mongoose;
const dishSchema = new Schema({
  image: mongoose.ObjectId,
  name: String,
  tags: [String],
  statistics: {
    ordered: Number,
    served: Number,
    wasted: Number
  }
});
const menuPlanSchema = new Schema({
  createdBy: mongoose.ObjectId,
  approvedBy: mongoose.ObjectId,
  startDate: String,
  endDate: String,
  state: String,
  days: {
    Montag: {type: [dishSchema],default:undefined},
    Dienstag: {type: [dishSchema],default:undefined},
    Mittwoch: {type: [dishSchema],default:undefined},
    Donnerstag: {type: [dishSchema],default:undefined},
    Freitag: {type: [dishSchema],default:undefined}
  }

},{minimize: false});
const MenuPlan = mongoose.model('MenuPlan', menuPlanSchema);
module.exports = { MenuPlan,dishSchema };