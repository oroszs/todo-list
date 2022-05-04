import React from 'react';
import '../index.css';

class Todo extends React.Component {
    render() {
        let changeTodo = this.props.changeTodo;
        return(
            <div onClick={() => changeTodo(this.props.id)} className={this.props.total === 1 ? 'only-todo todo-wrapper' : this.props.id === 1 ? 'first-todo todo-wrapper' : this.props.id === this.props.total ? 'last-todo todo-wrapper' : 'middle-todo todo-wrapper'}>
                <div className='todo-div'>
                    <h2 className='todo-title'>{this.props.title}</h2>
                    <div className='todo-description-div'>
                        <span className='todo-description'>{this.props.description}</span>
                    </div>
                    <h3>{this.props.status}</h3>
                    <span>{this.props.deadlineString}</span>
                </div>
            </div>
        );
    }
}

export default Todo;