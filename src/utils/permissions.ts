import type { Directive } from 'vue'

const checkKey = (key: string[]) => {
  // 获取权限数组
  const username = sessionStorage.getItem('userPermissions') || ''
  return key.includes(username)
}

export const buttonPermissions: Directive<HTMLInputElement, any> = (
  el,
  binding
) => {
  const buttonKey = binding.value
  if (buttonKey) {
    const key = checkKey(buttonKey)
    if (!key)
      el.remove()
  }
}
