const mongoose = require('mongoose');
const Task = require('../models/Task');
const Project = require('../models/Project');

const createTask = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found'});
        }

        const member = project.members.find(item => {
            return item.user.toString() === req.user.id;
        });

        if (!member) {
            return res.status(403).json({ message: 'Access denied'});
        }
        
        const {title, description, assignedTo, dueDate} = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is missing'});
        }

        if (assignedTo) {
            const assign = project.members.find(item => {
                return item.user.toString() === assignedTo;
            });

            if (!assign) {
                return res.status(400).json({ message: 'Assigned user is not a project member'});
            }

        }

        const task = new Task({ title, description, project: req.params.id, assignedTo, dueDate });

        await task.save();
        const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email');
        res.status(201).json(populatedTask);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' }); 
    }

}

const getTask = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ message: 'Project not found' });
    }

    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found'});
        }

        const member = project.members.find(item => {
            return item.user.toString() === req.user.id;
        });

        if (!member) {
            return res.status(403).json({ message: 'Access denied'});
        }

        const task = await Task.find({ project: req.params.id}).populate('assignedTo', 'name email');

        res.status(200).json(task);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' }); 
    }

} 

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found'});
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(403).json({ message: 'Access denied'});
        }

        const member = project.members.find(item => {
            return item.user.toString() === req.user.id;
        })

        if (!member) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (member.role === 'admin') {
            const { title, description, status, assignedTo, dueDate } = req.body;

            if (title) {
                task.title = title;
            }

            if (description) {
                task.description = description;
            }

            if (status) {
                task.status = status;
            }

            if (assignedTo) {
                task.assignedTo = assignedTo;
            }

            if (dueDate) {
                task.dueDate = dueDate;
            }

        }

        if (member.role === 'member') {
            if (!task.assignedTo) {
                return res.status(403).json({ message: 'You can only update tasks assigned to you' });
            }

            const assign = task.assignedTo.toString() === req.user.id;

            if (!assign) {
                return res.status(403).json({ message: 'You can only update tasks assigned to you'})
            }

            const { status } = req.body;

            if (status) {
                task.status = status;
            }
        }

        await task.save();

        res.status(200).json(task);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error'});
    }
}

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found'});
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(403).json({ message: 'Access denied'});
        }

        const member = project.members.find(item => {
            return item.user.toString() === req.user.id;
        })

        if (!member) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (member.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required'});
        }
        
        await task.deleteOne();

        return res.status(200).json({ message: 'Task deleted'})

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error'});    
    }
}

module.exports = { createTask, getTask, updateTask, deleteTask };