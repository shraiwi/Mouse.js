export let Screen = {
    get width() { return window.innerWidth },
    get height() { return window.innerHeight },
    get aspect() {
        return window.innerWidth / window.innerHeight;
    }
}

/**
 * @typedef {Object} Mouse A mouse object
 * @property {number} docX The normalized x coordinate of the mouse pointer on the screen. -1 is all the way left and +1 is all the way right.
 * @property {number} docY The normalized y coordinate of the mouse pointer on the screen. -1 is at the bottom and +1 is at the top.
 * @property {number} docPX The pixel x coordinate of the mouse pointer, relative to the document.
 * @property {number} docPY The pixel y coordinate of the mouse pointer, relative to the document.
 * @property {number} docDPX The pixel x coordinate of the mouse pointer movement since the last update, relative to the document.
 * @property {number} docDPY The pixel y coordinate of the mouse pointer movement since the last update, relative to the document.
 * @property {number} docDX The normalized x coordinate of the mouse pointer's movement on the screen, relative to the document. -1 is all the way left and +1 is all the way right.
 * @property {number} docDY The normalized y coordinate of the mouse pointer's movement on the screen, relative to the document. -1 is at the bottom and +1 is at the top.
 * @property {number} targetX The normalized x coordinate of the mouse pointer, relative to the target. -1 is all the way left and +1 is all the way right.
 * @property {number} targetX The normalized y coordinate of the mouse pointer, relative to the target. -1 is at the bottom and +1 is at the top.
 * @property {number[]} buttons A set of the buttons pressed by the mouse. Use the has() or down() method to access individual buttons.
 * @property {function} on Subscribes a callback to a mouse event.
 * @property {function} off Unsubscribes a callback to a mouse event.
 * @property {function} down Checks whether or not a key is down.
 * @property {function} codeOf Takes a mouse button name as an input and returns the mouse button code.
 * @property {function} nameOf Takes a mouse button code as an input and returns the mouse button name.
 * @property {function} lockPointer Locks the mouse pointer to the target
 * @property {function} unlockPointer Unlocks the mouse pointer from a target
 */

/**Creates a new mouse object, with specified DOM element to target with the pointerlock API.
 * @author Shraiwi
 * @param {object} target The target of the pointerlock API (if used)
 * @returns {Mouse} Returns a mouse object.
 */
