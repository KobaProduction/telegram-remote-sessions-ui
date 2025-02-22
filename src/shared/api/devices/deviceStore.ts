import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Device } from 'components/sessions/CreateSession/model'

export const useDeviceStore = defineStore('device', () => {
  const devices = ref<Device[]>(JSON.parse(localStorage.getItem('devices') || '[]'))
  const currentPage = ref(1)
  const rowsPerPage = ref(5)
  const rowsPerPageOptions = [5, 10, 20] as const

  const paginatedDevices = computed(() => {
    const start = (currentPage.value - 1) * rowsPerPage.value
    return devices.value.slice(start, start + rowsPerPage.value)
  })

  const saveDevice = (newDevice: Device) => {
    if (devices.value.some(device => device.deviceName === newDevice.deviceName)) {
      return false
    }
    devices.value.push(newDevice)
    localStorage.setItem('devices', JSON.stringify(devices.value))
    return true
  }

  const deleteDevice = (index: number) => {
    devices.value.splice(index, 1)
    localStorage.setItem('devices', JSON.stringify(devices.value))
  }

  const updateDevice = (index: number, updatedDevice: Device) => {
    devices.value[index] = updatedDevice
    localStorage.setItem('devices', JSON.stringify(devices.value))
  }

  return {
    devices,
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    paginatedDevices,
    saveDevice,
    deleteDevice,
    updateDevice
  }
})
