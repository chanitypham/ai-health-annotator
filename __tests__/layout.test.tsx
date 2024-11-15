import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import RootLayout from "../app/layout";

// Mock Clerk's SignedIn and SignedOut components
jest.mock("@clerk/nextjs", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SignedIn: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SignedOut: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SignInButton: () => <button>Sign In</button>,
  UserButton: () => <button>User</button>,
}));

describe("RootLayout Component", () => {
  it("renders the navigation brand image", () => {
    render(
      <RootLayout>
        <div />
      </RootLayout>
    );
    const brandImg = screen.getByAltText(/Mannota/i);
    expect(brandImg).toBeInTheDocument();
  });

  it("renders the Sign In button when signed out", () => {
    render(
      <RootLayout>
        <div />
      </RootLayout>
    );
    const signInButton = screen.getByText(/Sign In/i);
    expect(signInButton).toBeInTheDocument();
  });

  it("renders the User button when signed in", () => {
    render(
      <RootLayout>
        <div />
      </RootLayout>
    );
    const userButton = screen.getByText(/User/i);
    expect(userButton).toBeInTheDocument();
  });
});
