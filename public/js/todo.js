(function(){
	var todos = document.querySelector('ul');
	todos.onclick = function(event){

		if(event.target.nodeName === 'INPUT'){
			changeTodoState(event.target.dataset.id, event.target.checked);
		}

		if(event.target.nodeName === 'A'){
			removeTodo(event.target.dataset.id);
		}
	}

	var todoAdder = document.querySelector('#todo-adder');
	todoAdder.onclick = function(){
		var content = document.querySelector('#todo-content').value;
		addNewTodo({content: content})
	}

	function changeTodoState(todoId, finished){
		fetch(`/todos/${todoId}/state?finished=${finished}`, {
			method: 'PATCH'
		}).then((result) => {
			console.log(result);
		})
	}

	function removeTodo(id){
		fetch(`/todos/${id}`, {method: 'DELETE'}).then(res => {
			var todoItems = todos.querySelectorAll('li');
			var targetTodoDom = null;
			todoItems.forEach(li=>{
				if (li.querySelector('a').dataset.id === id ){
					targetTodoDom = li;
				}
			});
			todos.removeChild(targetTodoDom);
		});
	}

	function addNewTodo(todo){
		
		if(!todo.content){ return; }
		fetch(`/todo/new`, {
			method: 'POST',
			headers: {
				'Accept':'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(todo)
		}).then((result) => {
			return result.json();
		}).then(result=>{
			var li = document.createElement('li');
			li.innerHTML = `<span>${result.content}</span><input data-id=${result._id} type="checkbox" ${result.finished && 'checked'} /><a href="javascript:void(0);" data-id=${result._id}>删除</a>`
			todos.appendChild(li);
		})
	}
})();