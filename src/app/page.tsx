"use client";

import React, { useState } from "react";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import DataTable from "@/components/DataTable/DataTable";
import ColumnManager from "@/components/ColumnManager/ColumnManager";
import ImportExport from "@/components/ImportExport/ImportExport";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";

export default function Home() {
  const [columnManagerOpen, setColumnManagerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: "#1976d2",
          },
        },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Dynamic Data Table Manager
            </Typography>

            <ThemeToggle
              darkMode={darkMode}
              onToggle={() => setDarkMode(!darkMode)}
            />
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <ImportExport />

            <Button
              variant="contained"
              startIcon={<SettingsIcon />}
              onClick={() => setColumnManagerOpen(true)}
            >
              Manage Columns
            </Button>
          </Box>

          <DataTable />

          <ColumnManager
            open={columnManagerOpen}
            onClose={() => setColumnManagerOpen(false)}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
