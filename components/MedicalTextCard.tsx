import { Input, Chip } from '@nextui-org/react';

interface MedicalTextCardProps {
  text: string;
  task: string;
  confidence: number;
}

const MedicalTextCard: React.FC<MedicalTextCardProps> = ({ text, task, confidence }) => {
  return (
    <div>
      <Input
        value={text}
        isReadOnly
        label="Sample Text"
        className="mb-2"
      />
      <div className="flex items-center space-x-2">
        <Chip color="primary">{task}</Chip>
        <Chip color="secondary">Confidence: {confidence.toFixed(2)}</Chip>
      </div>
    </div>
  );
};

export default MedicalTextCard;
