const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 8080;
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const session = require('express-session');


const fs = require('fs');
const dbFilePath = './data/userdata.db';

//f sql ORM for da win!

if (!fs.existsSync('./data')){
  fs.mkdirSync('./data');
}

const db = new sqlite3.Database('./data/userdata.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the names database.');
});

const dbs = new sqlite3.Database('./data/sessions.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the sessions database.');
});

// create the "names" table if it does not exist
db.run(`
  CREATE TABLE IF NOT EXISTS userdata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )
`, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Checked state of the "userdata" table.');
  }
});

dbs.run(`
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sessionid TEXT,
    username TEXT
  )
`, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Checked state of the "sessions" table.');
  }
});

//idk what this middleware ah stuff does
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'lohenchenisthebestprogrammer!!!',
  name: 'session-cookie',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000 * 24, // 1 day in milliseconds
    sameSite: true,
    secure: false // set to true if using HTTPS
  }
}));

// Use EJS as the view engine
app.set('view engine', 'ejs');

app.post('/createsubmit', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.get(`SELECT * FROM userdata WHERE username = ?`, [username], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
    } else if (row) {
      const error = "Username already exists!";
      res.redirect('/create?error=' + encodeURIComponent(error));
    } else {
      // Username does not exist, insert new user
      db.run(`INSERT INTO userdata (username, password) VALUES (?, ?)`, [username, password], (err) => {
        if (err) {
          console.error(err.message);
          res.status(500).send('Internal Server Error');
        }
        console.log(`A new row has been inserted with username ${username} and password ${password}`);
        res.redirect('/sign');
      });
    }
  });
});

app.get('/sign', (req, res) => {
  if (req.session && req.session.sessionid) {
    res.redirect('/');
    return;
  } else {
    const error = req.query.error || "";
    res.render('sign', {error: error });
  }
});

app.get('/', (req, res) => {
  if (!req.session || !req.session.sessionid) { //checks the existence of a session or session key
    res.redirect('/sign');
  } else {
    dbs.get("SELECT username FROM sessions WHERE sessionid = ?", [req.session.sessionid], (err, result) => {
      if(err){
        console.log(err.message);
      } else if(!result){
        res.redirect('/sign');
      } else {
        const username = result.username;
        console.log(result.username);
        res.render('index', {username: username});
      }
    });
  }
});

app.get('/create', (req, res) => {
    const error = req.query.error || "";
    res.render('create', {error: error });
});

app.get('/slot', (req, res) => {
  if (!req.session || !req.session.sessionid) { //checks the existence of a session or session key
    res.redirect('/');
  } else {
    res.render('slot');
  }
});

app.get('/blackjack', (req, res) => {
  if (!req.session || !req.session.sessionid) { //checks the existence of a session or session key
    res.redirect('/');
  } else {
    res.render('blackjack');
  }
});

app.get('/signstyles.css', (req, res) => {
  res.sendFile(path.join(__dirname, '/signstyles.css'))
  // styling for divs mostly broken without this and i dont know why
});

app.get('/createstyle.css', (req, res) => {
  res.sendFile(path.join(__dirname, '/createstyle.css'))
  //same thing as the style.css pathway
});

app.get('/img/gambling.jpeg', (req, res) => {
  res.sendFile(path.join(__dirname, '/img/gambling.jpeg'))
});

app.get('/img/gambling.webp', (req, res) => {
  res.sendFile(path.join(__dirname, '/img/gambling.webp'))
});

app.get('/img/gambling2.webp', (req, res) => {
  res.sendFile(path.join(__dirname, '/img/gambling2.webp'))
});

app.get('/blackjack.js', (req, res) => {
  res.sendFile(path.join(__dirname, '/blackjack.js'))
});

app.get('/blackjack.css', (req, res) => {
  res.sendFile(path.join(__dirname, '/blackjack.css'))
});


app.get('/cards/:filename', (req, res) => {
  const dirPath = path.join(__dirname, 'cards');
  const filename = req.params.filename;
  const filePath = path.join(dirPath, filename);

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading directory');
    }

    // Filter out non-image files
    const imageFiles = files.filter(file => {
      const fileExt = path.extname(file).toLowerCase();
      return fileExt === '.jpg' || fileExt === '.jpeg' || fileExt === '.png' || fileExt === '.gif';
    });

    // Check if requested filename is in the list of image files
    if (!imageFiles.includes(filename)) {
      return res.status(404).send('Image not found');
    }

    // Serve the requested image file
    res.sendFile(filePath);
  });
});



app.get('/slot.css', (req, res) => {
  res.sendFile(path.join(__dirname, '/slot.css'))
});

app.get('/slot.js', (req, res) => {
  res.sendFile(path.join(__dirname, '/slot.js'))
});

app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, '/style.css'))
});

app.get('/img/bj.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, '/img/bj.jpg'))
});

app.get('/img/slot.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, '/img/slot.jpg'))
});

app.get('/img/casino.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, '/img/casino.jpg'))
});

app.post('/signsubmit', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (req.session && req.session.sessionid) {
    // User already has a session, redirect to home page
    res.redirect('/');
    return;
  }

  db.get(`SELECT id FROM userdata WHERE username = ? AND password = ?`, [username, password], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else if (row) {
      const sessionid = generateSessionId();
      dbs.run(`INSERT INTO sessions (sessionid, username) VALUES (?, ?)`, [sessionid, username], (err) => {
        if (err) {
          console.error(err.message);
          res.status(500).send('Internal server error');
        } else {
          req.session.sessionid = sessionid;
          res.redirect('/');
        }
      });
    } else {
      //user does not exist or the password is incorrect
      const error = "Invalid username or password";
      res.redirect('/sign?error=' + encodeURIComponent(error));
    }
  });
});


app.get('/usersettings', (req, res) => {
  if (!req.session || !req.session.sessionid) {
    res.redirect('/sign');
    return;
  } else {
    dbs.get("SELECT username FROM sessions WHERE sessionid = ?", [req.session.sessionid], (err, result) => {
      if(err){
        console.log(err.message);
      } else if(!result){
        res.redirect('/sign');
      } else {
        const username = result.username;
        console.log(result.username);
        res.render('usersettings', {username: username});
      }
    });
}});

app.post('/signout', (req, res) => {
  if (!req.session || !req.session.sessionid) {
    res.redirect('/sign');
    return;
  }
  dbs.run('DELETE FROM sessions WHERE sessionid = ?', [req.session.sessionid], (err) => {
    if (err) {
      console.error(err.message);
    } else {
      req.session.destroy((err) => {
        if (err) {
          console.error(err.message);
        }
        res.redirect('/');
      });
    }
  });
});

app.post('/bet', (req, res) => {
  console.log("this works");
});

function generateSessionId() {
  //generate a random session ID
  const randomBytes = require('crypto').randomBytes;
  return randomBytes(16).toString('hex');
}

app.listen(8080, () => {
  console.log('server started');
});
