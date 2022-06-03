import React from 'react';
import '../index.css';
class FullTodo extends React.Component {
    render() {
        let classString = `create-todo-div ${this.props.fullTodo.colorClass}`;
        return (
            <div className={classString}>
                <h3 className='todo-header' id='create-todo-title'>Title</h3>
                <input className='create-todo-element' placeholder='Enter Title Here...' type='text' id='title' />
                <h3 className='todo-header'>Description</h3>
                <textarea className='create-todo-element' placeholder='Enter Description Here...' id='description' />
                {this.props.fullTodo.deadline ? 
                    <div id='deadline-wrapper'>
                        <h3 className='todo-header'>Deadline</h3>
                        <input className = 'create-todo-element' type='datetime-local' id='date-time' onChange={() => this.props.updateDisplayTodo()} />
                    </div> :
                    <input className='create-todo-element todo-button' type='button' id='add-deadline' value='Add Deadline' onClick={() => this.props.addDeadline()} />
                }
                <h3 className='todo-header'>Status</h3>
                <div className='create-todo-element' id='status-div'>
                    <input id='not-started' className='status-element' type='radio' name='progress' value='Not Started' onChange={() => this.props.updateDisplayTodo()}/><label htmlFor='not-started'>Not Started</label>
                    <input id='in-progress' className='status-element' type='radio' name='progress' value='In Progress' onChange={() => this.props.updateDisplayTodo()}/><label htmlFor='in-progress'>In Progress</label>
                    <input id='completed' className='status-element' type='radio' name='progress' value='Completed' onChange={() => this.props.updateDisplayTodo()}/><label htmlFor='completed'>Completed</label>
                </div>
                <div id='button-holder'>
                    <input className='todo-button' type='button' id='confirm-button' value='Confirm' onClick={() => this.props.save()}/>
                    <input className='todo-button' type='button' id='delete-button' value={this.props.message} onClick={(e) => this.props.delete(e, this.props.index)} />
                </div> 
           </div>
        );
    }
}
export default FullTodo;