const chai = require('chai')
const chaiHttp = require('chai-http'); 

const { app, runServer, closeServer } = require('../server'); 

const expect = chai.expect;

chai.use(chaiHttp);

describe("Blog API", function(){

	before(function(){
		return runServer();
	});

	after(function(){
		return closeServer();
	});

	it('should list posts on GET', function(){
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.an('array')
				expect(res.body.length).to.be.at.least(1);

				const expectedKeys = ["id", "title", "content", "author", "publishDate"]

				res.body.forEach(function(item){
					expect(item).to.be.an('object');
					expect(item).to.include.keys(expectedKeys); 
				});
			});
	});

	it('should add a blog post on POST', function(){

		const newPost = {
			title: "Test Post",
			content: "adding test content",
			author: "Mr. Test",
		};

		return chai.request(app)
			.post('/blog-posts')
			.send(newPost)
			.then(function(res){
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.be.an('object');
				expect(res.body).to.include.keys('title', 'id', 'content', 'author', 'publishDate');
				expect(res.body.id).to.not.equal(null); 
			});
	});

	it('should update a post on PUT', function(){

		const updatedPost = {
			title: "updated title",
			content: "updated content", 
			author: "new Author",
			publishDate: "07-23-2018"
		}

		return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				let updatedId = res.body[0].id;
				updatedPost.id = updatedId
				return chai.request(app)
					.put(`/blog-posts/${updatedId}`)
					.send(updatedPost); 
			})
			.then(function(res){
				expect(res).to.have.status(200)
			});
	});

	it('should delete post on DELETE', function(){
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res){
				const deletedItem = res.body[0].id
				return chai.request(app)
					.delete(`/blog-posts/${deletedItem}`)
			})
				.then(function(res){
					expect(res).to.have.status(204); 
				});
		});
});

