import "@testing-library/jest-dom";
import { useRouter } from "next/router";

// Mock ResizeObserver for components that use it
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {}
  observe(target) {}
  unobserve(target) {}
  disconnect() {}
};

// // Mock IntersectionObserver for components that use it
// global.IntersectionObserver = class IntersectionObserver {
//   constructor(callback) {}
//   observe(target) {}
//   unobserve(target) {}
//   disconnect() {}
// };

jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
}));
