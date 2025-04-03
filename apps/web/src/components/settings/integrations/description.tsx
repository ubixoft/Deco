import { useState } from "react";

export function ExpandableDescription(
  { description }: { description: string },
) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <p
        className={`text-xs text-muted-foreground ${
          !isExpanded ? "line-clamp-1" : ""
        }`}
      >
        {description}
      </p>
      {description.length > 60 && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground mt-0.5 cursor-pointer"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
