import { Request } from "express";

export interface AuthRequest<p, rsb, rqb, rq, l extends Record<string, any>> extends Request<p, rsb, rqb, rq, l> { 
    participantId?: number
    user?: {id: string}
}

export interface IResponseBody<T = null>{
    message: string
    data: T
}

export class ResponseBody<T>{

    private _message: string = "" ;
    private _data: T; 

    constructor(data: T ){
        this._data = data
    }

    
    public set message(v : string) {
        this._message = v;
    }
    
    
    public set data(v : T) {
        this.data = v;
    }

    
    public get message() : string {
        return this.message
    }
    

}
