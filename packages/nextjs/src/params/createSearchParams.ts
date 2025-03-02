import { z } from "zod";

type ParamBuilder = {
  stringOr: (defaultValue?: string) => z.ZodType<string>;
  numberOr: (defaultValue?: number) => z.ZodType<number>;
  booleanOr: (defaultValue?: boolean) => z.ZodType<boolean>;
  enumOr: <T extends [string, ...string[]]>(
    values: readonly [...T],
    defaultValue: T[number],
  ) => z.ZodType<T[number]>;
  or: <T>(schema: z.ZodType<T>, defaultValue: T) => z.ZodType<T>;
  dateOr: (defaultValue: Date) => z.ZodType<Date>;
  listOr: <T>(type: z.ZodType<T>, separator?: string) => z.ZodType<T[]>;
  optional: <T>(schema: z.ZodType<T>) => z.ZodOptional<z.ZodType<T>>;
  arrayOr: (defaultValue?: string[]) => z.ZodType<string[]>;
  parse: {
    number: () => z.ZodNumber;
    string: () => z.ZodString;
    boolean: () => z.ZodBoolean;
  };
  custom: <T>(
    schema: z.ZodType<T>,
    validator: (value: T) => boolean,
    errorMessage: string,
  ) => z.ZodType<T>;
};

export const createSearchParams = <T extends Record<string, z.ZodType>>(
  builder: (p: ParamBuilder) => T,
) => {
  const p: ParamBuilder = {
    stringOr: (defaultValue = "") => {
      return p.or(p.parse.string(), defaultValue);
    },
    booleanOr: (defaultValue = false) => {
      return p.or(p.parse.boolean(), defaultValue);
    },
    numberOr: (defaultValue = 1) => {
      return p.or(p.parse.number().int().min(1), defaultValue);
    },
    dateOr: (defaultValue: Date) => {
      return z.preprocess(
        (val = defaultValue) => new Date(String(val)),
        z.date(),
      ) as unknown as z.ZodType<Date>;
    },
    arrayOr: (defaultValue: string[] = []) => {
      const schema = z.array(z.string());
      return p.or(schema, defaultValue);
    },
    listOr: <T>(type: z.ZodType<T>, separator = ",") => {
      return z.preprocess((val) => {
        const str = String(val);
        if (!str) return [];
        return str.split(separator).map((item) => type.parse(item.trim()));
      }, z.array(type)) as unknown as z.ZodType<T[]>;
    },
    enumOr: <T extends [string, ...string[]]>(
      values: readonly [...T],
      defaultValue?: T[number],
    ) => {
      const schema = z.enum([...values]);
      return defaultValue !== undefined ? p.or(schema, defaultValue) : schema;
    },
    or: <T>(schema: z.ZodType<T>, defaultValue: T): z.ZodType<T> => {
      type NoUndefined<T> = T extends undefined ? never : T;
      const defaultSchema = schema.default(defaultValue as NoUndefined<T>);
      const catchSchema = defaultSchema.catch(defaultValue as NoUndefined<T>);
      return catchSchema as z.ZodType<T>;
    },
    parse: {
      number: () => z.coerce.number(),
      string: () => z.coerce.string(),
      boolean: () => z.coerce.boolean(),
    },
    optional: <T>(schema: z.ZodType<T>) => z.optional(schema),
    custom: <T>(
      schema: z.ZodType<T>,
      validator: (value: T) => boolean,
      errorMessage: string,
    ) => schema.refine(validator, { message: errorMessage }),
  };

  const schema = builder(p);
  return z.object(schema);
};

export const parseSearchParams = <T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
  input: URLSearchParams | Record<string, unknown>,
  options?: {
    passthrough?: boolean;
  },
): z.infer<T> => {
  const passthrough = options?.passthrough ?? true;
  const data =
    input instanceof URLSearchParams ? Object.fromEntries(input) : input;
  return passthrough ? schema.passthrough().parse(data) : schema.parse(data);
};

export type InferSearchParams<T extends z.ZodType> = z.infer<T>;
