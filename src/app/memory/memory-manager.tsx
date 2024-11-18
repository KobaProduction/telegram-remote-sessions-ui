class MemoryManager {
    sessions: ListSessions = []
    devices: ListDevices = []

    private memoryKeyFromLocalStorage = "memory"

    constructor () {
        let memRawData = localStorage.get(this.memoryKeyFromLocalStorage)

        if (!memRawData) return

        try {
            const mem = JSON.parse(memRawData)
            if (mem?.sessions && mem.sessions.length) {
                this.sessions = mem.sessions
            }
            if (mem?.devices && mem.devices.length) {
                this.devices = mem.devices
            }
        } catch (e) {
            this.save()
        }
    }

    save() {
        localStorage.set(
            this.memoryKeyFromLocalStorage, JSON.stringify({sessions: this.sessions, devices: this.devices})
        )
    }

}