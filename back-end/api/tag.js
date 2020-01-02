const express = require("express");
const Tag = require("../models/tag");

const router = express.Router();

//Insert record
router.post("/add", (req, res, next) => {
    let tag;
    tag = new Tag({
        tagName: req.body.tagName
    });

    tag.save()
        .then(result => {
            res.status(201).json({
                message: "Tag created!",
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Invalid Here!" + err
            });
        });
});


//View all records
router.get("/get", (req, res, next) => {
    Tag.find().then(tags => {
            if (tags) {
                res.status(200).json({tags:tags});
            } else {
                res.status(404).json({ message: "Tags not found!" });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching tags failed!"
            });
        });
});


module.exports = router;