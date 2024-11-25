import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
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
    mockSave.mockClear();
    mockSetStatus.mockClear();
  });

  // Test 1: Checks if the textarea for annotation is rendered in the component.
  it("renders the textarea", () => {
    const textarea = screen.getByLabelText(/Annotate Text/i);
    expect(textarea).toBeInTheDocument();
  });

  // Test 2: Checks if the input field for annotation reason is rendered.
  it("renders the annotate reason input", () => {
    const input = screen.getByLabelText(/Annotate Reason/i);
    expect(input).toBeInTheDocument();
  });

  // Test 3: Verifies that text can be entered into the annotation textarea.
  it("allows user to type into the textarea", () => {
    const textarea = screen.getByLabelText(/Annotate Text/i);
    fireEvent.change(textarea, { target: { value: "New Sample Text" } });
    expect(textarea).toHaveValue("New Sample Text");
  });

  // Test 4: Verifies that a reason for annotation can be entered.
  it("allows user to type annotate reason", () => {
    const input = screen.getByLabelText(/Annotate Reason/i);
    fireEvent.change(input, { target: { value: "Reason for annotation" } });
    expect(input).toHaveValue("Reason for annotation");
  });

  // Test 5: Ensures onSave is called with the correct parameters on submission.
  it("calls onSave with the correct parameters upon submission", () => {
    const startButton = screen.getByText("Start");
    fireEvent.click(startButton);

    const stopButton = screen.getByText("Stop & Submit");
    fireEvent.click(stopButton);

    expect(mockSave).toHaveBeenCalled();
    const [
      [submittedText, submittedTime, submittedPerformance, submittedReason],
    ] = mockSave.mock.calls;

    expect(submittedText).toBe("Sample");
    expect(submittedTime).toBeGreaterThanOrEqual(0);
    expect(submittedPerformance).toBeGreaterThanOrEqual(0.1);
    expect(submittedReason).toBe("");
  });

  // Test 6: Checks that buttons are enabled/disabled appropriately.
  it("disables buttons when necessary", () => {
    const stopButton = screen.getByText("Stop & Submit");
    expect(stopButton).toBeDisabled();

    const startButton = screen.getByText("Start");
    fireEvent.click(startButton);
    expect(startButton).toBeDisabled();

    // Ensure stop button becomes enabled
    expect(stopButton).not.toBeDisabled();
  });

  // Test 7: Checks pause and resume functionality updates status correctly.
  it("pauses and resumes correctly", () => {
    const startButton = screen.getByText("Start");
    fireEvent.click(startButton);

    const pauseButton = screen.getByText("Pause");
    fireEvent.click(pauseButton);

    expect(mockSetStatus).toHaveBeenCalledWith("Annotation paused");

    fireEvent.click(pauseButton); // Resume
    expect(mockSetStatus).toHaveBeenCalledWith("Data ready for annotating");
  });
});
