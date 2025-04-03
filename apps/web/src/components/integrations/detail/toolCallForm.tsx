import type { MCPTool } from "@deco/sdk";
import { Button } from "@deco/ui/components/button.tsx";
import { Icon } from "@deco/ui/components/icon.tsx";
import { Spinner } from "@deco/ui/components/spinner.tsx";
import { Textarea } from "@deco/ui/components/textarea.tsx";
import { useState } from "react";

interface ToolCallFormProps {
  tool: MCPTool;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function ToolCallForm(
  { tool, onSubmit, onCancel, isLoading }: ToolCallFormProps,
) {
  const [payload, setPayload] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      const parsedPayload = JSON.parse(payload);
      setError(null);
      await onSubmit(parsedPayload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON payload");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-medium mb-2">Input Schema</div>
        <pre className="p-4 rounded-lg bg-muted text-sm overflow-auto">
          {JSON.stringify(tool.inputSchema, null, 2)}
        </pre>
      </div>

      <div>
        <div className="text-sm font-medium mb-2">Payload</div>
        <Textarea
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          placeholder="Enter JSON payload..."
          className="font-mono"
          rows={10}
          disabled={isLoading}
        />
        {error && <div className="text-sm text-destructive mt-2">{error}</div>}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          className="flex-1 gap-2"
          disabled={isLoading}
        >
          {isLoading
            ? (
              <>
                <Spinner size="xs" />
                Processing...
              </>
            )
            : "Execute Tool Call"}
        </Button>
        {isLoading && (
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <Icon name="close" />
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
