import React from 'react';
import '../index.css';

class Todo extends React.Component {
    render() {
        let changeTodo = this.props.changeTodo;
        return(
            <div onClick={() => changeTodo(this.props.id)} className='todo-div'>
                <h2 className='todo-title'>{this.props.title}</h2>
                <div className='todo-description-div'>
                    <span className='todo-description'>{this.props.description}</span>
                </div>
                <h3>{this.props.status}</h3>
                <span>{this.props.deadlineString}</span>
            </div>
        );
    }
}

export default Todo;