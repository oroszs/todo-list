import React from 'react';
import '../index.css';
import TodoObj from '../Utils/TodoObj';
import Todo from './Todo.js';
import DateConvert from '../Utils/DateConvert.js';

class Manager extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            todos: [],
            displayTodo: null,
            displayTodoIndex: null,
            convert: new DateConvert,
            columnLength: 5,
            mode: null,
        }
        this.completeTodo = this.completeTodo.bind(this);
        this.displayTodo = this.displayTodo.bind(this);
    }

    createTodo() {
        let newOne = (
            <div className='create-todo-div'>
                <input className='create-todo-element' placeholder='Enter Title Here...' type='text' id='title' />
                <textarea className='create-todo-element' placeholder='Enter Description Here...' id='description' />
                <input className = 'create-todo-element' type='datetime-local' id='date-time' />
                <div className='create-todo-element'>
                    <h3 id='status-header'>Status</h3>
                    <div id='status-div'>
                        <input id='not-started' className='status-element' type='radio' name='progress' value='Not Started' /><label htmlFor='not-started'>Not Started</label>
                        <input id='in-progress' className='status-element' type='radio' name='progress' value='In Progress' /><label htmlFor='in-progress'>In Progress</label>
                        <input id='completed' className='status-element' type='radio' name='progress' value='Completed' /><label htmlFor='completed'>Completed</label>
                    </div>
                </div>
            </div>
        );
        this.setState({
            displayTodo: newOne,
            mode: 'Create',
        }, () => {
            let time = this.props.time;
            let datetime = document.querySelector('#date-time');
            let timeString = new Date(time);
            timeString.setMinutes(timeString.getMinutes() - timeString.getTimezoneOffset());
            datetime.value = timeString.toISOString().slice(0, 16);
            let status = document.querySelector('#not-started');
            status.checked = true;
            this.stopProp();
        });
    }

    displayTodo(index) {
        let editOne = (
            <div className='create-todo-div'>
                <input className='create-todo-element' type='text' id='title'/>
                <textarea className='create-todo-element' id='description'/>
                <input className='create-todo-element' id='date-time' type='datetime-local' />
                <div className='create-todo-element'>
                    <h3 id='status-header'>Status</h3>
                    <div id='status-div'>
                        <input id='not-started' className='status-element' type='radio' name='progress' value='Not Started' /><label htmlFor='not-started'>Not Started</label>
                        <input id='in-progress' className='status-element' type='radio' name='progress' value='In Progress' /><label htmlFor='in-progress'>In Progress</label>
                        <input id='completed' className='status-element' type='radio' name='progress' value='Completed' /><label htmlFor='completed'>Completed</label>
                    </div>
                </div>
            </div>
        );
        this.setState({
            displayTodo: editOne,
            displayTodoIndex: index,
            mode: 'Display',
        }, () => {
            let title = document.querySelector('#title');
            let description = document.querySelector('#description');
            let chosenTodo = this.state.todos[this.state.displayTodoIndex - 1];
            title.value = chosenTodo.title;
            description.value = chosenTodo.description;
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
            let deadline = document.querySelector('#date-time');
            deadline.value = chosenTodo.deadline;
            this.stopProp();
        });
    }

    stopProp() {
        let createDiv = document.querySelector('.create-todo-div');
        createDiv.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    deleteTodo(index) {
        let currentTodos = this.state.todos;
        currentTodos.splice(index - 1, 1);
        this.setState({
            todos: currentTodos,
        });
    }

    saveTodo() {
        let mode = this.state.mode;
        let currentTodos = this.state.todos;
        let title = document.querySelector('#title');
        let description = document.querySelector('#description');
        let status = document.querySelector('input[type="radio"]:checked');
        let deadline = document.querySelector('#date-time');
        let todo = new TodoObj;
        let index = this.state.displayTodoIndex;
        todo.title = (title.value === ''? 'Untitled' : title.value);
        todo.description = (description.value === ''? '' : description.value);
        todo.deadline = deadline.value;
        todo.status = status.value;
        if(mode === 'Create') {
            currentTodos.push(todo);
        } else if (mode === 'Display') {
            currentTodos.splice(index - 1, 1, todo);
        }
        let sortedTodos = currentTodos.sort((a, b) => Date.parse(a.deadline) - Date.parse(b.deadline));
        this.setState({
            displayTodo: null,
            displayTodoIndex: null,
            todos: sortedTodos,
            mode: null,
        });
    }

    completeTodo(e, index) {
        e.stopPropagation();
        let todos = this.state.todos;
        if(todos[index - 1].status === 'In Progress') {
            todos[index - 1].status = 'Completed';
            todos[index - 1].deadlineString = null;
        } else if (todos[index - 1].status === 'Completed') {
            todos[index - 1].status = 'In Progress';
        }
        this.setState({
            todos: todos,
        });
    }

    displayTodos() {
        let currentTodos = this.state.todos;
        let index = 0;
        let todoComponents = currentTodos.map(obj => 
            {
                index ++;
                return <Todo key={index} id={index} title={obj.title} description={obj.description} status={obj.status} deadlineString={obj.deadlineString} completeTodo={this.completeTodo} displayTodo={this.displayTodo}/>
            });
        return todoComponents;
    }

    updateDeadlines(){
        let currentTodos = this.state.todos;
        if(currentTodos.length === 0) {
            return;
        }
        let time = this.props.time;
        const convert = new DateConvert;
        const MILLI_WEEK = 604800000;
        const MILLI_DAY = 86400000;
        const MILLI_HOUR = 3600000;

        currentTodos.forEach(todo => {
            if(todo.status !== 'Completed') {
                let todoDate = new Date(Date.parse(todo.deadline)).getDate();
                let todoMilli = Date.parse(todo.deadline);

                let currentDate = time.getDate();
                let currentMilli = Date.parse(time);

                let milliDiff = todoMilli - currentMilli;

                let sameDay = (milliDiff < MILLI_DAY && todoDate === currentDate);
                let tomorrow = new Date(currentMilli + MILLI_DAY).getDate();

                if(sameDay) {
                    todo.deadlineString = 'Deadline: Today';
                } else if (tomorrow === todoDate){
                    todo.deadlineString = 'Deadline: Tomorrow';
                } else if (milliDiff < MILLI_WEEK) {
                    let todoDay = convert.day(new Date(Date.parse(todo.deadline)).getDay());
                    todo.deadlineString = `Deadline: ${todoDay}`;
                } else {
                    let todoMonth = new Date(Date.parse(todo.deadline)).getMonth();
                    todo.deadlineString = `Deadline: ${(todoMonth + 1) + ' / ' + (todoDate)}`
                }
                if (milliDiff < 0) {
                    todo.deadlineString = 'Deadline: Passed';
                } else if (milliDiff < MILLI_HOUR) {
                    todo.deadlineString = 'Deadline: Approaching';
                }
            }
        });
    }

    componentDidUpdate() {
        setInterval(() => {
            this.updateDeadlines();
        }, 500);
    }

    render() {
        let displayTodo = this.state.displayTodo;
        return(
            <div id='wrapper'>
                {displayTodo? 
                <div id='displayBG' onClick={(e) => this.saveTodo(e)}>
                    {displayTodo}
                </div> 
                : null}
                <div id='todo-holder'>
                    {this.displayTodos()}
                    <div className='todo-wrapper'>
                        <div className='todo-div' id='add-todo' onClick={() => this.createTodo()}>+</div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Manager;