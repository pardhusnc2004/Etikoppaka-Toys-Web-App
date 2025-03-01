import ItemModel from "../Models/item.model.js";

export const AddItem = async (req, res) => {
    try {
        const { name, images, description } = req.body;
        const itemWithSameNameExists = await ItemModel.findOne({ name: name });
        if(itemWithSameNameExists) {
            return res.status(400).json({ message: "Item with same name is already found...." })
        }
        const newItem = new ItemModel({
            name: name,
            images: images,
            description: description,
            available: true
        })
        await newItem.save();
        return res.status(200).json({ message: "Item created successfully...", Item: newItem })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const DeleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const itemExists = await ItemModel.findById(id);
        if(!itemExists) {
            return res.status(400).json({ message: "Item doesn't exist..." })
        }
        await ItemModel.findByIdAndDelete(id);
        return res.status(200).json({ message: "Item deleted successfully...", Item: itemExists })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const GetAllItems = async (req, res) => {
    try {
        const allItems = await ItemModel.find();
        return res.status(200).json({ message: "Fetched all items...", Items: allItems })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const GetItem = async (req, res) => {
    try {
        const { id } = req.params;
        const itemExists = await ItemModel.findById(id);
        if(!itemExists) {
            return res.status(400).json({ message: "Item doesn't exist..." })
        }
        return res.status(200).json({ message: "Item fetched successfully...", Item: itemExists })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const UpdateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, images, description, available } = req.body;
        const itemExists = await ItemModel.findById(id);
        if(!itemExists) {
            return res.status(400).json({ message: "Item doesn't exist..." })
        }
        await ItemModel.findByIdAndUpdate(id, { name: name, images: images, description: description, available: available });
        return res.status(200).json({ message: "Item updated successfully..."})
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}