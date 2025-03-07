import { NextFunction, Request, Response } from "express";

const globalErrorHandling = (err: Error, req: Request, res: Response, next: NextFunction) => {

    console.log('error: ', err.stack)
    res.status(500).json({message: "Something went wrong."})
    next()

}

export default globalErrorHandling