import { SDK } from "@deco/sdk";
import { Button } from "@deco/ui/components/button.tsx";
import { Icon } from "@deco/ui/components/icon.tsx";
import { cn } from "@deco/ui/lib/utils.ts";
import { useState } from "react";

interface PreviewProps {
  type: "url" | "html";
  title?: string;
  content: string;
  className?: string;
}

const wrapHtmlContent = (content: string) =>
  `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      :root { zoom: 0.8; }
      body { margin: 0; }
    </style>
  </head>
  <body>${content}</body>
</html>`.trim();

export function Preview({ type, content, title, className }: PreviewProps) {
  const [loading, setLoading] = useState(true);

  const iframeProps = type === "url"
    ? { src: content }
    : { srcDoc: wrapHtmlContent(content) };

  const handleExpand = () => {
    SDK.layout.addPanel({
      id: `preview-${title?.toLowerCase().replace(/\s+/g, "-")}`,
      component: "preview",
      title: title || "Preview",
      params: {
        content,
        type,
      },
      initialWidth: 400,
      position: {
        direction: "right",
      },
    });
  };

  return (
    <div
      className={cn(
        "relative w-max flex flex-col rounded-lg mb-4 p-1",
        className,
      )}
    >
      <div className="flex items-center justify-between p-2 pr-0">
        <div className="flex items-center gap-2">
          <Icon name="draft" className="text-sm text-muted-foreground" />
          <p className="text-sm font-medium tracking-tight">
            {title || "Preview"}
          </p>
        </div>
        <Button
          onClick={handleExpand}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-muted"
          aria-label="Expand preview"
        >
          <Icon
            name="expand_content"
            className="text-sm text-muted-foreground"
          />
        </Button>
      </div>

      <div className="w-max relative h-[420px] min-h-0 aspect-[4/5]">
        <iframe
          {...iframeProps}
          className="absolute inset-0 w-full h-full rounded-2xl shadow-lg"
          sandbox="allow-scripts"
          title={title || "Preview content"}
          onLoad={() => setLoading(false)}
        />

        <div
          className={cn(
            "absolute inset-0 w-full h-full items-center justify-center bg-opacity-80 bg-white rounded-lg",
            loading ? "flex" : "hidden",
          )}
        >
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    </div>
  );
}
