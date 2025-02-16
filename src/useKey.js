import { useEffect } from "react";
export function useKey(keyValue, callBack) {
    useEffect(() => {
        function handleKeyPress(e) {
            if (e.code.toLowerCase() === keyValue.toLowerCase()) {
                console.log(e.code)
                callBack?.();
                console.log("Side effect running to go back");
            }
        }

        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [callBack, keyValue]); 
   
}