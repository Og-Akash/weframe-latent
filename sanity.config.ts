import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { PdfExportTool } from "./sanity/components/PdfExportTool";
import { createExportPdfAction } from "./sanity/actions/exportPdfAction";

export default defineConfig({
  name: "latent",
  title: "Latent",
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool(), visionTool()],
  tools: [
    {
      name: "pdf-export",
      title: "PDF Export 📄",
      component: PdfExportTool,
    },
  ],
  schema: { types: schemaTypes },
  document: {
    actions: (prev, { schemaType }) => {
      if (schemaType === "submission") {
        const filtered = prev.filter((a) => !["duplicate", "unpublish"].includes(a.action ?? ""));
        return [...filtered, createExportPdfAction()];
      }
      return prev;
    },
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((t) => t.templateId !== "submission")
        : prev,
  },
});
