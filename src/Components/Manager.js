import React from 'react';
import '../index.css';
import TodoObj from '../Utils/TodoObj';
import Todo from './Todo.js';

class Manager extends React.Component {
    constructor(props){
        super(props);
        let todos = [];
        this.state = {
            todos: todos,
            newTodo: null,
            editTodo: null,
            deleting: false,
        }
        this.changeTodo = this.changeTodo.bind(this);
    }

    createTodo() {
        let newOne = (
            <div className='create-todo-div'>
                <input className='create-todo-element' placeholder='Enter Title Here...' type='text' id='title' />
                <textarea className='create-todo-element' placeholder='Enter Description Here...' id='description' />
                <div className='create-todo-element'>
                    <input type='radio' name='progress' value='Not Started' />Not Started
                    <input type='radio' name='progress' value='In Progress' />In Progress
                    <input type='radio' name='progress' value='Completed' />Completed
                </div>
                <button className='create-todo-element' id='submit-button' onClick={() => this.saveTodo()}>Submit</button>
            </div>
        );
        this.setState({
            newTodo: newOne,
        });
    }

    changeTodo(index) {
        let deleting = this.state.deleting;
        if(deleting) {
            this.deleteTodo(index);
        } else {
            this.editTodo(index);
        }
    }

    editTodo(index) {
        let currentTodos = this.state.todos;
        let chosenTodo = currentTodos[index - 1];
        let editOne = (
            <div className='create-todo-div'>
                <input className='create-todo-element' type='text' id='title' value={chosenTodo.title}/>
                <textarea className='create-todo-element' id='description' value={chosenTodo.description}/>
                <div className='create-todo-element'>
                    <input type='radio' name='progress' value='Not Started' checked={chosenTodo.status==='Not Started' ? true : false}/>Not Started
                    <input type='radio' name='progress' value='In Progress' checked={chosenTodo.status==='In Progress' ? true : false}/>In Progress
                    <input type='radio' name='progress' value='Completed' checked={chosenTodo.status==='Completed' ? true : false}/>Completed
                </div>
                <button className='create-todo-element' id='submit-button' onClick={() => this.updateTodo()}>Submit</button>
            </div>
        );
        this.setState({
            editTodo: editOne,
        });
    }

    deleteOn() {
        this.setState({
            deleting: true,
        });
    }

    deleteOff() {
        this.setState({
            deleting: false,
        });
    }

    deleteTodo(index) {
        let currentTodos = this.state.todos;
        currentTodos.splice(index - 1, 1)
        this.setState({
            todos: currentTodos,
            deleting: false,
        });
    }

    saveTodo() {
        let currentTodos = this.state.todos;
        let title = document.querySelector('#title');
        let description = document.querySelector('#description');
        let status = document.querySelector('input[type="radio"]:checked');
        let todo = new TodoObj;
        todo.title = title.value;
        todo.description = description.value;
        todo.status = status.value;
        currentTodos.push(todo);
        this.setState({
            newTodo: null,
            todos: currentTodos,
        });
    }

    updateTodo(index) {
        let currentTodos = this.state.todos;
        let title = document.querySelector('#title');
        let description = document.querySelector('#description');
        let status = document.querySelector('input[type="radio"]:checked');
        let todo = new TodoObj;
        todo.title = title.value;
        todo.description = description.value;
        todo.status = status.value;
        currentTodos[index - 1] = todo;
        this.setState({
            editTodo: null,
            todos: currentTodos,
        });
    }

    displayTodos() {
        let currentTodos = this.state.todos;
        let index = 0;
        let todoComponents = currentTodos.map(obj => 
            {
                index ++;
                return <Todo key={index} id={index} title={obj.title} description={obj.description} status={obj.status} changeTodo={this.changeTodo}/>
            });
        return todoComponents;
    }

    render() {
        let newTodo = this.state.newTodo;
        let editTodo = this.state.editTodo;
        let deleting = this.state.deleting;
        return(
            <div id='wrapper'>
                <div>{newTodo}</div>
                <div>{editTodo}</div>
                <div id='todo-controls' className='main-element'>
                    <button className='todo-button' onClick={() => this.createTodo()}>Add To-Do</button>
                    <button className='todo-button' onClick={() => this.deleteOn()}>Remove To-Do</button>
                </div>
                <div id='todo-holder' className='main-element'>{this.displayTodos()}</div>
                {deleting? <button className='todo-button main-element' onClick={() => this.deleteOff()}>Cancel Delete</button> : null}
            </div>
        );
    }
}
export default Manager;