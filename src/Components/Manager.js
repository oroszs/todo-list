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
            displayTodo: null,
            displayTodoIndex: null,
            convert: new DateConvert(),
            columnLength: 3,
            mode: null,
        }
        this.completeTodo = this.completeTodo.bind(this);
        this.displayTodo = this.displayTodo.bind(this);
        this.saveTodo = this.saveTodo.bind(this);
        this.deleteTodo = this.deleteTodo.bind(this);
        this.addDeadline = this.addDeadline.bind(this);
        this.addDescription = this.addDescription.bind(this);
        this.updateDisplayTodo = this.updateDisplayTodo.bind(this);
        this.removeElement = this.removeElement.bind(this);
        this.clearCompleted = this.clearCompleted.bind(this);
        this.clearAll = this.clearAll.bind(this);
    }

    storeTodos(todos) {
        let todoJSON = JSON.stringify(todos);
        window.localStorage.setItem('storedTodos', todoJSON);
    }

    createTodo() {
        let fullTodo = new TodoObj();
        fullTodo.colorClass = 'normal-todo';
        this.setState({
            displayTodo: fullTodo,
            mode: 'Create',
        }, () => {
            let status = document.querySelector('#not-started');
            status.checked = true;
        });
    }

    updateDisplayTodo() {
        let temp = this.state.displayTodo;
        let deadline = document.querySelector('#date-time');
        let status = document.querySelector('input[type="radio"]:checked');
        if(deadline) {
            temp.deadline = deadline.value;
        }
        if(status) {
            temp.status = status.value;
        }
        this.setState({
            displayTodo: temp,
        });
    }

    displayTodo(index) {
        this.setState({
            displayTodoIndex: index,
            displayTodo: this.state.todos[index - 1],
            mode: 'Display',
        }, () => {
            let title = document.querySelector('#title');
            let description = document.querySelector('#description');
            let chosenTodo = this.state.todos[this.state.displayTodoIndex - 1];
            title.value = chosenTodo.title;
            if(description) {
                description.value = chosenTodo.description;
            }
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
            if(deadline) {
                deadline.value = chosenTodo.deadline;
            }
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
        if(description && description.value !== '') {
            todo.description = description.value;
        }
        if(deadline) {
            todo.deadline = deadline.value;
        }
        todo.deadlineString = (index ? currentTodos[index - 1].deadlineString : '');
        todo.colorClass = (index ? currentTodos[index - 1].colorClass : 'normal-todo');
        todo.status = status.value;
        if(mode === 'Create') {
            currentTodos.push(todo);
        } else if (mode === 'Display') {
            currentTodos.splice(index - 1, 1, todo);
        }
        let deadlineTodos = [];
        let nonDeadlineTodos = [];
        currentTodos.forEach(todo => {
            if(todo.deadline) {
                deadlineTodos.push(todo);
            } else {
                nonDeadlineTodos.push(todo);
            }
        });
        let sortedTodos = [];
        if(deadlineTodos.length > 0) {
            sortedTodos = deadlineTodos.sort((a, b) => Date.parse(a.deadline) - Date.parse(b.deadline));
        }
        if(nonDeadlineTodos.length > 0) {
            nonDeadlineTodos.forEach(todo => {
                sortedTodos.unshift(todo);
            });
        }
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

    clearCompleted() {
        let todos = this.state.todos;
        for(let i = 0; i < todos.length; i++) {
            if(todos[i].status === 'Completed') todos.splice(i, 1);
        }
        this.storeTodos(todos);
        this.setState({
            todos: todos,
        });
    }

    clearAll() {
        this.storeTodos([]);
        this.setState({
            todos: [],
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

    addDescription() {
        let temp = this.state.displayTodo;
        temp.description = '';
        this.setState({
            displayTodo: temp,
        });
    }
    removeElement(element) {
        let temp = this.state.displayTodo;
        if(element === 'Description') {
            temp.description = undefined;
        } else if (element === 'Deadline') {
            temp.deadline = undefined;
        }
        this.setState({
            displayTodo: temp,
        });
    }

    addDeadline() {
        let temp = this.state.displayTodo;
        temp.deadline = new Date();
        this.setState({
            displayTodo: temp,
        }, () => {
            let time = this.props.time;
            let future = Date.parse(time) + 3600000;
            let timeString = new Date(future);
            timeString.setMinutes(timeString.getMinutes() - timeString.getTimezoneOffset());
            let setTodo = this.state.displayTodo;
            setTodo.deadline = timeString.toISOString().slice(0, 16);
            let displayDeadline = document.querySelector('#date-time');
            displayDeadline.value = timeString.toISOString().slice(0, 16);
            this.setState({
                displayTodo: setTodo,
            });
        });
    }

    updateDeadlines(){
        let currentTodos = this.state.todos;
        let savedTodos = window.localStorage.getItem('storedTodos');
        let time = this.props.time;
        const convert = new DateConvert();
        const MILLI_WEEK = 604800000;
        const MILLI_DAY = 86400000;
        const MILLI_HOUR = 3600000;

        const updateTodo = (todo) => {
            if(todo.status !== 'Completed' && todo.deadline !== undefined && todo.deadline !== 'Add Deadline') {
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
                if(todo.status === 'Completed') {
                    todo.colorClass = 'complete-todo';
                    todo.deadlineString = null;
                } else {
                    todo.colorClass = 'normal-todo';
                }
            }
            return todo;
        }

        if(this.state.mode === 'Create') {
            let newdisplayTodo = updateTodo(this.state.displayTodo);
                this.setState({
                    displayTodo: newdisplayTodo,
                });
        }
        if(this.state.todos.length === 0) {
            return;
        }
        let newTodos = currentTodos.map(todo => updateTodo(todo));
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
        let fullTodo = (mode ? this.state.displayTodo : null);
        let todos = this.state.todos;
        let completed = todos.filter(todoEl => todoEl.status === 'Completed');
        return(
            <div id='wrapper'>
                {mode? 
                <div>
                    <div id='displayBG' onClick={() => this.saveTodo()}/>
                    <FullTodo removeElement={this.removeElement} updateDisplayTodo={this.updateDisplayTodo} addDescription={this.addDescription} addDeadline={this.addDeadline} fullTodo={fullTodo} message={buttonMessage} save={this.saveTodo} delete={this.deleteTodo} index={index}/>
                </div>
                : null}
                <div id='todo-holder'>
                    {this.displayTodos()}
                    <div className='todo-wrapper'>
                        <div className='todo-div normal-todo' id='add-todo' onClick={() => this.createTodo()}>+</div>
                    </div>
                </div>
                {todos.length > 0?
                    <div id='clearHolder'>
                        <div className='clearButton' id='clearAllButton' onClick={() => this.clearAll()}>Clear All</div>
                        {completed.length > 0?
                        <div className='clearButton' id='clearCompletedButton' onClick={() => this.clearCompleted()}>Clear Completed</div>
                        : null}
                    </div>
                : null}
            </div>
        );
    }
}
export default Manager;