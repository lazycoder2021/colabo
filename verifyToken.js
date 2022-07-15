const jwt = require('jsonwebtoken'); 


const verifyToken = (req, res, next) => {
    console.log('middleware medding...')
    let token = req.headers.token;
    if (!token) {
        return res.status(403).json({"msg": "no token present"})
    }

    
    token = token.split(" ")[1];
    console.log(token)
    jwt.verify(token, process.env.JWT_PASS, (err, user) => {
        if (err) {
            return res.status(403).json({"msg": "token not valid"})
        } else {
            req.user = user.id;
            req.isAdmin = user.isAdmin;
            req.isReviewer = user.isReviewer;
            req.isApprover = user.isApprover;  
            next();
        }
  
    })


    
    
}


const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.params.id === req.user) {
            next()
        } else {
            res.status(403).json({"msg": "you do not have permission to do that"})
        }
    })
}

module.exports = {
    verifyToken, 
    verifyTokenAndAuthorization
}


