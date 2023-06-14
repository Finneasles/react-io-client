# react-io-client

[![thumbnail](https://repository-images.githubusercontent.com/584224529/39430953-efa7-4b46-b0c7-f89491303b53)](https://i.imgur.com/Ob4qAwu.png)

> Note: The socket connection does not come with any event handlers. Those should be added and managed by the component that use this hook. [More information](https://f1n.dev/react-io-client/).

## Getting Started

Install dependency:

```bash
npm i react-io-client
```

### Example

Here's an example of how to use the useSocket hook in a React component:

```js
import { useSocket } from  "react-io-client";
import  React, { useEffect, useState } from  "react";

export  default  function  Chat() {
const [socket] = useSocket("ws://localhost:3000", { autoConnect:  false });
const [messages, setMessages] = useState([]);

useEffect(() => {
if (!socket) return;
socket.on("message", (message: string) => {
setMessages((prevMessages) => [...prevMessages, message]);
});
socket.emit("join", "room1");
return () => {
socket.off("message");
socket.emit("leave", "room1");
};
}, [socket]);

return messages.map((message, index) => {
return <div  key={index}>{message}</div>;
});
}
```

## Learn More

* The hook must be wrapped in a useEffect to avoid memory leaks.

You can learn more in the [Documentation](https://f1n.dev/react-io-client).
