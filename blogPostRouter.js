const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models'); 

// example blogposts in a database

BlogPosts.create(
	'My first Blog Post',
	` ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod 
	tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
	quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
	consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
	cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
	proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
	"Khris",
	"07-12-2018"
)

BlogPosts.create(
	'My third Blog Post',
	` ipsum d eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
	proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
	"Khris",
	"07-13-2018"
)

BlogPosts.create(
	'My Second Blog Post',
	` ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod 
	tempor incididunt in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
	proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
	"Khris",
	"07-18-2018"
)




// CRUD commands 

router.get('/', (req, res) => {
	res.json(BlogPosts.get()); 
});

router.get('/:id', (req, res) => {
	res.json(BlogPosts.get(req.params.id))
})


router.post('/', (req, res) => {

		const requiredFeilds = ['title', 'content', 'author', 'publishDate'];
	for(let i=0; i<requiredFeilds.length; i++){
		let field = requiredFeilds[i];
		if(!(field in req.body)){
			const message = `Missing ${field} in request body`
			console.error(message); 
			return res.status(400).send(message); 
		}
	}

	const item = BlogPosts.create(
		req.body.title,
		req.body.content,
		req.body.author,
		req.body.publishDate
		)
	res.status(201).json(item); 
})

router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id); 
	console.log(`Deleted shopping list item ${req.params.id}`);
	res.status(204).end(); 
})

router.put('/:id', (req, res) => {

	const requiredFeilds = ['id', 'title', 'content', 'author', 'publishDate'];
	for(let i=0; i<requiredFeilds.length; i++){
		let field = requiredFeilds[i];
		if(!(field in req.body)){
			const message = `Missing ${field} in request body`
			console.error(message); 
			return res.status(400).send(message); 
		}
	}

	if (req.params.id !== req.body.id){
		const message = (
			`Request path id (${req.params.id}) and request body id`
			`(${req.body.id}) must match`)
		console.error(message);
		return res.status(400).send(message); 
	}

	console.log(`Updating Blog Post \`${req.params.id}\``);
	const updatedPost = BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	})

	res.status(200).end(); 

});


module.exports = router; 
