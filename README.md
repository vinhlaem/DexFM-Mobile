# Dex.FM Mobile 👋

A mobile wallet application built with [Expo](https://expo.dev) and React Native. Support for Ethereum and Solana blockchains.

## Demo

Watch the demo video to see the app in action:

📹 [Demo Video](https://drive.google.com/file/d/1CElY0NmXOicvZ0sHbpFoUbBrhtzdGxC1/view?usp=sharing)

## Features

- **Multi-chain Support**: Ethereum and Solana wallets
- **Wallet Creation**: Create new wallet or import existing wallet using seed phrase
- **Biometric Authentication**: Face ID, Fingerprint, and Device Passcode support
- **Send & Receive**: Transfer tokens with QR code scanning
- **Dashboard**: View balances, tokens, favorites, and portfolio
- **Secure Storage**: Seed phrases and private keys stored securely

## App Flow

### 1. Onboarding Screen

- **Create New Wallet**: Generates new Ethereum and Solana wallets with seed phrase
- **Import Existing Wallet**: Import wallet using seed phrase
- If wallet already exists, automatically redirects to Authentication screen

### 2. Authentication Screen

- **Passcode Login**: Enter saved passcode to authenticate
- **Biometric Options**:
  - Face ID (iOS) / Face Recognition (Android)
  - Fingerprint Authentication
  - Device Passcode
- After successful authentication → Dashboard

### 3. Dashboard

- **Bottom Tab Navigation**:
  - **Home**: Main screen with wallet balance, Send/Receive buttons, and token list
  - **Favorite**: View favorite tokens
  - **Portfolio**: View your portfolio
  - **Setting**: App settings

### 4. Home Screen Features

- **Wallet Info**: Display wallet address and balance
- **Send Button**: Open bottom sheet to send tokens (with QR scanner)
- **Receive Button**: Open bottom sheet to receive tokens (show QR code and address)
- **Token List**: Browse and manage tokens

### 5. Send/Receive

- **Send**:
  - Enter recipient address (or scan QR code)
  - Select token (Ethereum or Solana)
  - Enter amount
  - Confirm transaction
- **Receive**:
  - Display QR code for wallet address
  - Copy address to clipboard
  - Switch between Ethereum and Solana addresses

## Get started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Setup environment variables**

   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env and add your API keys
   # Get Alchemy API keys from: https://dashboard.alchemy.com/
   ```

   See [SETUP_ENV.md](./SETUP_ENV.md) for detailed instructions on setting up environment variables and EAS Secrets.

3. **Start the app**

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
