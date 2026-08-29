const router = require("express").Router() ;
const { getNews } = require("../controllers/news.controller");
router.get("/", getNews);

module.exports = router ;
