const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const checkAuth = require("../authentication/authenticate");
const checkAuth = require("../authentication/authenticate");
const Question = require("../models/question");
const Counter = require("../misc/counter");

const router = express.Router();

//Insert record
router.post("/add", (req, res, next) => {
  const question = new Question({
    _id: getNextSequence("question_id"),
    type: req.body.type,
    category: req.body.category,
    competency: req.body.competency,
    text: req.body.text,
    textHtml: req.body.textHtml,
    options: req.body.options,
    comment: req.body.comment,
    status: req.body.status,
    complexity: req.body.complexity,
    createdBy: req.body.createdBy,
    updatedBy: req.body.updatedBy,
    approvedBy: req.body.approvedBy
  });
  question
    .save()
    .then(result => {
      res.status(201).json({
        message: "Question created!",
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
router.get("/view", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const filteredType = req.query.Type;
  var filteredCats = req.query.Cat;
  var filteredSubCats = req.query.SubCat;
  console.log("inside view all api"); 

  var quesQuery;
  var whrCondition = {};

  quesQuery = Question.find(whrCondition);

  let fetchedQuestions;
  if (pageSize && currentPage) {
    quesQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  quesQuery
    .then(documents => {
      fetchedQuestions = documents;
      return Question.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Questions fetched successfully!",
        questions: fetchedQuestions,
        maxQuestions: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching questions failed!"
      });
    });
});

//Delete record
router.delete("/delete/:id", checkAuth, (req, res, next) => {
  Question.deleteOne({ _id: req.params.id })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        Console.log(result.error);
        res.status(401).json({ message: "Not authorized!" });

      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Fetching posts failed!"

      });
    });
});

//View record by Id
router.get("/getQuestion/:id", (req, res, next) => {
  Question.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Question not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching Question failed!"
      });
    });
});

//Update record
router.put("/update/:id", checkAuth, (req, res, next) => {
  const question = new Question({
    _id: req.params.id,
    type: req.body.type,
    category: req.body.category,
    competency: req.body.competency,
    text: req.body.text,
    textHtml: req.body.textHtml,
    options: req.body.options,
    comment: req.body.comment,
    status: req.body.status,
    complexity: req.body.complexity,
    createdBy: req.body.createdBy,
    updatedBy: req.body.updatedBy,
    approvedBy: req.body.approvedBy
  });

  Question.updateOne({ _id: req.params.id }, question)
    .then(result => {
      if (result.nModified > 0) {
        res.status(200).json({ message: "Update successful!" + result });
      } else {
        res.status(401).json({ message: "Not authorized!" + req.params.id });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate post!" + error
      });
    });
}
);

module.exports = router;