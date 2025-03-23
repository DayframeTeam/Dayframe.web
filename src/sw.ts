import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('🆕 Доступна новая версия. Обновление...');
    updateSW(true);
  },
  onOfflineReady() {
    console.log('📦 Готово к офлайн-режиму');
  },
});
