interface ISession extends IDeviceTemplate {
    name: string;
    description: string;
    isActive: boolean;
    proxy: string;
}


type ListSessions = ISession[];