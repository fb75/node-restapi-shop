const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// mongodb atlas api-key: 189d2f71-cdaf-40d7-a46d-42ba1df2d579
const uri = 'mongodb+srv://fbrac-mongodb:'+ process.env.MONGODB_ATLAS_PWD +'@cluster0-xhnss.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.catch(e => console.log(e));


// setting middleware to log requests prints to console GET request name duration ms
app.use(morgan('dev'));
// middleware bodyParser to parse the body of requests: for urlencoded (extended if true also rich-text bodies), json
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// using custom routes as middleware  to handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);


// using middleware to set custom header preventing from server side the CORS check on the client
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	// all those headers are present in each incoming request
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

	if(req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});


// if no one of the above route could handle the request
// this code ipotetically won't run so no error is returned 
app.use((req, res, next) => {
	const error = new Error('404 Not found.');
	error.status = 404;
	// forwarding this specific error
	next(error);
});

// other middleware to handle global error from everywhere in the app 
// if db throws an error this middleware that has error as argument will 
// handle (sending 500 error, f.e.)
// for the code above it will return '404....' for the other cases the specific error

app.use((error, req, res, next) => {
	res.status(error.status || 500)
	res.json({
		error: {
			message: error.message
		}
	})
});

module.exports = app;