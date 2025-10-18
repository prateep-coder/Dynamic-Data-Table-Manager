"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  TextField,
  Box,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Add as AddIcon} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { updateColumns, addColumn } from "../../store/slices/tableState";
import { Column } from "@/types";

interface ColumnManagerProps {
  open: boolean;
  onClose: () => void;
}

const ColumnManager: React.FC<ColumnManagerProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { columns } = useSelector((state: RootState) => state.table);

  const [newColumn, setNewColumn] = useState({
    field: "",
    headerName: "",
    visible: true,
    sortable: true,
    editable: true,
  });

  const handleToggleColumn = (field: string) => {
    const updatedColumns = columns.map((col) =>
      col.field === field ? { ...col, visible: !col.visible } : col
    );
    dispatch(updateColumns(updatedColumns));
  };

  const handleAddColumn = () => {
    if (newColumn.field && newColumn.headerName) {
      dispatch(addColumn(newColumn as Column));
      setNewColumn({
        field: "",
        headerName: "",
        visible: true,
        sortable: true,
        editable: true,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Columns</DialogTitle>
      <DialogContent>
        <List>
          {columns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                primary={column.headerName}
                secondary={column.field}
              />
              <ListItemSecondaryAction>
                <Checkbox
                  edge="end"
                  checked={column.visible}
                  onChange={() => handleToggleColumn(column.field)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 3, p: 2, border: "1px dashed #ccc", borderRadius: 1 }}>
          <TextField
            fullWidth
            label="Field Name"
            value={newColumn.field}
            onChange={(e) =>
              setNewColumn({ ...newColumn, field: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Display Name"
            value={newColumn.headerName}
            onChange={(e) =>
              setNewColumn({ ...newColumn, headerName: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={newColumn.sortable}
                  onChange={(e) =>
                    setNewColumn({ ...newColumn, sortable: e.target.checked })
                  }
                />
              }
              label="Sortable"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={newColumn.editable}
                  onChange={(e) =>
                    setNewColumn({ ...newColumn, editable: e.target.checked })
                  }
                />
              }
              label="Editable"
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddColumn}
              disabled={!newColumn.field || !newColumn.headerName}
            >
              Add Column
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColumnManager;
