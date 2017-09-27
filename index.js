const express = require('express');
const pug = require('pug');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const todo = require('./models/todo');

app.use(express.static('public'));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// get all todos
app.get('/todos', function(req, res){
	todo.fetchTodos().then((todos) => {
		res.render('index', {todos: todos});
	});
});

// update todo state
app.patch('/todos/:id/state', function(req, res){
	console.log('run through...')
	var id = req.params['id'];
	var state = req.query['finished'];
	todo.changeTodoState(id, state).then((result) => {
		res.json(result);
	})
});

// delete todo
app.delete('/todos/:id', function(req, res){
	var todoId = req.params['id'];
	todo.removeTodo(todoId).then(success=>{
		res.json({success: success});
	});
})

// add new todo
app.post('/todo/new', function(req, res){
	var aTodo = req.body;
	console.log(aTodo);
	todo.addNewTodo(aTodo).then(result=>{
		res.json(result.ops[0]);
	}).catch(err=>{
		console.log(err);
		res.json(err);
	})
});

app.listen(3000, () => {
	console.log('server start...')
})
