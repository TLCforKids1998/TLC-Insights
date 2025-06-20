# TLC Insights

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Firebase Configuration

1. Copy `.env.example` to `.env` in the `frontend/` directory.
2. Fill in your Firebase project credentials. **Do not commit your real secrets.**
3. The app uses Vite environment variables (all keys must start with `VITE_`).

Example:
```
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain-here
VITE_FIREBASE_PROJECT_ID=your-project-id-here
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket-here
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id-here
VITE_FIREBASE_APP_ID=your-app-id-here
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id-here
```

**Never commit your real .env file or secrets to git.**
