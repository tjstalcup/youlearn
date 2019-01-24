// app/models/step.js
var mongoose = require('mongoose'); // our layer between the routes and the database
var findOrCreate = require('mongoose-findorcreate'); // neat little add-on to mongoose

var stepSchema = mongoose.Schema({
  title: String,
  path: {type: mongoose.Schema.Types.ObjectId, ref: 'Path'},
  link: String,
  text: String
});

stepSchema.plugin(findOrCreate);

module.exports = mongoose.model('Step', stepSchema);