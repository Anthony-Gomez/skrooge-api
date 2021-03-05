const express = require('express');
const Database = require("@replit/database")

const app = express();

app.get('/', (req, res) => {

  if(isAuth(req.query.key)) {

    res.status(200);
    res.send("auth !");
  }
  else {
    res.status(401);
    res.send("no auth !");
  }

});

app.listen(3000, () => {
  console.log('server started');
});

function isAuth(key) {
  return (key.toLowerCase() == process.env.TOKEN.toLowerCase());
}