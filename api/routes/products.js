const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Product = require('../model/product.js')

router.get('/', function(req, res, next){
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            product: docs.map(doc=> {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://127.0.0.1:3000/products/' + doc._id
                    }
                }
            })
        }
       
        //if (doc.length >= 0) {
            res.status(200).json(response)
        //}
        //else{
        //    res.status(404).json({message: 'Nothing'})
        //}
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
            res.status(201).json({
                message: "Created product successfully",
                creatdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://127.0.0.1:3000/products/' + result._id,
                    }
                }
            });
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
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Get_all_product',
                        url: 'http://127.0.0.1/products'
                    }
                });
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
        //console.log(result);
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: 'http://127.0.0.1:8000/products/' + id
            }
        })
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
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: "http://127.0.0.1:3000/products",
                body: {name: 'String', price: 'Number'}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})

module.exports = router;