// import { Request, Response } from 'express';
// import AuthService from '../service/auth.service';
// import { log } from 'console';
// import { UserInterface } from '../entity/User';


// class AuthController {

//     private authService: AuthService = new AuthService();

//     constructor() {
//         this.createAccount = this.createAccount.bind(this);
//         this.getUser = this.getUser.bind(this);
//     }

//     public async createAccount(req: Request, res: Response): Promise<void> {
//         try {
//             const user = req.body;
//             const createdUser: UserInterface = await this.authService.createAccount(user)
//             res.status(201).json({message: "User created successfully", user: createdUser});

//         } catch (error: any) {
//             log(error)
//             res.status(500).json({ error: error?.message });
//         }
//     }

//     public async getUser(req: Request, res: Response): Promise<void> {
//         try {
//             const id: number = parseInt(req.params.id);
//             const user = await this.authService.getUser(id);
//             res.status(200).json({message: "User found", user: user});
//         } catch (error: any) {
//             log(error)
//             res.status(500).json({ error: error?.message });
//         }
//     }
// }

// export default AuthController;