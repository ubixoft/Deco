import { useIntegration } from "@deco/sdk";
import { Spinner } from "@deco/ui/components/spinner.tsx";
import { useParams } from "react-router";
import { DetailForm } from "./form.tsx";

function EditIntegration({ id }: { id: string }) {
  const { isLoading, data: integration } = useIntegration(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return <DetailForm integration={integration ?? undefined} />;
}

export default function Edit() {
  const { id } = useParams();

  // TODO: add nice error handling
  if (!id) {
    return <div>No id</div>;
  }

  return <EditIntegration id={id} />;
}
