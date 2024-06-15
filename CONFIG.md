Got it! Let's focus on clarifying the setup steps in the `CONFIG.md` file while addressing the specific details you mentioned:

---

# Configuration Guide for Setting Up MediBot

Follow these steps to set up and configure MediBot on your local machine.

## Setting Up Client and Server

1. **Open Terminal / Command Prompt:**

   - For **Windows**: Use Command Prompt or PowerShell.
   - For **Linux and macOS**: Use Terminal.

2. **Navigate to Client and Server Directories:**

   ```bash
   cd path/to/client
   npm i
   cd path/to/server
   npm i
   ```

## Setting Up Server Environment

1. **Create Virtual Environment (Python 3.12 and above preferred):**

   ```bash
   cd path/to/server
   python3 -m venv venv
   ```

   Replace `python3` with `python` or `python3.12` as appropriate.

2. **Set Up Virtual Environment as Interpreter in VS Code:**

   - Open VS Code.
   - Press `Ctrl + Shift + P` (Cmd + Shift + P on macOS) to open the Command Palette.
   - Type `Select Interpreter` and choose `Enter interpreter path...`.
   - Enter the path to the Python interpreter located in the `venv` folder.

3. **Activate the Virtual Environment:**

   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   
   - **Linux / macOS:**
     ```bash
     source venv/bin/activate
     ```

4. **Install Python Dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

## Adding Chroma Library

1. **Download and Extract Chroma Zip Folder:**

   Download the Chroma zip folder from the provided [drive link](https://drive.google.com/file/d/1qehnf8V7SsARDanK-SIf2bAdUUMIwJh6/view?usp=sharing).
   
2. **Put Chroma Inside Server Folder:**

   Extract the Chroma folder and place it inside the `server` directory.

## Setting Up .env File

1. **Rename .env.example:**

   In both `client` and `server` directories, rename `.env.example` files to `.env`.

2. **Configure .env File:**

   Edit the `.env` files in both directories to set up API keys, ports, and tokens as per your requirements.

## How to Run

1. **Activate Python Script:**

   ```bash
   cd path/to/server
   python main.py
   ```

2. **Start Server:**

   If your server requires starting a database, use the appropriate command or script. For example:
   
   ```bash
   npm start
   ```

3. **Start Client:**

   Open a new terminal or command prompt window.

   ```bash
   cd path/to/client
   npm start
   ```

4. **Access MediBot:**

   Open the provided localhost URL in your web browser as shown in the client terminal.

---

Ensure to replace `path/to/client` and `path/to/server` with the actual paths to your client and server directories. Adjust Python version (`python3`) and other commands based on your system setup. This guide now includes a clarified section for starting the database if needed and running the client and server applications using `npm start`.