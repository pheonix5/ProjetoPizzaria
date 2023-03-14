import crypto from 'crypto'
import multer from 'multer'

import { extname, resolve }  from 'path'

export default{
    upload(file: string){
        return{
            storage: multer.diskStorage({
                destination: resolve(__dirname, '..', '..', file),
                filename: (request, file, callback) => {
                    const filehash = crypto.randomBytes(16).toString("hex");
                    const filename = `${filehash}-${file.originalname}`

 
                    return callback(null, filename)
                }
            })
        }
    }
}