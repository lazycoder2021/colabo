const express = require('express'); 
const router = express.Router();
const Doc = require('../models/doc');
const Review = require('../models/review');
const { verifyToken, verifyTokenAndAuthorization } = require('../verifyToken');


router.get('/:id/getdocswaitingreview', verifyTokenAndAuthorization, async function (req, res) {
    try {
        console.log(req.user, req.isAdmin, req.isReviewer, req.isApprover)
        if (!req.isReviewer) {
            return res.status(403).json({"msg": "you are not a reviewer! so no access!"})
        }

        const docswaitingreview = await Doc.find({ status: req.query.status1 })
        console.log(docswaitingreview)

        const docsreviewed = await Doc.find({ status: req.query.status2 })
        //console.log(docsreviewed)

        res.status(200).json({ "msg": "user authenticated", docswaitingreview, docsreviewed })
    } catch (e) {
        console.log(e)
        res.status(500).json({"msg": "server error"})
    }
})

router.post('/:id/addreview', verifyTokenAndAuthorization, async function (req, res) {
    try {
        console.log(req.user, req.isAdmin, req.isReviewer, req.isApprover)
        var docid = req.query.docid;
        console.log(req.query.docid)
        if (!req.isReviewer) {
            return res.status(403).json({ "msg": "you are not reviewer, so you cannot take action" })

        }

        const docbeingreviewed = await Doc.updateOne({ _id: docid }, { status: 'pending_approval' });
        //console.log(docbeingapproved);
        const updateddoc = await Doc.findOne({ _id: docid })

            const review = new Review(req.body)
            await review.save();

           
            res.status(200).json({ "msg": "review comments added", review, updateddoc })
        
        
    } catch (e) {
        console.log(e)
        res.status(500).json({"msg": "server error"})
    }
})

module.exports = router; 
