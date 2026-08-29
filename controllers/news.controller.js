const axios = require('axios');
const User = require("../models/user.model")

async function getNews(req, res) {
    try {
        // Get logged-in user's ID from JWT
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                message: "User unauthenticated"
            });
        }

        // Get user from MongoDB
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Get preferences
        const { categories, languages } = user.preferences;

        if (!categories?.length || !languages?.length) {
            return res.status(400).json({
                message: "Please set your news preferences first"
            });
        }

        const NEWS_API_URI = "https://newsdata.io/api/1/latest";
        const NEWS_API_KEY = process.env.NEWS_API_KEY;

        const response = await axios.get(NEWS_API_URI , {
            params:{
                apikey: NEWS_API_KEY , 
                category: categories.join(","),
                language: languages.join(",")
            }
        }) ;

        return res.status(200).json({
            "message":"sucessfully fetched news",
            articles : response.data.results
        })

    }catch(err){
        console.log("error ", err);
        return res.status(502).json({"message":"couldnt generate news"})
    }
}


module.exports ={ getNews };
