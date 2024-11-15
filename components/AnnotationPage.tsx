'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import MedicalTextCard from '@/components/MedicalTextCard';
import AnnotationEditor from '@/components/AnnotationEditor';

interface MedicalText {
  id: string;
  text: string;
  task: string;
  confidence: number;
  performance: number;
  annotateTime: number;
}

export default function AnnotationPage() {
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

  const handleSave = async (updatedText: string, annotateTime: number, performanceScore: number, annotateReason: string) => {
    if (selectedText) {
      try {
        const response = await fetch(`/api/medical-text`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: updatedText,
            task: selectedText.task,
            annotator: '', 
            annotateReason,
            annotateTime,
            performance: performanceScore, 
          }),
        });

        if (response.ok) {
          setStatus(`Data successfully annotated with a performance score of ${performanceScore}`);
          setTimeout(() => setStatus('Data ready for annotating'), 3000);

          setTexts((prevTexts) => prevTexts.slice(1));
          setSelectedText(texts[1] || null);
        } else {
          throw new Error('Error submitting your response');
        }
      } catch (error) {
        console.error('Failed to save:', error);
        setStatus('Error submitting your response');
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
      return (
        <Badge variant="outline" className="text-base bg-green-100 text-green-800 border-green-300">
          {status}
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="text-base bg-red-100 text-red-800 border-red-300">
          {status}
        </Badge>
      );
    }
  };

  return (
    <div className="flex items-center justify-center mx-48 mt-24">
      <div className="container mx-auto p-4">
        <div className="grid lg:grid-cols-2 gap-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
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
                  min={0.1}
                  max={1}
                  step={0.1}
                  value={[confidenceThreshold]}
                  onValueChange={handleConfidenceThresholdChange}
                  className='mb-2'
                />
                <span>{confidenceThreshold.toFixed(1)}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-4 pt-6">
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
              {/* <div>
                <h3 className="text-lg font-semibold">Remaining Annotations</h3>
                <span>{texts.length} / {samplesToAnnotate}</span>
              </div> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
