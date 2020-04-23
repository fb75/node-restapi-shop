const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const api = supertest(app);


describe('[Products Routes] - Integrations Test', () => {
	beforeEach(async () => {
		// Connect to a Mongo DB
		const uri = 'mongodb+srv://fbrac-mongodb:mysecretpassword@cluster0-xhnss.mongodb.net/test?retryWrites=true&w=majority';
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}).catch(e => console.log(e));
	});
	
	test('/products should return json data != null', async (done) => {
		const result = await api.get('/products')
		expect(result).not.toBeNull()
		done()
	});

	test('/products should return an array with at least one element', async (done) => {
		const result = await api.get('/products')
		expect(result.length).not.toBe(0)
		done()
	});

	test('/products should return status code 200', async (done) => {
		const result = await api.get('/products')
		expect(result.statusCode).toBe(200)
		done()
	});


	
	afterAll(async () => {
		await mongoose.connection.close()
	});
});



