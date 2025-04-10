import { JSX } from "react";

export interface JSXTableCell {
  jsx:JSX.Element;
  value:string;
}
export interface Order extends TableData{
    orderId: JSXTableCell;
    amount: string;
    status:JSXTableCell;
    store: string;
    deliveryAddress: string;
    deliveryMode: JSXTableCell;
    scheduleDateTime: JSXTableCell;
    paymentMethod: JSXTableCell;
    createdDate?: string; // Added for date filtering
    items?: OrderItem[]; // Optional items for detailed view
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