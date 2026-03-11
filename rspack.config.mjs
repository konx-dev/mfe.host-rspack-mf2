/*
 * Rspack Configuration file - Module Federation 2.0 (Host/Shell)
 * Handles the build orchestration, dev server settings, and the micro-frontend integration layer.
 */

// --- [ BOOTSTRAP & INFRASTRUCTURE ] ---
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import * as dotenv from 'dotenv';

// --- [ PLUGINS ] ---
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import HtmlRspackPlugin from 'html-rspack-plugin';

// Setup environment and paths
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Extract dependencies for version-synced shared modules
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const deps = packageJson.dependencies;

/** @type {import('@rspack/core').Configuration} */
export default {

  // Root context for resolving entry points and loaders
  context: __dirname,

  // Entry points must follow the Async Bootstrap pattern for MF 2.0.
  // index.ts handles the dynamic import of the actual app logic.   
  entry: './src/index.ts',

  mode: 'development',

  /**
  * OUTPUT: Defines how and where bundles are served.
  * Note: publicPath MUST be explicit for Module Federation manifests.
  */
  output: {
    publicPath: `http://localhost:${process.env.PORT || 3000}/`,
    // clean: true // Recommended for production builds
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },

  // DEV SERVER: Configured for Micro-frontend connectivity.
  devServer: {
    port: process.env.PORT || 3000,
    historyApiFallback: true, // Support for client-side routing
    headers: {
      // CORS is required so that other remotes can request assets/manifests from this origin.
      "Access-Control-Allow-Origin": "*",
    },
  },

  // MODULE RULES: Transpilation and asset handling.
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        use: {
          loader: 'builtin:swc-loader', // high-performance Rust-based compilation.
          options: {
            jsc: {
              parser: { syntax: 'typescript', tsx: true },
              transform: { react: { runtime: 'automatic' } },
            },
          },
        },
      },
    ],
  },

  // PLUGINS: The core of the Micro-frontend architecture.
  plugins: [
    new HtmlRspackPlugin({ template: './index.html' }),

    new ModuleFederationPlugin({
      name: 'shell', // Unique identifier for this container
      
      remotes: {
        ...(process.env.REMOTE_APP && { remote_app: process.env.REMOTE_APP }),
      },

      /*
        SHARED: Libraries shared between Host and Remotes.
        - singleton: Only one instance of the library is loaded.
        - eager: false: Allows MF to negotiate versions before loading (avoids factory errors).
        - requiredVersion: Ensures the versions match the package.json exactly.
      */
      shared: {
        react: { 
          singleton: true, 
          eager: false,
          requiredVersion: deps.react 
        },
        'react-dom': { 
          singleton: true, 
          eager: false,
          requiredVersion: deps['react-dom'] 
        },
      },
    }),
  ],
};