const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Order = require('../model/order.js')
const Product = require('../model/product')
router.get('/', function(req, res, next){
    Order.find()
    .select('product quantity _id')
    .exec()
    .then(docs=>{
        res.status(200).json({
             count: docs.length,
             orders: docs.map(doc => {
                 return {
                    _id: doc.id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://127.0.0.1/orders/' + doc._id
                    }
                 }
             })

        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
});

router.get('/:orderID', function(req, res, next){
    Order.findById(req.params.orderID)
    .exec()
    .then(order => {
        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://127.0.0.1:8000/orders'
            }
        });
    })
    .catch(err => {
        res.status(200).json({
            message: "Order deleted",
            orderID: req.params.orderID
        })
    })
});

router.delete('/:orderID', function(req, res, next){
    Order.remove({_id: req.params.orderID})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'POST',
                    url: "http://127.0.0.1:300/orders",
                    body: {productID: 'ID', quantity: 'Number'}
                }
            });
        })
        .catch(err =>{
            res.status(500).json({
                error: err
            })
        })
});

router.post('/', function(req, res, next){
    Product.findById(req.body.productID)
    .then(product => {
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productID
        });
        return order
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://127.0.0.1/orders/' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
    })
})
module.exports = router;