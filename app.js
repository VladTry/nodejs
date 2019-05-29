'use strict';

const express 		= require('express'),
	  app 			= express(),
	  bodyParser 	= require('body-parser'),
	  mysql 		= require('mysql'),
	  connection 	= require('express-myconnection');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));

app.use(connection(mysql, {
	host: '35.224.30.156',
	//socketPath: '/cloudsql/logical-hallway-239911:us-central1:lab2db',
	user: 'root',
	password: '',
	database: 'mydb'
}));

app.get('/holes', (req, res) => {
	req.getConnection(function(err, connection) {
		if (err) throw err;
		connection.query('SELECT * FROM holes', function(err, data) {
			console.log(data);
			res.render('holes', {title: 'Великі-Космічні-Дірочки.ком', data: data});
		});
	});
});

app.get('/add', function (req, res, next) {
	res.render( __dirname + "/views/" + "addhole.ejs");
});

app.get('/authentication', function (req, res, next) {
	res.render( __dirname + "/views/" + "authentication.ejs");
});

app.post('/login', function(req, res){

	var foundUser = false;

	let user = {
			login: req.body.login,
			password: req.body.password
		};

	req.getConnection(function(err, connection) {
		if (err) throw err;
		connection.query('SELECT * FROM USERS', function(err, data) {
			for (let i = 0; i < data.length; i++) {
				if((user.login == data[i].login)&(user.password == data[i].password)){
					foundUser = true;
					break;
				}
			}

			if(foundUser){
			 	console.log("Authentication succeed");
				/*return res.status(200).send({
		            message: 'Authentication succeed !'
		        });*/
			}
			else {
				console.log("Authentication failed");
				/*return res.status(401).send({
		            message: 'Authentication failed !'
		        });*/
			}
		});

	});
});

app.post('/submit',function(req,res){

  let data = {
			holeName: req.body.holeName,
			holeStatus: req.body.holeStatus,
		};


  req.getConnection(function(err, connection) {
		if (err) throw err;
		connection.query('INSERT INTO holes SET ? ', [data], function(err, data) {
			if (err) throw err;
			res.redirect('/holes');
		});
 	});
});

if (module === require.main) {
  // [START server]
  // Start the server
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
  // [END server]
}

module.exports = app;
