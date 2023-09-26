const path = require('path');
const os = require('os');
const fs = require('fs');
const resizeImg = require('resize-img');
const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');

isDevMode = process.env.NODE_ENV !== 'production';
isMac = process.platform === 'darwin';

let mainWindow;

// Create the main window
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Image Resizer',
        width: isDevMode ? 1000 : 400,
        height: 550,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Open developer tools only if running in development mode.
    if (isDevMode) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

// Create about window
function createAboutWindow() {
    const aboutWindow = new BrowserWindow({
        title: 'About Image Resizer',
        width: 350,
        height: 300
    });

    aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
}

// App is ready
app.whenReady().then(() => {
    createMainWindow();

    // Implement menu
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    // Remove main window from memory on close
    mainWindow.on('closed', () => {(mainWindow = null)})

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

// Menu template
const menu = [
    ...(isMac ? [{
        label: app.name,
        submenu: [
            {
                label: 'About',
                click: createAboutWindow
            },
        ],
    }] : []),
    {
        /** 
        role: 'fileMenu',
        This can be used as a shortcut to use a predefined role to 
        quit the app instead of writing the below label and its submenu. 
        **/
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                click: () => app.quit(),
                accelerator: 'CmdOrCtrl+W'
            },
        ],
    },
    ...(!isMac ? [{
        label: 'Help',
        submenu: [
            {
                label: 'About',
                click: createAboutWindow
            }
        ]
    }] : [])
];

// Respond to ipcRenderer
ipcMain.on('image:resize', (event, options) => {
    options.imageDestination = path.join(os.homedir(), 'ImageResizer')
    resizeImage(options)
});

// Resize the image
async function resizeImage({imagePath, width, height, imageDestination}) {
    try {
        const newPath = await resizeImg(fs.readFileSync(imagePath), {
            width: +width,
            height: +height
        });

        // Create filename for resized image
        const filename = "Resized-" + path.basename(imagePath);

        // Create destination folder if not present
        if (!fs.existsSync(imageDestination)) {
            console.log(imageDestination)
            fs.mkdirSync(imageDestination);
        }

        // Write the file to the destination
        fs.writeFileSync(path.join(imageDestination, filename), newPath)

        // Send success alert to renderer
        mainWindow.webContents.send('image:done')

        // Open destination folder to see the image
        shell.openPath(imageDestination)

    } catch (error) {
        console.log(error)
    }
}

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});