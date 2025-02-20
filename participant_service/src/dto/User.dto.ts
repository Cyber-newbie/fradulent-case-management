import { Status } from "../utils/Enums"
import { RoleDto } from "./Role.dto"

export interface IUser {

    firstName: string
    lastName: string
    email: string
    password: string
    status: Status

}   

export interface IUserRoleDto {
    user: IUser
    roles: RoleDto[]
}

