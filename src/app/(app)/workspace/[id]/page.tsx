import { notFound } from "next/navigation";
import { getDesign, listVersions } from "@/lib/designs.server";
import { DesignCanvas } from "@/components/workspace/design-canvas";
import { requireUserId } from "@/lib/auth.server";

export const dynamic = "force-dynamic";

export default async function WorkspaceDesignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const userId = await requireUserId();
  const design = await getDesign(userId, id);
  if (!design) notFound();

  const versions = await listVersions(userId, id);

  return <DesignCanvas design={design} versions={versions} />;
}
