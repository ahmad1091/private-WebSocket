const app = require('./app');
const port = process.env.PORT || 7000;
require('dotenv').config();

app.listen(port, () => {
    console.log('listening to port ' + port);
});
