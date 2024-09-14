import { useState } from "react"

export const CreateProblem = ({socket, roomId}: {socket: any; roomId: string}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [answer,setAnswer] = useState(0);
    const [options, setOptions] = useState([
        {
            id: 1,
            title: ""
        },
        {
            id: 2,
            title: ""
        },
        {
            id: 3,
            title: ""
        },
        {
            id: 4,
            title: ""
        }
    ]);


    return (
        <div>
            Question
            <br />
            Title: <input type = "text" onChange={(e) => {
                setTitle(e.target.value);
            }}></input>
            <br />
            Desciption: <input type = "text" onChange={(e) => {
                setDescription(e.target.value);
            }}></input>

            <br />

            {[1, 2, 3, 4].map(optionId => <div>
                <input type="radio" checked={optionId === answer} onChange={() => {
                    setAnswer(optionId)
                }}></input>
                Option {optionId}
                <input type = "text" onChange={(e) => {
                    setOptions(options => options.map(x => {
                        if (x.id === optionId)
                        {
                            return {
                                ...x,
                                title: e.target.value
                            }
                        }
                        return x;
                    }))
                }}></input>
            <br />
            </div>)}

            <button onClick={() => {
                socket.emit("CREATE_PROBLEM", {
                    roomId,
                    problem: {
                        title,
                        description,
                        options,
                        answer
                    }
                });
            }}>Add the question</button>
        </div>
    )
}