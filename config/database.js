module.exports = {

  // 'url' : 'your-settings-here' // looks like mongodb://<user>:<pass>@url:27017/dbname
  // 'url' : process.env.DATABASE_URL || 'mongodb://localhost/youlearn'
  'url' : "mongodb://youlearn:testing1234@cluster0-shard-00-00-ucr4u.mongodb.net:27017,cluster0-shard-00-01-ucr4u.mongodb.net:27017,cluster0-shard-00-02-ucr4u.mongodb.net:27017/youlearn?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true",
  'testUrl' : "mongodb://youlearn:testing1234@cluster0-shard-00-00-ucr4u.mongodb.net:27017,cluster0-shard-00-01-ucr4u.mongodb.net:27017,cluster0-shard-00-02-ucr4u.mongodb.net:27017/youlearntest?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"
};