import React from 'react';
import '../index.css';

class Todo extends React.Component {
    render() {
        let displayTodo = this.props.displayTodo;
        return(
            <div onClick={() => displayTodo(this.props.id)} className='todo-wrapper'>
                <div className='todo-div'>
                    <h3 className='todo-title'>{this.props.title}</h3>
                    <span className='todo-deadline-string'>{this.props.deadlineString}</span>
                    {this.props.status === 'Completed' ? <span className='todo-checkmark'>&#10003;</span> : null}
                    <span className='todo-delete' onClick={(e) => this.props.deleteTodo(e, this.props.id)}>&#9447;</span>
                    <span className='todo-square' onClick={(e) => this.props.completeTodo(e, this.props.id)}>&#9634;</span>
                </div>
            </div>
        );
    }
}

export default Todo;