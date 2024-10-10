'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useTimer } from 'react-timer-hook'
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

// Mock database
const mockDatabase = [
  { id: 1, text: "The patient presents with acute abdominal pain.", task: "summarize", confidence: 0.7, annotateTime: 0 },
  { id: 2, text: "MRI reveals a small lesion in the left temporal lobe.", task: "Simplify", confidence: 0.5, annotateTime: 0 },
  // Add more mock data as needed
]

// Chip component
const Chip = ({ label, color = "primary" }) => (
  <Badge variant="outline" className={`bg-${color}-100 text-${color}-800 border-${color}-300`}>
    {label}
  </Badge>
)

// Timer component
const Timer = ({ expiryTimestamp, autoStart = false }) => {
  const {
    seconds,
    minutes,
    hours,
    start,
    pause,
    resume,
  } = useTimer({ expiryTimestamp, autoStart })

  return (
    <div className="text-2xl font-mono">
      <span>{hours.toString().padStart(2, '0')}</span>:
      <span>{minutes.toString().padStart(2, '0')}</span>:
      <span>{seconds.toString().padStart(2, '0')}</span>
    </div>
  )
}

// AutoResizeTextarea component
const AutoResizeTextarea = ({ value, onChange, disabled = false, className = "" }) => {
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full min-h-[24px] max-h-32 overflow-y-auto resize-none border rounded-md p-2 ${className}`}
      style={{ lineHeight: '24px' }}
    />
  )
}

// Main component
export default function MedicalTextAnnotation() {
  const [sampleText, setSampleText] = useState("")
  const [task, setTask] = useState("")
  const [testScore, setTestScore] = useState(0.5)
  const [samplesToAnnotate, setSamplesToAnnotate] = useState(10)
  const [annotatedText, setAnnotatedText] = useState("")
  const [status, setStatus] = useState("Data ready for annotating")
  const [remainingAnnotations, setRemainingAnnotations] = useState(0)
  const [timerExpiry, setTimerExpiry] = useState(new Date())

  useEffect(() => {
    // Fetch data based on testScore and samplesToAnnotate
    const filteredData = mockDatabase.filter(item => item.confidence <= testScore).slice(0, samplesToAnnotate)
    if (filteredData.length > 0) {
      setSampleText(filteredData[0].text)
      setTask(filteredData[0].task)
      setAnnotatedText(filteredData[0].text)
      setRemainingAnnotations(filteredData.length)
    }
  }, [testScore, samplesToAnnotate])

  const handleStart = () => {
    setStatus("Data currently being annotated")
    const time = new Date()
    time.setSeconds(time.getSeconds() + 3600) // Set timer for 1 hour
    setTimerExpiry(time)
  }

  const handlePause = () => {
    setStatus("Data annotation paused")
  }

  const handleSubmit = () => {
    setStatus("Data successfully annotated")
    setTimeout(() => setStatus("Data ready for annotating"), 3000)
    setRemainingAnnotations(prev => Math.max(0, prev - 1))
    // Here you would typically send the annotated data to your backend
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardContent className="space-y-4">
            <h2 className="text-2xl font-bold">Sample Text</h2>
            <AutoResizeTextarea 
              value={sampleText} 
              onChange={() => {}} 
              disabled={true}
              className="text-gray-500 bg-gray-100"
            />
            <div>
              <h3 className="text-lg font-semibold">Task</h3>
              <Chip label={task} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Test Score</h3>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[testScore]}
                onValueChange={(value) => setTestScore(value[0])}
              />
              <span>{testScore.toFixed(1)}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Samples to Annotate</h3>
              <Slider
                min={10}
                max={100}
                step={10}
                value={[samplesToAnnotate]}
                onValueChange={(value) => setSamplesToAnnotate(value[0])}
              />
              <span>{samplesToAnnotate}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardContent className="space-y-4">
            <h2 className="text-2xl font-bold">Annotation</h2>
            <AutoResizeTextarea
              value={annotatedText}
              onChange={(e) => setAnnotatedText(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button onClick={handleStart}>Start</Button>
              <Button onClick={handlePause}>Pause</Button>
              <Button onClick={handleSubmit}>Stop & Submit</Button>
            </div>
            <Timer expiryTimestamp={timerExpiry} />
            <div>
              <h3 className="text-lg font-semibold">Status</h3>
              <Chip label={status} color={status.includes("success") ? "green" : "blue"} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Remaining Annotations</h3>
              <span>{remainingAnnotations}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}