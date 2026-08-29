const User = require('../models/user.model');

async function getPreferences(req, res) {
    try {
        console.log("inside of getpreferences");
        const userId = req.user.userId;
        if (!userId) {
            return res.status(404).json({ "message": "user unauthenticated" });
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"user not foiund"});
        }
        const preferences = user.preferences;

        return res.status(200).json({
            "message": "Sucessfully fetched",
            preferences
        });
    } catch (err) {
        console.log("error ", err);
        return res.status(401).json(`error occured ${err}`);
    }

}


async function updatePreferences(req, res) {
    try {
        console.log("inside of updatePreferences");
        const userId = req.user.userId;
        const { categories, languages } = req.body;
        if (!categories || !languages) {
            return res.status(400).json({
                message: "Categories and languages are required"
            });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ "message": "User not found" });
        }
        user.preferences.categories = categories;
        user.preferences.languages = languages;

        await user.save();
        return res.status(200).json({
            message: "Preferences updated successfully",
            preferences: user.preferences
        });


    } catch (err) {
        console.log("error occured ");
        return res.status(401).json(`error occured ${err}`);
    }

}


module.exports = { getPreferences, updatePreferences }
