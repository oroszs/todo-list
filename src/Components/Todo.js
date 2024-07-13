import React from 'react';
import '../index.css';

class Todo extends React.Component {
    render() {
        let displayTodo = this.props.displayTodo;
        let classString = `todo-div ${this.props.colorClass}`;
        return(
            <div onClick={() => displayTodo(this.props.id)} className='todo-wrapper'>
                <div className={classString}>
                    {this.props.title.length > 18 ? 
                        <span className='todo-title long-title'>{this.props.title}</span> :
                        <span className='todo-title short-title'>{this.props.title}</span>
                    }
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