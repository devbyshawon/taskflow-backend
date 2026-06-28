const Project = require("../models/Project");

const createProject = async (req, res) => {
    try {
        const {name, description} = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required'});
        }

        const owner = req.user.id;

        const project = new Project({ name, description, owner, members : [{ user: owner, role: 'admin'}]});
        await project.save();

        res.status(201).json(project);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });  
    }
} 

const getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({ 'members.user' : req.user.id});

        res.status(200).json(projects);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });    
    }
}

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found'});
        }

        const found = project.members.find(item => {
            return item.user.toString() === req.user.id;
        });

        if (!found) {
            return res.status(403).json({ message: 'Access denied'});
        }
        
        res.status(200).json(project)
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

}

module.exports = { createProject, getMyProjects, getProjectById };