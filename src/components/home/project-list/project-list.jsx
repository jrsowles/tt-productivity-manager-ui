// npm modules
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// components
import Accordion from '../../accordion/accordion.jsx';
import AccordionItem from '../../accordion/accordion-item/accordion-item.jsx';
import AddNew from './add-new/add-new.jsx';
import TaskListItems from './task-list-items/task-list-items.jsx';

// actions
import projectListActions from './project-list-actions.js';

// styles
require('./project-list.scss');

class ProjectList extends React.Component {

    componentWillMount() {
        this.props.fetchProjectList();
    }

    render() {
        return (
            <div className="project-list">
                {this.props.error}

                <Accordion>
                    {
                        this.props.projects.map(function(project, key) {
                            const taskLists = this.props.taskLists.filter(function(taskList) {
                                return taskList.ProjectId == project.Id;
                            });

                            return (
                                <AccordionItem
                                    key={key}
                                    header={{
                                        content: project.Name,
                                        class: 'project'
                                    }}
                                    body={{
                                        content: <TaskListItems
                                            taskLists={taskLists}
                                            projectId={project.Id}
                                            handleAddTaskListClick={this.props.handleAddTaskListClick}
                                            handleDeleteTaskListClick={this.props.handleDeleteTaskListClick}
                                        />
                                    }}
                                />
                            );
                        }.bind(this))
                    }
                    <AddNew
                        entity='project'
                        class='add-new-project'
                        handleSubmit={this.props.handleAddProjectClick}
                    />
                </Accordion>
            </div>
        );
    }
}

ProjectList.propTypes = {
    isLoading: React.PropTypes.bool.isRequired,
    error: React.PropTypes.string.isRequired,
    projects: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    taskLists: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
};

function mapStateToProps(state) {
    return {
        isLoading: state.projectList.isLoading,
        error: state.projectList.error,
        projects: state.projectList.projects,
        taskLists: state.projectList.taskLists
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchProjectList: function() {
            dispatch(projectListActions.fetchProjectList());
        },
        handleAddProjectClick: function(name) {
            dispatch(projectListActions.addProject(name)).then(function() {
                dispatch(projectListActions.fetchProjectList());
            });
        },
        handleAddTaskListClick: function(projectId) {
            dispatch(projectListActions.addTaskList(projectId)).then(function() {
                dispatch(projectListActions.fetchProjectList());
            });
        },
        handleDeleteTaskListClick: function(taskListId) {
            dispatch(projectListActions.deleteTaskList(taskListId)).then(function() {
                dispatch(projectListActions.fetchProjectList());
            });
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);
