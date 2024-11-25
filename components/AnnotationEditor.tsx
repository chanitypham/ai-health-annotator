"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import prand from "pure-rand";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AnnotationEditorProps {
  text: string;
  onSave: (
    updatedText: string,
    annotateTime: number,
    performanceScore: number,
    annotateReason: string
  ) => void;
  status: string;
  setStatus: (status: string) => void;
}

const AnnotationEditor: React.FC<AnnotationEditorProps> = ({
  text,
  onSave,
  status,
  setStatus,
}) => {
  const [editableText, setEditableText] = useState(text);
  const [annotateReason, setAnnotateReason] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setEditableText(text);
    setSeconds(0);
    setIsRunning(false);
    setIsPaused(false);
  }, [text]);

  // Handles start and stops for the timer
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  useEffect(() => {
    if (status.includes("successfully")) {
      setIsSubmitting(false);
    }
  }, [status]);

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
    setStatus("Annotation paused");
  };

  const resumeTimer = () => {
    setIsPaused(false);
    setStatus("Data ready for annotating");
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleSubmit = () => {
    stopTimer();
    setIsSubmitting(true);
    const seed = Date.now();
    const rng = prand.xoroshiro128plus(seed);
    const performanceScore =
      prand.unsafeUniformIntDistribution(1, 10, rng) / 10;
    console.log(`Calculated performance score: ${performanceScore}`);
    onSave(editableText, seconds, performanceScore, annotateReason);
    setAnnotateReason("");
  };

  return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="annotate-text">Annotate Text</Label>
        <Textarea
          id="annotate-text"
          value={editableText}
          onChange={(e) => setEditableText(e.target.value)}
          className="mb-2"
          disabled={!isRunning || isPaused}
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="annotate-reason">Annotate Reason</Label>
        <Input
          id="annotate-reason"
          value={annotateReason}
          onChange={(e) => setAnnotateReason(e.target.value)}
          placeholder="Give your reason for annotating"
          className="mb-2"
          disabled={!isRunning || isSubmitting}
        />
      </div>
      <div className="flex space-x-2">
        <Button onClick={startTimer} disabled={isRunning}>
          Start
        </Button>
        <Button
          onClick={isPaused ? resumeTimer : pauseTimer}
          disabled={!isRunning}
        >
          {isPaused ? "Resume" : "Pause"}
        </Button>
        <Button onClick={handleSubmit} disabled={!isRunning || isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Stop & Submit
        </Button>
        <Badge
          variant="outline"
          className="text-base bg-primary-100 text-primary-800 border-primary-300"
        >
          Time: {seconds}s
        </Badge>
      </div>
    </div>
  );
};

export default AnnotationEditor;
