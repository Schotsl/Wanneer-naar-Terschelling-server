import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";

export function isDate(date: string): boolean {
  // Copied RegExp from https://www.delftstack.com/howto/javascript/javascript-validate-date/
  const regex = new RegExp(
    /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[1-9]|2[1-9])$/,
  );
  return regex.test(date);
}

export function isLength(input: string): boolean {
  const result = input.length >= 3 && input.length <= 255;
  return result;
}

export function initializeEnv(variables: Array<string>) {
  // Loop over every key and make sure it has been set
  variables.forEach((variable: string) => {
    if (!Deno.env.get(variable)) {
      throw new Error(`${variable} .env variable must be set.`);
    }
  });
}

export function cleanHex(hex: string): string {
  // Re-add the dashes and turn the string into lowercase
  const dashed = `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${
    hex.substr(12, 4)
  }-${hex.substr(16, 4)}-${hex.substr(20)}`;
  const lower = dashed.toLowerCase();

  return lower;
}
