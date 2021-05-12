const express = require('express');
const Database = require('@replit/database')
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

const {Transaction,TYPES,Stage,STATUS} = require('./models/Transaction.js');
const  Transactions = require('./functions/transactions.js');

const app = express();
app.use(bodyParser.json());

const db = new Database();

var transactions = [];

// test for git

app.get('/sandbox',(req, res) => {
  
  var transaction1 = new Transaction(TYPES.IN, "salary", "Fenyx Consult salary",2280.11)
  transactions.push(transaction1);
  transaction1.stages.push(new Stage("2021-04-07",STATUS.PAID));
  transaction1.stages.push(new Stage("2021-04-07",STATUS.PLANNED));

  var transaction2 = new Transaction(TYPES.OUT, "FOOD", "Burger King",5.99)
  transactions.push(transaction2);
  transaction2.stages.push(new Stage("2021-04-06",STATUS.PAID));
  transaction2.stages.push(new Stage("2021-04-06",STATUS.PAID));
  
  var transaction3 = new Transaction(TYPES.OUT, "FOOD", "Tacos chez Max",10.99)
  transactions.push(transaction3);
  transaction3.stages.push(new Stage("2021-04-07",STATUS.PAID));
  transaction3.stages.push(new Stage("2021-04-07",STATUS.TRANSFERRED));
  
  var result = Transactions.getTotalAmountUntilTransferredOut(transactions);

  res.status(200);
  res.send(result.toString());
});

app.get('/',(req, res) => {
  res.status(200);
  res.send('Welcome to Skrooge API. For documentation, see https://github.com/Anthony-Gomez/skrooge-api/wiki')
});

app.post('/account', (req, res) => {

  var key = req.query.key;

  if(isAuth(key)) {

    var name = req.body.name;

    if(typeof name == 'string') {

      var accountID = uuidv4();

      var account = {
        name : name,
        status : 'created',
        id : accountID
      }

      db.set(accountID,account).then(() => {

        res.status(201);
        res.send(account);

      });

    }

    else {
      res.status(400);
      res.send({
        message:"JSON body must contains 'name' key with string value"});
    }  

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

    db.get(id).then(account => {

      if(account){
        res.status(200);
        res.send(account);
      }
      else {
        res.status(404);
        res.send(id+  " account is not found");
      }
      
      
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