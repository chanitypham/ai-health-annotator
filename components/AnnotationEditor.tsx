import { Textarea, Button, Chip } from '@nextui-org/react';
import { useState, useEffect, useRef } from 'react';
import prand from 'pure-rand';

interface AnnotationEditorProps {
  text: string;
  onSave: (updatedText: string, annotateTime: number, confidenceScore: number) => void;
}

const AnnotationEditor: React.FC<AnnotationEditorProps> = ({ text, onSave }) => {
  const [editableText, setEditableText] = useState(text);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setEditableText(text);
    setSeconds(0);
    setIsRunning(false);
    setIsPaused(false);
  }, [text]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setSeconds(0);
  };

  const handleSubmit = () => {
    stopTimer();
    const seed = Date.now();
    const rng = prand.xoroshiro128plus(seed);
    const confidenceScore = prand.unsafeUniformIntDistribution(1, 10, rng) / 10;
    onSave(editableText, seconds, confidenceScore);
  };

  return (
    <div>
      <Textarea
        value={editableText}
        onChange={(e) => setEditableText(e.target.value)}
        label="Annotate Text"
        className="mb-2"
        isDisabled={!isRunning || isPaused}
      />
      <div className="flex space-x-2 mb-2">
        <Button color="primary" onClick={startTimer} disabled={isRunning}>Start</Button>
        <Button color="secondary" onClick={isPaused ? resumeTimer : pauseTimer} disabled={!isRunning}>
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
        <Button color="success" onClick={handleSubmit} disabled={!isRunning}>Stop & Submit</Button>
      </div>
      <Chip>Time: {seconds}s</Chip>
    </div>
  );
};

export default AnnotationEditor;
