/// <reference types="vite/client" />

declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.webp";
declare module "*.gif";
declare module "*.css";

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
