const mongoose = require('mongoose');
//console.log(`mongodb+srv://root:${process.env.MONGODB_PASS}@cluster0.cwlt5.mongodb.net/Bothamut?retryWrites=true&w=majority`);
//module.exports = mongoose.connect(`mongodb+srv://root:${process.env.MONGODB_PASS}@cluster0.cwlt5.mongodb.net/Bothamut?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});
module.exports = mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_URL}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 100
});
