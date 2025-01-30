import { RowDataPacket } from "mysql2";

export interface UserInterface {
    
    id?: number;

    name: string;

    email: string;
    
    password: string;

    created_at?: Date;

    updated_at?: Date;

}

export interface UserQuery extends RowDataPacket {


    id?: number;

    name: string;

    email: string;
    
    password: string;

    created_at?: Date;

    updated_at?: Date;
}

export class User implements UserInterface {

    id?: number;

    name: string;

    email: string;
    
    password: string;

    created_at?: Date;

    updated_at?: Date;

    constructor() {
        this.name = '';
        this.email = '';
        this.password = '';
        this.created_at = new Date();
        this.updated_at = new Date();
    }

    public static Builder() {
        return new User();
    }

    public setId(id: number): User {
        this.id = id;
        return this;
    }

    public setName(name: string): User {
        this.name = name;
        return this;
    }
    
    public setEmail(email: string): User {
        this.email = email;
        return this;
    }

    public setPassword(password: string): User {
        this.password = password;
        return this;
    }

    public setCreatedAt(created_at: Date): User {
        this.created_at = created_at;
        return this;
    }

    public setUpdatedAt(updated_at: Date): User {
        this.updated_at = updated_at;
        return this;
    }

}