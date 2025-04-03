import { Button } from "@deco/ui/components/button.tsx";

interface PickerProps {
  options: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  onSelect: (value: string) => void;
}

export function Picker({ options, onSelect }: PickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Button
          key={option.id}
          variant="outline"
          size="sm"
          className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
