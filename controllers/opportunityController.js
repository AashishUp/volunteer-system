const Opportunity = require('../models/Opportunity');
const User = require('../models/User');

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
            tags,
        });

        await opportunity.save();
        res.status(201).json({ message: 'Opportunity created', opportunity});
    } catch (err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.getAllOpportunities = async (req, res)=>{
    try{
        const opportunities = await Opportunity.find({}, '-applicants').populate('postedBy', 'name email');
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

exports.applyToOpportunity = async (req,res)=>{
    try {
        if (req.user.role !== 'volunteer'){
            return res.status(403).json({message: 'Only volunteers can apply'});
        }

        const opportunity = await Opportunity.findById(req.params.id);

        if(!opportunity){
            return res.status(404).json({message: 'Opportunity not found'});
        }
        if(opportunity.applicants.includes(req.user._id)){
            return res.status(400).json({message:'You may have already applied'});
        }

        opportunity.applicants.push(req.user._id);
        await opportunity.save();

        res.status(200).json({message: 'Applied successfully'});
    } catch (err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.getApplicants = async (req,res)=>{
    try{
        const opportunity = await Opportunity.findById(req.params.id)
        .populate('applicants', 'name email role')
        .populate('postedBy', 'name');
        if(!opportunity){
            return  res.status(404).json({message: 'Opportunity not found'});
        }

        if (req.user.role !== 'organization' || opportunity.postedBy._id.toString() !== req.user._id.toString()){
            return res.status(403).json({message: 'Not authorized'});
        }
        
        res.json({
            opportunity: opportunity.title,
            applicants: opportunity.applicants,
        });
    } catch (err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.updateOpportunity = async (req,res)=>{
    try{
        const opportunity = await Opportunity.findById(req.params.id);
        if (!opportunity) return res.status(404).json({ message: 'Opportunity not found'});

        if(req.user.role !== 'organization' || opportunity.postedBy.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"Not authorized"});
        }
        
        const updatedFields = req.body;

        const updatedOpportunity = await Opportunity.findByIdAndUpdate(
            req.params.id,
            {$set: updatedFields},
            {new: true}
        );

        res.json({ message:"Opportunity updated", opportunity: updatedOpportunity});
    } catch (err){
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.deleteOpportunity = async (req, res)=>{
    try{
        const opportunity = await Opportunity.findById(req.params.id);
        if(!opportunity) return res.status(404).json({message:'Opportunity not found'});

        if(req.user.role !== 'organization' || opportunity.postedBy.toString()!== req.user._id.toString()){
            res.status(403).json("Not authorized");
        }
        
        await opportunity.deleteOne();

        res.json({message: 'Opportunity deleted'});
    } catch (err){
        res.status(500).json({message:'Server error', error:err.message});
    }
};

exports.approveApplicant = async(req, res)=>{
    try{
        const { userId } = req.body;
        const opportunity = await Opportunity.findById(req.params.id);

        if(!opportunity) return res.status(404).json({message:'Opportunity not found'});

        if(req.user.role!== 'organization' || opportunity.postedBy.toString()!== req.user._id.toString()){
            return res.staus(403).json({message: 'Not authorized'});
        }

        if(!opportunity.applicants.includes(userId)){
            return res.status(400).json({message: 'User did not apply'});
        }

        if(opportunity.approvedVolunteers.includes(userId)){
            return res.status(400).json({ message: 'Already approved'});
        }

        opportunity.approvedVolunteers.push(userId);
        await opportunity.save();
        res.status(200).json({message:'Volunteer approved'});
    }   catch(err){
        res.status(500).json({message: 'Server error', error: err.messaga});
    }
};

exports.markAsCompleted = async (req, res)=>{
    try{
        const {userId} = req.body;
        const opportunity = await Opportunity.findById(req.params.Id).populate('postedBy');

        if(!opportunity) return res.status(404).json({message: 'Opportunity not found'});

        if(req.user.role!== 'organization' || opportunity.postedBy._id.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: 'Not Authorized'});
        }

        if(!opportunity.approvedVolunteers.includes(userId)){
            return res.status(400).json({message: "User not approved for this."});
        }

        const volunteer = await User.findById(userId);

        const alreadyCompleted = volunteer.volunteerHistory.some(
            (entry)=>entry.opportunity.toString() === opportunity._id.toString()
        );

        if(alreadyCompleted){
            return res.status(400).json({message: 'Volunteer already marked as completed'});
        }

        volunteer.volunteerHistory.push({
            opportunity: opportunity._id,
            organization: opportunity.postedBy._id,
            title: opportunity.title,
            date: new Date(),
        });
        
        await volunteer.save();
        res.status(200).json({message: 'Participation confirmed and history updated'});
    } catch(err){
        res.status(500).json({message: 'Seever error', error: err.message});
    }
};