import { describe, expect, test } from "vitest";
import { screen } from "@testing-library/react";

describe("Onboarding", () => {
  test("It has the Google sign-in button", () => {
    expect(screen.findByText("Continue with Google"));
  });
});
