import { DocumentActionComponent } from "sanity";

export function createExportPdfAction(): DocumentActionComponent {
  return function ExportPdfAction(props) {
    const { id, type } = props;

    if (type !== "submission") return null;

    return {
      label: "Export PDF 📄",
      title: "Export this participant's full answers to PDF",
      onHandle: () => {
        window.open(`/export-pdf?id=${id}`, "_blank");
      },
    };
  };
}
