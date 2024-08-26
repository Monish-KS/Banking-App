import HeaderBox from "@/components/HeaderBox";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import React from "react";

const Home = async () => {
  const loggedIn = await getLoggedInUser();
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.name || "Guest"}
            subtext="Access and Manage you account transactions efficiently."
          />

          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={2340}
          />
        </header>
        RECENT TRANSACTIONS
      </div>
      <RightSidebar 
      user={loggedIn} 
      trasactions={[]} 
      banks={[{currentBalance: 1234.00},{currentBalance: 1500.00}]} />
    </section>
  );
};

export default Home;
