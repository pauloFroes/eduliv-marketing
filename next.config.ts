import type { NextConfig } from "next";

import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
