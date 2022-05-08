import React from 'react';
import '../index.css';
import TodoObj from '../Utils/TodoObj';
import Todo from './Todo.js';
import DateConvert from '../Utils/DateConvert.js';

class Manager extends React.Component {
    constructor(props){
        super(props);
        let time = this.props.time;
        let sampleTodos = [
            {
                title: 'Work',
                description: 'Go to work',
                deadline: time,
                deadlineString: '',
                status: 'In Progress',
            },
            {
                title: 'Food',
                description: 'Eat something',
                deadline: time,
                deadlineString: '',
                status: 'Not Completed',
            },
            {
                title: 'Dogs',
                description: 'Walk the dogs',
                deadline: time,
                deadlineString: '',
                status: 'Not Completed',
            },
            {
                title: 'Work',
                description: 'Go to work',
                deadline: time,
                deadlineString: '',
                status: 'In Progress',
            },
            {
                title: 'Food',
                description: 'Eat something',
                deadline: time,
                deadlineString: '',
                status: 'Not Completed',
            },
            {
                title: 'Dogs',
                description: 'Walk the dogs',
                deadline: time,
                deadlineString: '',
                status: 'Not Completed',
            },
            {
                title: 'Work',
                description: 'Go to work',
                deadline: time,
                deadlineString: '',
                status: 'In Progress',
            },
            {
                title: 'Food',
                description: 'Eat something',
                deadline: time,
                deadlineString: '',
                status: 'Not Completed',
            },
            {
                title: 'Dogs',
                description: 'Walk the dogs',
                deadline: time,
                deadlineString: '',
                status: 'Not Completed',
            },
        ];
        this.state = {
            todos: sampleTodos,
            newTodo: null,
            editTodo: null,
            displayTodo: null,
            modState: null,
            convert: new DateConvert,
        }
        this.changeTodo = this.changeTodo.bind(this);
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
                <button className='create-todo-element' id='submit-button' onClick={() => this.saveTodo()}>Submit</button>
            </div>
        );
        this.setState({
            newTodo: newOne,
            modState: 'Add',
        }, () => {
            let time = this.props.time;
            let datetime = document.querySelector('#date-time');
            let timeString = new Date(time);
            timeString.setMinutes(timeString.getMinutes() - timeString.getTimezoneOffset());
            datetime.value = timeString.toISOString().slice(0, 16);
            let status = document.querySelector('#not-started');
            status.checked = true;
        });
    }

    changeTodo(index) {
        let modState = this.state.modState;
        switch(modState) {
            case 'Edit':
                this.editTodo(index);
            break;
            case 'Delete':
                this.deleteTodo(index);
            break;
            default:
                this.displayTodo(index);
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
                <input className='create-todo-element' id='date-time' type='datetime-local' />
                <div className='create-todo-element'>
                    <h3 id='status-header'>Status</h3>
                    <div id='status-div'>
                        <input id='not-started' className='status-element' type='radio' name='progress' value='Not Started' /><label htmlFor='not-started'>Not Started</label>
                        <input id='in-progress' className='status-element' type='radio' name='progress' value='In Progress' /><label htmlFor='in-progress'>In Progress</label>
                        <input id='completed' className='status-element' type='radio' name='progress' value='Completed' /><label htmlFor='completed'>Completed</label>
                    </div>
                </div>
                <button className='create-todo-element' id='submit-button' onClick={() => this.updateTodo(index)}>Submit</button>
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

            let deadline = document.querySelector('#date-time');
            deadline.value=chosenTodo.deadline;
        });
    }

    deleteTodo(index) {
        let currentTodos = this.state.todos;
        currentTodos.splice(index - 1, 1);
        this.setState({
            todos: currentTodos,
            modState: null,
        });
    }

    setMod(newState) {
        this.setState({
            modState: newState,
        });
    }

    cancelMod() {
        this.setState({
            modState: null,
            newTodo: null,
            editTodo: null,
            displayTodo: null,
        });
    }

    saveTodo() {
        let currentTodos = this.state.todos;
        let title = document.querySelector('#title');
        let description = document.querySelector('#description');
        let status = document.querySelector('input[type="radio"]:checked');
        let deadline = document.querySelector('#date-time');
        let todo = new TodoObj;
        todo.title = title.value;
        todo.description = description.value;
        todo.deadline = deadline.value;
        todo.status = status.value;
        currentTodos.push(todo);
        let sortedTodos = currentTodos.sort((a, b) => Date.parse(a.deadline) - Date.parse(b.deadline));
        this.setState({
            newTodo: null,
            todos: sortedTodos,
            modState: null,
        });
    }

    updateTodo(index) {
        let currentTodos = this.state.todos;
        let title = document.querySelector('#title');
        let description = document.querySelector('#description');
        let deadline = document.querySelector('#date-time');
        let status = document.querySelector('input[type="radio"]:checked');
        let todo = new TodoObj;
        todo.title = (title.value === '' ? title.placeholder : title.value);
        todo.description = (description.value === '' ? description.placeholder : description.value);
        todo.deadline = deadline.value;
        todo.status = status.value;
        currentTodos.splice(index - 1, 1, todo);
        let sortedTodos = currentTodos.sort((a, b) => Date.parse(a.deadline) - Date.parse(b.deadline));
        this.setState({
            editTodo: null,
            todos: sortedTodos,
            modState: null,
        });
    }

    displayTodo(index) {
        let currentTodos = this.state.todos;
        let chosenTodo = currentTodos[index - 1];
        let displayTodo = (
            <div className='create-todo-div'>
                <input className='create-todo-element' type='text' id='title' readOnly value={chosenTodo.title}/>
                <textarea className='create-todo-element' id='description' readOnly value={chosenTodo.description}/>
                <input className='create-todo-element' type='datetime-local' readOnly value={chosenTodo.deadline} />
                <div className='create-todo-element'>
                    {chosenTodo.status}
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
                return <Todo total={currentTodos.length} key={index} id={index} title={obj.title} description={obj.description} status={obj.status} deadlineString={obj.deadlineString} changeTodo={this.changeTodo}/>
            });
        return todoComponents;
    }

    updateDeadlines(){
        let currentTodos = this.state.todos;
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
                    <div id='todo-controls'>
                        {!modState ? <button className='todo-button' onClick={() => this.createTodo()}>Add To-Do</button> : null}
                        {todos.length > 0 && !modState? <button className='todo-button' onClick={() => this.setMod('Delete')}>Delete To-Do</button> : null}
                        {todos.length > 0 && !modState? <button className='todo-button' onClick={() => this.setMod('Edit')}>Edit To-Do</button> : null}
                        {modState? <button className='todo-button cancel-button' onClick={() => this.cancelMod()}>Cancel {modState}</button> : null}
                    </div>
                    {todos.length > 0? <div id='todo-holder'>{this.displayTodos()}</div> : <div id='empty-todo-holder' ><span id='empty-message'>Click "Add To-Do" to Get Started!</span></div>}
                </div>
            </div>
        );
    }
}
export default Manager;