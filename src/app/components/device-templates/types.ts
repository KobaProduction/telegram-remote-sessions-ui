interface IDeviceTemplate {
    apiId: number;
    apiHash: string;
    device_model: string;
    system_version: string;
    app_version: string;
    lang_code: string
    system_lang_code: string;
}


type ListDevices = IDeviceTemplate[];