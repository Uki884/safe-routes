import { z } from "zod";

class GlobalSearchParamsManager {
  private static instance: GlobalSearchParamsManager;
  private schema: z.ZodObject<z.ZodRawShape> | null = null;
  private initialized = false;
  private constructor() {}

  public static getInstance(): GlobalSearchParamsManager {
    if (!GlobalSearchParamsManager.instance) {
      GlobalSearchParamsManager.instance = new GlobalSearchParamsManager();
    }
    return GlobalSearchParamsManager.instance;
  }

  public setSchema(schema: z.ZodObject<z.ZodRawShape>): void {
    if (this.initialized) {
      return;
    }

    this.schema = schema;
    this.initialized = true;
  }

  public getSchema(): z.ZodObject<z.ZodRawShape> | undefined {
    if (!this.schema) {
      return undefined;
    }
    return this.schema;
  }
}

export type ParamBuilder = {
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

const getParamBuilder = () => {
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
  return p;
};

export const setGlobalSearchParams = (
  schema: z.ZodObject<z.ZodRawShape>,
): void => {
  GlobalSearchParamsManager.getInstance().setSchema(schema);
};

export const getGlobalSearchParams = () => {
  return GlobalSearchParamsManager.getInstance().getSchema();
};

export const defineSearchParamsWithGlobal =
  (globalSchema: z.ZodObject<z.ZodRawShape>) =>
    <T extends Record<string, z.ZodType>>(builder: (p: ParamBuilder) => T ) => {
    const p = getParamBuilder();
    const schema = builder(p);
    const mergedSchema = z.object(schema).merge(globalSchema);
    return mergedSchema;
  };

export const defineSearchParams = <T extends Record<string, z.ZodType>>(
  builder: (p: ParamBuilder) => T,
) => {
  const p = getParamBuilder();
  const schema = builder(p);
  return z.object(schema);
};

export const createSearchParams = <
  T extends Record<string, z.ZodType>,
>(
  builder: (p: ParamBuilder) => T,
) => {
  const globalSchema = getGlobalSearchParams();
  if (!globalSchema) {
    return defineSearchParams(builder);
  }
  const schema = defineSearchParamsWithGlobal(globalSchema)(builder);
  return schema;
};

export const createGlobalSearchParams = <
  T extends Record<string, z.ZodType>,
>(
  builder: (p: ParamBuilder) => T,
) => {
  return defineSearchParams(builder);
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