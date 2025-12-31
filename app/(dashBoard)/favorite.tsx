import React from "react";

import WrapDashboard from "../../components/home/WrapDashboard";
import ListFavorites from "@/components/home/ListFavorites";

const Favorite = () => {
  return (
    <WrapDashboard>
      <ListFavorites />
    </WrapDashboard>
  );
};

export default Favorite;
