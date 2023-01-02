## Getting Started

Install dependency:

```bash
npm i react-socket
```

use the useSocket hook to get the socket connection:

```javascript
import { useSocket } from "react-socket";

const [socket] = useSocket(SOCKET_SERVER_URL, {
    // access query on socket.handshake.query on server
    query: { "someKey": "someValue"},
    autoConnect: false,
    reconnection: false,
    auth: (cb: ({}) => void) => {
      cb({
        // access token on socket.handshake.auth on server
        token: "token",
      });
    },
  });
  
  ```

# Example : 
```javascript
import type { AppProps } from "next/app";
import { useSocket } from "react-socket";
import App from "next/app";

const SOCKET_SERVER_URL = "ws://localhost:4000";

function MyApp({ Component, pageProps }: AppProps) {

const [socket] = useSocket(SOCKET_SERVER_URL, {
    // access query on socket.handshake.query on server
    query: { "someKey": "someValue"},
    autoConnect: false,
    reconnection: false,
    auth: (cb: ({}) => void) => {
      cb({
        // access token on socket.handshake.auth on server
        token: "token",
      });
    },
  });

    useEffect(()=>{
        socket.connect();
        if(socket.connected){
            consle.log("Socket connected." ,socket)
        }else{
            consle.log("Failed to connect." ,socket.error)
        }

    },[]);

  return <Component {...pageProps} />;
}

export default MyApp;

```

# Types 

useSocket input types: 
```javascript
const useSocket = (url: string, options?: SocketOptions & any) => {...});
```