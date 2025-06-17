const Opportunity = require('../models/Opportunity');

exports.createOpportunity = async (req, res)=>{
    const {title, description, location, startDate, endDate, requiredSkills}= req.body;

    if(req.user.role !== 'organization'){
        return res.status(403).json({message: 'Only organizations can create opportunities'});
    }

    try{
        const opportunity = new Opportunity({
            title,
            description,
            location,
            startDate,
            endDate,
            requiredSkills,
            postedBy: req.user._id,
        });

        await opportunity.save();
        res.status(201).json({ message: 'Opportunity created', opportunity});
    } catch (err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.getAllOpportunities = async (req, res)=>{
    try{
        const opportunities = await Opportunity.find().populate('postedBy', 'name email');
        res.json(opportunities);
    } catch(err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.getMyOpportunities = async (req, res)=>{
    try{
        if (req.user.role != 'organization'){
            return res.status(403).json({message: 'only organization can view this'});
        }

        const opportunities = await Opportunity.find({postedBy: req.user._id});
        res.json({opportunities});
    } catch (err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
};