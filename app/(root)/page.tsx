import HeaderBox from "@/components/HeaderBox";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import React from "react";

const Home = () => {
  const loggedIn = { firstName: "Monish", lastName: 'KS' , email: "monishks2406@gmail.com" };
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
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
