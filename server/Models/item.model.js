import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: true,
    },
    images: {
        type: [String],
        default: []
    },
    description: {
        type: String,
        default: ""
    },
    available: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true })

const ItemModel = mongoose.model('Item', ItemSchema);
export default ItemModel;