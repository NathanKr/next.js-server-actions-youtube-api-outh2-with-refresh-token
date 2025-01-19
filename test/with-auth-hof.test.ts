// serverAction.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { redirect } from "next/navigation";
import { checkAndRefreshToken } from '../src/logic/auth-utils';
import { withAuthHOF } from '../src/logic/hof/with-auth-hof';

// Mock the dependencies
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("../auth-utils", () => ({
  checkAndRefreshToken: vi.fn(),
}));

describe("withAuthHOF", () => {
  // Mock server action
  const mockServerAction = vi.fn();

  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks();
  });

  it("should call serverAction with augmented params if oauth2Client is available", async () => {
    const mockParams = { query: "example" };
    const oauth2Client = {};
    const redirectTo = null;

    (checkAndRefreshToken as any).mockResolvedValue({ oauth2Client, redirectTo });
    mockServerAction.mockResolvedValue({ data: "test data" });

    const wrappedAction = withAuthHOF(mockServerAction);
    const result = await wrappedAction(mockParams);

    expect(mockServerAction).toHaveBeenCalledWith({ ...mockParams, oauth2Client });
    expect(result).toEqual({ data: "test data" });
  });

  it("should redirect and return null if redirectTo is available", async () => {
    const mockParams = { query: "example" };
    const oauth2Client = null;
    const redirectTo = "/login";

    (checkAndRefreshToken as any).mockResolvedValue({ oauth2Client, redirectTo });

    const wrappedAction = withAuthHOF(mockServerAction);
    const result = await wrappedAction(mockParams);

    expect(redirect).toHaveBeenCalledWith(redirectTo);
    expect(result).toBeNull();
  });

  it("should throw an error if oauth2Client is not available and no redirectTo", async () => {
    const mockParams = { query: "example" };
    const oauth2Client = null;
    const redirectTo = null;

    (checkAndRefreshToken as any).mockResolvedValue({ oauth2Client, redirectTo });

    const wrappedAction = withAuthHOF(mockServerAction);

    await expect(wrappedAction(mockParams)).rejects.toThrow(
      "OAuth2 client not available. Authentication failed but missing redirectTo"
    );
  });
});
