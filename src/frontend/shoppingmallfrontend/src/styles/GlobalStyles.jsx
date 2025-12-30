import { Global, css } from "@emotion/react";
import { useSelector } from "react-redux";

const GlobalStyles = () => {
    const isDark = useSelector((state) => state.theme?.isDark ?? false);
    const globalStyles = css`
    :root {
      --mainBG: ${isDark ? "#23272b" : "#ffffff"};
      --subBG: ${isDark ? "#282C30" : "#f9f9f9"};
      --fontColor : ${isDark ? "#ffffff" : "#000000"};
      --outLine: ${isDark ? "#35393d" : "#e1e1e1"};
      --reverseFontColor : ${isDark ? "#000000" : "#ffffff"};
      --reverseMainBG : ${isDark ? "#f9f9f9" : "#282C30"};
      --primary : #79d7f3;
      --primaryHover : #0882f3; 
      // var(--MainBG);
      // var(--SubBG);
      // var(--fontColor);
      // var(--outline);

    }
  `;

    return <Global styles={globalStyles} />;
};

export default GlobalStyles;