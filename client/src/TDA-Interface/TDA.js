import React from "react";
import "./TDA.css";

import { searchInstrumentFundamentals } from "tda-api-client/instruments";

import configFiles from "../config.json";

const config = {
  symbol: "MSFT",
  apikey: configFiles.client_id,
};

export let start = async () => {
  const result = await searchInstrumentFundamentals(config);
  console.log(result);
};

export const TDA = (props) => {
  return (
    <>
      <div
        onClick={() => {
          start();
        }}
      >
        Hi
      </div>
    </>
  );
};
