const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/upload'));
    },

    filename: function(req,file,cb){
        const userId = req.user.userId;
        const uniqueSuffix = Date.now() + '-' + userId + '-' +  Math.round(Math.random() * 1E9) + '-' + file.originalname ;

        cb(null,file.fieldname + '-' + uniqueSuffix)
    }
});

const upload = multer({storage: storage});

module.exports = upload;