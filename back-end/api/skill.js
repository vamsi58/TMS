const express = require("express");
const Skill = require("../models/skill");

const router = express.Router();

//Insert record
router.post("/add", (req, res, next) => {
    let skill;
    skill = new Skill({
        type: req.body.skillName
    });

    skill.save()
        .then(result => {
            res.status(201).json({
                message: "Skill created!",
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
    Skill.find()
    .then(skills => {
            if (skills) {
                res.status(200).json(skills);
            } else {
                res.status(404).json({ message: "Skills not found!" });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching skills failed!"
            });
        });
});


module.exports = router;