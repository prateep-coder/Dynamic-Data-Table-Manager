"use client";

import React, { useRef, useState } from "react";
import { Button, Box, Snackbar, Alert } from "@mui/material";
import {
  FileDownload as DownloadIcon,
  FileUpload as UploadIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "../../store/slices/tableState";
import { RootState } from "@/store";
import { User } from "@/types";

interface CSVRow {
  [key: string]: string;
}

const ImportExport: React.FC = () => {
  const dispatch = useDispatch();
  const { data, columns } = useSelector((state: RootState) => state.table);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const parseCSV = (csvText: string): CSVRow[] => {
    const lines = csvText.split("\n").filter((line) => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0]
      .split(",")
      .map((header) => header.trim().replace(/^"|"$/g, ""));

    const result: CSVRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i]
        .split(",")
        .map((val) => val.trim().replace(/^"|"$/g, ""));

      const row: CSVRow = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });

      result.push(row);
    }

    return result;
  };

  const stringifyCSV = (data: CSVRow[]): string => {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const csvLines = [headers.join(",")];

    data.forEach((row) => {
      const values = headers.map((header) => {
        const value = row[header];

        return typeof value === "string" && value.includes(",")
          ? `"${value}"`
          : value;
      });
      csvLines.push(values.join(","));
    });

    return csvLines.join("\n");
  };

  const handleExport = () => {
    try {
      // Only include visible columns
      const visibleColumns = columns.filter((col) => col.visible);
      const exportData: CSVRow[] = data.map((row) => {
        const exportRow: CSVRow = {};
        visibleColumns.forEach((col) => {
          const value = row[col.field as keyof User];
          exportRow[col.headerName] = value ? value.toString() : "";
        });
        return exportRow;
      });

      const csv = stringifyCSV(exportData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "table-data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSnackbar("Data exported successfully!", "success");
    } catch (error) {
      showSnackbar("Export failed!", "error");
      console.error("Export error:", error);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const importedData = parseCSV(csvText);

        if (importedData.length === 0) {
          showSnackbar("No data found in CSV file!", "error");
          return;
        }

        const users: User[] = importedData.map((row, index) => {
          return {
            id: (Date.now() + index).toString(),
            name: row.Name || row.name || "",
            email: row.Email || row.email || "",
            age: parseInt(row.Age || row.age) || 0,
            role: row.Role || row.role || "",
            department: row.Department || row.department || "",
            location: row.Location || row.location || "",
          };
        });

        dispatch(setData(users));
        showSnackbar(`Imported ${users.length} rows successfully!`, "success");
      } catch (error) {
        showSnackbar("Error parsing CSV file!", "error");
        console.error("Import error:", error);
      }
    };

    reader.onerror = () => {
      showSnackbar("Error reading file!", "error");
    };

    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <input
        type="file"
        accept=".csv"
        onChange={handleImport}
        ref={fileInputRef}
        style={{ display: "none" }}
      />

      <Button
        variant="outlined"
        startIcon={<UploadIcon />}
        onClick={() => fileInputRef.current?.click()}
      >
        Import CSV
      </Button>

      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={handleExport}
      >
        Export CSV
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ImportExport;
