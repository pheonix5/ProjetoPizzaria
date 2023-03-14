import { Router } from 'express';
import multer from 'multer';

import { CreateUserController } from './controllers/user/CreateUserController'
import { AuthUserControler } from './controllers/user/AuthUserController'
import { DetailUserController } from './controllers/user/DetailUserController'

import { CreateCategoryController } from './controllers/category/CreateCategoryController'
import { ListCategoryController } from './controllers/category/ListCategoryController'

import { CreateProductController } from './controllers/product/CreateProductController'
import { ListByCategoryController } from './controllers/category/ListByCategoryController'

import { CreateOrderController } from './controllers/order/CreateOrderController'
import { RemoveOrderController } from './controllers/order/RemoveOrderController'
import { AddItemController } from './controllers/order/AddItemController'
import{ RemoveItemController } from './controllers/order/RemoveItemController'
import { SendOrderController } from './controllers/order/SendOrderController'
import { ListOrdersController } from './controllers/order/ListOrdersController'
import { DetailOrderController } from './controllers/order/DetailOrderController'
import { FinishOrderController } from './controllers/order/FinishOrderController'

import { estaAutenticado } from './middlewares/estaAutenticado'

import uploadConfig from './config/multer'


  
const router = Router();

const upload = multer(uploadConfig.upload("./tmp"));

// Rotas User
router.post('/users', new CreateUserController().handle)

router.post('/session', new AuthUserControler().handle)

router.get('/me', estaAutenticado, new DetailUserController().handle)

// Rotas Category
router.post('/category', estaAutenticado, new CreateCategoryController().handle)

router.get('/category',  estaAutenticado, new ListCategoryController().handle)

//Rotas Product
router.post('/product', estaAutenticado, upload.single('file'), new CreateProductController().handle)

router.get('/category/product', estaAutenticado, new ListByCategoryController().handle)

//Rotas Order
router.post('/order', estaAutenticado, new CreateOrderController().handle)
router.delete('/order', estaAutenticado, new RemoveOrderController().handle)

router.post('/order/add', estaAutenticado, new AddItemController().handle)
router.delete('/order/remove', estaAutenticado, new RemoveItemController().handle)

router.put('/order/send', estaAutenticado, new SendOrderController().handle)

router.get('/orders', estaAutenticado, new ListOrdersController().handle)
router.get('/order/detail', estaAutenticado, new DetailOrderController().handle)

router.put('/order/finish', estaAutenticado, new FinishOrderController().handle)

export { router };