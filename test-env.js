const { execSync } = require("child_process");
const { resolve } = require("path")
const { config } = require("dotenv")

const setupDevEnvironment = () => config({ path: resolve(__dirname, "./.env.dev") });

setupDevEnvironment()

execSync("prisma2 generate")