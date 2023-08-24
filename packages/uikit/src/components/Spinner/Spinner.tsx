import React from "react";
import { SpinnerProps } from "./types";
import { Box } from "../Box";
import { Image } from "../Image";

const Spinner: React.FC<React.PropsWithChildren<SpinnerProps>> = ({ size = 128 }) => {
  return (
    <Box width={size} height={size * 1.197} position="relative">
      <Image width={size} height={size * 1.197} src="./dinausaur.gif" alt="leviathan-gif" />
    </Box>
  );
};

export default Spinner;
