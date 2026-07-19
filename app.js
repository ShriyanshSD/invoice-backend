let express = require('express');
let cors = require('cors');
let path = require('path');
let mongoose = require('./Database/db');
let router = require('./Routes/Route');

let app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use((req, res, next) => {
  console.log('HTTP:' + req.method + req.url);
  next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', router);

if (require.main === module) {
  app.listen(3000, () => {
    console.log('Port 3000 is active');
  });
}

module.exports = app;
