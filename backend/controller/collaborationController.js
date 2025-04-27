const Collaboration = require('../models/Collaboration');

// Create a new collaboration request
exports.createCollaboration = async (req, res) => {
  try {
    const { requested_user, requesting_user } = req.body;
    const newCollaboration = new Collaboration({
      requested_user,
      requesting_user
    });
    await newCollaboration.save();
    res.status(201).json({ message: 'Collaboration request created successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all collaboration requests
exports.getAllCollaborations = async (req, res) => {
  try {
    const collaborations = await Collaboration.find().populate('requested_user requesting_user');
    res.status(200).json(collaborations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get collaboration request by ID
exports.getCollaborationById = async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.id).populate('requested_user requesting_user');
    if (!collaboration) {
      return res.status(404).json({ message: 'Collaboration request not found' });
    }
    res.status(200).json(collaboration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update collaboration request by ID
exports.updateCollaboration = async (req, res) => {
  try {
    const { accepted } = req.body;
    const updatedCollaboration = await Collaboration.findByIdAndUpdate(
      req.params.id,
      { accepted },
      { new: true, runValidators: true }
    );
    if (!updatedCollaboration) {
      return res.status(404).json({ message: 'Collaboration request not found' });
    }
    res.status(200).json(updatedCollaboration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a collaboration request by ID
exports.deleteCollaborationById = async (req, res) => {
  try {
    const result = await Collaboration.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Collaboration request not found' });
    }
    res.status(200).json({ message: 'Collaboration request deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete all collaboration requests
exports.deleteAllCollaborations = async (req, res) => {
  try {
    await Collaboration.deleteMany();
    res.status(200).json({ message: 'All collaboration requests deleted successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
