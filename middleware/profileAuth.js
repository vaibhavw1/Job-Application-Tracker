const Profile = require('../models/profile');

const User = require('../models/user');



const profileAuth = async (req, res, next) => {
    try {
        const user = req.user;
        const profileId = req.body.profileId;

        const profile = await Profile.findByPk(profileId);

        const isValid = user.hasProfile(profile);
        if (!isValid) {
            return res.status(401).json({ succcess: false, message: 'User not Authenticated' });
        }
        
        req.profile = profile;

        next();

    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: 'Something went wrong', success: false })
    }
}

module.exports = profileAuth;