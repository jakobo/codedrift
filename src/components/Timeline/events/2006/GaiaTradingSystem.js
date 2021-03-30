import { Entry } from "src/components/Timeline";
import React from "react";

export default function GaiaTradingSystem() {
  return (
    <Entry
      year="2006"
      title="Software Engineer, Gaia Online"
      product="Gaia Trading System"
      href="/thunked/transactions-part-1"
      categories={["Engineering", "Product"]}
    >
      <p>
        One of the most challenging things of any MMO-style game is facilitating
        the fair trade of items between accounts. With a distributed sharded
        database, there needed to be a consistent ledger for auditing,
        verifying, and completing player-to-player transactions.
      </p>
    </Entry>
  );
}
