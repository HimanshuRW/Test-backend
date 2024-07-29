const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    restaurantName: {
        type: String,
        required: true
    },
    tableNumber: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    billing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Billing'
    },
    items: [{
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem'
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    pointsEarned: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'completed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
