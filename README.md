# Horizon - A Fintech Bank Application

Built with Next.js, Horizon is a financial SaaS platform that connects to multiple bank accounts, displays transactions in real-time, allows users to transfer money to other platform users, and manages their finances altogether.

This project was built step by step with our detailed tutorial on the JavaScript Mastery YouTube channel. Join the JSM family!

## 📋 Table of Contents

-   [🤖 Introduction](#-introduction)
-   [⚙️ Tech Stack](#️-tech-stack)
-   [🔋 Features](#-features)
-   [🤸 Quick Start](#-quick-start)
-   [🕸️ Code Snippets to Copy](#️-code-snippets-to-copy)
-   [🔗 Assets](#-assets)
-   [🚀 More](#-more)
-   [🚨 Tutorial](#-tutorial)

## 🤖 Introduction

Built with Next.js, Horizon is a financial SaaS platform that connects to multiple bank accounts, displays transactions in real-time, allows users to transfer money to other platform users, and manages their finances altogether.

If you're getting started and need assistance or face any bugs, join our active Discord community with over 34k+ members. It's a place where people help each other out.

## ⚙️ Tech Stack

-   Next.js
-   TypeScript
-   Appwrite
-   Plaid
-   Dwolla
-   React Hook Form
-   Zod
-   TailwindCSS
-   Chart.js
-   ShadCN

## 🔋 Features

-   **👉 Authentication:** An ultra-secure SSR authentication with proper validations and authorization
-   **👉 Connect Banks:** Integrates with Plaid for multiple bank account linking
-   **👉 Home Page:** Shows general overview of user account with total balance from all connected banks, recent transactions, money spent on different categories, etc
-   **👉 My Banks:** Check the complete list of all connected banks with respective balances, account details
-   **👉 Transaction History:** Includes pagination and filtering options for viewing transaction history of different banks
-   **👉 Real-time Updates:** Reflects changes across all relevant pages upon connecting new bank accounts.
-   **👉 Funds Transfer:** Allows users to transfer funds using Dwolla to other accounts with required fields and recipient bank ID.
-   **👉 Responsiveness:** Ensures the application adapts seamlessly to various screen sizes and devices, providing a consistent user experience across desktop, tablet, and mobile platforms.
-   and many more, including code architecture and reusability.

## Test User

For testing the website, you can use the following credentials:

-   **Email:** testuser@gmail.com
-   **Password:** testuser123


## 🤸 Quick Start

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  Configure environment variables:

    -   Create a `.env` file in the project root.
    -   Add the necessary environment variables (Appwrite, Plaid, Dwolla, Sentry, etc.). See the `.env.example` file for a template.

4.  Run the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

5.  Open your browser and navigate to `http://localhost:3000`.


