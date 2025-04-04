import React, {useState, useEffect, useRef} from "react";
import { TableColumns, Order, TableData } from "../../types";
const TableTemplate = ({tableColumns, tableData, hideToolbar=false, showActionColumn=false}:{tableColumns:TableColumns[], tableData:TableData[], hideToolbar?:boolean, showActionColumn?:boolean}) => {
  const [paginatedData, setPaginatedData] = useState<TableData[]>([]);
  const [modalMode, setModalMode] = useState<
    "add" | "edit" | "view" | "payment"
  >("add");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("2025-02-10");
  const [endDate, setEndDate] = useState("2025-02-28");
  const [density, setDensity] = useState<
    "compact" | "standard" | "comfortable"
  >("standard");
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
    // Refs for handling outside clicks
  const columnMenuRef = useRef<HTMLDivElement>(null);

  // Sample data initialization with createdDate field
  useEffect(() => {

    // Filter by date range initially
    // const filtered = filterByDateRange(mockOrders, startDate, endDate);
    setPaginatedData(tableData);

    // Initialize visible columns
    // const allColumnFields = tableColumns.map((col) => col.field);
    // setVisibleColumns(allColumnFields);

    // Close menus when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        columnMenuRef.current 
        &&
        !columnMenuRef.current.contains(event.target as Node)
      ) {
        setShowColumnMenu(false);
      }
      // if (
      //   filterMenuRef.current &&
      //   !filterMenuRef.current.contains(event.target as Node)
      // ) {
      //   setShowFilterMenu(false);
      // }
      // if (
      //   densityMenuRef.current &&
      //   !densityMenuRef.current.contains(event.target as Node)
      // ) {
      //   setShowDensityMenu(false);
      // }
      // if (
      //   datePickerRef.current &&
      //   !datePickerRef.current.contains(event.target as Node)
      // ) {
      //   setShowDatePicker(false);
      // }
    };
    document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
  }, []);

  

  const handleSelectRow = (id: string) => {
    setSelectedRows((currState) => {
      if (currState.includes(id)) {
        return currState.filter((rowId) => rowId !== id);
      } else {
        return [...currState, id];
      }
    });
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isSelected = event.target.checked;
    if (isSelected) {
      setSelectedRows(paginatedData.map((order) => order.id));
    } else {
      setSelectedRows([]);
    }
  };

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

  const handleToggleColumnVisibility = (field:string) => {
    if(hiddenColumns.includes(field)) setHiddenColumns(currState => currState.filter(item => item != field))
    else setHiddenColumns(currState => [...currState, field])
  }
  return (
    <div className="px-8 pb-8 overflow-x-auto">
      <div className="w-full border border-grey-border rounded-custom8px mb-10">
        {!hideToolbar && (
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Column toggle button */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 text-[14px] font-inter font-[500] text-textHeading"
                  onClick={() => {
                    setShowColumnMenu(!showColumnMenu);
                    setShowFilterMenu(false);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M8.5575 2.91666V11.0833H5.4425V2.91666H8.5575ZM9.14083 11.0833H12.25V2.91666H9.14083V11.0833ZM4.85917 11.0833V2.91666H1.75V11.0833H4.85917Z"
                      fill="#636363"
                    />
                  </svg>
                  Columns
                </button>

                {showColumnMenu && (
                  <div
                    ref={columnMenuRef}
                    className="absolute z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                  >
                    <div className="py-1 px-2">
                      {tableColumns.map((column) => (
                        <div
                          key={column.field}
                          className="flex items-center px-2 py-2"
                        >
                          <input
                            type="checkbox"
                            id={`column-${column.field}`}
                            checked={
                              !hiddenColumns.includes(column.field)
                                ? true
                                : false
                            }
                            onChange={() =>
                              handleToggleColumnVisibility(column.field)
                            }
                            className="h-4 w-4 rounded border-gray-300 focus:ring-bgButton accent-bgButton"
                          />
                          <label
                            htmlFor={`column-${column.field}`}
                            className="ml-2 text-[12px] text-reloadButton font-inter"
                          >
                            {column.headerName}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="border-b border-gray-200 bg-background-grey">
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={selectedRows.length === paginatedData.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-btnBorder focus:ring-bgButton accent-bgButton"
                />
              </th>
              {tableColumns
                .filter((column) => !hiddenColumns.includes(column.field))
                .map((col) => (
                  <th
                    key={col.field}
                    className="text-left p-4 font-inter font-[600] text-headding-color bg-background-grey"
                  >
                    {col.headerName}
                  </th>
                ))}
              {showActionColumn && (
                <th className="text-left p-4 font-inter font-[600] text-headding-color bg-background-grey">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-200 bg-store-card"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                    className="h-4 w-4 rounded border border-gray-300 focus:ring-bgButton accent-bgButton"
                  />
                </td>
                {tableColumns
                  .filter((column) => !hiddenColumns.includes(column.field))
                  .map((col) => (
                    <td
                      key={col.field}
                      className="p-4 text-[12px] font-inter font-[500] text-cardValue"
                    >
                      <div>
                        <div className="text-[14px] font-inter font-[500] text-cardValue leading-[21px]">
                          {row[col.field]}
                        </div>
                      </div>
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <CustomDataGrid
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
      /> */}
    </div>
  );
};

export default TableTemplate;
