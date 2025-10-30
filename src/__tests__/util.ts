import {expect as baseExpect} from "@loopback/testlab";

export function expect(
  key: string,
  expected: any,
  actual: any
) {
  baseExpect(expected).to.deepEqual(
    actual,
    `${key} is invalid: expected ${expected}, got ${actual}`
  );
}
