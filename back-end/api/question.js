const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const checkAuth = require("../authentication/authenticate");
const Question = require("../models/question");
const Counter = require("../misc/counter");

const router = express.Router();

//Insert record
router.post("/add", (req, res, next) => {
  let question;
  Counter.getNextSequence("question_id", function(sequence){
  question = new Question({
    _id: sequence,
    type: req.body.type,
    tags: req.body.tags,
    skills: req.body.skills,
    stmt: req.body.stmt,
    stmtHtml: req.body.stmtHtml,
    options: req.body.options,
    descAnswer: req.body.descAnswer,
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
});

//View all records
router.get("/view", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const filteredType = req.query.Type;
  var filteredCats = req.query.Cat;
  var filteredSubCats = req.query.SubCat;

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
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });

      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Question Delete failed!"
      });
    });
});

//View record by Id
router.get("/getQuestion/:id", (req, res, next) => {
  Question.findById(req.params.id)
    .then(question => {
      if (question) {
        res.status(200).json(question);
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
    tags: req.body.tags,
    skills: req.body.skills,
    stmt: req.body.stmt,
    stmtHtml: req.body.stmtHtml,
    options: req.body.options,
    descAnswer: req.body.descAnswer,
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
        message: "Couldn't udpate Question!" + error
      });
    });
}
);

module.exports = router;