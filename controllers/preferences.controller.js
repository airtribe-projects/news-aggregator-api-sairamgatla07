const User = require('../models/user.model');

async function getPreferences(req, res) {
    try {
        console.log("inside of getpreferences");
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ "message": "user unauthenticated" });
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(401).json({message:"user not foiund"});
        }
        const preferences = user.preferences;

        return res.status(200).json({
            "message": "Sucessfully fetched",
            preferences
        });
    } catch (err) {
        console.log("error ", err);
        return res.status(500).json({
        message: "Internal server error"
    });
    }

}


async function updatePreferences(req, res) {
    try {
        console.log("inside of updatePreferences");
        const userId = req.user.userId;
        const{ preferences} = req.body;
        
        if (!Array.isArray(preferences) ) {
            return res.status(400).json({
                message: "preferences must be an array"
            });
        }


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ "message": "User not found" });
        }
        user.preferences =  preferences ;

        await user.save();
        return res.status(200).json({
            message: "Preferences updated successfully",
            preferences: user.preferences
        });


    } catch (err) {
       console.error("Error updating preferences:", err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }

}


module.exports = { getPreferences, updatePreferences }
