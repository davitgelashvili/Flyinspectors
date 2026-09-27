import { downloadExcel } from "react-export-table-to-excel";

export const exportToExcel = (data, header) => {
  downloadExcel({
    fileName: Date.now().toString(),
    sheet: "client",
    tablePayload: {
      header,
      body: data,
    },
  });
};