export function Mouse(target) {

    let self = this;
    this.target = target;

    let buttonCodes = {
        "left": 0,
        "middle": 1,
        "right": 2,
        "back": 3,
        "next": 4,
    };

    /**
     * Gets the name of a mouse button by the numeric code
     * @param {number} code The code of the mouse button
     * @returns {string} The name of the identified button, otherwise undefined
     */
    function nameOf(code) {
        return Object.keys(buttonCodes).find(k => buttonCodes[k] === code);
    }

    /**
     * Gets the code of a specified string code
     * @param {("left"|"middle"|"right"|"back"|"next")} name The name of the mouse button
     * @returns {number} The numeric code of the mouse button, otherwise undefined.
     */
    function codeOf(name) {
        return buttonCodes[name.toLowerCase()];
    }

    this.events = {
        "move": [],
        "anydown": [],
        "anyup": [],
        "unlock": [],
        "lock": [],
        "lockchange": [],
        "lockerror": [],
        "leftdown": [],
        "leftup": [],
        "rightdown": [],
        "rightup": [],
        "middledown": [],
        "middleup": [],
        "backdown": [],
        "backup": [],
        "nextdown": [],
        "nextup": [],
    };
    /**
     * Subscribes a callback to a mouse event
     * @param {("move"|"mousedown"|"mouseup"|"unlock"|"lock"|"lockchange"|"lockerror"|"leftdown"|"leftup"|"rightdown"|"rightup"|"middledown"|"middleup"|"backdown"|"backup"|"nextdown"|"nextup")} event The name of the event
     * @param {function} callback The callback for the event
     * @returns Whether or not the addition was completed
     */
    function on(event, callback) {
        if (event in self.events) {
            self.events[event].push(callback);
            return true;
        }
        console.warn("MouseError: Event not found!");
        return false;
    }
    /**
     * Unsubscribes a callback from a mouse event. If the callback is "all", it will remove all listeners subscribed to the event.
     * @param {("move"|"mousedown"|"mouseup"|"unlock"|"lock"|"lockchange"|"lockerror"|"leftdown"|"leftup"|"rightdown"|"rightup"|"middledown"|"middleup"|"backdown"|"backup"|"nextdown"|"nextup"|"all")} event The name of the event
     * @param {function|"all"} callback The callback for the event. Use "all" to remove all listeners from the event.
     * @returns {boolean} Whether or not the removal was completed
     */
    function off(event, callback) {
        if (callback === "all") {
            if (event in self.events) {
                self.events[event] = [];
                return true;
            }
            console.warn("MouseError: Event not found!");
            return false;
        }
        if (event in self.events) {
            let _event = self.events[event];
            let index = _event.indexOf(callback);
            if (index < 0) {
                console.warn("MouseError: Callback not found!");
                return false;
            }
            _event.splice(index, 1);
        } else {
            console.warn("MouseError: Event not found!");
            return false;
        }
        return true;
    }

    function emit(event, params) {
        self.events[event].map((f) => f(params));
    }

    /**
    * Locks the pointer to a target using the pointerlock API.
    */
    function lock() {
        if (self.target) self.target.requestLock();
        else console.warn("MouseError: Target is undefined!");
    }
    /**
     * Unlocks the pointer to a target using the pointerlock API.
     */
    function unlock() {
        if (self.target) self.target.requestUnlock();
        else console.warn("MouseError: Target is undefined!");
    }

    function lockChange() {
        let state = document.pointerLockElement === self.target ||
            document.mozPointerLockElement === self.target ||
            document.webkitPointerLockElement === self.target;
        emit("lockchange", state);
        emit(state ? "lock" : "unlock");
    }

    function lockError() {
        emit("lockerror");
    }

    this.docX = 0;
    this.docY = 0;
    this.docPX = 0;
    this.docPY = 0;
    this.docDX = 0;
    this.docDY = 0;
    this.docDPX = 0;
    this.docDPY = 0;

    this.targetX = 0;
    this.targetY = 0;
    this.targetPX = 0;
    this.targetPY = 0;

    this.buttons = new Set();

    function docMove(e) {
        self.docPX = e.pageX;
        self.docPY = e.pageY;
        self.docX = (e.pageX / Screen.width - 0.5) * 2;
        self.docY = (e.pageY / Screen.height - 0.5) * 2;
        self.docDPX = e.movementX;
        self.docDPY = e.movementY;
        self.docDX = (e.movementX / Screen.width - 0.5) * 2;
        self.docDY = (e.movementY / Screen.height - 0.5) * 2;
        emit("move", e);
    }

    function targetMove(e) {
        self.targetPX = e.clientX;
        self.targetPY = e.clientY;
        self.targetX = (e.clientX / self.target.clientWidth - 0.5) * 2;
        self.targetY = (e.clientY / self.target.clientHeight - 0.5) * 2;
        docMove(e);
    }

    function docDown(e) {
        self.buttons.add(e.button);
        emit(`${nameOf(e.button)}down`, e);
        emit("anydown", e);
    }

    function docUp(e) {
        self.buttons.delete(e.button);
        emit(`${nameOf(e.button)}up`, e);
        emit("anyup", e);
    }

    /**
     * Checks if a certain button is pressed. Accepts either a string or a button code.
     * @param {(number|"left"|"middle"|"right"|"back"|"next")} button The button to be targeted.
     * @returns {boolean} Whether or not the specified button is pressed.
     */
    function pressed(button) {
        if (typeof button === "string") {
            button = buttonCodes[button.toLowerCase()];
        }
        if (button === undefined || button === null) console.log("MouseError: Invalid button!");
        return self.buttons.has(button);
    }

    if ("onpointerlockchange" in document) document.addEventListener("pointerlockchange", lockChange, false);
    else if ("onmozpointerlockchange" in document) document.addEventListener("mozpointerlockchange", lockChange, false);
    else if ("onwebkitpointerlockchange" in document) document.addEventListener("webkitpointerlockchange", lockChange, false);

    document.addEventListener("pointerlockerror", lockError, false);
    document.addEventListener("mozpointerlockerror", lockError, false);
    document.addEventListener("webkitpointerlockerror", lockError, false);

    document.addEventListener("mousemove", docMove, false);
    document.addEventListener("mousedown", docDown, false);
    document.addEventListener("mouseup", docUp, false);

    if (self.target) {
        self.target.requestLock = self.target.requestPointerLock ||
            self.target.mozRequestPointerLock ||
            self.target.webkitRequestPointerLock;
        self.target.requestUnlock = self.target.exitPointerLock ||
            self.target.mozExitPointerLock ||
            self.target.webkitExitPointerLock;
        self.target.addEventListener("mousemove", targetMove, false);
    }

    this.lockPointer = lock;
    this.unlockPointer = unlock;
    this.down = pressed;
    this.on = on;
    this.off = off;
    this.nameOf = nameOf;
    this.codeOf = codeOf;

    return this;
}
