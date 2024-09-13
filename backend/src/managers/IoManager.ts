import { Server } from "socket.io";

export class IoManager
{
    private static io;
    private static instance: IoManager;

    public static getIo(io: Server)
    {
        if(!this.instance)
        {
            this.instance = new IoManager();
        }
        return this.instance;
    }


}