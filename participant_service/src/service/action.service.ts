import { Action, ActionRepository} from "@cyber-newbie/db-repository";
import { ActionValues } from "../utils/Enums"
  
export class ActionService { 


    private actionRepository: ActionRepository = new ActionRepository()
    async initCreateBulk() {

        // let data = process.env?.actions?.split(" ")
        let data = Object.values(ActionValues)
        const actions = data?.map((action) => {
            console.log("action values: ", data)
            return Action.Builder().setAction(action)
        })

        try {

            const existed = await this.actionRepository.getAll()            
            if(existed.length === 0 && actions && actions?.length > 0) await this.actionRepository.createBulk(actions)

        } catch (error) {

            console.error("Error creating actions:", error);
            throw new Error("Error creating actions: " + error);            
        }
    }


}