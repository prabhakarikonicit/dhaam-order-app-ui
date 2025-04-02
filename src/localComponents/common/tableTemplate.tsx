import React, {useState, useEffect} from "react";
import CustomDataGrid from "./datagrid";
import { TableColumns, Order, TableData } from "../../types";
const TableTemplate = ({tableColumns, tableData}:{tableColumns:TableColumns[], tableData:TableData[]}) => {
  const [paginatedData, setPaginatedData] = useState<TableData[]>([]);
  const [modalMode, setModalMode] = useState<
    "add" | "edit" | "view" | "payment"
  >("add");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("2025-02-10");
  const [endDate, setEndDate] = useState("2025-02-28");
  const [density, setDensity] = useState<
    "compact" | "standard" | "comfortable"
  >("standard");

   

  // Sample data initialization with createdDate field
  useEffect(() => {

    // Filter by date range initially
    // const filtered = filterByDateRange(mockOrders, startDate, endDate);
    setPaginatedData(tableData);

    // Initialize visible columns
    const allColumnFields = tableColumns.map((col) => col.field);
    setVisibleColumns(allColumnFields);
  }, []);

  

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) => {
      if (prev.includes(id)) {
        return prev.filter((rowId) => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const isSelected = event.target.checked;
  //   if (isSelected) {
  //     setSelectedRows(paginatedData.map((order) => order.id));
  //   } else {
  //     setSelectedRows([]);
  //   }
  // };

  // const filterByDateRange = (
  //   ordersToFilter: TableData[],
  //   start: string,
  //   end: string
  // ): Order[] => {
  //   return ordersToFilter.filter((order) => {
  //     if (!order.createdDate) return true;

  //     const orderDate = new Date(order.createdDate);
  //     const startDateObj = new Date(start);
  //     const endDateObj = new Date(end);

  //     return orderDate >= startDateObj && orderDate <= endDateObj;
  //   });
  // };
  return (
    <div className="px-8 pb-8 overflow-x-auto">
      <CustomDataGrid
        rows={paginatedData}
        onSelectAll={() => null}
        columns={tableColumns}
        selectedRows={selectedRows}
        onSelectRow={handleSelectRow}
        // onSelectAll={handleSelectAll}
        searchPlaceholder="Search order"
        hideToolbar={false}
        showActionColumn={false}
        enableDateFilters={true}
        densityFirst={true} // Change to false if you want export button before density
        dateRange={{
          label: `Feb 10–31, 2025`,
          startDate: startDate,
          endDate: endDate,
          onDateChange: (start, end) => {
            setStartDate(start);
            setEndDate(end);
            // Format the date range for display
            const startObj = new Date(start);
            const endObj = new Date(end);
            const formattedStart = startObj.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            const formattedEnd = endObj.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            // Apply date range filter
            // const filtered = filterByDateRange(tableData, start, end);
            setPaginatedData(tableData);
          },
        }}
        densityOptions={{
          currentDensity: density,
          onDensityChange: (newDensity) => {
            setDensity(newDensity);
            // Apply any density-related styling changes here if needed
          },
        }}
      />
    </div>
  );
};

export default TableTemplate;
