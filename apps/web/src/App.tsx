import { useState } from "react";

import { Button } from "@deco/ui/components/button.tsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button onClick={() => setCount(count + 1)}>click me</Button>
      <p>{count}</p>
    </div>
  );
}

export default App;
