import { User } from "@cyber-newbie/db-repository"

export interface Login { 
    
    email: string 
    password: string

}

export type IUserLogin = {
    user: User,
    token: string
}  