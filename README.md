
# react-io-client

This is a custom hook for react applications that creates a connection to a websocket server using the [socket.io-client library](https://socket.io/docs/v4/client-api/). The hook takes in two parameters: a `url: string`, which is the address of the [websocket server](https://socket.io/docs/v4/server-instance/), and an optional `options: object`, which can contain additional options to pass to the io() function.

The hook uses the [useRef](https://reactjs.org/docs/hooks-reference.html#useref) hook to create a ref that holds the socket connection created by the io() function. The [useEffect hook](https://reactjs.org/docs/hooks-effect.html) is then used to close the socket connection when the component using the hook is unmounted or the connection is re-established to avoid memory leaks.

The hook exports the [Socket type](https://socket.io/docs/v4/typescript/#types-for-the-client) from the [socket.io-client library](https://socket.io/docs/v4/client-api/), so it can be used by other parts of the application. Also it returns an array with the single element as the socket instance.

> Note: The socket connection does not come with any event handlers. Those should be added and managed by the component that use this hook. [More information](#additional-information).


## Getting Started

Install dependency:
```bash
npm i react-socket
```

### Example:

Here's an example of how to use the useSocket hook in a React component:
```js
import { useSocket } from  "react-socket";
import  React, { useEffect, useState } from  "react";

export  default  function  Chat() {
const [socket] = useSocket("ws://localhost:3000", { autoConect:  false });
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

return  messages.map((message, index) => {
return  <div  key={index}>{message}</div>;
});
}
```
> `useEffect` hook is used in this example to handle the side effect of creating a socket connection, but if you're already using useEffect in your component, you can use that one to handle the side effect of managing the websocket as well.

In this example, the Chat component is using the useSocket hook to create a websocket connection to the server at `ws://localhost:3000`. The hook returns an array containing the socket instance. The component uses the [useEffect hook](https://reactjs.org/docs/hooks-effect.html) to listen for incoming "message" events on the socket, and adds them to the component's state.

When the component is unmounted or the socket connection is re-established, the [useEffect callback](https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup) will be called and it removes the "message" event handler, and emit the "leave" event to the server to leave the chat room.

The types for the useSocket function are as follows:
```js
interface  SocketOptions {
// options specific to the "socket.io-client" library
}

declare  function  useSocket(
url: string,
options?: SocketOptions & any
): [Socket | undefined];
```

It takes two parameters, a required string url and an optional options object of type SocketOptions. and the returned array contains an element of type [Socket](https://socket.io/docs/v4/typescript/#types-for-the-client) or undefined

The [Socket type](https://socket.io/docs/v4/typescript/#types-for-the-client) from the [socket.io-client library](https://www.npmjs.com/package/socket.io-client) is a class that provides an interface for interacting with a [websocket server](https://socket.io/docs/v4/server-instance/). It has methods such as [emit](https://socket.io/docs/v4/emitting-events/), [on](https://socket.io/docs/v4/listening-to-events/#socketoneventname-listener), [off](https://socket.io/docs/v4/listening-to-events/#socketoffeventname-listener), [close](https://socket.io/docs/v4/server-api/#serverclosecallback), etc that are used to send and receive data and events over the websocket connection. These methods are documented in the [socket.io-client documentation](https://socket.io/docs/v4/client-api/).

### Important information

the `useSocket` hook is only responsible for creating and managing the socket connection, but it does not come with any predefined event handlers for handling incoming events from the server. This is left up to the component that uses the hook to add and manage.

When you create a socket connection, you can listen to events that are emitted from the server, and in turn, handle them in some way in your component, by using the `on` method provided by the socket instance.

For example, in the above example code I provided, the Chat component is using the `useEffect` hook to listen to the "message" event, and adding the messages to the component's state.

```js
useEffect(() => {
    if (!socket) return;
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    //..
  }, [socket]);
```

This is a common pattern when using websockets in a React application, where the component uses the `useEffect` hook to add event handlers to the socket when the component mounts, and removes them when the component unmounts, to avoid memory leaks.

It's worth mentioning that the code is also emitting "join" event on the "socket" instance, this is an example of how we can emit an event to the server.

```js
socket.emit("join", "room1");
```

You can also use `off` method to remove the specific event listener, in the above example when the component unmount, we remove the "message" event handler by calling:

```js
socket.off("message");
```

t's important to keep in mind that if the component that uses the `useSocket` hook is unmounting or re-rendering the new instance of the component, your event handlers added by `on` method will not be removed automatically and would lead to potential memory leaks. Read [additional information](#additional-information).

### Additional Information

1.  You should make sure that the component that uses the hook is only mounted and unmounted when the component is meant to be active or inactive. If the component re-renders frequently, the hook will create and close the socket connection each time, which may lead to poor performance and unexpected behaviour.
    
2.  The hook does not automatically handle errors that occur during the websocket connection or handle cases where the websocket connection is closed by the server.  
> If you want to handle this case, you can add an event listener for the `"disconnect"` and `"error"` event on the socket instance using the `on` method, and handle them in your component accordingly.  

The client API provides us with following built in events :
-   **Connect**  − When the client successfully connects.
-   **Connecting**  − When the client is in the process of connecting.
-   **Disconnect**  − When the client is disconnected.
-   **Connect_failed**  − When the connection to the server fails.
-   **Error**  − An error event is sent from the server.
-   **Message**  − When the server sends a message using the  **send**  function.
-   **Reconnect**  − When reconnection to the server is successful.
-   **Reconnecting**  − When the client is in the process of connecting.
-   **Reconnect_failed**  − When the reconnection attempt fails.

For example, you can handle errors and disconnect this way : 
```js 

useEffect(() => {
 if (!socket) return;
 socket.on("error", (error)=>{
 console.log(error.message);
});

socket.on("disconnect", ()=>{
 console.log("Disconnected from server");
});
  }, [socket]);
  
```