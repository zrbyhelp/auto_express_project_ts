import { ZrError } from "../zrError";

export class UnitCommon {
    static ThrowIfNullOrEmpty(errorMessage: string):never {
        throw new ZrError(errorMessage);
  }
}