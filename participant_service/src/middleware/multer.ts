import { Request } from "express"
import multer, { FileFilterCallback, } from "multer"

const filterFiles = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    file.mimetype !== "text/csv" ? cb(null, false) : cb(null, true)

}

  const filename = (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void)  => {
    
    const uniqueSuffix = Date.now() + '-' + "9ec109cd-2cf3-4add-b74e-aeb7b866f4a1"
    cb(null, "data" + '-' + uniqueSuffix)

  }

  const destinationControl =  (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {

    cb(null, './uploads/')
  }

const storage = multer.diskStorage({
    destination: destinationControl,
    filename: filename
})


export default  multer({
    storage: storage,
    limits: {
        files: 1
    },
    fileFilter: filterFiles 
})