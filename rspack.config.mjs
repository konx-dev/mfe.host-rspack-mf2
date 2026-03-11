// Imports
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import fs from 'fs';

// Module Federation Imports
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import HtmlRspackPlugin from 'html-rspack-plugin';


// Load .env variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Automatically grab versions from package.json for the 'shared' config
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const deps = packageJson.dependencies;

/** @type {import('@rspack/core').Configuration} */
export default {
  context: __dirname,
  entry: './src/index.ts',
  mode: 'development',
  output: {
    // Falls back to 3000 if PORT isn't in .env
    publicPath: `http://localhost:${process.env.PORT || 3000}/`,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  devServer: {
    port: process.env.PORT || 3000,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        use: {
          loader: 'builtin:swc-loader',
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
  plugins: [
    new HtmlRspackPlugin({ template: './index.html' }),
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        // Portability: Use the env variable for the remote manifest
        // Example in .env: REMOTE_APP=remote_app@http://localhost:3001/mf-manifest.json
        ...(process.env.REMOTE_APP && { remote_app: process.env.REMOTE_APP }),
      },
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