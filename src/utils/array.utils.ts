export class ArrayUtils {

  public static enumToArray(Enum: any): string[] {
    return Object.keys(Enum).map((key: string) => key);
  }
}
