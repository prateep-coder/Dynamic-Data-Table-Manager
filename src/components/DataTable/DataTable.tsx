"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  TextField,
  Box,
  IconButton,
  Tooltip,
  Checkbox,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import {
  setSearch,
  setSort,
  setPagination,
  startEditing,
  saveEditing,
  cancelEditing,
  deleteRow,
} from "../../store/slices/tableState";
import { User } from "@/types";

const DataTable: React.FC = () => {
  const dispatch = useDispatch();
  const { data, columns, search, sort, pagination, editing } = useSelector(
    (state: RootState) => state.table
  );

  const getValue = (item: User, field: string): string | number => {
    return item[field as keyof User] ?? "";
  };

  const filteredAndSortedData = React.useMemo(() => {
    const filtered = data.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(search.toLowerCase())
      )
    );

    filtered.sort((a, b) => {
      const aValue = getValue(a, sort.field);
      const bValue = getValue(b, sort.field);

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sort.direction === "asc" ? -1 : 1;
      if (bValue == null) return sort.direction === "asc" ? 1 : -1;

      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();

      if (aString < bString) return sort.direction === "asc" ? -1 : 1;
      if (aString > bString) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data, search, sort]);

  const paginatedData = React.useMemo(() => {
    const start = pagination.page * pagination.rowsPerPage;
    return filteredAndSortedData.slice(start, start + pagination.rowsPerPage);
  }, [filteredAndSortedData, pagination]);

  const visibleColumns = columns.filter((col) => col.visible);

  const handleSort = (field: string) => {
    const direction =
      sort.field === field && sort.direction === "asc" ? "desc" : "asc";
    dispatch(setSort({ field, direction }));
  };

  const handleEdit = (id: string, field: string, value: string | number) => {
    dispatch(startEditing({ id, updates: { [field]: value } }));
  };

  const handleSave = (id: string) => {
    dispatch(saveEditing(id));
  };

  const handleCancel = (id: string) => {
    dispatch(cancelEditing(id));
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
      dispatch(deleteRow(id));
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search across all fields..."
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          sx={{ mb: 2 }}
        />
      </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              {visibleColumns.map((column) => (
                <TableCell key={column.field}>
                  {column.sortable ? (
                    <TableSortLabel
                      active={sort.field === column.field}
                      direction={
                        sort.field === column.field ? sort.direction : "asc"
                      }
                      onClick={() => handleSort(column.field)}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  ) : (
                    column.headerName
                  )}
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => {
                const isEditing = Boolean(editing[row.id]);
                const editedRow = editing[row.id] || {};

                return (
                  <TableRow key={row.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    {visibleColumns.map((column) => {
                      const currentValue = getValue(row, column.field);
                      const editedValue = editedRow[column.field as keyof User];
                      const displayValue =
                        isEditing && editedValue !== undefined
                          ? editedValue
                          : currentValue;

                      return (
                        <TableCell
                          key={column.field}
                          onDoubleClick={() =>
                            column.editable &&
                            handleEdit(row.id, column.field, displayValue)
                          }
                        >
                          {isEditing && column.editable ? (
                            <TextField
                              size="small"
                              value={displayValue || ""}
                              onChange={(e) =>
                                handleEdit(row.id, column.field, e.target.value)
                              }
                              onBlur={() => handleSave(row.id)}
                            />
                          ) : (
                            displayValue
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {isEditing ? (
                          <>
                            <Tooltip title="Save">
                              <IconButton
                                size="small"
                                onClick={() => handleSave(row.id)}
                                color="primary"
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel">
                              <IconButton
                                size="small"
                                onClick={() => handleCancel(row.id)}
                                color="secondary"
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleEdit(row.id, "name", row.name)
                                }
                                color="primary"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(row.id)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 2} align="center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredAndSortedData.length}
        rowsPerPage={pagination.rowsPerPage}
        page={pagination.page}
        onPageChange={(_, page) =>
          dispatch(setPagination({ ...pagination, page }))
        }
        onRowsPerPageChange={(e) =>
          dispatch(
            setPagination({
              page: 0,
              rowsPerPage: parseInt(e.target.value, 10),
            })
          )
        }
      />
    </Paper>
  );
};

export default DataTable;
