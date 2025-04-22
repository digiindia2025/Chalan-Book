"use client";
import React from "react";
import PackingDetailsEdit from "../../../component/PackingTable/PackingDetailsEdit";
import { useParams } from 'next/navigation';

const PackingDetailsWrapper = () => {
  const params = useParams<{ id: string }>();

  return (
    <div>
      {params ? <PackingDetailsEdit id={params.id} /> : <p>Loading...</p>}
    </div>
  );
};

export default PackingDetailsWrapper;