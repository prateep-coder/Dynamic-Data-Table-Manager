export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  department?: string;
  location?: string;

  [key: string]: string | number | undefined;
}

export interface Column {
  field: string;
  headerName: string;
  visible: boolean;
  sortable?: boolean;
  editable?: boolean;
  type?: "string" | "number" | "date";
}

export interface TableState {
  data: User[];
  columns: Column[];
  search: string;
  sort: { field: string; direction: "asc" | "desc" };
  pagination: {
    page: number;
    rowsPerPage: number;
  };
  editing: { [key: string]: Partial<User> };
}

export type UserField = keyof User | string;
