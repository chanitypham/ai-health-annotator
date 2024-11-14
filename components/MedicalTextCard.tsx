'use client';
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface MedicalTextCardProps {
  text: string;
  task: string;
  confidence: number;
}

const MedicalTextCard: React.FC<MedicalTextCardProps> = ({ text, task, confidence }) => {
  return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label>Sample Text</Label>  
        <Textarea 
        value={text} 
        readOnly
        className="text-gray-500 bg-gray-100 resize-none"
      />
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="text-base bg-primary-100 text-primary-800 border-primary-300">
          {task}
        </Badge>
        <Badge variant="outline" className="text-base bg-secondary-100 text-secondary-800 border-secondary-300">
          Confidence: {confidence.toFixed(2)}
        </Badge>
      </div>
    </div>
  );
};

export default MedicalTextCard;
