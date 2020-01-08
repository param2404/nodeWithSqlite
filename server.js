
const express = require('express');
const app = express();

app.use(express.static('static_files'));

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('pets.db');


app.get('/users', (req, res) => {
  db.all('SELECT name FROM users_to_pets', (err, rows) => {
    console.log(rows);
    const allUsernames = rows.map(e => e.name);
    console.log('allUsernames is:', allUsernames);
    res.send(allUsernames);
  })
});

///POST request is for posting new data to the server
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/users',(req, res)=> {
  console.log(req.body);
  db.run(
    'INSERT INTO users_to_pets VALUES($name,$job,$pet)',
    {
      $name: req.body.name,
      $job: req.body.job,
      $pet: req.body.pet
    },
    (err) => {
      if (err) {
        res.send({ message: "Error " });
      } else {
        res.send({ message: "Inserted" });
      }
    }
  );
});


app.get('/users/:userid', (req, res) => {
  const nameToLookup = req.params.userid; // matches ':userid' above
  ///SQL query
  db.all('SELECT * FROM users_to_pets WHERE name=$name',
    //param  to pass
    {
      $name: nameToLookup,
    },
    ///callback when query finishes
    (err, rows) => {
      console.log(rows)
      if (rows.length>0) {
        res.send(rows[0]);
      } else {
        res.send({}); // failed, so return an empty object instead of undefined
      }
    }
  );



});

// start the server at URL: http://localhost:3000/
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/');
});
