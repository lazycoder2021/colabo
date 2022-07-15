const express = require('express');
const Doc = require('../models/doc');
const Review = require('../models/review');
const Approve = require('../models/approve');
const router = express.Router(); 
const { verifyToken, verifyTokenAndAuthorization } = require('../verifyToken');

router.post('/createdoc/:id', verifyTokenAndAuthorization, async function (req, res) {
    try {
        console.log(req.user, req.isAdmin, req.isReviewer, req.isApprover)
        const doc = new Doc(req.body); 
        await doc.save();
        res.status(200).json({"msg": "doc added successfully", doc})
    } catch (e) {
        console.log(e)
        res.status(500).json({"msg": "server error"})
    }
})

router.get('/:id/getdocs', verifyTokenAndAuthorization, async function (req, res) {
    try {
        console.log(req.user, req.isAdmin, req.isReviewer, req.isApprover)
        console.log(req.query.userId)
        if (req.params.id == req.query.userId) {
            const docs = await Doc.find({ userId: req.query.userId })
            res.status(200).json({ docs })
        } else {
            res.status(403).json({"msg": "you are not authorized to view docs belonging to others" })
        }

        
    } catch (e) {
        console.log(e)
        res.status(500).json({ "msg": "server error" })
    }
})

router.get('/:id/getdoc/:docid', verifyTokenAndAuthorization, async function (req, res) {
    try {
        console.log(req.query.docid)
        console.log(req.user, req.isAdmin, req.isReviewer, req.isApprover)
        const doc = await Doc.find({ _id: req.params.docid })
        res.status(200).json({ "msg": doc })
    } catch (e) {
        console.log(e)
        res.status(500).json({"msg": "server error"})
    }
})

router.delete('/:id/deletedoc/:docid', verifyTokenAndAuthorization, async function (req, res) {
    try {
        const deletedDoc = await Doc.findByIdAndDelete(req.params.docid);
        res.status(200).json({ "msg": "document deleted sucessfully", deletedDoc })
    } catch (e) {
        console.log(e)
        res.status(500).json({"msg": "server error"})
    }
})

router.put('/:id/updatedoc/:docid', verifyTokenAndAuthorization, async function (req, res) {
    try {
        const updatedDoc = await Doc.findByIdAndUpdate({ _id: req.params.docid }, (req.body), { new: true })
        res.status(200).json({ "msg": "document updated successfully", updatedDoc })
    } catch (e) {
        console.log(e)
        res.status(500).json({"msg": "server error"})
    }
})


router.get('/:id/getreviewfordoc/:docid', verifyTokenAndAuthorization, async function (req, res) {
    try {
        console.log(req.params.docid)
        const review = await Review.findOne({ docId: req.params.docid}); 
        res.status(200).json({"msg": "reviews fetched succcessfully", "reviewcomment": review})
    } catch (e) {
        console.log(e)
        res.status(500).json({"msg": "server error"})
    }
})

router.get('/:id/getapprovefordoc/:docid', verifyTokenAndAuthorization, async function (req, res) {
    try {
        console.log(req.params.docid)
        const approve = await Approve.findOne({ docId: req.params.docid });
        res.status(200).json({ "msg": "approve fetched succcessfully", "approvecomment": approve })
    } catch (e) {
        console.log(e)
        res.status(500).json({ "msg": "server error" })
    }
})


module.exports = router; 
