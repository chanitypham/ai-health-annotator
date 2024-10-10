'use client';
import { useState, useEffect } from 'react';
import { Card, CardBody, Slider, Chip } from '@nextui-org/react';
import MedicalTextCard from '@/components/MedicalTextCard';
import AnnotationEditor from '@/components/AnnotationEditor';

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

  useEffect(() => {
    fetchTexts();
  }, [confidenceThreshold]);

  const fetchTexts = async () => {
    try {
      const response = await fetch(`/api/medical-text?confidenceThreshold=${confidenceThreshold}`);
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
        setTimeout(() => setStatus('Data ready for annotating'), 3000);
  
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

  const handleConfidenceThresholdChange = (value: number | number[]) => {
    setConfidenceThreshold(Array.isArray(value) ? value[0] : value);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardBody>
            <h2 className="text-2xl font-bold mb-4">Sample Text</h2>
            {selectedText && (
              <MedicalTextCard
                text={selectedText.text}
                task={selectedText.task}
                confidence={selectedText.confidence}
              />
            )}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Confidence Threshold</h3>
              <Slider
                label="Confidence Threshold"
                step={0.1}
                maxValue={1}
                minValue={0}
                value={confidenceThreshold}
                onChange={handleConfidenceThresholdChange}
                className="max-w-md"
              />
              <span>{confidenceThreshold.toFixed(1)}</span>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h2 className="text-2xl font-bold mb-4">Annotation Text</h2>
            {selectedText && (
              <AnnotationEditor
                text={selectedText.text}
                onSave={handleSave}
              />
            )}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Status</h3>
              <Chip color={status.includes("success") ? "success" : "primary"}>{status}</Chip>
            </div>
            <div className="mt-2">
              <h3 className="text-lg font-semibold">Remaining Annotations</h3>
              <span>{texts.length}</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
