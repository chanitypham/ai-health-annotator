import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AnnotationEditor from "../components/AnnotationEditor";

describe("AnnotationEditor Component", () => {
  const mockSave = jest.fn();
  const mockSetStatus = jest.fn();

  beforeEach(() => {
    render(
      <AnnotationEditor
        text="Sample"
        onSave={mockSave}
        status="Data ready for annotating"
        setStatus={mockSetStatus}
      />
    );
  });

  it("renders the textarea", () => {
    const textarea = screen.getByLabelText(/Annotate Text/i);
    expect(textarea).toBeInTheDocument();
  });

  it("renders the annotate reason input", () => {
    const input = screen.getByLabelText(/Annotate Reason/i);
    expect(input).toBeInTheDocument();
  });
});
