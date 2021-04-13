const exp = require('express');
const router = exp.Router();

router.get('*',(req,res)=>{
    const path = require('path');
    res.sendFile(path.resolve(__dirname, '../rtrkblhrana-client', 'build', 'index.html'))
})


module.exports = router;