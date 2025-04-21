# SSH Key Uploader

## 🚀 What is it?

The **SSH Key Uploader** is a simple and secure tool for generating and uploading SSH keys to your GitHub account, using the OAuth device flow. It makes authentication easy without any complicated interactions, automating the generation and upload of your SSH key directly from your terminal.

## 🔐 Security

Security is a top priority:

- **Secure SSH Key Generation**: The tool generates 4096-bit SSH keys with `ssh-keygen`, ensuring strong encryption to protect your connections to GitHub.
- **OAuth Device Flow**: We use GitHub's OAuth device flow, one of the most secure methods of authentication. This allows you to log in to your GitHub account without sharing credentials directly.

- **Unique SSH Key**: The SSH key generated is unique to each run of the program and is automatically removed once the process is finished, ensuring no unnecessary files or data leakage risks.

- **Privacy Ensured**: The process of uploading the SSH key to your GitHub account is done securely with temporary access tokens, which are never stored on your system.

## 🛠️ How to Use

### Global Installation

To install the tool globally and use it from anywhere, run:

```bash
npm install -g ssh-key-uploader
```

### Initialize the Upload Process

Once installed, simply run the following command to generate your SSH key and upload it to GitHub:

```bash
ssh-key-uploader init
```

This will start the authentication process, where you will be asked to open a link and enter a device code to authorize the application. Once authorized, your SSH key will be automatically uploaded to your GitHub account!

### Process Steps

1. **Generate SSH Key**: If you don't already have an SSH key, the tool will generate one for you.
2. **OAuth Authentication**: The tool will guide you through the OAuth flow where you'll authenticate your GitHub account.
3. **SSH Key Upload**: After authentication, the generated SSH key will be automatically uploaded to your GitHub account, ready to use.

## 🧑‍💻 Example Usage

```bash
$ ssh-key-uploader init

🔐 GitHub SSH Key Uploader (OAuth)
📦 No SSH key found. Generating one...
✅ SSH key generated.
🔐 Please open https://github.com/login/device and enter this code: 3ABC-D1E1
🚀 SSH key uploaded successfully!
📎 Key ID: 120938539
```

## 🛡️ Security in Detail

- **4096-bit SSH Key**: Ensuring strong encryption.
- **No Credential Storage**: The OAuth flow ensures that no GitHub credentials are stored locally.
- **Temporary Token**: We use a temporary access token for uploading the key, which is never stored on your device.

## 📚 How It Works

1. **SSH Key Generation**: We use `ssh-keygen` to generate a public and private SSH key on your machine.
2. **GitHub OAuth Authentication**: The tool uses GitHub's device code flow to authenticate you without needing your password.
3. **Secure Upload**: The SSH key is uploaded to GitHub via the API using an access token.

## 🔧 Requirements

- Node.js (version 16 or above)
- GitHub (active account)

## 🎨 SSH Key Customization

Additionally, the machine name will be included in the key's title on GitHub, making it easier to organize and identify keys associated with different devices.

## 📝 License

This project is licensed under the **MIT License**. See the LICENSE file for more details.
