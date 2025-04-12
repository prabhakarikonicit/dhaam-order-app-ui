import { JSX } from "react";

// Define field types for form fields
export type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "select"
  | "textarea"
  | "checkbox"
  | "date"
  | "time"
  | "radio"
  | "file"
  | "image-upload"
  | "custom";

// Field definition interface
export interface FieldDefinition {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  rows?: number; // For textarea
  cols?: number; // For textarea
  customRender?: (props: {
    value: any;
    onChange: (value: any) => void;
    disabled?: boolean;
    error?: string;
  }) => JSX.Element;
  fullWidth?: boolean; // Add this to allow fields to take full width
  containerClassName?: string; // Custom class for the field container
  inputClassName?: string; // Custom class for the input element
  layout?: "horizontal" | "vertical"; // Field layout - default is vertical
}

export interface TableTemplateProps {
  tableColumns: TableColumns[];
  tableData: TableData[];
  pageSize?:number;
  hideToolbar?: boolean;
  showActionColumn?: boolean;
  enableDateFilters?: boolean;
  densityFirst?: boolean;
  selectedRows?: string[] | null,
  setSelectedRows?: React.Dispatch<React.SetStateAction<string[]>> | null;
  searchPlaceholder?:string,
}

// Base item interface that can be extended for specific use cases
export interface BaseItem {
  id?: string;
  isActive?: boolean;
  [key: string]: any;
}

export interface JSXTableCell {
  jsx:JSX.Element;
  value:string;
}

export interface StatCardProps {
  value: string;
  description: string | React.ReactNode;
  descriptionFirst?: boolean;
  icon?: string;
  fontWeight?: string;
}

export interface Order extends TableData{
    orderId: JSXTableCell;
    amount: string;
    status:JSXTableCell;
    store: string;
    deliveryAddress: string;
    deliveryMode: JSXTableCell;
    scheduledDateTime: JSXTableCell;
    paymentMethod: JSXTableCell;
    createdDate?: string; // Added for date filtering
    items?: OrderItem[]; // Optional items for detailed view
  }

  export interface FetchedOrderType {
    id:string;
    orderId:string;
    amount:string;
    status:string;
    store:string;
    deliveryAddress:string;
    deliveryMode: string;
    scheduledDate:string;
    scheduledTime:string;
    paymentMethod:string;
    createdDate:string;
  }

  interface OrderItem {
    name: string;
    quantity: number;
    price: string;
  }

  export interface Filter {
    field: string;
    value: string;
    type?: "text" | "date" | "number";
    dateOperator?: "equals" | "before" | "after" | "between";
    endDate?: string;
  }

  export interface TableColumns {
    field: string;
    headerName: string;
    type?: "text" | "date" | "number" | "jsx";
    sort?:boolean
  }

  export interface TableData {
    id:string;
    [key: string]: any;
  }