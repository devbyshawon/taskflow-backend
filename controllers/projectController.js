const mongoose = require('mongoose');
const Project = require('../models/Project');
const User = require('../models/User');

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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ message: 'Project not found' });
    }
    
    try {
        const project = await Project.findById(req.params.id).populate('members.user', 'name email');
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found'});
        }

        const found = project.members.find(item => {
            return item.user._id.toString() === req.user.id;
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

const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found'});
        }
        
        const member = project.members.find(item => { 
            return item.user.toString() === req.user.id;
        });
        
        if (!member || member.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
        const {name, description} = req.body;
        
        if (name) {
            project.name = name;
        }
        
        if (description) {
            project.description = description;
        }
        
        await project.save();
        
        res.status(200).json(project);        
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });           
    }

}

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found'});
        }
        
        const member = project.members.find(item => { 
            return item.user.toString() === req.user.id;
        });
        
        if (!member || member.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
        await project.deleteOne();

        res.status(200).json({ message: 'Project deleted'});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });        
    }
}

const addMember = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found'});
        }
        
        const member = project.members.find(item => { 
            return item.user.toString() === req.user.id;
        });
        
        if (!member || member.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const {email} = req.body;

        const userToAdd = await User.findOne({ email });

        if (!userToAdd) {
            return res.status(404).json({ message: 'User not found'});
        }

        const existingMember = project.members.find(item => {
            return item.user.toString() === userToAdd._id.toString();
        });

        if (existingMember) {
            return res.status(400).json({ message: 'User already a member'});
        }

        project.members.push({ user: userToAdd._id, role: 'member'});

        await project.save();

        res.status(200).json(project);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });   
    }
}

const removeMember = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found'});
        }
        
        const member = project.members.find(item => { 
            return item.user.toString() === req.user.id;
        });
        
        if (!member || member.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
        const userId = req.params.userId;

        const existingMember = project.members.find(m => {
            return m.user.toString() === userId
        });

        if (!existingMember) {
            return res.status(404).json({ member: 'Member not found'});
        }

        if (userId === req.user.id) {
            return res.status(400).json({ message: 'Cannot remove yourself as admin'})
        }

        project.members = project.members.filter(item => {
            return item.user.toString()!== userId;
        });

        await project.save();

        res.status(200).json(project);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });                   
    }

}

module.exports = { createProject, getMyProjects, getProjectById, updateProject, deleteProject, addMember, removeMember };