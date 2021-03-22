const exp = require('express');
const router = exp.Router();

router.get("/", (req, res) => {
    res.send("Welcome to login");
});

module.exports = router;