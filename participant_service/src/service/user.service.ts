import { Role, RoleRepository, User, UserRepository, UserRoleRepository } from "@cyber-newbie/db-repository";
import { IUser } from "../dto/User.dto";
import bcrypt from "bcryptjs"
import { RoleDto } from "../dto/Role.dto";
import { Status } from "@cyber-newbie/db-repository/dist/utils/Enums";
import { IUserLogin, Login } from "../dto/Login.dto";
import jwt, { SignOptions } from "jsonwebtoken"
import { config } from "../config/Config"

export class UserService {

    private userRepository: UserRepository = new UserRepository()
    private roleRepository: RoleRepository = new RoleRepository()
    private userRoleRepository: UserRoleRepository = new UserRoleRepository()

    create =  async (data: IUser, roles: RoleDto[]): Promise<void> => {

        try {
            const hashedPassword = await bcrypt.hash(data.password, 10)

            const allRoles = await this.roleRepository.getAll()
            const userRoles = roles.map(item => allRoles.filter(r => r.getRole() == item.role)[0]) 

            console.log("user roles: ", userRoles)
            const user = User.Builder()
            .setParticipantId("9ec109cd-2cf3-4add-b74e-aeb7b866f4a1")
            .setFirstName(data.firstName)
            .setLastName(data.lastName)
            .setemail(data.email)
            .setpassword(hashedPassword)
            .setStatus(data.status || Status.Active)

            await this.userRepository.createAndAssign(user, userRoles)
            
        } catch (error) {
            
            throw new Error("Error creating user with assigned roles: " + error)
            
        }
    }

    signin = async (data: Login): Promise<IUserLogin> => {

        try {
            
            const user = await this.userRepository.findByEmail(data.email)
            if(!user.getId()) throw new Error("Account does not exists.")   

            const isEqual =  await bcrypt.compare(data.password, user.getPassword())   
            if(!isEqual) throw new Error("Incorrect credentials. ")
            
            const roles = await this.userRoleRepository.getUserRoles(user.getId())
     
            const options: SignOptions = {
                expiresIn: `${parseInt(config.token.expiry)}D`
            }
            
            
            const payload = {
                participantId: user.getParticipantId(),
                userId: user.getId(),
                roles 
            } 
            
            const token = jwt.sign(payload, config.token.secret, options)
            
            return { user, token  }    

        } catch (error) {

            throw new Error("" + error)
        }
    }
     

}