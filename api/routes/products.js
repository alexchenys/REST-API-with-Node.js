const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Product = require('../model/product.js')

router.get('/', function(req, res, next){
    Product.find()
    .exec()
    .then(doc => {
       
        if (doc.length >= 0) {
            res.status(200).json(doc)
        }
        else{
            res.status(404).json({message: 'Nothing'})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})
router.post('/', function(req, res, next){
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
        .save()
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));
    res.status(200).json({
        message: 'Handling POST requests to /products',
        creatdProduct: product
    });
})
router.get('/:productId', function(req, res, next){
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log("From the database: ", doc);
            if(doc){
                res.status(200).json({doc});
            }
            else {
                res.status(404).json({message: 'Cannot find ID'});
            }
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        });
    
})
router.patch('/:productId', function(req, res, next){
    const id = req.params.productId;
    const updateOps = {}
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }
    Product.update({_id: id}, { $set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
})
router.delete('/:productId', function(req, res, next){
    const id = req.params.productId;
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})

module.exports = router;