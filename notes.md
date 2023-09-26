<h3> Introduction / General Information </h3>

* Assume this to be the backend process.
* Electron uses Chromium under the hood.
* We can include any node or npm modules into the main process. For renderer, we have to use preload. Common modules cannot be imported directly under the renderer.
* Alternate to call the main window: `app.on('ready', <function_name>)`
* window-all-closed is checked against the platform to quit/terminate the process 
    - Boilerplate code which is recommended to be used in all applications. 
    - Encouraged to avoid cross-platform dependencies.
    - platform in the process library is NOT a function. Just use process.platform
* Use the command `npx electronmon .` to be able run changes without restarting the app.
* To fix the security warning on the developer console:
    </br> `<meta http-equiv="Content-Security-Policy" content="script-src 'self'" />`
    - script-src indicate the inclusion of source scripts.

* If the () => is not specified in the menu while trying to quit, if the line just reads `app.quit()`, the application will quit RIGHT AWAY.
* ... is called as a spread operator
    - The spread (...) syntax allows an iterable, such as an array or string, to be expanded in places where zero or more arguments (for function calls) or elements (for array literals) are expected.
* The name assigned to the HTML id and the name used as variable or constant inside the js should not clash.

<h3> Good to know </h3>

* When a files are uploaded, even if it is a single file, it gets put into an array called `files`
* Function calls can be made without having paranthesis in the end also.
* files module would not have any option to get the current image resolution. This is why URL object's `createObjectURL` method.
* A set of curly brackets in javascript represent an object.

<h3> IPC (Inter-Process Communication): </h3>

* Renderer does not run Node.js by default.
* Not only functions, variables can also be exposed to the main world through the preload script.
* The API name and function name while exposing to the main world could be anything. In our example, `os` could be renamed as `operatingSystem` and `homedir` can be renamed as `homeDirectory`, too. However, point to note is that the value which is set against `homedir/homeDirectory` should be a function which returns the desired entity.
* In the renderer, the event is caught using the `ipcRenderer.on()`

<h3> To Learn </h3>
* Promises in Javascript.
* Asynchronous functions.