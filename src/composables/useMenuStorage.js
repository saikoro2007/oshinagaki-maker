import { ref, reactive, computed, watch, onMounted } from 'vue'
import {
  INITIAL_MENU_STATE,
  MOZU_GRAND_MENU_STATE,
  MOZU_DRINK_MENU_STATE
} from '../constants/presets'

export const STORAGE_KEY_DAILY = 'oshinagaki_maker_menu_data'
export const STORAGE_KEY_GRAND = 'oshinagaki_maker_grand_menu_data'
export const STORAGE_KEY_DRINK = 'oshinagaki_maker_drink_menu_data'
export const STORAGE_KEY_ACTIVE_TYPE = 'oshinagaki_maker_active_type'

export function useMenuStorage() {
  // Menu Mode: 'grand' (定番料理) | 'drink' (お飲み物) | 'daily' (本日のおすすめ)
  const menuType = ref('grand')
  const showSaveToast = ref(false)
  let toastTimer = null

  // 各種メニューのリアクティブデータ
  const dailyMenuData = reactive(JSON.parse(JSON.stringify(INITIAL_MENU_STATE)))
  const grandMenuData = reactive(JSON.parse(JSON.stringify(MOZU_GRAND_MENU_STATE)))
  const drinkMenuData = reactive(JSON.parse(JSON.stringify(MOZU_DRINK_MENU_STATE)))

  // 現在選択中のメニューデータ
  const currentActiveData = computed(() => {
    if (menuType.value === 'daily') return dailyMenuData
    if (menuType.value === 'drink') return drinkMenuData
    return grandMenuData
  })

  function triggerSaveToast() {
    showSaveToast.value = true
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      showSaveToast.value = false
    }, 1500)
  }

  // LocalStorage からの初期ロード＆マイグレーション
  function loadInitialData() {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const paramType = urlParams.get('type')
      if (paramType === 'daily' || paramType === 'grand' || paramType === 'drink') {
        menuType.value = paramType
      } else {
        const savedType = localStorage.getItem(STORAGE_KEY_ACTIVE_TYPE)
        if (savedType === 'daily' || savedType === 'grand' || savedType === 'drink') {
          menuType.value = savedType
        }
      }

      // 1. Daily Menu Load & Migration
      const savedDaily = localStorage.getItem(STORAGE_KEY_DAILY)
      if (savedDaily) {
        const parsedDaily = JSON.parse(savedDaily)
        const hasLegacyHakkaku = parsedDaily.items?.some(it => it.name && it.name.includes('八角'))
        const hasLegacyGarlic = parsedDaily.items?.some(it => it.name && it.name.includes('十勝さん'))
        const hasLegacyNote = !parsedDaily.footerNote
        if (parsedDaily.version === INITIAL_MENU_STATE.version && !hasLegacyHakkaku && !hasLegacyGarlic && !hasLegacyNote) {
          Object.assign(dailyMenuData, parsedDaily)
        } else {
          const updatedDaily = JSON.parse(JSON.stringify(INITIAL_MENU_STATE))
          for (const k of Object.keys(dailyMenuData)) delete dailyMenuData[k]
          Object.assign(dailyMenuData, updatedDaily)
          localStorage.setItem(STORAGE_KEY_DAILY, JSON.stringify(updatedDaily))
        }
      }

      // 2. Grand Menu Load & Migration
      const savedGrand = localStorage.getItem(STORAGE_KEY_GRAND)
      if (savedGrand) {
        const parsed = JSON.parse(savedGrand)
        if (parsed.version === MOZU_GRAND_MENU_STATE.version) {
          Object.assign(grandMenuData, parsed)
        } else {
          const keepLogo = parsed.logoImage || parsed.noticeBlock?.logoImage || ''
          const updated = JSON.parse(JSON.stringify(MOZU_GRAND_MENU_STATE))
          if (keepLogo) {
            updated.logoImage = keepLogo
            if (updated.noticeBlock) updated.noticeBlock.logoImage = keepLogo
          }
          for (const k of Object.keys(grandMenuData)) delete grandMenuData[k]
          Object.assign(grandMenuData, updated)
          localStorage.setItem(STORAGE_KEY_GRAND, JSON.stringify(updated))
        }
      }

      // 3. Drink Menu Load & Migration
      const savedDrink = localStorage.getItem(STORAGE_KEY_DRINK)
      if (savedDrink) {
        const parsedDrink = JSON.parse(savedDrink)
        if (parsedDrink.version === MOZU_DRINK_MENU_STATE.version) {
          Object.assign(drinkMenuData, parsedDrink)
        } else {
          const updatedDrink = JSON.parse(JSON.stringify(MOZU_DRINK_MENU_STATE))
          for (const k of Object.keys(drinkMenuData)) delete drinkMenuData[k]
          Object.assign(drinkMenuData, updatedDrink)
          localStorage.setItem(STORAGE_KEY_DRINK, JSON.stringify(updatedDrink))
        }
      }
    } catch (e) {
      console.error('Failed to load menu data from localStorage:', e)
    }
  }

  // 永続化監視
  watch(menuType, (newType) => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_TYPE, newType)
    } catch (e) {
      console.error(e)
    }
  })

  watch(
    dailyMenuData,
    (newVal) => {
      try {
        localStorage.setItem(STORAGE_KEY_DAILY, JSON.stringify(newVal))
        triggerSaveToast()
      } catch (e) {
        console.error(e)
      }
    },
    { deep: true }
  )

  watch(
    grandMenuData,
    (newVal) => {
      try {
        localStorage.setItem(STORAGE_KEY_GRAND, JSON.stringify(newVal))
        triggerSaveToast()
      } catch (e) {
        console.error(e)
      }
    },
    { deep: true }
  )

  watch(
    drinkMenuData,
    (newVal) => {
      try {
        localStorage.setItem(STORAGE_KEY_DRINK, JSON.stringify(newVal))
        triggerSaveToast()
      } catch (e) {
        console.error(e)
      }
    },
    { deep: true }
  )

  function resetDefaultDaily() {
    if (confirm('本日のおすすめを初期設定に戻しますか？')) {
      for (const k of Object.keys(dailyMenuData)) delete dailyMenuData[k]
      Object.assign(dailyMenuData, JSON.parse(JSON.stringify(INITIAL_MENU_STATE)))
    }
  }

  function resetDefaultGrand() {
    if (confirm('定番料理メニューを初期設定に戻しますか？')) {
      for (const k of Object.keys(grandMenuData)) delete grandMenuData[k]
      Object.assign(grandMenuData, JSON.parse(JSON.stringify(MOZU_GRAND_MENU_STATE)))
    }
  }

  function resetDefaultDrink() {
    if (confirm('お飲み物メニューを初期設定に戻しますか？')) {
      for (const k of Object.keys(drinkMenuData)) delete drinkMenuData[k]
      Object.assign(drinkMenuData, JSON.parse(JSON.stringify(MOZU_DRINK_MENU_STATE)))
    }
  }

  function loadSlot(slot) {
    if (slot.type === 'daily') {
      menuType.value = 'daily'
      for (const k of Object.keys(dailyMenuData)) delete dailyMenuData[k]
      Object.assign(dailyMenuData, slot.data)
    } else if (slot.type === 'drink') {
      menuType.value = 'drink'
      for (const k of Object.keys(drinkMenuData)) delete drinkMenuData[k]
      Object.assign(drinkMenuData, slot.data)
    } else {
      menuType.value = 'grand'
      for (const k of Object.keys(grandMenuData)) delete grandMenuData[k]
      Object.assign(grandMenuData, slot.data)
    }
  }

  function loadPreset(type) {
    if (type === 'daily') {
      menuType.value = 'daily'
      for (const k of Object.keys(dailyMenuData)) delete dailyMenuData[k]
      Object.assign(dailyMenuData, JSON.parse(JSON.stringify(INITIAL_MENU_STATE)))
    } else if (type === 'drink') {
      menuType.value = 'drink'
      for (const k of Object.keys(drinkMenuData)) delete drinkMenuData[k]
      Object.assign(drinkMenuData, JSON.parse(JSON.stringify(MOZU_DRINK_MENU_STATE)))
    } else {
      menuType.value = 'grand'
      for (const k of Object.keys(grandMenuData)) delete grandMenuData[k]
      Object.assign(grandMenuData, JSON.parse(JSON.stringify(MOZU_GRAND_MENU_STATE)))
    }
  }

  function addItemFromPreset(item) {
    dailyMenuData.items.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
      name: item.name,
      price: item.price,
      note: item.note || '',
      translation: item.translation || '',
    })
  }

  function applySharedData(type, data) {
    const incomingLogo = data.logoImage || data.noticeBlock?.logoImage || ''

    if (type === 'daily') {
      menuType.value = 'daily'
      for (const k of Object.keys(dailyMenuData)) delete dailyMenuData[k]
      Object.assign(dailyMenuData, data)
    } else if (type === 'drink') {
      menuType.value = 'drink'
      const existingDrinkLogo = drinkMenuData.logoImage || drinkMenuData.noticeBlock?.logoImage || ''
      for (const k of Object.keys(drinkMenuData)) delete drinkMenuData[k]
      Object.assign(drinkMenuData, data)
      const finalLogo = incomingLogo || existingDrinkLogo
      if (finalLogo) {
        drinkMenuData.logoImage = finalLogo
        if (drinkMenuData.noticeBlock) drinkMenuData.noticeBlock.logoImage = finalLogo
      }
    } else {
      menuType.value = 'grand'
      const existingGrandLogo = grandMenuData.logoImage || grandMenuData.noticeBlock?.logoImage || ''
      for (const k of Object.keys(grandMenuData)) delete grandMenuData[k]
      Object.assign(grandMenuData, data)
      const finalLogo = incomingLogo || existingGrandLogo
      if (finalLogo) {
        grandMenuData.logoImage = finalLogo
        if (grandMenuData.noticeBlock) grandMenuData.noticeBlock.logoImage = finalLogo
      }
    }
    triggerSaveToast()
  }

  onMounted(() => {
    loadInitialData()
  })

  return {
    menuType,
    showSaveToast,
    dailyMenuData,
    grandMenuData,
    drinkMenuData,
    currentActiveData,
    triggerSaveToast,
    resetDefaultDaily,
    resetDefaultGrand,
    resetDefaultDrink,
    loadSlot,
    loadPreset,
    addItemFromPreset,
    applySharedData,
  }
}
