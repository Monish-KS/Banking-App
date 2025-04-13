import HeaderBox from "@/components/HeaderBox";
import RecentTransactions from "@/components/RecentTransactions";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import React from "react";

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;

  // Get the logged-in user
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) {
    return <div>Please log in to view your accounts.</div>;
  }

  // Fetch accounts based on the logged-in user
  const accounts = await getAccounts({ userId: loggedIn.$id });
  if (!accounts || accounts.data.length === 0) {
    return <div>No accounts found for this user.</div>;
  }

  const accountsData = accounts.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  // Fetch account details
  const account = await getAccount({ appwriteItemId });

  // Ensure transactions are iterable, even if empty
  const transactions = account?.transactions || [];

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
            subtext="Access and manage your account transactions efficiently."
          />

          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>
        <RecentTransactions
          accounts={accountsData}
          transactions={transactions} // Always provide an array
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>
      <RightSidebar
        user={loggedIn}
        transactions={transactions} // Always provide an array
        banks={accountsData?.slice(0, 2)}
      />
    </section>
  );
};

export default Home;
