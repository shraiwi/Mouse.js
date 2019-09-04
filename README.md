# Mouse.js
A simple, fast, and powerful mouse library written in JavaScript.

Honestly, this is best for HTML5 games which need a fast, simple, and standardized mouse API.

## Features

**Mouse Events**

Traditionally, to make an event trigger when the user clicks their left button, you would require some code like this:

```javascript	
document.addEventListener("mousedown", function (event) {
    if (event.button === 0) {
        console.log("The left button was clicked!");
    }
}, false);
```

For more events, things would get more cluttered:

```javascript
document.addEventListener("mousedown", function (event) {
    switch (event.button) {
        case 0:
        	console.log("The left button was clicked!");
            break;
        case 1:
        	console.log("The middle button was clicked!");
            break;
        case 2:
        	console.log("The right button was clicked!");
            break;
    }
}, false);
```

On the other hand, Mouse.js uses a more simple syntax for mouse events, allowing for more readable code:

```javascript
let mouse = new Mouse();
mouse.on("rightdown", () => console.log("The right button was clicked!"));
mouse.on("leftdown", () => console.log("The left button was clicked!"));
mouse.on("middledown", () => console.log("The middle button was clicked!"));
```

**Simple Pointer Lock API**

Using the pointerlock API in HTML5 is a *headache* to get working. Using Mouse.js, this:

```javascript
target.requestLock = target.requestPointerLock ||
    target.mozRequestPointerLock ||
    target.webkitRequestPointerLock;
target.requestUnlock = target.exitPointerLock ||
    target.mozExitPointerLock ||
    target.webkitExitPointerLock;

function lockChange() {
    console.log("The pointer lock was changed!");
}

function lockError() {
    console.log("Error!");
}

if ("onpointerlockchange" in document) document.addEventListener("pointerlockchange", lockChange, false);
else if ("onmozpointerlockchange" in document) document.addEventListener("mozpointerlockchange", lockChange, false);
else if ("onwebkitpointerlockchange" in document) document.addEventListener("webkitpointerlockchange", lockChange, false);

document.addEventListener("pointerlockerror", lockError, false);
document.addEventListener("mozpointerlockerror", lockError, false);
document.addEventListener("webkitpointerlockerror", lockError, false);

target.requestLock();		// request lock
target.requestUnlock();		// request pointer unlock
```

Becomes this:

```javascript
let mouse = new Mouse(target);

mouse.on("lockchange", function () {
    console.log("The pointer lock was changed!");
});

mouse.on("lockerror", function () {
    console.log("Error!");
})

mouse.pointerLock();		// request lock
mouse.pointerUnlock();		// request unlock
```

**Helper Functions**

Mouse.js also provides a lot of helper functions!

```javascript
let mouse = new Mouse();

mouse.pressed("left");		// checks if left button is pressed
mouse.pressed(0);			// it also works with button codes ;)

mouse.pointerLock();		// lock pointer
mouse.locked				// => true
mouse.pointerUnlock();		// unlock pointer
mouse.locked				// => false

// gets the name of a mouse button code
mouse.nameOf(0);			// => "left"
// gets the code of a mouse button name
mouse.codeOf("left");		// => 0
```

## Installation

**Use ES6 Import**

JS:

```javascript
import { Mouse } from "./mouse.js"

let mouse = new Mouse();
```

**Include as a script tag**

HTML:

```html
<!DOCTYPE html>
<html>
    <head>
        
    </head>
    <body>
        <script src="path/to/mouse.js"></script>
        <script>
            let mouse = new Mouse();
        </script>
    </body>
</html>
```

Either way, you can just grab Mouse.js and include it with your project!

## Methods

### Mouse()

Creates a new Mouse object.

```javascript
Mouse(target: object)
```

**Target** (optional): The target of the pointer lock API (DOM object). Will default to `document.body` if not provided.

### Mouse.on()

Attaches a callback to an event listener. 

```javascript
mouse.on(event: string, callback: function) 			// => boolean
```

**Event:** The event the callback should be attached to. See [MouseEvents](#mousevents) for the possible events.

**Callback:** A function which will be called when the event happens.

**Returns:** Whether or not the action was completed.

### Mouse.off()

Removes a callback from an event listener.

```javascript
mouse.off(event: string, callback: function | string)	// => boolean
```

**Event:** The event of the callback to be removed. See [MouseEvents](#mousevents) for the possible events.

**Callback:** The function to be removed.  Use the string `"all"` to remove all of the listeners from the event.

**Returns:** Whether or not the action was completed.

### Mouse.pressed()

Checks whether or not a button is pressed.

```javascript
mouse.pressed(button: string | number)						// => boolean
```

**Button:** The targeted button code or button name. Can be a number or a string.

**Returns:** Whether or not the button is down.

### Mouse.codeOf()

Returns the code of a mouse button, given a name.

```javascript
mouse.codeOf(name: string)									// => number
```

**Button:** The name of the button.

**Returns:** The code of the button (undefined if not found)

### Mouse.nameOf()

Returns the name of a mouse button, given a code.

```javascript
mouse.nameOf(code: number)									// => string
```

**Button:** The code of the button.

**Returns:** The name of the button (undefined if not found)

### MouseEvents

| Name           | Description                                                  | Passes                 |
| -------------- | ------------------------------------------------------------ | ---------------------- |
| `move`         | Called on the mousemove event, after the mouse object has been updated. | The MouseEvent trigger |
| `{button}down` | Called when any button on the mouse is pressed. `{button}` can be `left, right, middle, back, or next`. Use `anydown` to listen to all mousedown events. | The MouseEvent trigger |
| `{button}up`   | Like `{button}down`, but called when a mouse button is unpressed. Use `anyup` to listen to all mouseup events. | The MouseEvent trigger |
| `lockchange`   | Called when the pointer lock change state changes            | mouse.locked           |
| `lock`         | Called when the mouse pointer is locked to the target        | nothing                |
| `unlock`       | Called when the mouse pointer is unlocked from the target    | nothing                |
| `lockerror`    | Called when the pointer lock API throws an error             | nothing                |
