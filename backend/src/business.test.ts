import { describe, expect, it } from "vitest";
import {
  businessDate,
  hasSufficientAvailableStock,
  isValidInvoiceCode,
  isValidDateOnly,
} from "./business";

describe("business dates", () => {
  it("uses the shop timezone instead of UTC", () => {
    const nearMidnightUtc = new Date("2026-08-28T21:30:00.000Z");
    expect(businessDate(nearMidnightUtc, "Asia/Tbilisi")).toBe("2026-08-29");
  });

  it("rejects impossible calendar dates", () => {
    expect(isValidDateOnly("2026-02-29")).toBe(false);
    expect(isValidDateOnly("2028-02-29")).toBe(true);
    expect(isValidDateOnly("2026-13-01")).toBe(false);
  });
});

describe("available inventory", () => {
  it("rejects a sale or reservation when location stock is insufficient", () => {
    expect(hasSufficientAvailableStock(0, 1)).toBe(false);
    expect(hasSufficientAvailableStock(2, 3)).toBe(false);
  });

  it("allows a sale or reservation when enough stock is available", () => {
    expect(hasSufficientAvailableStock(3, 3)).toBe(true);
    expect(hasSufficientAvailableStock(4, 3)).toBe(true);
  });
});

describe("invoice codes", () => {
  it("preserves and accepts leading zeroes", () => {
    expect(isValidInvoiceCode("00160")).toBe(true);
    expect(isValidInvoiceCode("0")).toBe(true);
  });

  it("still rejects non-digit invoice codes", () => {
    expect(isValidInvoiceCode("16A")).toBe(false);
    expect(isValidInvoiceCode("")).toBe(false);
  });
});
