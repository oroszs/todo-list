import React from 'react';
import './index.css';

class Manager extends React.Component {
    constructor(props){
        super(props);
        let todos = [];
        this.state = {
            todos: todos,
            newTodo: null,
        }
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

    saveTodo() {
        let currentTodos = this.state.todos;
        let title = document.querySelector('#title');
        let description = document.querySelector('#description');
        let status = document.querySelector('input[type="radio"]:checked');
        const NEW_TODO = (
            <div className='todo-div'>
                <h1>{title.value}</h1>
                <h3>{status.value}</h3>
                <div className='todo-description-div'>
                    <span className='todo-description'>{description.value}</span>
                </div>
            </div>
        );
        currentTodos.push(NEW_TODO);
        this.setState({
            newTodo: null,
            todos: currentTodos,
        });
    }

    render() {
        let currentTodoList = this.state.todos;
        let newTodo = this.state.newTodo;
        return(
            <div id='wrapper'>
                <div>{newTodo}</div>
                <div id='todo-controls' className='main-element'>
                    <button className='todo-button' onClick={() => this.createTodo()}>Add To-Do</button>
                </div>
                <div id='todo-holder' className='main-element'>{currentTodoList}</div>
            </div>
        );
    }
}
export default Manager;