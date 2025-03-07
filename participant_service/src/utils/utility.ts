import { IRouter } from "express"

export class Utility {

  constructor(){}

  public checkValueExistsInEnum<T extends Record<string, string | number>>(enumObj: T, value: string | number): boolean {
        return Object.values(enumObj).includes(value);
    }
    

    registerRoute =  (route: IRouter, baseUrl: string) => {

      const registeredPaths: string[] = []  
      const routes: Set<string>  = new Set<string>()
      
      console.log("participant route: ", route.stack)
     for(const c of route.stack){
      console.log(`${c.route?.path}`)
      if(c.route?.stack && c.route.stack.length > 0){
          for(const r of c.route.stack){
            console.log("details: ", r.method, r.name, r.handle)
            const path = baseUrl + c.route.path
            routes.add(path)
          }
      }
     }

     console.log("set paths: ", routes.keys())

    }
}

