////////////////////////////////////////////////////////////////////////////////////////////////
//CONFIG
////////////////////////////////////////////////////////////////////////////////////////////////

var express    = require('express')
,app           = express()
,bodyParser    = require('body-parser')
,mongoose      = require('mongoose')
,passport      = require('passport')
,LocalStrategy = require('passport-local').Strategy
,cookieParser  = require('cookie-parser')
,bodyParser    = require('body-parser')
,session       = require('express-session')
,models        = require('./models')
,origin        = "http://localhost"

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: 'secretapplicationsession' }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017');

////////////////////////////////////////////////////////////////////////////////////////////////
//AUTH
////////////////////////////////////////////////////////////////////////////////////////////////

passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
  	if(username == "admin" && password == "admin")
  	{
  		var User = {};
  		User.Name = username;
  		User.Pass = password;

  		return done(null, User);
  	}
  	else
        return done(null, false);
  })
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});
 
passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", req.get('origin'));
  res.header("Access-Control-Allow-Credentials", true);

  next();
});

app.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
	
		if (err) { return next(err); }
		
		if (!user) { return res.send(false); }
		
		req.logIn(user, function(err) {
			
			if (err) { return next(err); }
			
			return res.send(true);
			
		});

	})(req, res, next);
});

app.get('/login', isLoggedIn, function(req, res, next) {
	res.send(true)
});
 
app.get('/logout', function(req, res) {
    req.logout();
    res.send(false);
});

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.send(false);
}


////////////////////////////////////////////////////////////////////////////////////////////////
//ROUTER
////////////////////////////////////////////////////////////////////////////////////////////////

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", origin);
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	res.header("Access-Control-Allow-Credentials", 'true');
  	
    next();
});

router.route('/:type')

	.get(isLoggedIn, function(req, res) {
		if(models[req.params.type] === undefined)
		{
			res.json({ message: req.params.type + ' is undefined!' });			
		}
		else
			models[req.params.type].find(function(err, results) {
				if (err)
					res.send(err);

				res.json(results);
			});
	})

	.post(isLoggedIn, function(req, res) { 
		if(models[req.params.type] === undefined)
		{
			res.json({ message: req.params.type + ' is undefined!' });			
		}
		else
		{
			var object = new models[req.params.type]();

			for(var property in req.body)
			{
				try
				{
					object[property] = req.body[property];
				}catch(ex){ console.log(ex.message)}
			}

			object.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: req.params.type + ' Created!' });
			});
		}
	})

router.route('/:type/:id')

	.get(isLoggedIn, function(req, res) {
		if(models[req.params.type] === undefined)
		{
			res.json({ message: req.params.type + ' is undefined!' });			
		}
		else
			models[req.params.type].findById(req.params.id, function(err, result) {
				if (err)
					res.send(err);

				res.json(result);
			});
	})

	.put(isLoggedIn, function(req, res) {
		if(models[req.params.type] === undefined)
		{
			res.json({ message: req.params.type + ' is undefined!' });			
		}
		else
			models[req.params.type].findById(req.params.id, function(err, result) {
				if (err)
					res.send(err);

				for(var property in req.body) 
				{
					try
					{
						result[property] = req.body[property];
					}catch(ex){ }
				}

				result.save(function(err) {
					if (err)
						res.send(err);

					res.json({ message: req.params.type + ' Updated!' });
				});

			});
	})

	.delete(isLoggedIn, function(req, res) {
		if(models[req.params.type] === undefined)
		{
			res.json({ message: req.params.type + ' is undefined!' });			
		}
		else
			models[req.params.type].remove({
				_id: req.params.id
			}, function(err, result) {
				if (err)
					res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
	});


app.use('/api', router);

////////////////////////////////////////////////////////////////////////////////////////////////
//START
////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(port);

console.log('App Starts on port ' + port);