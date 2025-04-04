import React, { useState } from "react";
import TableTemplate from "./common/tableTemplate";
import CustomModal from "./common/modals";
import { Order, TableColumns } from "../types";
const Orders = () => {

  const renderStatus = (status: string) => {
    const statusStyles: { [key: string]: string } = {
      Pending: "bg-[#FFF7E6] text-[#DD9E06] border border-[#F5D78E]",
      Completed: "bg-[#EAF8E9] text-[#1A8917] border border-[#A5E0A2]",
      Dispatched: "bg-[#E9F1FB] text-[#3172D7] border border-[#A0C5F7]",
      Cancelled: "bg-[#FFEAEA] text-[#DD0606] border border-[#F7A0A0]",
      "Out for delivery": "bg-[#EAE9FB] text-[#3F31D7] border border-[#C3A0F7]",
    };

    return (
      <div
        className={`px-3 py-1 text-center rounded-custom4px font-inter text-[12px] font-[500] ${
          statusStyles[status] || ""
        }`}
      >
        {status}
      </div>
    );
  };
  const renderPaymentMethod = (method: string, orderId:string) => {
    const methodStyles: { [key: string]: string } = {
      Cash: "bg-[#1A8917] text-white cursor-pointer hover:bg-[#157512]",
      UPI: "bg-[#DD9E06] text-white",
      "Credit Card": "bg-[#3172D7] text-white",
    };

    // Only make Cash payment method clickable
    if (method === "Cash") {
      return (
        <div
          className={`py-1 text-center rounded-custom4px font-inter text-[12px] font-[500] ${
            methodStyles[method] || ""
          }`}
          onClick={() => handleOpenPaymentModal(orderId)}
          role="button"
          aria-label="View payment details"
        >
          {method}
        </div>
      );
    }

    return (
      <div
        className={`px-3 py-1 text-center rounded-custom4px font-inter text-[12px] font-[500] ${
          methodStyles[method] || ""
        }`}
      >
        {method}
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
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderId: "#20345",
      amount: "₹100.00",
      status: renderStatus("Completed"),
      store: "Queenstown Public House",
      deliveryAddress: "6391 Elgin St. Celina, Delaware 10299",
      deliveryMode: "Home delivery",
      scheduleTime: "06:30 PM",
      scheduleDate: "January 26",
      paymentMethod: renderPaymentMethod("Cash", '1'),
      createdDate: "2025-02-12",
    },
    {
      id: '2',
      orderId: "#20345",
      amount: "₹100.00",
      status: renderStatus("Pending"),
      store: "Plumed Horse",
      deliveryAddress: "8502 Preston Rd. Inglewood, Maine 98380",
      deliveryMode: "Home delivery",
      scheduleTime: "06:30 PM",
      scheduleDate: "January 26",
      paymentMethod: renderPaymentMethod("UPI", '2'),
      createdDate: "2025-02-15",
    },
    {
      id: "3",
      orderId: "#20345",
      amount: "₹100.00",
      status: renderStatus("Dispatched"),
      store: "King Lee's",
      deliveryAddress: "3517 W. Gray St. Utica, Pennsylvania 57867",
      deliveryMode: "Home delivery",
      scheduleTime: "06:30 PM",
      scheduleDate: "January 26",
      paymentMethod: renderPaymentMethod("Credit Card", '3'),
      createdDate: "2025-02-18",
    },
    {
      id: "4",
      orderId: "#20345",
      amount: "₹100.00",
      status: renderStatus("Cancelled"),
      store: "Marina Kitchen",
      deliveryAddress: "4140 Parker Rd. Allentown, New Mexico 31134",
      deliveryMode: "Home delivery",
      scheduleTime: "06:30 PM",
      scheduleDate: "January 26",
      paymentMethod: renderPaymentMethod("Cash", '4'),
      createdDate: "2025-02-20",
    },
    {
      id: "5",
      orderId: "#20345",
      amount: "₹100.00",
      status: renderStatus("Out for delivery"),
      store: "The Aviary",
      deliveryAddress: "4517 Washington Ave. Manchester, Kentucky 39495",
      deliveryMode: "Home delivery",
      scheduleTime: "06:30 PM",
      scheduleDate: "January 26",
      paymentMethod: renderPaymentMethod("UPI", '5'),
      createdDate: "2025-02-22",
    },
    {
      id: "6",
      orderId: "#20345",
      amount: "₹100.00",
      status: renderStatus("Pending"),
      store: "Crab Hut",
      deliveryAddress: "2715 Ash Dr. San Jose, South Dakota 83475",
      deliveryMode: "Home delivery",
      scheduleTime: "06:30 PM",
      scheduleDate: "January 26",
      paymentMethod: renderPaymentMethod("Credit Card", '6'),
      createdDate: "2025-02-24",
    },
    {
      id: "7",
      orderId: "#20345",
      amount: "₹100.00",
      status: renderStatus("Completed"),
      store: "Brass Tacks",
      deliveryAddress: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
      deliveryMode: "Home delivery",
      scheduleTime: "06:30 PM",
      scheduleDate: "January 26",
      paymentMethod: renderPaymentMethod("Cash", '7'),
      createdDate: "2025-02-25",
    },
    {
      id: "8",
      orderId: "#20345",
      amount: "₹100.00",
      status: renderStatus("Out for delivery"),
      store: "Bean Around the World Coffees",
      deliveryAddress: "2715 Ash Dr. San Jose, South Dakota 83475",
      deliveryMode: "Home delivery",
      scheduleTime: "06:30 PM",
      scheduleDate: "January 26",
      paymentMethod: renderPaymentMethod("UPI", '8'),
      createdDate: "2025-02-26",
    },
    {
      id: "9",
      orderId: "#20345",
      amount: "₹100.00",
      status: renderStatus("Cancelled"),
      store: "Chewy Balls",
      deliveryAddress: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
      deliveryMode: "Home delivery",
      scheduleTime: "06:30 PM",
      scheduleDate: "January 26",
      paymentMethod: renderPaymentMethod("Credit Card", '9'),
      createdDate: "2025-02-27",
    },
    {
      id: "10",
      orderId: "#20345",
      amount: "₹100.00",
      status: renderStatus("Out for delivery"),
      store: "Proxi",
      deliveryAddress: "2118 Thornridge Cir. Syracuse, Connecticut 35624",
      deliveryMode: "Home delivery",
      scheduleTime: "06:30 PM",
      scheduleDate: "January 26",
      paymentMethod: renderPaymentMethod("Cash", '10'),
      createdDate: "2025-02-28",
    },
  ]);
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
      type: "text",
      // renderCell: (value, row) => (
      //   <div className="flex items-center">
      //     {value}
      //     <button className="ml-2" onClick={(e) => handleOrderIdClick(e, row)}>
      //       <svg
      //         xmlns="http://www.w3.org/2000/svg"
      //         width="16"
      //         height="16"
      //         viewBox="0 0 16 16"
      //         fill="none"
      //       >
      //         <path
      //           fillRule="evenodd"
      //           clipRule="evenodd"
      //           d="M4.23431 5.83432C4.54673 5.5219 5.05327 5.5219 5.36569 5.83432L8 8.46864L10.6343 5.83432C10.9467 5.5219 11.4533 5.5219 11.7657 5.83432C12.0781 6.14674 12.0781 6.65327 11.7657 6.96569L8.56569 10.1657C8.25327 10.4781 7.74673 10.4781 7.43431 10.1657L4.23431 6.96569C3.9219 6.65327 3.9219 6.14674 4.23431 5.83432Z"
      //           fill="#2B2B2B"
      //         />
      //       </svg>
      //     </button>
      //   </div>
      // ),
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "text",
    },
    {
      field: "status",
      headerName: "Status",
      type: "text",
    },
    {
      field: "store",
      headerName: "Store",
      type: "text",
    },
    {
      field: "deliveryAddress",
      headerName: "Delivery Address",
      type: "text",
    },
    {
      field: "deliveryMode",
      headerName: "Delivery Mode",
      type: "text",
    },
    {
      field: "scheduleTime",
      headerName: "Schedule Time",
      type: "text",
      // renderCell: (value, row) => (
      //   <div>
      //     <div className="text-[14px] font-inter font-[500] text-cardValue leading-[21px]">
      //       {row.scheduleDate}
      //     </div>
      //     <div className="text-[11px] font-[400] font-inter text-cardTitle ">
      //       {value}
      //     </div>
      //   </div>
      // ),
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      type: "date",
      // renderCell: (value, row) => (
      //   <div className="text-[14px] font-inter font-[500] text-cardValue">
      //     {value}
      //   </div>
      // ),
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      type: "text",
      // renderCell: (value, row) => renderPaymentMethod(value, row),
    },
  ];

  const handleOrderIdClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    order: Order
  ) => {
    event.stopPropagation();

    const orderWithItems = {
      ...order,
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
  };

  // Function to render payment method with appropriate styling
  
  // Handler for opening the payment modal
  const handleOpenPaymentModal = (orderId: string) => {
    const foundOrder = orders.find(order => order.id == orderId);
    if(foundOrder){
      setSelectedOrder(foundOrder);
      setModalMode("payment");
      setIsModalOpen(true);

    }
    
  };
  return (
  <>
  <TableTemplate tableColumns={columns} tableData={orders}/>
  {isModalOpen &&
        (modalMode === "payment" ? (
          <CustomModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            mode="payment"
            onSave={() => null}
            title={selectedOrder?.orderId || "Order Details"}
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
            onSave={() => null}
            title={modalMode === "add" ? "Create Order" : "Edit Order"}
            fields={[]}
            size="sm"
            showToggle={false}
            confirmText={modalMode === "add" ? "Create" : "Save"}
          />
        ))}

  </>)
  
};

export default Orders;
