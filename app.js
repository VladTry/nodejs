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
	host: '35.224.50.101',
	//socketPath: '/cloudsql/flowing-blade-221909:us-central1:lab2-2816',
	user: 'root',
	password: 'frek@abc.xyz',
	database: 'BlackHoles'
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
