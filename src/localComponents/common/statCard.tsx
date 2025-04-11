import React, { useState } from "react";
import { StatCardProps } from "../../types";

const StatCard = ({
  value,
  description,
  descriptionFirst = false,
  icon,
  fontWeight = "600",
}: StatCardProps) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    // Only toggle active state if descriptionFirst is true
    if (descriptionFirst) {
      setIsActive(!isActive);
    }
  };

  const fontWeightClass = fontWeight === "400" ? "font-[400]" : "font-[600]";

  return (
    <div
      className={`bg-white rounded-custom p-4 ${
        descriptionFirst && isActive
          ? "border-2 border-bgButton bg-bgButton"
          : "border border-grey-border"
      } ${descriptionFirst ? "cursor-pointer" : ""}`}
      onClick={handleClick}
    >
      {icon ? (
        // Layout with icon
        <div className="flex items-center space-x-3">
          <div
            className={`flex-shrink-0 border rounded-custom4px px-2 py-3 bg-background-grey ${
              descriptionFirst && isActive
                ? "bg-purple text-maroon"
                : "border-grey-border"
            }`}
          >
            <div
              className={descriptionFirst && isActive ? "text-bgButton" : ""}
            >
              <img src={icon} alt="icon" />
            </div>
          </div>
          <div>
            {descriptionFirst ? (
              <>
                <div
                  className={`text-[12px] font-inter ${fontWeightClass} ${
                    isActive ? "text-bgButton" : "text-headding-color"
                  }`}
                >
                  {description}
                </div>
                <div
                  className={`text-[22px] font-inter font-[600] ${
                    isActive ? "text-bgButton" : "text-cardValue"
                  }`}
                >
                  {value}
                </div>
              </>
            ) : (
              <>
                <div className="text-[16px] font-inter font-[600] text-cardValue">
                  {value}
                </div>
                <div
                  className={`text-[12px] font-inter ${fontWeightClass} text-headding-color`}
                >
                  {description}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        // Original centered layout without icon
        <div className="">
          {descriptionFirst ? (
            <>
              <div
                className={`text-[12px] font-inter ${fontWeightClass} ${
                  isActive ? "text-bgButton" : "text-headding-color"
                }`}
              >
                {description}
              </div>
              <div
                className={`text-[22px] font-inter font-[600] ${
                  isActive ? "text-bgButton" : "text-cardValue"
                }`}
              >
                {value}
              </div>
            </>
          ) : (
            <>
              <div className="text-[16px] font-inter font-[600] text-cardValue">
                {value}
              </div>
              <div
                className={`text-[12px] font-inter ${fontWeightClass} text-headding-color pb-0`}
              >
                {description}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
