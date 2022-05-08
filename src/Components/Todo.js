import React from 'react';
import '../index.css';

class Todo extends React.Component {
    render() {
        let changeTodo = this.props.changeTodo;
        let columnLength = 6;
        return(
            <div onClick={() => changeTodo(this.props.id)} className={this.props.total === 1 ? 'only-todo todo-wrapper' : this.props.id === 1 || this.props.id % (columnLength + 1) === 0 ? 'first-todo todo-wrapper' : this.props.id === this.props.total || this.props.id % columnLength === 0 ? 'last-todo todo-wrapper' : 'middle-todo todo-wrapper'}>
                <div className='todo-div'>
                    <h3 className='todo-title'>{this.props.title}</h3>
                    <span className='todo-deadline-string'>{this.props.deadlineString}</span>
                    <span className='todo-checkmark'>&#10003;</span>
                    <span className='todo-square'>&#9634;</span>
                </div>
            </div>
        );
    }
}

export default Todo;