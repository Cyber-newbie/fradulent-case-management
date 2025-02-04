import { RowDataPacket } from "mysql2";

export interface IPermission extends RowDataPacket {

    id: number
    access: string;

}


export class Permission {

    private id: number; 
    private access: string;

    constructor(){
        this.id = 0;
        this.access = ""
    }


    public static Builder(){
        return new Permission();
    }

    public getId() : number {
        return this.id; 
    }

    public getAccess(): string {
        return this.access;
    }
    
    public setAccess(value: string) {
        this.access = value
        return this;
    }

    public setId(value: number) {
        this.id = value
        return this;
    }

}