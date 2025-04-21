import readline from "readline";
import { execSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import axios from "axios";
import open from "open";
import querystring from "querystring";
import chalk from "chalk";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const sshDir = path.join(os.homedir(), ".ssh");
const keyName = "github_personal";
const privateKeyPath = path.join(sshDir, keyName);
const publicKeyPath = `${privateKeyPath}.pub`;

const clientId = "Ov23li1ALJ5FXK4iEBxs";
const clientSecret = "fbdb5faf8c10ea7c10bf4d1d9ba2c990fa8c3cc5";

function cleanupKeys() {
  if (fs.existsSync(privateKeyPath)) fs.unlinkSync(privateKeyPath);
  if (fs.existsSync(publicKeyPath)) fs.unlinkSync(publicKeyPath);
  console.log(chalk.yellow("🧹 Cleaned up generated keys."));
}

function generateSSHKey() {
  if (!fs.existsSync(publicKeyPath)) {
    try {
      console.log(chalk.gray("📦 No SSH key found. Generating one..."));
      execSync(`ssh-keygen -t rsa -b 4096 -f ${privateKeyPath} -N ""`);
      console.log(chalk.green("✅ SSH key generated."));
    } catch (error) {
      console.error(
        chalk.red("❌ Failed to generate SSH key:"),
        error.message || error
      );
      cleanupKeys();
      process.exit(1);
    }
  } else {
    console.log(chalk.gray("🔑 SSH key already exists."));
  }
}

async function startDeviceFlow() {
  try {
    const res = await axios.post(
      "https://github.com/login/device/code",
      querystring.stringify({
        client_id: clientId,
        scope: "admin:public_key",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const data = querystring.parse(res.data);
    const { device_code, user_code, verification_uri, interval } = data;

    console.log(
      chalk.cyan(
        `🔐 Please open ${verification_uri} and enter this code: ${chalk.bold(
          user_code
        )}`
      )
    );
    await open(verification_uri);

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const tokenRes = await axios.post(
            "https://github.com/login/oauth/access_token",
            querystring.stringify({
              client_id: clientId,
              client_secret: clientSecret,
              device_code,
              grant_type: "urn:ietf:params:oauth:grant-type:device_code",
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
              },
            }
          );

          const { access_token, error, error_description } = tokenRes.data;

          if (access_token) {
            resolve(access_token);
          } else if (error === "authorization_pending") {
            setTimeout(poll, interval * 1000);
          } else {
            reject(
              new Error(error_description || "Failed to get access token")
            );
          }
        } catch (err) {
          reject(err);
        }
      };

      poll();
    });
  } catch (err) {
    console.error(
      chalk.red("❌ Failed to start device flow:"),
      err.response?.data || err.message
    );
    throw err;
  }
}

async function uploadSSHKey(token) {
  const publicKey = fs.readFileSync(publicKeyPath, "utf8");
  const hostname = os.hostname();
  const title = `${hostname}`;

  const res = await axios.post(
    "https://api.github.com/user/keys",
    {
      title: title,
      key: publicKey,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "ssh-key-uploader-cli",
      },
    }
  );

  console.log(chalk.green("🚀 SSH key uploaded successfully!"));
  console.log(chalk.gray(`📎 Key ID: ${res.data.id}`));
}

export async function main() {
  console.log(chalk.bold.green("🔐 GitHub SSH Key Uploader (OAuth)"));

  generateSSHKey();

  try {
    const token = await startDeviceFlow();
    await uploadSSHKey(token);
  } catch (err) {
    console.error(
      chalk.red("❌ Authentication or upload failed:"),
      err.message || err
    );
    cleanupKeys();
  }

  rl.close();
}
