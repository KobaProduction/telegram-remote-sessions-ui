import {useState} from "react";

interface DefaultInputProps {
    name: string
    defaultValue: string
    type: string
    callback: (event: any, inputData: string) => void

}

const DefaultInput = (props: DefaultInputProps) => {
    const [value, setValue] = useState(props.defaultValue)

    return (
        <input
            type={props.type ? props?.type : "text"}
            name={props.name}
            value={value}
            onChange={(e) => {
                setValue(e.target.value)
                props.callback(e, e.target.value)
            }}
        />
    )

}

export default DefaultInput;