import { JSX } from "react";

export interface Order extends TableData{
    orderId: string;
    amount: string;
    status:JSX.Element
    store: string;
    deliveryAddress: string;
    deliveryMode: string;
    scheduleTime: string;
    scheduleDate: string;
    paymentMethod: JSX.Element;
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
    type?: "text" | "date" | "number";
  }

  export interface TableData {
    id:string;
    [key: string]: any;
  }