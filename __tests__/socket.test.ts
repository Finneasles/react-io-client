import { useSocket } from "../src/index";

describe("use-hook test:", () => {
  it("connect test", (done) => {
    const uri = "ws://host:port";
    const [socket] = useSocket(uri, {
      autoConnect: false,
    });
    done(socket.connect());
  });
});
