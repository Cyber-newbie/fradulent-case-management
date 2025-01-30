// import { log } from "console";
// import { User, UserInterface, UserQuery } from "../entity/User"
// import UserRepository from "../repository/UserRepository";
// import { QueryResult } from "mysql2";

// class AuthService {

//     userRepository: UserRepository = new UserRepository();

//      createAccount = async (user: UserInterface): Promise<UserInterface> => {
//         console.log("creating user....")
//         try {
//             const createdUser: UserInterface =  await this.userRepository.create(user);
//             console.log('User created: ', createdUser);
//             return createdUser;
            
//         } catch (error) {
//             log('Error creating user: ', error);
//             throw new Error('Error creating user: ' + error);
//         }
//     }

//     getUser = async (id: number): Promise<User> => {
//         try {
//             const [result]  = await this.userRepository.findById<UserQuery>(id);
//             if(!result) {
//                 throw new Error('User not found');
//             }
//             const user: User = User.Builder()
//                 .setId(result.id || 0)
//                 .setName(result.name) 
//                 .setEmail(result.email)
//                 .setPassword(result.password)


//             console.log('User found: ', user);
//             return user;
//             // const user = result ? result[0] : result;

//         } catch (error) {
//             log('Error getting user: ', error);
//             throw new Error('Error getting user: ' + error);
//         }
//     }
// }



// export default AuthService;