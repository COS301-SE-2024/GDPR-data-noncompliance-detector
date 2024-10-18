const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSupabaseConfig: () => ipcRenderer.invoke('get-supabase-config')
});
