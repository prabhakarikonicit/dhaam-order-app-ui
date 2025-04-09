import React, {useEffect, useState} from 'react'
// Mobile view detection hook
const useMobileView = () => {
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 500);
      };
  
      checkMobile();
      window.addEventListener("resize", checkMobile);
  
      return () => window.removeEventListener("resize", checkMobile);
    }, []);
  
    return isMobile;
  };

  export default useMobileView;