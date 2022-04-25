import React from 'react';
import '../index.css';

class Todo extends React.Component {
    render() {
        let changeTodo = this.props.changeTodo;
        return(
            <div onClick={() => changeTodo(this.props.id)} className='todo-div'>
                <h1>{this.props.title}</h1>
                <h3>{this.props.status}</h3>
                <div className='todo-description-div'>
                    <span className='todo-description'>{this.props.description}</span>
                </div>
            </div>
        );
    }
}

export default Todo;