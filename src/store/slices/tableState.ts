import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, Column, TableState } from "@/types";

const initialState: TableState = {
  data: [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      age: 28,
      role: "Developer",
      department: "IT",
      location: "New York",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      age: 32,
      role: "Designer",
      department: "Creative",
      location: "London",
    },
  ],
  columns: [
    {
      field: "name",
      headerName: "Name",
      visible: true,
      sortable: true,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      visible: true,
      sortable: true,
      editable: true,
    },
    {
      field: "age",
      headerName: "Age",
      visible: true,
      sortable: true,
      editable: true,
    },
    {
      field: "role",
      headerName: "Role",
      visible: true,
      sortable: true,
      editable: true,
    },
    {
      field: "department",
      headerName: "Department",
      visible: false,
      sortable: true,
      editable: true,
    },
    {
      field: "location",
      headerName: "Location",
      visible: false,
      sortable: true,
      editable: true,
    },
  ],
  search: "",
  sort: { field: "name", direction: "asc" },
  pagination: {
    page: 0,
    rowsPerPage: 10,
  },
  editing: {},
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<User[]>) => {
      state.data = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.pagination.page = 0;
    },
    setSort: (
      state,
      action: PayloadAction<{ field: string; direction: "asc" | "desc" }>
    ) => {
      state.sort = action.payload;
    },
    setPagination: (
      state,
      action: PayloadAction<{ page: number; rowsPerPage: number }>
    ) => {
      state.pagination = action.payload;
    },
    updateColumns: (state, action: PayloadAction<Column[]>) => {
      state.columns = action.payload;
    },
    addColumn: (state, action: PayloadAction<Column>) => {
      state.columns.push(action.payload);
    },
    startEditing: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<User> }>
    ) => {
      state.editing[action.payload.id] = {
        ...state.editing[action.payload.id],
        ...action.payload.updates,
      };
    },
    saveEditing: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const editedData = state.editing[id];
      if (editedData) {
        const index = state.data.findIndex((item) => item.id === id);
        if (index !== -1) {
          state.data[index] = { ...state.data[index], ...editedData };
        }
        delete state.editing[id];
      }
    },
    cancelEditing: (state, action: PayloadAction<string>) => {
      delete state.editing[action.payload];
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((item) => item.id !== action.payload);
    },
  },
});

export const {
  setData,
  setSearch,
  setSort,
  setPagination,
  updateColumns,
  addColumn,
  startEditing,
  saveEditing,
  cancelEditing,
  deleteRow,
} = tableSlice.actions;

export default tableSlice.reducer;
