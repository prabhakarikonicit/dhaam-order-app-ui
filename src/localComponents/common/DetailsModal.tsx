
import React, { useState, useEffect, useRef } from "react";
import Burger from "../../assets/images/burger.png"
import { Order } from "../../types";
interface Store {
  id: string;
  storeId: string;
  amount: string;

  name: string;
  address: string;
  rating: number;
  status: "Active" | "Inactive";
  items?: StoreItem[]; // Optional items for detailed view
}


interface StoreItem {
  name: string;
  quantity: number;
  price: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

// Unified Popover Component
const UnifiedPopover: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  data: Store | Order | null;
  type: "store" | "order";
  anchorEl: HTMLElement | null;
}> = ({ isOpen, onClose, data, type, anchorEl }) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !data || !anchorEl) return null;

  // Calculate position based on the anchor element
  const anchorRect = anchorEl.getBoundingClientRect();
  const popoverStyle = {
    top: `${anchorRect.bottom + window.scrollY + 5}px`,
    left: `${anchorRect.left + window.scrollX}px`,
  };

  // Render Order Popover Content
  const renderOrderContent = () => {
    const order = data as Order;
    const items = order.items || [];
    
    // Calculate total dynamically if items exist
    const calculateTotal = () => {
      if (items.length === 0) {
        // If no items, just use the order amount
        return order.amount;
      }
      
      // Otherwise calculate from items
      const total = items.reduce((sum, item) => {
        // Extract numeric value from price string (removing currency symbol)
        const priceValue = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        return sum + (priceValue * item.quantity);
      }, 0);
      
      // Format with same currency symbol as in the order amount
      const currencySymbol = order.amount.match(/[^0-9.]/g)?.[0] || '₹';
      return `${currencySymbol}${(total/2).toFixed(2)}`;
    };
    
    const total = calculateTotal();

    return (
      <>
        {/* Header */}
        <div className="flex justify-between items-center p-3 border-b">
          <h2 className="text-[14px] font-inter font-[400] text-cardValue">{order.orderId.value}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Item Ordered Section */}
        <div className="p-4">
          <h3 className="text-headding-color text-[12px] font-inter font-[500] mb-3">Item Ordered</h3>
          
          {/* Item list */}
          <div className="space-y-4">
            {items.length > 0 ? (
              items.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden mr-3 flex items-center justify-center">
                      <img 
                        src={Burger} 
                        alt={item.name} 
                        className="w-8 h-8"
                      />
                    </div>
                    <div>
                     <span> <p className="text-[12px] font-inter font-[500] text-cardValue">{item.name}</p>
                      <p className="text-[12px] font-inter font-[500] text-headding-color">x {item.quantity}</p></span>
                    </div>
                  </div>
                  <div className="text-[12px] font-inter font-[500] text-cardValue">{item.price}</div>
                </div>
              ))
            ) : (
              // If no items are available, show a message or fallback
              <div className="text-center py-2 text-gray-500">
                {order.status.value === "Completed" ? 
                  "Order completed" : 
                  "No item details available"}
              </div>
            )}
          </div>

          {/* Grand Total */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-grey-border">
            <span className="ftext-[12px] font-inter font-[500] text-cardValue">Grand Total</span>
            <span className="text-[12px] font-inter font-[500] text-cardValue">{total}</span>
          </div>
        </div>
      </>
    );
  };

  // Render Store Popover Content
  const renderStoreContent = () => {
    const store = data as Store;
    const items = store.items || [];
 // Calculate total dynamically if items exist
 const calculateTotal = () => {
  if (items.length === 0) {
    // If no items, just use the order amount
    return store.amount;
  }
  
  // Otherwise calculate from items
  const total = items.reduce((sum, item) => {
    // Extract numeric value from price string (removing currency symbol)
    const priceValue = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    return sum + (priceValue * item.quantity);
  }, 0);
  
  // Format with same currency symbol as in the order amount
  const currencySymbol = store.amount.match(/[^0-9.]/g)?.[0] || '₹';
  return `${currencySymbol}${(total/2).toFixed(2)}`;
};

const total = calculateTotal();
    return (
      <>
        {/* Store ID Header */}
        <div className="flex justify-between items-center p-3 border-b">
          <h2 className="text-headding-color text-[12px] font-inter font-[500] mb-3">{store.storeId}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Store Details Section */}
        <div className="p-4">
          {/* <h3 className="text-gray-600 font-medium mb-3">Store Information</h3>
          
  
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden mr-3 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Name</p>
                  <p className="text-gray-500 text-sm">{store.name}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden mr-3 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Address</p>
                  <p className="text-gray-500 text-sm">{store.address}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden mr-3 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Rating</p>
                  <p className="text-gray-500 text-sm flex items-center">
                    <span className="text-yellow-500 mr-1">★</span> {store.rating}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden mr-3 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8v8"></path>
                    <path d="M8 12h8"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Status</p>
                  <p className="text-gray-500 text-sm">
                    <span className={`px-2 py-1 rounded-md text-xs ${
                      store.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {store.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div> */}

          {/* Popular Items Section (if items exist) */}
          {items.length > 0 && (
            <div>
              <div className="flex justify-between items-center  ">
                <span className="text-headding-color text-[12px] font-inter font-[500] mb-3">Store Items</span>
              </div>
              
      
              <div className="space-y-4 mt-3">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden mr-3 flex items-center justify-center">
                        <img 
                          src={Burger} 
                          alt={item.name} 
                          className="w-8 h-8"
                        />
                      </div>
                      <div>
                     <span> <p className="text-[12px] font-inter font-[500] text-cardValue">{item.name}</p>
                      <p className="text-[12px] font-inter font-[500] text-headding-color">x {item.quantity}</p></span>
                    </div>
                  </div>
                  <div className="text-[12px] font-inter font-[500] text-cardValue">{item.price}</div>
                  </div>
                  
                ))}
                 <div className="flex justify-between items-center mt-4 pt-4 border-t border-grey-border">
    <span className="text-[12px] font-inter font-[500] text-cardValue">Grand Total</span>
    <span className="text-[12px] font-inter font-[500] text-cardValue">{total}</span>
  </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div 
      ref={popoverRef}
      className="fixed z-50 bg-white rounded-lg shadow-xl w-[300px] border border-gray-200"
      style={popoverStyle}
    >
      {type === "order" ? renderOrderContent() : renderStoreContent()}
    </div>
  );
};

// For backward compatibility, provide these exported components
export const OrderPopover: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  anchorEl: HTMLElement | null;
}> = (props) => {
  return (
    <UnifiedPopover
      isOpen={props.isOpen}
      onClose={props.onClose}
      data={props.order}
      type="order"
      anchorEl={props.anchorEl}
    />
  );
};

export const StorePopover: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  store: Store | null;
  anchorEl: HTMLElement | null;
}> = (props) => {
  return (
    <UnifiedPopover
      isOpen={props.isOpen}
      onClose={props.onClose}
      data={props.store}
      type="store"
      anchorEl={props.anchorEl}
    />
  );
};

export default UnifiedPopover;