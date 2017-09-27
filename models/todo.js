const MongoClient = require('mongodb').MongoClient;
const {ObjectId} = require('mongodb');
const url = require('../config').mongodb;

module.exports = {
	fetchTodos(){
		return new Promise(function(resolve, reject){
			MongoClient.connect(url, (err, db) => {
				if(err) reject();
				var todoCollection = db.collection('todos');
				todoCollection.find({}).toArray((err, todos) => {
					if(err) reject();
					resolve(todos);
					db.close();
				})
			})
		})
	},

	addNewTodo(todo){
		todo.finished = false;
		return new Promise(function(resolve, reject){
			MongoClient.connect(url, (err, db) => {
				if(err) reject(err);
				var collection = db.collection('todos');
				collection.insert(todo, function(err, result){
					if(err) reject(err);
					resolve(result);
				});
				db.close();
			});
		});
	},

	changeTodoState(todoId, finished){
		finished = finished === "true";
		return new Promise(function(resolve, reject){
			MongoClient.connect(url, (err, db) => {
				var collection = db.collection('todos');
				collection.update({_id: ObjectId(todoId)}, {$set: {finished: finished}}, (err, result) => {
					resolve(result.opt);
					db.close();
				});
			})
		});
	},

	removeTodo(id){
		return new Promise(function(resolve, reject){
			MongoClient.connect(url, (err, db) => {
				var collection = db.collection('todos');
				collection.remove({_id: ObjectId(id)}, (err, result) => {
					console.log(result);
					resolve(result);
					db.close();
				});
			})
		});
	}
}