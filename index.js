const express = require('express');
const Database = require('@replit/database')
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const db = new Database();

app.get('/',(req, res) => {
  res.status(200);
  res.send('Welcome to Skrooge API. For documentation, see https://github.com/Anthony-Gomez/skrooge-api/wiki')
});

app.post('/account', (req, res) => {

  var key = req.query.key;

  if(isAuth(key)) {

    var accountID = uuidv4();

    var account = {
      name : req.body.name,
      status : 'created',
      id : accountID
    }

    db.set(accountID,account).then(() => {

      res.status(201);
      res.send(account);

    });

  }
  else {
    res.status(401);
    res.send('no auth !');
  }

});

app.get('/accounts', (req, res) => {

  var key = req.query.key;

  if(isAuth(key)) {

    db.list().then(ids => {

      res.status(200);
      res.send(ids);
      
    });

  }

  else {
    res.status(401);
    res.send('no auth !');
  }

});

app.get('/accounts/:id', (req, res) => {

  var key = req.query.key;

  if(isAuth(key)) {

    var id = req.params.id;

    db.get(id).then(value => {

      res.status(200);
      res.send(value);
      
    });

  }

  else {
    res.status(401);
    res.send('no auth !');
  }

});

app.delete('/accounts', (req, res) => {

  var key = req.query.key;

  if(isAuth(key)) {

    db.list().then(async ids => {

      for(id of ids){

        await db.delete(id);

      }
      
      res.status(200);
      res.send(ids);
      
    });
  }

});

app.delete('/accounts/:id', (req, res) => {

  var key = req.query.key;

  if(isAuth(key)) {

    var id = req.params.id;
    
    
    db.get(id).then(account => {

      account.status = "deleted";

      db.delete(id).then(() => {

        res.status(200);
        res.send(account);
    
      });

    });

  }

  else {
    res.status(401);
    res.send('no auth !');
  }

});

app.listen(3000, () => {
  console.log('server started');
});

function isAuth(key) {
  if(!key) {
    return false;
  }
  return (key.toLowerCase() == process.env.TOKEN.toLowerCase());
}