import React from 'react';
import '../index.css';
import TodoObj from '../Utils/TodoObj';
import Todo from './Todo.js';
import FullTodo from './FullTodo.js';
import DateConvert from '../Utils/DateConvert.js';

class Manager extends React.Component {
    constructor(props){
        super(props);
        let storedTodos = JSON.parse(window.localStorage.getItem('storedTodos'));
        let currentTodos = (storedTodos ? storedTodos : []);
        this.state = {
            todos: currentTodos,
            displayTodoIndex: null,
            convert: new DateConvert(),
            columnLength: 5,
            mode: null,
        }
        this.completeTodo = this.completeTodo.bind(this);
        this.displayTodo = this.displayTodo.bind(this);
        this.deleteTodo = this.deleteTodo.bind(this);
    }

    storeTodos(todos) {
        let todoJSON = JSON.stringify(todos);
        window.localStorage.setItem('storedTodos', todoJSON);
    }

    createTodo() {
        this.setState({
            mode: 'Create',
        }, () => {
            let time = this.props.time;
            let datetime = document.querySelector('#date-time');
            let future = Date.parse(time) + 3600000;
            let timeString = new Date(future);
            timeString.setMinutes(timeString.getMinutes() - timeString.getTimezoneOffset());
            datetime.value = timeString.toISOString().slice(0, 16);
            let status = document.querySelector('#not-started');
            status.checked = true;
            this.stopProp();
        });
    }

    displayTodo(index) {
        this.setState({
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

    deleteTodo(e, index) {
        e.stopPropagation();
        let currentTodos = this.state.todos;
        let mode = this.state.mode;
        if(mode !== 'Create') {
            currentTodos.splice(index - 1, 1);
        }
        this.storeTodos(currentTodos);
        this.setState({
            todos: currentTodos,
            displayTodoIndex: null,
            mode: null,
        });
    }

    saveTodo() {
        let mode = this.state.mode;
        let currentTodos = this.state.todos;
        let title = document.querySelector('#title');
        let description = document.querySelector('#description');
        let status = document.querySelector('input[type="radio"]:checked');
        let deadline = document.querySelector('#date-time');
        let todo = new TodoObj();
        let index = this.state.displayTodoIndex;
        todo.title = title.value === '' ? 'To-Do' : title.value;
        todo.description = (description.value === ''? '' : description.value);
        todo.deadline = deadline.value;
        todo.deadlineString = (index ? currentTodos[index - 1].deadlineString : '');
        todo.colorClass = (index ? currentTodos[index - 1].colorClass : 'normal-todo');
        todo.status = status.value;
        if(mode === 'Create') {
            currentTodos.push(todo);
        } else if (mode === 'Display') {
            currentTodos.splice(index - 1, 1, todo);
        }
        let sortedTodos = currentTodos.sort((a, b) => Date.parse(a.deadline) - Date.parse(b.deadline));
        this.storeTodos(sortedTodos);
        this.setState({
            displayTodoIndex: null,
            todos: sortedTodos,
            mode: null,
        });
    }

    completeTodo(e, index) {
        e.stopPropagation();
        let todos = this.state.todos;
        if(todos[index - 1].status === 'In Progress' || todos[index - 1].status === 'Not Started') {
            todos[index - 1].status = 'Completed';
            todos[index - 1].deadlineString = null;
        } else if (todos[index - 1].status === 'Completed') {
            todos[index - 1].status = 'In Progress';
        }
        this.storeTodos(todos);
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
                return <Todo key={index} id={index} title={obj.title} description={obj.description} status={obj.status} deadlineString={obj.deadlineString} colorClass={obj.colorClass} deleteTodo={this.deleteTodo} completeTodo={this.completeTodo} displayTodo={this.displayTodo}/>
            });
        return todoComponents;
    }

    updateDeadlines(){
        let currentTodos = this.state.todos;
        let savedTodos = window.localStorage.getItem('storedTodos');
        if(currentTodos.length === 0) {
            return;
        }
        let time = this.props.time;
        const convert = new DateConvert();
        const MILLI_WEEK = 604800000;
        const MILLI_DAY = 86400000;
        const MILLI_HOUR = 3600000;

        let newTodos = currentTodos.map(todo => {
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
                    todo.colorClass = 'passed-todo';
                } else if (milliDiff < MILLI_HOUR) {
                    todo.deadlineString = 'Deadline: Approaching';
                    todo.colorClass = 'soon-todo';
                } else {
                    todo.colorClass = 'normal-todo';
                }
            } else {
                todo.colorClass = 'complete-todo';
            }
            return todo;
        });
        if(JSON.stringify(newTodos) !== savedTodos) {
            this.storeTodos(newTodos);
        }
        if(JSON.stringify(newTodos) !== JSON.stringify(this.state.todos)) {
            this.setState({
                todos: newTodos,
            });
        }
    }

    componentDidMount() {
        setInterval(() => {
            this.updateDeadlines();
        }, 500);
    }

    render() {
        let mode = this.state.mode;
        let index = this.state.displayTodoIndex;
        let buttonMessage = (mode === 'Create' ? 'Cancel' : 'Delete');
        let colorClass = (index ? this.state.todos[index - 1].colorClass : 'normal-todo');
        return(
            <div id='wrapper'>
                {mode? 
                <div>
                    <div id='displayBG' onClick={(e) => this.saveTodo(e)}>
                        <FullTodo colorClass={colorClass}/>
                    </div>
                    <div id='button-holder'>
                        <button className='todo-button' id='confirm-button' onClick={() => this.saveTodo(index)}>Confirm</button>
                        <button className='todo-button' id='delete-button' onClick={(e) => this.deleteTodo(e, index)}>{buttonMessage}</button>
                    </div>
                </div>
                : null}
                <div id='todo-holder'>
                    {this.displayTodos()}
                    <div className='todo-wrapper'>
                        <div className='todo-div normal-todo' id='add-todo' onClick={() => this.createTodo()}>+</div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Manager;