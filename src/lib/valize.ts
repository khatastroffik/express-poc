import type { z, ZodObject } from "zod";
import type { $strict, $ZodLooseShape } from "zod/v4/core";

const ZodUnrecognizedKeysErrorMessageHandler = { error: (issue: any) => {
  if (issue.code === "unrecognized_keys") {
    return { message: `Unknown properties must not be provided! → [${issue.keys.toString()}]` };
  }
  return undefined;
} };

/********************************************************
 * validatePayloadWithZodSchema
*******************************************************/
export type StrictZodObject = ZodObject<$ZodLooseShape /* ZodRawShape */, $strict>;
export interface validatePayloadWithZodSchemaArgument<T extends StrictZodObject> { payload: unknown; schema: T; errorMessage: string | ((key: string) => string) }
export function validatePayloadWithZodSchema<T extends StrictZodObject>({ payload, schema, errorMessage }: validatePayloadWithZodSchemaArgument<T>): z.output<T> {
  const result = schema.parse(payload, {
    error: (issue) => {
      if (issue.code === "unrecognized_keys") {
        const msg = typeof errorMessage === "string" ? errorMessage : errorMessage(issue.keys.toString());
        return { message: msg };
      }
      return undefined;
    },
  });
  return result as unknown as z.output<T>;
}

/********************************************************
 * valizeLoose
*******************************************************/
export function valizeLooze<T extends z.ZodObject>(payload: unknown /* z.input<T> */, schema: T): z.output<T> {
  const result = schema.parse(payload, ZodUnrecognizedKeysErrorMessageHandler);
  return result as unknown as z.output<T>;
}

/********************************************************
 * valize
 *******************************************************/
export function valize<T extends z.ZodObject>(payload: unknown /* z.input<T> */, schema: T): z.output<T> {
  const result = schema.strict().parse(payload, ZodUnrecognizedKeysErrorMessageHandler);
  return result as unknown as z.output<T>;
}
