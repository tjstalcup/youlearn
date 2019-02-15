// app/models/path.js
var mongoose = require('mongoose'); // our layer between the routes and the database
var findOrCreate = require('mongoose-findorcreate'); // neat little add-on to mongoose

var enrollmentSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  path: {type: mongoose.Schema.Types.ObjectId, ref: 'Path'},
  currentStep: {type: Number, default: 1}
});

enrollmentSchema.plugin(findOrCreate);

module.exports = mongoose.model('Enrollment', enrollmentSchema);