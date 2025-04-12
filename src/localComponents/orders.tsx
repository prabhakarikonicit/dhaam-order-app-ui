import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import TableTemplate from "./common/tableTemplate";
import CustomModal from "./common/modals";
import UnifiedPopover from "./common/DetailsModal";
import { FieldDefinition, Order, TableColumns } from "../types";
import StatCard from "./common/statCard";
import newOrderIcon from "../assets/images/newOrderIcon.svg";
import allOrdersIcon from "../assets/images/allOrdersIcon.svg";
import pendingIcon from "../assets/images/pendingIcon.svg";
import dispatchedIcon from "../assets/images/dispatchedIcon.svg";
import completedIcon from "../assets/images/completedIcon.svg";
import cancelledIcon from "../assets/images/cancelledIcon.svg";
import { fetchOrders } from "../api";
const Orders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const storesDropdownRef = useRef<HTMLDivElement>(null);
  const [storesDropdownOpen, setStoresDropdownOpen] = useState(false);
  const actionsDropdownRef = useRef<HTMLDivElement>(null);
  const [actionsDropdownOpen, setActionsDropdownOpen] = useState(false);
  // Function to render status with appropriate styling
  const renderStatus = (value: string) => {
    // Status styles for status badges
    const statusStyles: {
      [key: string]: {
        textColor: string;
        bgColor: string;
      };
    } = {
      Pending: {
        textColor: "text-yellow",
        bgColor: "bg-orangeColor",
      },
      Completed: {
        textColor: "text-green",
        bgColor: "bg-customBackgroundColor",
      },
      "Out for delivery": {
        textColor: "text-primary",
        bgColor: "bg-primary",
      },
      Cancelled: {
        textColor: "text-maroon",
        bgColor: "bg-bgCrossIcon",
      },
    };

    // Reject icon (red X)
    const rejectIcon = (
      <div className="flex justify-center items-center w-8 h-8 rounded-custom border border-borderCrossIcon bg-bgCrossIcon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="14"
          viewBox="0 0 15 14"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.50501 3.00501C3.77838 2.73165 4.2216 2.73165 4.49496 3.00501L7.49999 6.01004L10.505 3.00501C10.7784 2.73165 11.2216 2.73165 11.495 3.00501C11.7683 3.27838 11.7683 3.7216 11.495 3.99496L8.48994 6.99999L11.495 10.005C11.7683 10.2784 11.7683 10.7216 11.495 10.995C11.2216 11.2683 10.7784 11.2683 10.505 10.995L7.49999 7.98994L4.49496 10.995C4.2216 11.2683 3.77838 11.2683 3.50501 10.995C3.23165 10.7216 3.23165 10.2784 3.50501 10.005L6.51004 6.99999L3.50501 3.99496C3.23165 3.7216 3.23165 3.27838 3.50501 3.00501Z"
            fill="#620E0E"
          />
        </svg>
      </div>
    );

    // Accept icon (green checkmark)
    const acceptIcon = (
      <div className="flex justify-center items-center w-8 h-8 rounded-custom border border-borderGreeen bg-customBackgroundColor ml-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="14"
          viewBox="0 0 15 14"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12.1949 3.70503C12.4683 3.97839 12.4683 4.42161 12.1949 4.69497L6.59495 10.295C6.32158 10.5683 5.87837 10.5683 5.605 10.295L2.805 7.49497C2.53163 7.22161 2.53163 6.77839 2.805 6.50503C3.07837 6.23166 3.52158 6.23166 3.79495 6.50503L6.09998 8.81005L11.205 3.70503C11.4784 3.43166 11.9216 3.43166 12.1949 3.70503Z"
            fill="#125E1B"
          />
        </svg>
      </div>
    );

    // For rows that should show status text badges (Pending, Completed, Out for delivery, Cancelled)
    if (
      value &&
      ["Pending", "Completed", "Cancelled", "Out for delivery"].includes(value)
    ) {
      const statusConfig = statusStyles[value] || {
        textColor: "text-gray-600",
        bgColor: "bg-gray-100",
      };

      return (
        <div
          className={`px-3 py-1 rounded-custom80px  ${statusConfig.bgColor} ${statusConfig.textColor} 
          font-inter text-[12px] font-[600] whitespace-nowrap inline-block`}
        >
          {value}
        </div>
      );
    }

    // For rows that should show the reject/accept icons (empty status value)
    return (
      <div className="flex items-center">
        {rejectIcon}
        {acceptIcon}
      </div>
    );
  };

  // Function to render payment method with appropriate styling
  const renderPaymentMethod = (method: string, orderId: string) => {
    let styleClass = "";
    let widthClass = "";

    // Safe approach to determine styles based on method value
    if (method === "Cash") {
      styleClass =
        "bg-bgActive rounded-custom4x text-customWhiteColor font-inter font-[600] ";
      widthClass = "w-16";
    } else if (method === "UPI") {
      styleClass =
        "bg-yellow rounded-custom4x text-yellow font-inter font-[600]";
      widthClass = "w-16";
    } else if (method === "Credit Card") {
      styleClass =
        "bg-blueCredit rounded-custom4x text-primaryCredit font-inter font-[600]";
      widthClass = "w-32";
    }

    return (
      <div
        className={`py-1 px-2 text-center whitespace-nowrap rounded-lg font-inter text-[14px] font-[500] ${styleClass} ${widthClass}`}
        onClick={
          method === "Cash" ? () => handleOpenPaymentModal(orderId) : undefined
        }
        role={method === "Cash" ? "button" : undefined}
        aria-label={method === "Cash" ? "View payment details" : undefined}
      >
        {method}
      </div>
    );
  };

  const renderOrderId = (value: string, orderId: string) => {
    return (
      <div className="flex items-center text-cardValue font-inter font-[500] text-[12px]">
        {value}
        <button
          className="ml-2"
          onClick={(e) => handleOrderIdClick(e, orderId)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.23431 5.83432C4.54673 5.5219 5.05327 5.5219 5.36569 5.83432L8 8.46864L10.6343 5.83432C10.9467 5.5219 11.4533 5.5219 11.7657 5.83432C12.0781 6.14674 12.0781 6.65327 11.7657 6.96569L8.56569 10.1657C8.25327 10.4781 7.74673 10.4781 7.43431 10.1657L4.23431 6.96569C3.9219 6.65327 3.9219 6.14674 4.23431 5.83432Z"
              fill="#2B2B2B"
            />
          </svg>
        </button>
      </div>
    );
  };

  const renderDeliveryMode = (value: string) => {
    return (
      <div>
        <div className="text-[12px] font-inter font-[600] text-headding-color whitespace-nowrap overflow-hidden text-ellipsis bg-subMenus p-1 rounded-custom80px text-center">
          {value}
        </div>
      </div>
    );
  };

  const renderScheduleTime = (date: string, time: string) => {
    return (
      <div className="flex items-center justify-between w-[96px]  pr-1 mr-3">
        <div>
          <div className="text-[14px] font-inter  w-[80px]  font-[500] text-cardValue leading-[21px] mr-4">
            {date}
          </div>
          <div className="text-[11px] font-[400] font-inter text-cardTitle">
            {time}
          </div>
        </div>
        <div className="text-gray-500 ps-0 md:p-0 sm:p-0 lg:p-0 xl:p-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.37689 5.83441C4.68931 5.52199 5.19584 5.52199 5.50826 5.83441L8.14258 8.46873L10.7769 5.83441C11.0893 5.52199 11.5958 5.52199 11.9083 5.83441C12.2207 6.14683 12.2207 6.65336 11.9083 6.96578L8.70826 10.1658C8.39584 10.4782 7.88931 10.4782 7.57689 10.1658L4.37689 6.96578C4.06447 6.65336 4.06447 6.14683 4.37689 5.83441Z"
              fill="#2B2B2B"
            />
          </svg>
        </div>
      </div>
    );
  };

  const preparePaymentDetails = () => {
    if (!selectedOrder) return undefined;

    // Create sample items for the order (simulate what would come from your data)
    const items = [
      {
        name: "Chicken Burger",
        quantity: 2,
        price: "₹100.00",
      },
      {
        name: "Chicken Burger",
        quantity: 2,
        price: "₹100.00",
      },
      {
        name: "Chicken Burger",
        quantity: 2,
        price: "₹100.00",
      },
    ];

    return {
      orderId: selectedOrder.orderId,
      paymentMethod: selectedOrder.paymentMethod,
      items: items,
      total: "₹300.00",
      store: selectedOrder.store,
      storeAddress: "Queenstown Public House",
      deliveryAddress: selectedOrder.deliveryAddress,
    };
  };
  const [orders, setOrders] = useState<Order[]>([]);
  // Modal field definitions
  const modalFields: FieldDefinition[] = [
    {
      id: "store",
      label: "Store",
      type: "select",
      options: [
        { value: "Queenstown Public House", label: "Queenstown Public House" },
        { value: "Plumed Horse", label: "Plumed Horse" },
        { value: "King Lee's", label: "King Lee's" },
      ],
      required: true,
    },
    { id: "amount", label: "Amount", type: "text", required: true },
    {
      id: "deliveryAddress",
      label: "Delivery Address",
      type: "text",
      required: true,
    },
    {
      id: "deliveryMode",
      label: "Delivery Mode",
      type: "select",
      options: [
        { value: "Home delivery", label: "Home delivery" },
        { value: "Pickup", label: "Pickup" },
      ],
      required: true,
    },
    {
      id: "scheduleDate",
      label: "Schedule Date",
      type: "date",
      required: true,
    },
    {
      id: "scheduleTime",
      label: "Schedule Time",
      type: "time",
      required: true,
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "Pending", label: "Pending" },
        { value: "Completed", label: "Completed" },
        { value: "Dispatched", label: "Dispatched" },
        { value: "Cancelled", label: "Cancelled" },
        { value: "Out for delivery", label: "Out for delivery" },
      ],
      required: true,
    },
    {
      id: "paymentMethod",
      label: "Payment Method",
      type: "select",
      options: [
        { value: "Cash", label: "Cash" },
        { value: "UPI", label: "UPI" },
        { value: "Credit Card", label: "Credit Card" },
      ],
      required: true,
    },
    { id: "createdDate", label: "Created Date", type: "date", required: true },
  ];
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(
    null
  );
  const [popoverOrder, setPopoverOrder] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalMode, setModalMode] = useState<
    "add" | "edit" | "view" | "payment"
  >("add");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const columns: TableColumns[] = [
    {
      field: "orderId",
      headerName: "Order ID",
      type: "jsx",
      sort: true,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "text",
    },
    {
      field: "status",
      headerName: "Status",
      type: "jsx",
    },
    {
      field: "store",
      headerName: "Store",
      type: "text",
      sort: true,
    },
    {
      field: "deliveryAddress",
      headerName: "Delivery Address",
      type: "text",
    },
    {
      field: "deliveryMode",
      headerName: "Delivery Mode",
      type: "jsx",
    },
    {
      field: "scheduledDateTime",
      headerName: "Schedule Time",
      type: "jsx",
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      type: "date",
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      type: "jsx",
    },
  ];

  const handleOrderIdClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    orderId: string
  ) => {
    event.stopPropagation();
    const foundOrder = orders.find((order) => order.id == orderId);
    if (foundOrder) {
      const orderWithItems = {
        ...foundOrder,
        items: [
          {
            name: "Chicken Burger",
            quantity: 2,
            price: "₹100.00",
          },
          {
            name: "Chicken Burger",
            quantity: 2,
            price: "₹100.00",
          },
          {
            name: "Chicken Burger",
            quantity: 2,
            price: "₹100.00",
          },
        ],
      };
      setPopoverAnchorEl(event.currentTarget);
      setPopoverOrder(orderWithItems);
      setPopoverOpen(true);
    }
  };

  // Function to render payment method with appropriate styling

  // Handler for opening the payment modal
  const handleOpenPaymentModal = (orderId: string) => {
    const foundOrder = orders.find((order) => order.id == orderId);
    if (foundOrder) {
      setSelectedOrder(foundOrder);
      setModalMode("payment");
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverOpen &&
        popoverAnchorEl &&
        event.target instanceof Node &&
        !popoverAnchorEl.contains(event.target)
      ) {
        setPopoverOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverOpen, popoverAnchorEl]);

  const fetchOrdersApi = async () => {
    // fetch orders api
    setIsLoading(true)
    const ordersResp = await fetchOrders();
    const ordersTemp: Order[] = ordersResp.map((item) => ({
      id: item.id,
      orderId: {
        jsx: renderOrderId(item.orderId, item.id),
        value: item.orderId,
      },
      amount: item.amount,
      status: {
        jsx: renderStatus(item.status),
        value: item.status == "" ? "New" : item.status,
      },
      store: item.store,
      deliveryAddress: item.deliveryAddress,
      deliveryMode: {
        jsx: renderDeliveryMode(item.deliveryMode),
        value: item.deliveryMode,
      },
      scheduledDateTime: {
        jsx: renderScheduleTime(item.scheduledDate, item.scheduledTime),
        value: `${item.scheduledDate}-${item.scheduledTime}`,
      },
      paymentMethod: {
        jsx: renderPaymentMethod(item.paymentMethod, item.id),
        value: item.paymentMethod,
      },
      createdDate: item.createdDate,
    }));
    setOrders(ordersTemp);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchOrdersApi();
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionsDropdownRef.current &&
        !actionsDropdownRef.current.contains(event.target as Node)
      ) {
        setActionsDropdownOpen(false);
      }
      if (
        storesDropdownRef.current &&
        !storesDropdownRef.current.contains(event.target as Node)
      ) {
        setStoresDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreateOrder = () => {
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleSave = (data: any) => {
    if (modalMode === "payment") {
      // Handle saving changes from the payment modal
      console.log("Saving payment changes:", data);

      // Here you would update the order status or other details as needed
      if (selectedOrder) {
        const updatedOrders = orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: data.status || order.status }
            : order
        );
        setOrders(updatedOrders);
      }
    } else if (modalMode === "add") {
      const newOrderID = `#${Math.floor(10000 + Math.random() * 90000)}`;
      const newId = Math.random().toString(36).substr(2, 9);
      const newStatus = data.status as
        | "Pending"
        | "Completed"
        | "Dispatched"
        | "Cancelled"
        | "Out for delivery";
      const newPaymentMethod = data.paymentMethod as
        | "Cash"
        | "UPI"
        | "Credit Card";
      const newOrder: Order = {
        id: newId,
        orderId: { jsx: renderOrderId(newOrderID, newId), value: newOrderID },
        amount: `₹${parseFloat(data.amount).toFixed(2)}`,
        status: {
          jsx: renderStatus(newStatus),
          value: newStatus,
        },
        store: data.store,
        deliveryAddress: data.deliveryAddress,
        deliveryMode: {
          jsx: renderDeliveryMode(data.deliveryMode),
          value: data.deliveryMode,
        },
        scheduledDateTime: {
          jsx: renderScheduleTime(data.scheduleDate, data.scheduleTime),
          value: `${data.scheduleDate}-${data.scheduleTime}`,
        },
        paymentMethod: {
          jsx: renderPaymentMethod(newPaymentMethod, newId),
          value: newPaymentMethod,
        },
        createdDate: data.createdDate || new Date().toISOString().split("T")[0],
      };
      setOrders((prev) => [...prev, newOrder]);
    } else if (modalMode === "edit") {
      // Handle edit functionality
      if (selectedOrder) {
        const updatedOrders = orders.map((order) =>
          order.id === selectedOrder.id ? { ...order, ...data } : order
        );
        setOrders(updatedOrders);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <>
    {isLoading && <div>Loading orders.....</div>}
    {!isLoading && <div className="p-0 max-w-full rounded-lg p-1 md:p-6 lg:p-0 xl:p-0 sm:max-h-full md:max-h-full lg:max-h-full xl:max-h-full max-h-[80vh] overflow-y-auto bg-background-grey">
      {/* Header with search and buttons */}
      <div className="flex justify-between items-center mb-6 px-8 pt-8 ">
        <h1 className="text-[16px] md:text-[20px] lg:text-[20px] sm:text-[20px] xl:text-[20px] font-inter font-[600] text-cardValue">
          Orders
        </h1>

        <div className="flex items-center space-x-2">
          {/* Search field */}
          <div className="relative mr-2 bg-backgroundWhite border border-reloadBorder p-2 rounded-custom">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clip-path="url(#clip0_6819_55)">
                <path
                  d="M14.66 15.6599C13.352 16.9694 11.6305 17.7848 9.78879 17.9673C7.94705 18.1497 6.09901 17.688 4.55952 16.6607C3.02004 15.6334 1.88436 14.1042 1.34597 12.3334C0.807587 10.5627 0.899804 8.66009 1.60691 6.94973C2.31402 5.23937 3.59227 3.8271 5.22389 2.95351C6.85551 2.07992 8.73954 1.79908 10.555 2.15882C12.3705 2.51856 14.005 3.49664 15.1802 4.92641C16.3554 6.35618 16.9985 8.14919 17 9.99995H15C15.0012 8.61175 14.521 7.26608 13.6413 6.19224C12.7615 5.1184 11.5366 4.38285 10.1753 4.11091C8.81404 3.83898 7.40056 4.04749 6.17577 4.70092C4.95098 5.35436 3.99066 6.41227 3.45845 7.6944C2.92625 8.97653 2.85509 10.4035 3.25711 11.7322C3.65913 13.061 4.50944 14.2092 5.66315 14.9812C6.81687 15.7532 8.20259 16.1013 9.58419 15.9662C10.9658 15.831 12.2578 15.2209 13.24 14.2399L14.66 15.6599ZM12 9.99995H20L16 13.9999L12 9.99995Z"
                  fill="#636363"
                />
              </g>
              <defs>
                <clipPath id="clip0_6819_55">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>

          {/* All stores dropdown */}
          <div className="relative mr-2" ref={storesDropdownRef}>
            <button
              className="bg-backgroundWhite rounded-custom px-4 py-2 flex items-center text-menuSubHeadingColor font-inter text-[10px] md:text-[12px] lg:text-[12px] sm:text-[12px] xl:text-[12px] font-[500] border border-reloadBorder shadow-sm"
              onClick={() => setStoresDropdownOpen(!storesDropdownOpen)}
            >
              All stores
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>

            {storesDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-custom border border-reloadBorder w-43 z-10">
                <div className="py-1">
                  <a
                    href="#"
                    className="block px-4 py-2 text-menuSubHeadingColor font-inter text-[12px] font-[500]"
                  >
                    All stores
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2  whitespace-nowrap text-menuSubHeadingColor font-inter text-[12px] font-[500]"
                  >
                    Public House
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2  whitespace-nowrap text-menuSubHeadingColor font-inter text-[12px] font-[500]"
                  >
                    Plumed Horse
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-menuSubHeadingColor font-inter text-[12px] font-[500]"
                  >
                    King Lee's
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* More actions dropdown */}
          <div className="relative mr-2" ref={actionsDropdownRef}>
            <button
              className="bg-backgroundWhite rounded-custom px-4 py-2 flex items-center text-menuSubHeadingColor font-inter text-[10px] md:text-[12px] lg:text-[12px] sm:text-[12px] xl:text-[12px] font-[500] border border-reloadBorder shadow-sm"
              onClick={() => setActionsDropdownOpen(!actionsDropdownOpen)}
            >
              More actions
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>

            {actionsDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-custom border border-reloadBorder w-43 z-10">
                <div className="py-1">
                  <a
                    href="#"
                    className="block px-4 py-2 text-menuSubHeadingColor font-inter text-[12px] font-[500]"
                  >
                    Import orders
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-menuSubHeadingColor whitespace-nowrap font-inter text-[12px] font-[500]"
                  >
                    Create new view
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-menuSubHeadingColor font-inter text-[12px] font-[500]"
                  >
                    Hide analytics
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Create order button */}
          <button
            className="bg-bgButton text-whiteColor font-inter text-[10px] md:text-[12px] lg:text-[12px] sm:text-[12px] xl:text-[12px] font-[600] border border-btnBorder rounded-md px-4 py-2 flex items-center shadow-sm"
            onClick={handleCreateOrder}
          >
            Create order
            <Plus className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 sm:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 gap-2  bg-backgroundWhite mx-8 p-4  rounded-custom8px">
        <StatCard
          value="213"
          description="New Orders"
          descriptionFirst={true}
          icon={newOrderIcon}
        />
        <StatCard
          value="245"
          description="All Orders"
          descriptionFirst={true}
          icon={allOrdersIcon}
        />
        <StatCard
          value="111"
          description="Pending"
          descriptionFirst={true}
          icon={pendingIcon}
        />
        <StatCard
          value="164"
          description="Dispatched"
          descriptionFirst={true}
          icon={dispatchedIcon}
        />
        <StatCard
          value="255"
          description="Completed"
          descriptionFirst={true}
          icon={completedIcon}
        />
        <StatCard
          value="25"
          description="Cancelled"
          descriptionFirst={true}
          icon={cancelledIcon}
        />
      </div>
      <TableTemplate
        tableColumns={columns}
        tableData={orders}
        enableDateFilters={true}
        densityFirst={true}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        pageSize={10}
        searchPlaceholder="Search Order"
      />
      <UnifiedPopover
        isOpen={popoverOpen}
        onClose={() => setPopoverOpen(false)}
        data={popoverOrder}
        type="order"
        anchorEl={popoverAnchorEl}
      />
      {isModalOpen &&
        (modalMode === "payment" ? (
          <CustomModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            mode="payment"
            onSave={() => null}
            title={selectedOrder?.orderId.value || "Order Details"}
            size="sm"
            showFooter={true}
            paymentDetails={preparePaymentDetails()}
            confirmText="Save"
          />
        ) : (
          <CustomModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            mode={modalMode}
            onSave={handleSave}
            title={modalMode === "add" ? "Create Order" : "Edit Order"}
            fields={modalFields}
            size="sm"
            showToggle={false}
            confirmText={modalMode === "add" ? "Create" : "Save"}
          />
        ))}
    </div>}
    </>
    
  );
};

export default Orders;
