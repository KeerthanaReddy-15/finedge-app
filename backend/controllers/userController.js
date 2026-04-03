import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-passwordHash');
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        res.json({
            email: user.email,
            displayName: user.displayName || '',
            username: user.username || '',
            bio: user.bio || ''
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { displayName, username, email, bio } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Check if username is taken by someone else
        if (username && username !== user.username) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists) {
                return res.status(400).json({ error: 'Username is already taken.' });
            }
        }

        user.displayName = displayName || user.displayName;
        user.username = username || user.username;
        user.email = email || user.email;
        user.bio = bio !== undefined ? bio : user.bio;
        
        await user.save();
        
        res.json({
            message: 'Profile updated successfully!',
            user: {
                email: user.email,
                displayName: user.displayName,
                username: user.username,
                bio: user.bio
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error updating profile' });
    }
};
