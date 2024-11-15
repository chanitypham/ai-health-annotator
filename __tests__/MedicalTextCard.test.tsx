import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import MedicalTextCard from "../components/MedicalTextCard";

describe("MedicalTextCard Component", () => {
  const sampleText = "Sample medical text";
  const sampleTask = "Sample Task";
  const sampleConfidence = 0.75;

  beforeEach(() => {
    render(
      <MedicalTextCard
        text={sampleText}
        task={sampleTask}
        confidence={sampleConfidence}
      />
    );
  });

  it("displays the given text", () => {
    const textarea = screen.getByDisplayValue(sampleText);
    expect(textarea).toBeInTheDocument();
  });

  it("displays the task badge", () => {
    const taskBadge = screen.getByText(sampleTask);
    expect(taskBadge).toBeInTheDocument();
  });

  it("displays the confidence level", () => {
    const confidenceBadge = screen.getByText(
      `Confidence: ${sampleConfidence.toFixed(2)}`
    );
    expect(confidenceBadge).toBeInTheDocument();
  });
});
