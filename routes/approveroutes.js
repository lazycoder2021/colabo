const express = require('express');
const router = express.Router();
const Approve = require('../models/approve');
const Doc = require('../models/doc');
const { verifyToken, verifyTokenAndAuthorization } = require('../verifyToken');


router.get('/:id/getdocswaitingapproval', verifyTokenAndAuthorization, async function (req, res) {
    try {
        console.log(req.user, req.isAdmin, req.isReviewer, req.isApprover)
        if (!req.isApprover) {
            return res.status(403).json({ "msg": "you are not a approver! so no access!" })
        }
        const docswaitingapproval = await Doc.find({ status: req.query.status1 })
        console.log(docswaitingapproval)

        const docsapproved = await Doc.find({ status: req.query.status2 })
        console.log(docsapproved)


        res.status(200).json({ docswaitingapproval, docsapproved })
    } catch (e) {
        console.log(e)
        res.status(500).json({"msg": "server error"})
    }
})

router.post('/:id/approve', verifyTokenAndAuthorization, async function (req, res) {
    try {
        console.log(req.user, req.isAdmin, req.isReviewer, req.isApprover)
        var docid = req.query.docid;
        console.log(req.query.docid)
        if (!req.isApprover) {
            return res.status(403).json({"msg": "you are not approver, so you cannot take action"})
        }

        const docbeingapproved = await Doc.updateOne({ _id: docid }, {status:'completed'});
        //console.log(docbeingapproved);
        const updateddoc = await Doc.findOne({_id: docid})
        

        const approve = new Approve({
            approvalComments: req.body.approvalComments, 
            status: req.body.status,
            docid: req.query.docid
        });






        await approve.save();
        res.status(200).json({ approve, updateddoc })

    } catch (e) {
        console.log(e)
        res.status(500).json({"msg": "server error"})
    }
})

module.exports = router;