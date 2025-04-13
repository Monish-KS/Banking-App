"use server";

import {
  ACHClass,
  CountryCode,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType,
} from "plaid";

import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";

import { getTransactionsByBankId } from "./transaction.actions";
import { getBanks, getBank } from "./user.actions";

// Get multiple bank accounts
export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    // get banks from db
    const banks = await getBanks({ userId });

    const accounts = await Promise.all(
      banks?.map(async (bank: Bank) => {
        // get each account info from plaid
        const accountsResponse = await plaidClient.accountsGet({
          access_token: bank.accessToken,
        });
        const accountData = accountsResponse.data.accounts[0];

        // get institution info from plaid
        const institution = await getInstitution({
          institutionId: accountsResponse.data.item.institution_id!,
        });

        const account = {
          id: accountData.account_id,
          availableBalance: accountData.balances.available!,
          currentBalance: accountData.balances.current!,
          institutionId: institution.institution_id,
          name: accountData.name,
          officialName: accountData.official_name,
          mask: accountData.mask!,
          type: accountData.type as string,
          subtype: accountData.subtype! as string,
          appwriteItemId: bank.$id,
          shareableId: bank.shareableId,
        };

        return account;
      })
    );

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);

    return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

// Get one bank account
export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
  try {
    // get bank from db
    const bank = await getBank({ documentId: appwriteItemId });

    // get account info from plaid
    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank.accessToken,
    });
    const accountData = accountsResponse.data.accounts[0];

    // get transfer transactions from appwrite
    const transferTransactionsData = await getTransactionsByBankId({
      bankId: bank.$id,
    });

    const transferTransactions = transferTransactionsData.documents.map(
      (transferData: Transaction) => ({
        id: transferData.$id,
        name: transferData.name!,
        amount: transferData.amount!,
        date: transferData.$createdAt,
        paymentChannel: transferData.channel,
        category: transferData.category,
        type: transferData.senderBankId === bank.$id ? "debit" : "credit",
      })
    );

    // get institution info from plaid
    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!,
    });

    let transactionsResult = await getTransactions({ // Change const to let
      accessToken: bank?.accessToken,
    });

    // Check if getTransactions returned a consent error
    if (transactionsResult?.error === 'consent_required') {
      return parseStringify({
        error: 'consent_required',
        accessToken: bank.accessToken, // Pass the token needed for update mode
        data: accountData, // Include basic account data for context if needed
        institution: institution // Include institution data if needed
      });
    }

    // If other error or no transactions, handle appropriately (maybe return empty array or the error)
    if (transactionsResult?.error) {
        // Handle other errors from getTransactions if necessary, or just return empty transactions
        console.error("Error fetching transactions in getAccount:", transactionsResult.error);
        // Depending on desired behavior, you might return the error or just empty transactions
        // For now, let's proceed with empty transactions if there was another error
         transactionsResult = []; // Fallback to empty array for other errors or if no data
    }

    const transactions = transactionsResult; // Assign if no consent error

    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      appwriteItemId: bank.$id,
    };

    // sort transactions by date such that the most recent transaction is first
    // Ensure transactions is an array before spreading
    const plaidTransactions = Array.isArray(transactions) ? transactions : [];
    const allTransactions = [...plaidTransactions, ...transferTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return parseStringify({
      data: account,
      transactions: allTransactions,
    });
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
  }
};

// Get bank info
export const getInstitution = async ({
  institutionId,
}: getInstitutionProps) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US"] as CountryCode[],
    });

    const intitution = institutionResponse.data.institution;

    return parseStringify(intitution);
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

// Get transactions using /transactions/get (more aligned with reference repo likely)
export const getTransactions = async ({
  accessToken,
}: getTransactionsProps) => {
  let transactions: any = [];

  try {
    // Calculate start and end dates (e.g., last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const startDate = thirtyDaysAgo.toISOString().split('T')[0]; // YYYY-MM-DD
    const endDate = today.toISOString().split('T')[0]; // YYYY-MM-DD

    // Fetch transactions using /transactions/get
    const response = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
      options: {
        count: 500, // Fetch up to 500 transactions (adjust as needed)
        offset: 0,
      },
    });

    transactions = response.data.transactions.map((transaction) => ({
      id: transaction.transaction_id,
      name: transaction.name,
      paymentChannel: transaction.payment_channel,
      type: transaction.merchant_name ? 'merchant' : transaction.payment_channel, // Example type logic
      accountId: transaction.account_id,
      amount: transaction.amount,
      pending: transaction.pending,
      category: transaction.category ? transaction.category[0] : "",
      date: transaction.date,
      image: transaction.logo_url, // Note: logo_url might not be available on /transactions/get
    }));

    // Note: /transactions/get pagination is handled via offset/count if needed,
    // but for simplicity here, we fetch one large batch.

    return parseStringify(transactions);

  } catch (error: any) {
    console.error("An error occurred while getting the transactions:", error);
    // Keep the detailed error handling for consent issues etc.
    if (error?.response?.data?.error_code) {
      if (error.response.data.error_code === 'ADDITIONAL_CONSENT_REQUIRED') {
        return parseStringify({ error: 'consent_required' });
      } else {
        return parseStringify({ error: 'plaid_error', code: error.response.data.error_code, message: error.response.data.error_message });
      }
    }
    return parseStringify({ error: 'unknown' }); // Return generic error
  }
};

// Create Transfer
export const createTransfer = async () => {
  const transferAuthRequest: TransferAuthorizationCreateRequest = {
    access_token: "access-sandbox-cddd20c1-5ba8-4193-89f9-3a0b91034c25",
    account_id: "Zl8GWV1jqdTgjoKnxQn1HBxxVBanm5FxZpnQk",
    funding_account_id: "442d857f-fe69-4de2-a550-0c19dc4af467",
    type: "credit" as TransferType,
    network: "ach" as TransferNetwork,
    amount: "10.00",
    ach_class: "ppd" as ACHClass,
    user: {
      legal_name: "Anne Charleston",
    },
  };
  try {
    const transferAuthResponse =
      await plaidClient.transferAuthorizationCreate(transferAuthRequest);
    const authorizationId = transferAuthResponse.data.authorization.id;

    const transferCreateRequest: TransferCreateRequest = {
      access_token: "access-sandbox-cddd20c1-5ba8-4193-89f9-3a0b91034c25",
      account_id: "Zl8GWV1jqdTgjoKnxQn1HBxxVBanm5FxZpnQk",
      description: "payment",
      authorization_id: authorizationId,
    };

    const responseCreateResponse = await plaidClient.transferCreate(
      transferCreateRequest
    );

    const transfer = responseCreateResponse.data.transfer;
    return parseStringify(transfer);
  } catch (error) {
    console.error(
      "An error occurred while creating transfer authorization:",
      error
    );
  }
};