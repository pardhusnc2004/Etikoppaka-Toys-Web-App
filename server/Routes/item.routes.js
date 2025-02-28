import { Router } from "express";
import { AddItem, DeleteItem, GetAllItems, GetItem, UpdateItem } from "../Controllers/item.controller.js";
import { Authenticate } from "../Middlewares/admin.auth.js";

const ItemRouter = Router();

ItemRouter.get('/', GetAllItems)
ItemRouter.get('/:id', GetItem)
ItemRouter.post('/', AddItem)
ItemRouter.put('/:id', UpdateItem)
ItemRouter.delete('/:id', DeleteItem)

export default ItemRouter;
