import React, {useState, useEffect} from "react";
import DefaultForm from "@/app/components/ui/forms/DefaultForm";
import DefaultInput from "@/app/components/ui/inputs/BaseInput";

// const sessionSchema = z.object({
//     name: z.string().min(1, "Имя не может быть пустым"), // Проверка на непустое значение
//     apiId: z.string().min(10, "API ID должно содержать минимум 10 символов"),
//     apiToken: z.string().min(10, "API Token должен содержать минимум 10 символов"),
//     proxy: z.string().url("Некорректный URL для прокси"),
//     deviceId: z.string().min(1, "ID устройства не может быть пустым"),
// });

import Form from "next/form"





interface FormProps {
    sessionData: ISession
}

const SessionFormTemplateSerent = (props: FormProps) => {




    return (
        <Form
            action={
                (e) => {
                    console.log(e)
                }
            }

        >
            <DefaultInput
                name={"123"}
                defaultValue={"12312311"}
                type={"text"}
                callback={
                    (e, value) => {
                        console.log(e, value);
                    }
                }
            />
            <button type="submit" value="Submit">Submit</button>
        </Form>

    )

    // return (
    //     <DefaultForm>
    //         <DefaultInput
    //             name={"123"}
    //             defaultValue={"12312311"}
    //             type={"text"}
    //             callback={
    //                 (e, value) => {
    //                     console.log(e, value);
    //                 }
    //             }
    //         />
    //     </DefaultForm>
    // )

}

export default SessionFormTemplateSerent;
