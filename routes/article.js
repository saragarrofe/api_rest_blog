const router = require('express').Router();
const multer = require("multer");
const ArticleController = require("../controllers/Article");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './images');
    }, 
    filename: function(req, file, cb) {
        cb(null, "article" + Date.now() + file.originalname);
    }
})

const uploads = multer({storage: storage})


router.post("/create", ArticleController.create)
router.get("/articles/:lasts?", ArticleController.getArticles)
router.get("/articles/:id", ArticleController.getById)
router.delete("/articles/:id", ArticleController.deleteByID)
router.put("/articles/:id", ArticleController.update)
router.post("/upload-image/:id", [uploads.single("file")], ArticleController.uploadImage)
router.get("/image/:file", ArticleController.image)
router.get("/search/:search", ArticleController.search)

module.exports = router;
