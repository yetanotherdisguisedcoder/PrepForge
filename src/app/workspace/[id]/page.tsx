import { notFound } from "next/navigation";
import { getDesign, listVersions } from "@/lib/designs.server";
import { DesignCanvas } from "@/components/workspace/design-canvas";

export const dynamic = "force-dynamic";

export default async function WorkspaceDesignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const design = await getDesign(numericId);
  if (!design) notFound();

  const versions = await listVersions(numericId);

  return <DesignCanvas design={design} versions={versions} />;
}
