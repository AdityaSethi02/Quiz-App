import { useEffect, useState } from "react";
import io from "socket.io-client";
import { CreateProblem } from "./CreateProblem";

export const Admin = () => {
    const [socket, setSocket] = useState<null | any>(null);
    const [quizId, setQuizId] = useState("");
    const [roomId, setRoomId] = useState("");
    useEffect(() => {
        const socket = io('http:localhost:3000');
        setSocket(socket);

        socket.on("connect", () => {
            console.log(socket.id);
            socket.emit("JOIN_ADMIN", {
                password: "ADMIN_PASSWORD"
            })
        });
        // socket.on("")
    }, [])

    if (!quizId)
    {
        return (
            <div>
                <input type = "text" onChange={(e) => {
                    setRoomId(e.target.value);
                }} />

                <br />

                <button onClick={() => {
                    socket.emit("CREATE_QUIZ");
                    setQuizId(roomId);
                }}>Create Quiz Room</button>
            </div>
        )
    }

    return (
        <div>
            <CreateProblem roomId = {quizId} socket = {socket} />
        </div>
    )
}