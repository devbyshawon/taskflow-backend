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

        res.status(201).json(task);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' }); 
    }

}

const getTask = async (req, res) => {
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
module.exports = { createTask, getTask };