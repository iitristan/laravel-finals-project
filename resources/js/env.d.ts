/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_NAME: string
    // Add other env variables here if needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv
} 