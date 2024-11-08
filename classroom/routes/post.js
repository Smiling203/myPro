const express = require("express");
const router =express.Router();

//posts
//Index Route
router.get("/", (req,res) => {
    res.send("GET for user id");
});

//Show - users
router.get("/:id", (req,res) => {
    res.send("GET for  show users");
});

//POST- users
router.post("/", (req,res) => {
    res.send("POST for users");
});

//Delete
router.delete("/", (req,res) => {
    res.send("DELETE for user id");
});

module.exports = router;