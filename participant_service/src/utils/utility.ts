
export class Utility {


  public checkValueExistsInEnum<T extends Record<string, string | number>>(enumObj: T, value: string | number): boolean {
        return Object.values(enumObj).includes(value);
    }

}
