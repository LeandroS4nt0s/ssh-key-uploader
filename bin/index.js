#!/usr/bin/env node
import { main } from "../src/main.js";

const [, , command] = process.argv;

if (command === "init") {
  main();
} else {
  console.log(`❓ Unknown command: ${command}\n👉 Use: ssh-key-uploader init`);
}
