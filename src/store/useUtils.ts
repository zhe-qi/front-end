import { defineStore } from 'pinia'
import type { Question } from '@/views/answerPage/types'

export const useAside = defineStore('useAside', () => {
  const detailWidth = ref(200)

  const examQuery = ref({
    type: '',
    num: 0,
  })

  const setExam = (type: string, num: number) => {
    examQuery.value = {
      type,
      num,
    }
  }

  const res = ref<{
    data: Question[]
    grade: number
  }>({
    grade: 0,
    data: []
  })

  const setRes = (grade: number, data: Question[]) => {
    res.value = {
      grade,
      data
    }
  }

  return {
    detailWidth,
    examQuery,
    setExam,
    res,
    setRes
  }
}, {
  persist: {
    enabled: true,
  }
})
