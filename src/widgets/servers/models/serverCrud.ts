// import { Notify } from 'quasar'
// import { AxiosError } from 'axios'

// export const addServer = async () => {
//   if (!newServerURL.value.trim() || !newServerName.value.trim()) return
//
//   const serverUrl = newServerURL.value.trim()
//   const serverName = newServerName.value.trim()
//
//   if (Object.values(serverStore.serverHistory).includes(serverUrl)) {
//     addServerUrlErrorMessage.value = 'Server with such URL already exists'
//     return
//   }
//   if (serverStore.serverHistory[serverName]) {
//     addServerErrorMessage.value = 'Server with such name already exists'
//     return
//   }
//   const api = serverStore.createApiInstance(serverUrl)
//   addServerErrorMessage.value = ''
//   try {
//     const status = await api.getStatus()
//
//     if (status.status === 'ok') {
//       serverStore.serverHistory[serverName] = serverUrl
//       serverStore.saveServerHistory()
//       newServerURL.value = ''
//       newServerName.value = ''
//       await updateServerStatuses()
//       Notify.create({
//         message: 'The server is successfully added!',
//         color: 'green',
//         position: 'bottom',
//         timeout: 1000,
//         progress: true
//       })
//     }
//   } catch (e) {
//     if (e instanceof AxiosError) {
//       if (e?.message) {
//         addServerUrlErrorMessage.value = e.message
//       }
//     }
//   }
// }
