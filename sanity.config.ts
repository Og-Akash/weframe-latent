import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "latent",
  title: "Latent",
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
  document: {
    // Submissions are created by the app, never by hand.
    actions: (prev, { schemaType }) =>
      schemaType === "submission"
        ? prev.filter((a) => !["duplicate", "unpublish"].includes(a.action ?? ""))
        : prev,
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((t) => t.templateId !== "submission")
        : prev,
  },
});
