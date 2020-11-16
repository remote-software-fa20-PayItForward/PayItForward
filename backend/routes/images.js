const express = require("express");
const router = express.Router();

const Image = require( '../models/Image' );

router.get('/:id/', function(req, res) {
    Image.findOne({ _id:req.params.id }).exec((err, data) => {
        if (err) {
            res.status(400).json('Error: ' + err)
        } else {
            /*
            var extension = data.name.substr(data.name.lastIndexOf('.') + 1);
            switch (extension) {
                case "png":
                    res.set('Content-Type', 'image/png');
                    break;
                case "jpg", "jpeg":
                    res.set('Content-Type', 'image/jpeg');
                    break;
                case "gif":
                    res.set('Content-Type', 'image/gif');
                    break;
                case "bmp":
                    res.set('Content-Type', 'image/bmp');
                    break;
            }
            */
            res.set('Content-Type', data.mime);
            //res.set('Content-Disposition', 'inline');
            console.log(data.data);
            res.end(data.data);
        }
    })
})

module.exports = router;