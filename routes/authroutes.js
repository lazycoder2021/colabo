const express = require('express'); 
const router = express.Router();
const User = require('../models/user'); 
const Approve = require('../models/approve');
const Review = require('../models/review');
const Doc = require('../models/doc'); 
const cryptoJS = require('crypto-js'); 
const jwt = require('jsonwebtoken');
const { verifyToken, verifyTokenAndAuthorization } = require('../verifyToken');


router.post('/register', async function (req, res) {
    try {
        const user = new User({
            email: req.body.email,
            password: cryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
        })
        await user.save(); 
        res.status(200).json({"msg": "user created successfully", user})
    } catch (e) {
        console.log(e)
        res.status(500).json({ "msg": "server error" })
    }
})

router.post('/login', async function (req, res) {
    try {
        const emailExists = await User.findOne({ email: req.body.email });
        console.log(emailExists)

        if (!emailExists) {
            return res.status(404).json({ "msg": "user does not exist" })
        } else {
            const originalPassword = await cryptoJS.AES.decrypt(emailExists.password, process.env.PASS_SEC).toString(cryptoJS.enc.Utf8);
            if (req.body.password == originalPassword) {
                const token = jwt.sign({ id: emailExists._id, isAdmin: emailExists.isAdmin, isReviewer: emailExists.isReviewer, isApprover: emailExists.isApprover }, process.env.JWT_PASS, { expiresIn: '3d' })
                res.status(200).json({ "msg": "login successful", token, "userid": emailExists._id })
            } else {
                res.status(403).json({ "msg": "passwords do not match" })
            }
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ "msg": "server error" })
    }
})

router.get('/:id/dashboard', verifyTokenAndAuthorization, async function (req, res) {
    try {
        console.log(req.user, req.isAdmin, req.isReviewer, req.isApprover)
        //const users = await User.countDocuments({});
        //const approves = await Approve.countDocuments({});
        //const reviews = await Review.countDocuments({});
        const docscreated = await Doc.countDocuments({ userId: req.user });
        const docsinfo = await Doc.find({ userId: req.user }); 
        const docsunderreview = docsinfo.filter((di) => {
            if (di.status == 'under_review') {
                return di;
            } 
        })

        console.log(docsunderreview.length)

        const docsunderreviewlength = docsunderreview.length;

        
        const docsunderapproval = docsinfo.filter((di) => {
            if (di.status == 'pending_approval') {
                return di;
            }
        })

        const docsunderapprovallength = docsunderapproval.length;

        const inprogressdocs = docsinfo.filter((di) => {
            if (di.status == 'inprogress') {
                return di;
            }
        })

        const inprogressdocslength = inprogressdocs.length;

        const completeddocs = docsinfo.filter((di) => {
            if (di.status == 'completed') {
                return di;
            }
        })

        const completeddocslength = completeddocs.length

        res.status(200).json({ "msg": "user authenticated", docscreated, inprogressdocslength, docsunderreviewlength, docsunderapprovallength, completeddocslength, inprogressdocs })
    } catch (e) {
        console.log(e)
        res.status(500).json({"msg": "server error"})
    }

})




module.exports = router; 