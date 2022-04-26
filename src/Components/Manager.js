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
            editing: false,
            creating: false,
        }
        this.changeTodo = this.changeTodo.bind(this);
    }

    createOff() {
        this.setState({
            creating: false,
        });
    }

    createTodo() {
        let editing = this.state.editing;
        let deleting = this.state.deleting;
        let creating = this.state.creating;
        if(editing || deleting || creating) {
            return;
        }
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
            creating: true,
        });
    }

    changeTodo(index) {
        let deleting = this.state.deleting;
        let editing = this.state.editing;
        if(deleting) {
            this.deleteTodo(index);
        } else if (editing) {
            this.editTodo(index);
        }
    }

    editOn() {
        let editing = this.state.editing;
        let deleting = this.state.deleting;
        let creating = this.state.creating;
        if(editing || deleting || creating) {
            return;
        }
        this.setState({
            editing: true,
        });
    }

    editOff() {
        this.setState({
            editing: false,
        });
    }

    editTodo(index) {
        let currentTodos = this.state.todos;
        let chosenTodo = currentTodos[index - 1];
        let editOne = (
            <div className='create-todo-div'>
                <input className='create-todo-element' type='text' id='title' placeholder={chosenTodo.title}/>
                <textarea className='create-todo-element' id='description' placeholder={chosenTodo.description}/>
                <div className='create-todo-element'>
                    <input id='not-started' type='radio' name='progress' value='Not Started' />Not Started
                    <input id='in-progress' type='radio' name='progress' value='In Progress' />In Progress
                    <input id='completed' type='radio' name='progress' value='Completed' />Completed
                </div>
                <button className='create-todo-element' id='submit-button' onClick={() => this.updateTodo()}>Submit</button>
            </div>
        );
        this.setState({
            editTodo: editOne,
        }, () => {
            let notStart = document.querySelector('#not-started');
            let inProg = document.querySelector('#in-progress');
            let complete = document.querySelector('#completed');
            let status = chosenTodo.status;
            switch(status) {
                case 'Not Started':
                    notStart.checked = true;
                    break;
                case 'In Progress':
                    inProg.checked = true;
                    break;
                case 'Completed':
                    complete.checked = true;
                    break;
                default:
                break;
            }
        });
    }

    deleteOn() {
        let editing = this.state.editing;
        let deleting = this.state.deleting;
        let creating = this.state.creating;
        if(editing || deleting || creating) {
            return;
        }
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
            creating: false,
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
            editing: false,
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
        let editing = this.state.editing;
        let creating = this.state.creating;
        let todos = this.state.todos;
        return(
            <div id='wrapper'>
                {creating ? <div>{newTodo}</div> : null}
                {editing? <div>{editTodo}</div> : null}
                <div id='todo-controls' className='main-element'>
                    <button className='todo-button' onClick={() => this.createTodo()}>Add To-Do</button>
                    {todos.length > 0? <button className='todo-button' onClick={() => this.deleteOn()}>Remove To-Do</button> : null}
                    {todos.length > 0? <button className='todo-button' onClick={() => this.editOn()}>Edit To-Do</button> : null}
                </div>
                <div id='todo-holder' className='main-element'>{this.displayTodos()}</div>
                {deleting? <button className='todo-button main-element' onClick={() => this.deleteOff()}>Cancel Delete</button> : null}
                {editing? <button className='todo-button main-element' onClick={() => this.editOff()}>Cancel Edit</button> : null}
                {creating? <button className='todo-button main-element' onClick={() => this.createOff()}>Cancel Create</button> : null}
            </div>
        );
    }
}
export default Manager;