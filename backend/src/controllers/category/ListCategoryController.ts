import { Request, Response } from 'express'
import { ListaCategoryService} from '../../services/category/ListCategoryService'

class ListCategoryController{
   async handle(req: Request, res: Response){
    const listCategoryService = new ListaCategoryService();

    const category = await listCategoryService.execute();

    return res.json(category);

   }
    
}

export { ListCategoryController }