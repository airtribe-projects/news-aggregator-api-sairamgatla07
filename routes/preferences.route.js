const router = require("express").Router() ;
const { getPreferences ,  updatePreferences  } = require("../controllers/preferences.controller")
router.get("/" , getPreferences);

router.put("/", updatePreferences) ;

module.exports = router ;
