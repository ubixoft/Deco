import { DetailedHTMLProps, IframeHTMLAttributes } from "react";
import { ALLOWANCES } from "../../constants.ts";
type Props = DetailedHTMLProps<
  IframeHTMLAttributes<HTMLIFrameElement>,
  HTMLIFrameElement
>;

function Preview(props: Props) {
  return (
    <iframe
      allow={ALLOWANCES}
      allowFullScreen
      sandbox="allow-scripts"
      className="w-full h-full"
      {...props}
    />
  );
}

export default Preview;
