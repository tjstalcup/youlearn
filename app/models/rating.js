// app/models/rating.js
var mongoose = require('mongoose'); // our layer between the routes and the database
var findOrCreate = require('mongoose-findorcreate'); // neat little add-on to mongoose

var ratingSchema = mongoose.Schema({
  path: {type: mongoose.Schema.Types.ObjectId, ref: 'Path'},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  rating: Number,
  review: String
});

ratingSchema.plugin(findOrCreate);

module.exports = mongoose.model('Rating', ratingSchema);