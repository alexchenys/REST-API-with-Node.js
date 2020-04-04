const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next){
    res.status(200).json({
        message: 'Orders were fetched'
    });
});

router.get('/:orderID', function(req, res, next){
    res.status(200).json({
        message: 'Orders were fetched',
        orderID : req.params.orderID
    });
});

router.delete('/:orderID', function(req, res, next){
    res.status(200).json({
        message: 'Orders deleted',
        orderID : req.params.orderID
    });
});

router.post('/', function(req, res, next){
    const order = {
        productID: req.body.productID,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'Order was created',
        order: order
    })
})
module.exports = router;