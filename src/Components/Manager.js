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
            displayTodo: null,
            modState: null,
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
            modState: 'Add',
        });
    }

    changeTodo(index) {
        let modState = this.state.modState;
        switch(modState) {
            case 'View':
                this.displayTodo(index);
            break;
            case 'Edit':
                this.editTodo(index);
            break;
            case 'Delete':
                this.deleteTodo(index);
            break;
            default:
            break;
        }
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

    deleteTodo(index) {
        let currentTodos = this.state.todos;
        currentTodos.splice(index - 1, 1)
        this.setState({
            todos: currentTodos,
            modState: null,
        });
    }

    /*
    create setmod() and cancelMod()
    */

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
            modState: null,
        });
    }

    updateTodo(index) {
        let currentTodos = this.state.todos;
        let title = document.querySelector('#title');
        let description = document.querySelector('#description');
        let status = document.querySelector('input[type="radio"]:checked');
        let todo = new TodoObj;
        todo.title = (title.value === '' ? title.placeholder : title.value);
        todo.description = (description.value === '' ? description.placeholder : description.value);
        todo.status = status.value;
        currentTodos.splice(index - 1, 1, todo);
        this.setState({
            editTodo: null,
            todos: currentTodos,
            modState: null,
        });
    }

    displayTodo(index) {
        let currentTodos = this.state.todos;
        let chosenTodo = currentTodos[index - 1];
        let displayTodo = (
            <div className='create-todo-div'>
                <input className='create-todo-element' type='text' id='title' value={chosenTodo.title}/>
                <textarea className='create-todo-element' id='description' value={chosenTodo.description}/>
                <div className='create-todo-element'>
                    <input id='not-started' type='radio' name='progress' value='Not Started' checked={chosenTodo.status==='Not Started' ? true: false} />Not Started
                    <input id='in-progress' type='radio' name='progress' value='In Progress' checked={chosenTodo.status==='In Progress' ? true : false}/>In Progress
                    <input id='completed' type='radio' name='progress' value='Completed' checked={chosenTodo.statues === 'Completed' ? true : false}/>Completed
                </div>
            </div>
        );
        this.setState({
            displayTodo: displayTodo,
            modState: 'View',
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
        let displayTodo = this.state.displayTodo;
        let todos = this.state.todos;
        let modState= this.state.modState;
        return(
            <div id='wrapper'>
                <div id='popup-wrapper'>
                    {newTodo? <div>{newTodo}</div> : null}
                    {editTodo? <div>{editTodo}</div> : null}
                    {displayTodo? <div>{displayTodo}</div> : null}
                </div>
                <div id='main-wrapper'>
                    <div id='todo-controls' className='main-element'>
                        {!modState ? <button className='todo-button' onClick={() => this.createTodo()}>Add To-Do</button> : null}
                        {todos.length > 0 && !modState? <button className='todo-button' onClick={() => this.setMod('Delete')}>Delete To-Do</button> : null}
                        {todos.length > 0 && !modState? <button className='todo-button' onClick={() => this.setMod('Edit')}>Edit To-Do</button> : null}
                        {modState? <button className='todo-button cancel-button' onClick={() => this.cancelMod()}>Cancel {modState}</button> : null}
                    </div>
                    {todos.length > 0? <div id='todo-holder' className='main-element full-holder'>{this.displayTodos()}</div> : <div id='todo-holder' className='main-element closed-holder'><span id='empty-message'>Click "Add To-Do" to Get Started!</span></div>}
                </div>
            </div>
        );
    }
}
export default Manager;