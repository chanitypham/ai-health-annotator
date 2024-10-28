'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import MedicalTextCard from '@/components/MedicalTextCard';
import AnnotationEditor from '@/components/AnnotationEditor';
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { Button } from '@/components/ui/button';

interface MedicalText {
  id: string;
  text: string;
  task: string;
  confidence: number;
  annotateTime: number;
}

export default function AnnotatorPage() {
  const [texts, setTexts] = useState<MedicalText[]>([]);
  const [selectedText, setSelectedText] = useState<MedicalText | null>(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.6);
  const [status, setStatus] = useState<string>('Data ready for annotating');
  const [samplesToAnnotate, setSamplesToAnnotate] = useState(10);

  useEffect(() => {
    fetchTexts();
  }, [confidenceThreshold, samplesToAnnotate]);

  const fetchTexts = async () => {
    try {
      const response = await fetch(`/api/medical-text?confidenceThreshold=${confidenceThreshold}&numSamples=${samplesToAnnotate}`);
      const data: MedicalText[] = await response.json();
      setTexts(data);
      setSelectedText(data[0] || null);
    } catch (error) {
      console.error('Failed to fetch texts:', error);
    }
  };

  const handleSave = async (updatedText: string, annotateTime: number, confidenceScore: number) => {
    if (selectedText) {
      try {
        const response = await fetch(`/api/medical-text/${selectedText.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: updatedText,
            annotateTime: annotateTime,
            confidence: confidenceScore,
          }),
        });
        const updatedData: MedicalText = await response.json();
        setStatus(`Data successfully annotated with ${updatedData.confidence.toFixed(2)} confidence score`);
        setTimeout(() => setStatus('Data ready for annotating'), 3000); // 3 seconds, toCheck
  
        setTexts((prevTexts) => {
          let newTexts;
          if (updatedData.confidence <= confidenceThreshold) {
            newTexts = [
              ...prevTexts.slice(1),
              { ...updatedData, text: updatedText, confidence: confidenceScore, annotateTime }
            ];
          } else {
            newTexts = prevTexts.slice(1);
          }
          setSelectedText(newTexts[0] || null);
          return newTexts;
        });
      } catch (error) {
        console.error('Failed to save:', error);
      }
    }
  };  

  const handleConfidenceThresholdChange = (value: number[]) => {
    setConfidenceThreshold(value[0]);
  };

  const handleSamplesToAnnotateChange = (value: number[]) => {
    setSamplesToAnnotate(value[0]);
  };

  const getStatusBadge = () => {
    if (status === 'Data ready for annotating') {
      return (
        <Badge variant="outline" className="text-base bg-blue-50 text-gray-800 border-blue-200">
          {status}
        </Badge>
      );
    } else if (status === 'Annotation paused') {
      return (
        <Badge variant="outline" className="text-base bg-yellow-100 text-yellow-800 border-yellow-300">
          {status}
        </Badge>
      );
    } else if (status.includes('successfully annotated')) {
      const confidenceScore = parseFloat(status.match(/\d+\.\d+/)?.[0] || '0');
      if (confidenceScore <= confidenceThreshold) {
        return (
          <Badge variant="outline" className="text-base bg-red-100 text-red-800 border-red-300">
            {status}
          </Badge>
        );
      } else {
        return (
          <Badge variant="outline" className="text-base bg-green-100 text-green-800 border-green-300">
            {status}
          </Badge>
        );
      }
    } else {
      return (
        <Badge variant="outline" className="text-base bg-blue-100 text-blue-800 border-blue-300">
          {status}
        </Badge>
      );
    }
  };

  return (
    <>
      <SignedOut>
      <div className="flex items-center justify-center min-h-screen">
        <Button className="text-center justify-center bg-[#B5B1E4] text-white px-4 py-2 text-sm font-medium rounded-xl text-lg">
          <SignInButton />
        </Button>
        <Button className="text-center justify-center bg-[#6b63c9] text-white px-4 py-2 text-sm font-medium rounded-xl text-lg custom-hover" disabled>
          <SignInButton />
        </Button>
      </div>
      </SignedOut>
      <SignedIn>
        <UserButton />
        <div className="flex items-center justify-center min-h-screen">
          <div className="container mx-auto p-4">
            <div className="grid lg:grid-cols-2 gap-4">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <h2 className="text-2xl font-bold">Sample Text</h2>
                  {selectedText && (
                    <MedicalTextCard
                      text={selectedText.text}
                      task={selectedText.task}
                      confidence={selectedText.confidence}
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Confidence Threshold</h3>
                    <Slider
                      min={0}
                      max={1}
                      step={0.1}
                      value={[confidenceThreshold]}
                      onValueChange={handleConfidenceThresholdChange}
                      className='mb-2'
                    />
                    <span>{confidenceThreshold.toFixed(1)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Samples to Annotate</h3>
                    <Slider
                      min={10}
                      max={100}
                      step={10}
                      value={[samplesToAnnotate]}
                      onValueChange={handleSamplesToAnnotateChange}
                      className='mb-2'
                    />
                    <span>{samplesToAnnotate}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <h2 className="text-2xl font-bold">Annotation</h2>
                  {selectedText && (
                    <AnnotationEditor
                      text={selectedText.text}
                      onSave={handleSave}
                      status={status}
                      setStatus={setStatus}
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">Status</h3>
                    {getStatusBadge()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Remaining Annotations</h3>
                    <span>{texts.length} / {samplesToAnnotate}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
