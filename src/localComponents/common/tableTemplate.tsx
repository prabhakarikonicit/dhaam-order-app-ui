import React, { useState, useEffect, useRef } from "react";
import { TableColumns, Order, TableData, Filter } from "../../types";
import useMobileView from "./hooks/useMobileView";
const TableTemplate = ({
  tableColumns,
  tableData,
  pageSize = 10,
  hideToolbar = false,
  showActionColumn = false,
  enableDateFilters = false,
  densityFirst = false, // Default to false for backward compatibility
  selectedRows= null,
  setSelectedRows = null,
  searchPlaceholder = "Search",
}: {
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
}) => {

  const [hasJSXTypeError, setHasJSXTypeError] = useState(false);
  const [filteredData, setFilteredData] = useState<TableData[]>([]);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("2025-02-28");
  const [density, setDensity] = useState<
    "compact" | "standard" | "comfortable"
  >("standard");
  const [showDensityMenu, setShowDensityMenu] = useState(false);
   // Check if we're on mobile
   const isMobile = useMobileView();
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [appliedFilter, setAppliedFilter] = useState<{
    [column: string]: string;
  } | null>(null);
  const [appliedFilterType, setAppliedFilterType] = useState<
    "text" | "date" | "number" | "jsx"
  >("text");
  const [dateOperator, setDateOperator] = useState<
    "equals" | "before" | "after" | "between"
  >("equals");
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  // Refs for handling outside clicks
  const columnMenuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const densityMenuRef = useRef<HTMLDivElement>(null);

  // Sample data initialization with createdDate field
  useEffect(() => {
    // table data validation, render error component if data is invalid type
    tableColumns.forEach(col => {
      if(col.type == 'jsx') {
        const isValid = tableData.every(row => {
          const keys = Object.keys(row[col.field]);
          return typeof(row[col.field]) == 'object' && keys.length == 2 && keys[0] == 'jsx' && typeof(row[col.field][keys[0]]) == 'object' && keys[1] == 'value' && typeof(row[col.field][keys[1]]) == 'string';
      })
      if(!isValid) {
        setHasJSXTypeError(true);
        return;
      }
      }
    })
    setFilteredData(tableData);

    // Initialize visible columns
    // const allColumnFields = tableColumns.map((col) => col.field);
    // setVisibleColumns(allColumnFields);

    // Close menus when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        columnMenuRef.current &&
        !columnMenuRef.current.contains(event.target as Node)
      ) {
        setShowColumnMenu(false);
      }
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node)
      ) {
        setShowFilterMenu(false);
      }
      if (
        densityMenuRef.current &&
        !densityMenuRef.current.contains(event.target as Node)
      ) {
        setShowDensityMenu(false);
      }
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

  useEffect(() => {
    if (appliedFilterType && appliedFilterType == "date") {
      setStartDate("");
      setEndDate("");
      setDateOperator("equals");
    }
  }, [appliedFilterType]);

  const handleAppliedFilterChange = (filterCol: string) => {
    setAppliedFilter({ [filterCol]: "" });
    const filterType = tableColumns.find((col) => col.field == filterCol)?.type;
    if (filterType) setAppliedFilterType(filterType);
  };

  // Handle adding a filter
  // const addFilter = (field: string, value: string) => {
  //   if (!field || field === "" || !value) return;

  //   const column = tableColumns.find((col) => col.field === field);
  //   if (!column) return;

  //   // Check if filter already exists
  //   const existingFilterIndex = activeFilters.findIndex(
  //     (f) => f.field === field
  //   );

  //   const newFilter: Filter = {
  //     field,
  //     value,
  //     type: column.type || "text",
  //   };

  //   // Add date-specific properties if it's a date filter
  //   if (column.type === "date") {
  //     newFilter.dateOperator = dateOperator;
  //     if (dateOperator === "between") {
  //       newFilter.endDate = endDate;
  //     }
  //   }

  //   if (existingFilterIndex >= 0) {
  //     // Update existing filter
  //     const updatedFilters = [...activeFilters];
  //     updatedFilters[existingFilterIndex] = newFilter;
  //     setActiveFilters(updatedFilters);
  //   } else {
  //     // Add new filter
  //     setActiveFilters([...activeFilters, newFilter]);
  //   }

  //   // Reset filter form
  //   setShowFilterMenu(false);
  //   setSelectedFilterField("");
  //   setDateOperator("equals");
  //   setStartDate("");
  //   setEndDate("");
  // };

  // Handle removing a filter
  const removeFilter = (field: string) => {
    setActiveFilters(activeFilters.filter((f) => f.field !== field));
  };

  // Function to format filter display text
  const formatFilterDisplay = (filter: Filter): string => {
    if (filter.type === "date") {
      switch (filter.dateOperator) {
        case "equals":
          return `equals ${filter.value}`;
        case "before":
          return `before ${filter.value}`;
        case "after":
          return `after ${filter.value}`;
        case "between":
          return `between ${filter.value} and ${filter.endDate}`;
        default:
          return filter.value;
      }
    }
    return filter.value;
  };

  // Handle field selection for filters
  // const handleFilterFieldChange = (field: string) => {
  //   setAppliedFilter(field);
  //   const selectedColumn = tableColumns.find((col) => col.field === field);
  //   setAppliedFilterType(selectedColumn?.type || "text");

  //   // Reset date-specific states when changing fields
  //   if (selectedColumn?.type !== "date") {
  //     setDateOperator("equals");
  //     setStartDate("");
  //     setEndDate("");
  //   }
  // };

  // Desktop pagination
  const renderPagination = () => {
    return (
      <div className="p-4 flex justify-between items-center border-t border-gray-200">
        <span className="text-[14px] font-inter font-[500] text-headding-color">
          Showing result {Math.min(currentPageSize, filteredData.length)} out of{" "}
          {tableData.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="p-2 hover:bg-gray-100 rounded"
            disabled={currentPage === 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.7071 5.29289C13.0976 5.68342 13.0976 6.31658 12.7071 6.70711L9.41421 10L12.7071 13.2929C13.0976 13.6834 13.0976 14.3166 12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L7.29289 10.7071C6.90237 10.3166 6.90237 9.68342 7.29289 9.29289L11.2929 5.29289C11.6834 4.90237 12.3166 4.90237 12.7071 5.29289Z"
                fill="#4A4A4A"
              />
            </svg>
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="p-2 hover:bg-gray-100 rounded"
            disabled={currentPage * currentPageSize >= filteredData.length}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z"
                fill="#4A4A4A"
              />
            </svg>
          </button>
          <select
            className="ml-2 px-4 py-4 border border-gray-200 rounded-custom text-[12px] bg-reloadBackground"
            value={currentPageSize}
            onChange={(e) => {
              setCurrentPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10} className="text-[12px] bg-reloadBackground">
              10
            </option>
            <option value={20} className="text-[12px] bg-reloadBackground">
              20
            </option>
            <option value={50} className="text-[12px] bg-reloadBackground">
              50
            </option>
          </select>
        </div>
      </div>
    );
  };

  const handleFilterValueChange = (value: string) => {
    if (appliedFilter && Object.keys(appliedFilter).length > 0) {
      const filterColumn = Object.keys(appliedFilter)[0];
      setAppliedFilter({ [filterColumn]: value });
    }
  };

  useEffect(() => {
    let result = tableData;

    // Apply search filter
    if(searchValue) {
      result = result.filter(row => {
        return tableColumns.some(col => {
          if(hiddenColumns.includes(col.field)) return false;
          const value = col.type == 'jsx' ? row[col.field].value :row[col.field];
          if(value == null) return false;
          return String(value).toLowerCase().includes(searchValue.toLowerCase());
        })
      })
    }
    // Apply column-specific filters
    if (appliedFilter && Object.keys(appliedFilter).length > 0) {
      const filterColumn = Object.keys(appliedFilter)[0];
      const filterValue = appliedFilter[filterColumn];
      const filterType = tableColumns.find((col) => col.field == filterColumn)?.type;
      if (filterColumn && filterValue) {
          result = result.filter((item) => {
            const tableCell = filterType == 'jsx' ? item[filterColumn].value: String(item[filterColumn]);
            return tableCell.toLowerCase().includes(filterValue.toLowerCase());
          });

        
      }
      if (filterColumn && appliedFilterType == "date") {
        if (startDate && startDate != "" && dateOperator != "between") {
          result = result.filter((item) => {
            try {
              const tableCell = String(item[filterColumn]).toLowerCase();
              const TableCellDate = new Date(tableCell).getTime();
              const formattedStartDate = new Date(startDate).getTime();
              if (isNaN(TableCellDate) || isNaN(formattedStartDate))
                return false;
              switch (dateOperator) {
                case "equals":
                  return TableCellDate === formattedStartDate;
                case "before":
                  return TableCellDate < formattedStartDate;
                case "after":
                  return TableCellDate > formattedStartDate;
                default:
                  return false;
              }
            } catch (e) {
              return false;
            }
          });
        }
        if (
          startDate &&
          startDate != "" &&
          dateOperator == "between" &&
          endDate &&
          endDate != ""
        ) {
          result = result.filter((item) => {
            try {
              const tableCell = String(item[filterColumn]).toLowerCase();
              const TableCellDate = new Date(tableCell).getTime();
              const formattedStartDate = new Date(startDate).getTime();
              const formattedEndtDate = new Date(endDate).getTime();
              if (
                isNaN(TableCellDate) ||
                isNaN(formattedStartDate) ||
                isNaN(formattedEndtDate)
              )
                return false;
              return (
                TableCellDate >= formattedStartDate &&
                TableCellDate <= formattedEndtDate
              );
            } catch (e) {
              return false;
            }
          });
        }
      }
    }
    if (!appliedFilter) {
      setDateOperator("equals");
      setStartDate("");
      setAppliedFilterType("text");
    }
    setFilteredData(result);
  }, [appliedFilter, searchValue, dateOperator, startDate, endDate]);

  const handleSelectRow = (id: string) => {
    setSelectedRows && setSelectedRows((currState) => {
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
      setSelectedRows && setSelectedRows(filteredData.map((order) => order.id));
    } else {
      setSelectedRows && setSelectedRows([]);
    }
  };

  // Render density button
  const renderDensityButton = () => {

    return (
      <div className="relative">
        <button
          className="flex items-center gap-2 text-[14px] font-inter font-[500] text-textHeading"
          onClick={() => setShowDensityMenu(!showDensityMenu)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M12.25 4.66659H1.75V2.33325H12.25V4.66659ZM12.25 5.83325H1.75V8.16659H12.25V5.83325ZM12.25 9.33325H1.75V11.6666H12.25V9.33325Z"
              fill="#636363"
            />
          </svg>
          {!isMobile && (
            <span className="text-[14px] font-inter font-[500] text-textHeading">
              Density
            </span>
          )}
        </button>

        {showDensityMenu && (
          <div
            className="absolute z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
            ref={densityMenuRef}
          >
            <div className="py-1">
              <button
                className={`block w-full text-left px-4 py-2 text-[12px] font-inter font-[500] text-textHeading ${
                  density === "comfortable"
                    ? "bg-gray-100"
                    : ""
                }`}
                onClick={() => {
                  setDensity("comfortable");
                  setShowDensityMenu(false);
                }}
              >
                Comfortable
              </button>
              <button
                className={`block w-full text-left px-4 py-2 text-[12px] font-inter font-[500] text-textHeading ${
                  density === "standard"
                    ? "bg-gray-100"
                    : ""
                }`}
                onClick={() => {
                  setDensity("standard");
                  setShowDensityMenu(false);
                }}
              >
                Standard
              </button>
              <button
                className={`block w-full text-left px-4 py-2 text-[12px] font-inter font-[500] text-textHeading ${
                  density === "compact"
                    ? "bg-gray-100"
                    : ""
                }`}
                onClick={() => {
                  setDensity("compact");
                  setShowDensityMenu(false);
                }}
              >
                Compact
              </button>
            </div>
          </div>
        )}
      </div>
    );
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

  const handleToggleColumnVisibility = (field: string) => {
    if (hiddenColumns.includes(field))
      setHiddenColumns((currState) =>
        currState.filter((item) => item != field)
      );
    else setHiddenColumns((currState) => [...currState, field]);
  };

  // Handle export to CSV
  const exportToCSV = () => {
    // Get visible columns
    const visibleColumns = tableColumns.filter((col) => !hiddenColumns.includes(col.field));

    // Create header row
    const headerRow = visibleColumns.map((col) => col.headerName);

    // Create data rows
    const dataRows = filteredData.map((row) => {
      return visibleColumns.map((col) => {
        const value = col.type == 'jsx' ? row[col.field].value: row[col.field];
        return value !== null && value !== undefined ? String(value) : "";

        // // Handle special cases
        // if (col.field === "status") {
        //   return value;
        // } else if (col.field === "amount" && typeof value === "number") {
        //   return value.toFixed(2);
        // } else if (
        //   col.field === "date" ||
        //   col.field === "transactionDate" ||
        //   col.field === "createdOn"
        // ) {
        //   return value;
        // } else {
        //   return value !== null && value !== undefined ? String(value) : "";
        // }
      });
    });

    // Combine header and data rows
    const csvContent = [
      headerRow.join(","),
      ...dataRows.map((row) => row.join(",")),
    ].join("\n");

    // Create blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "DataExport.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <>
    {hasJSXTypeError && <div>JSX Column Has Invalid Cell Data Type!!</div>}
    {!hasJSXTypeError && <div className="px-8 pb-8 overflow-x-auto">
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
              {/* Filter button */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 text-[14px] font-inter font-[500] text-textHeading"
                  onClick={() => {
                    setShowFilterMenu(!showFilterMenu);
                    setShowColumnMenu(false);
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
                      d="M4.085 9.49926C4.1883 9.20657 4.37987 8.95312 4.6333 8.77384C4.88673 8.59456 5.18954 8.49828 5.5 8.49828C5.81046 8.49828 6.11327 8.59456 6.3667 8.77384C6.62013 8.95312 6.8117 9.20657 6.915 9.49926H12V10.499H6.915C6.8117 10.7917 6.62013 11.0452 6.3667 11.2244C6.11327 11.4037 5.81046 11.5 5.5 11.5C5.18954 11.5 4.88673 11.4037 4.6333 11.2244C4.37987 11.0452 4.1883 10.7917 4.085 10.499H2V9.49926H4.085ZM7.085 6.00012C7.1883 5.70743 7.37987 5.45397 7.6333 5.27469C7.88673 5.09542 8.18954 4.99914 8.5 4.99914C8.81046 4.99914 9.11327 5.09542 9.3667 5.27469C9.62013 5.45397 9.8117 5.70743 9.915 6.00012H12V6.99988H9.915C9.8117 7.29257 9.62013 7.54603 9.3667 7.72531C9.11327 7.90458 8.81046 8.00086 8.5 8.00086C8.18954 8.00086 7.88673 7.90458 7.6333 7.72531C7.37987 7.54603 7.1883 7.29257 7.085 6.99988H2V6.00012H7.085ZM4.085 2.50098C4.1883 2.20829 4.37987 1.95483 4.6333 1.77555C4.88673 1.59627 5.18954 1.5 5.5 1.5C5.81046 1.5 6.11327 1.59627 6.3667 1.77555C6.62013 1.95483 6.8117 2.20829 6.915 2.50098H12V3.50073H6.915C6.8117 3.79343 6.62013 4.04688 6.3667 4.22616C6.11327 4.40544 5.81046 4.50171 5.5 4.50171C5.18954 4.50171 4.88673 4.40544 4.6333 4.22616C4.37987 4.04688 4.1883 3.79343 4.085 3.50073H2V2.50098H4.085Z"
                      fill="#636363"
                    />
                  </svg>
                  Filter
                </button>

                {showFilterMenu && (
                  <div
                    ref={filterMenuRef}
                    className="absolute z-10 mt-2 w-64 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                  >
                    <div className="py-1 px-2">
                      <div className="py-2">
                        <select
                          className="block w-full rounded-md text-[12px] font-inter font-[500] py-2 pl-3 pr-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                          id="filter-field"
                          value={
                            appliedFilter ? Object.keys(appliedFilter)[0] : ""
                          }
                          onChange={(e) =>
                            handleAppliedFilterChange(e.target.value)
                          }
                        >
                          <option
                            value=""
                            disabled
                            className="text-[14px] font-inter font-[500]"
                          >
                            Select field
                          </option>
                          {tableColumns.map((column) => (
                            <option
                              key={column.field}
                              className="text-[12px] font-inter font-[500]"
                              value={column.field}
                            >
                              {column.headerName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Date filter specific controls */}
                      {appliedFilterType === "date" && enableDateFilters && (
                        <div className="py-2">
                          <select
                            className="block w-full rounded-md text-[12px] font-inter font-[500] py-2 pl-3 pr-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                            value={dateOperator}
                            onChange={(e) =>
                              setDateOperator(e.target.value as any)
                            }
                          >
                            <option value="equals">Equals</option>
                            <option value="before">Before</option>
                            <option value="after">After</option>
                            <option value="between">Between</option>
                          </select>
                        </div>
                      )}

                      {/* Regular filter input or start date for date filters */}
                      <div className="py-2">
                        {appliedFilterType === "date" && enableDateFilters ? (
                          <input
                            type="date"
                            id="filter-date"
                            value={startDate}
                            // onChange={(e) => handleFilterValueChange(e.target.value)}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="block w-full rounded-md border-reloadBorder border py-2 pl-3 pr-3 text-[12px] font-inter font-[500] 
                          focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                          />
                        ) : (
                          <input
                            type="text"
                            value={
                              appliedFilter &&
                              Object.keys(appliedFilter).length > 0
                                ? appliedFilter[Object.keys(appliedFilter)[0]]
                                : ""
                            }
                            id="filter-value"
                            onChange={(e) =>
                              handleFilterValueChange(e.target.value)
                            }
                            placeholder="Filter value"
                            className="block w-full rounded-md border-reloadBorder border py-2 pl-3 pr-3 text-[12px] font-inter font-[500] 
                          focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                          />
                        )}
                      </div>

                      {/* End date input for "between" date operator */}
                      {appliedFilterType === "date" &&
                        dateOperator === "between" &&
                        enableDateFilters && (
                          <div className="py-2">
                            <label className="block text-[12px] font-inter font-[500] mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              className="block w-full rounded-md border-reloadBorder border py-2 pl-3 pr-3 text-[12px] font-inter font-[500] 
                          focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                            />
                          </div>
                        )}

                      <div className="py-2">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-bgButton px-4 py-2 text-sm font-inter text-whiteColor font-[12px] shadow-sm focus:outline-none focus:ring-2 focus:ring-bgButton focus:ring-offset-2"
                          onClick={() => setAppliedFilter(null)}
                        >
                          Clear Filter
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Render density button before export if densityFirst is true */}
            {densityFirst && renderDensityButton()}

            {/* Export button */}
            <button
              className="flex items-center gap-2 text-[14px] font-inter font-[500] text-textHeading"
              onClick={exportToCSV}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.09961 11.9C2.09961 11.5134 2.41301 11.2 2.79961 11.2H11.1996C11.5862 11.2 11.8996 11.5134 11.8996 11.9C11.8996 12.2866 11.5862 12.6 11.1996 12.6H2.79961C2.41301 12.6 2.09961 12.2866 2.09961 11.9ZM4.40463 6.50502C4.678 6.23165 5.12122 6.23165 5.39458 6.50502L6.29961 7.41004L6.29961 2.09999C6.29961 1.71339 6.61301 1.39999 6.99961 1.39999C7.38621 1.39999 7.69961 1.71339 7.69961 2.09999L7.69961 7.41004L8.60463 6.50502C8.878 6.23165 9.32122 6.23165 9.59458 6.50502C9.86795 6.77839 9.86795 7.2216 9.59458 7.49497L7.49458 9.59497C7.36331 9.72624 7.18526 9.79999 6.99961 9.79999C6.81396 9.79999 6.63591 9.72624 6.50463 9.59497L4.40463 7.49497C4.13127 7.2216 4.13127 6.77839 4.40463 6.50502Z"
                  fill="#636363"
                />
              </svg>
              {!isMobile && (
                <span className="text-[14px] font-inter font-[500] text-textHeading">
                  Export
                </span>
              )}
            </button>

            {/* Render density button after export if densityFirst is false */}
            {!densityFirst && renderDensityButton()}
            </div>
            {/* Search box */}
          <div className="relative w-full sm:w-auto mt-2 sm:mt-0">
            <span className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-grey-border">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M6.39961 3.2001C4.6323 3.2001 3.19961 4.63279 3.19961 6.4001C3.19961 8.16741 4.6323 9.6001 6.39961 9.6001C8.16692 9.6001 9.59961 8.16741 9.59961 6.4001C9.59961 4.63279 8.16692 3.2001 6.39961 3.2001ZM1.59961 6.4001C1.59961 3.74913 3.74864 1.6001 6.39961 1.6001C9.05058 1.6001 11.1996 3.74913 11.1996 6.4001C11.1996 7.43676 10.871 8.39667 10.3122 9.18133L14.1653 13.0344C14.4777 13.3468 14.4777 13.8534 14.1653 14.1658C13.8529 14.4782 13.3463 14.4782 13.0339 14.1658L9.18084 10.3127C8.39618 10.8715 7.43627 11.2001 6.39961 11.2001C3.74864 11.2001 1.59961 9.05106 1.59961 6.4001Z"
                  fill="#949494"
                />
              </svg>
            </span>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-[12px] font-inter font-[400] text-cardTitle w-full sm:w-64 md:w-80 lg:w-96 xl:w-120"
            />
          </div>
          </div>
        )}
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="border-b border-gray-200 bg-background-grey">
              {selectedRows && <th className="p-4">
                <input
                  type="checkbox"
                  checked={selectedRows ? selectedRows.length === filteredData.length:false}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-btnBorder focus:ring-bgButton accent-bgButton"
                />
              </th>}
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
            {filteredData.slice(
                  (currentPage - 1) * currentPageSize,
                  currentPage * currentPageSize
                ).map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-200 bg-store-card"
              >
               {selectedRows && <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedRows ? selectedRows.includes(row.id): false}
                    onChange={() => handleSelectRow(row.id)}
                    className="h-4 w-4 rounded border border-gray-300 focus:ring-bgButton accent-bgButton"
                  />
                </td>}
                {tableColumns
                  .filter((column) => !hiddenColumns.includes(column.field))
                  .map((col) => (
                    <td
                      key={col.field}
                      className="p-4 text-[12px] font-inter font-[500] text-cardValue"
                    >
                      <div>
                        <div className="text-[14px] font-inter font-[500] text-cardValue leading-[21px]">
                          {col.type == 'jsx' ? row[col.field].jsx:row[col.field]}
                        </div>
                      </div>
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Desktop pagination */}
        {renderPagination()}
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
    </div>}</>
  
  );
};

export default TableTemplate;
