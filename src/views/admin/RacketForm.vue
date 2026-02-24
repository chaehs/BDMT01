<template>
  <div class="max-w-4xl">
    <div class="mb-8">
      <h2 class="text-3xl font-black text-gray-900">{{ isEdit ? '라켓 수정' : '신규 라켓 등록' }}</h2>
      <p class="text-gray-500 font-medium mt-1">상세 스펙을 입력해 주세요. 작성 중인 내용은 자동 저장됩니다.</p>
    </div>

    <form @submit.prevent="saveRacket" class="space-y-8 pb-20">
      <!-- 기본 정보 섹션 -->
      <section class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <h3 class="text-lg font-black text-gray-800 border-b pb-4">기본 정보</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">라켓 명칭 *</label>
            <input v-model="form.name" type="text" required class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" placeholder="예: ASTROX 100 ZZ">
          </div>
          
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">브랜드 *</label>
            <select v-model="form.brand" required class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold">
              <option value="YONEX">YONEX</option>
              <option value="VICTOR">VICTOR</option>
              <option value="LI-NING">LI-NING</option>
              <option value="MIZUNO">MIZUNO</option>
            </select>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-black text-gray-400 uppercase tracking-wider">이미지 URL 또는 파일명</label>
          <input v-model="form.image_url" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" placeholder="이미지 파일명을 입력하세요.">
        </div>
      </section>

      <!-- 상세 스펙 섹션 -->
      <section class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <h3 class="text-lg font-black text-gray-800 border-b pb-4">상세 스펙</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">무게</label>
            <input v-model="form.weight" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" placeholder="4U">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">밸런스</label>
            <input v-model="form.balance" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" placeholder="HEAD HEAVY">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">탄성</label>
            <input v-model="form.flex" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" placeholder="STIFF">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">최대장력</label>
            <input v-model="form.max_tension" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" placeholder="28lbs">
          </div>
        </div>
      </section>

      <!-- 버튼 영역 -->
      <div class="flex gap-4">
        <button 
          type="button" 
          @click="$router.push('/admin/rackets')" 
          class="flex-1 py-4 bg-gray-200 text-gray-600 rounded-2xl font-black hover:bg-gray-300 transition-all"
        >
          취소
        </button>
        <button 
          type="submit" 
          :disabled="isSaving"
          class="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all disabled:opacity-50"
        >
          {{ isSaving ? '저장 중...' : (isEdit ? '수정 완료' : '라켓 등록하기') }}
        </button>
      </div>
    </form>

    <!-- 임시 저장 알림 -->
    <div v-if="hasDraft && !isEdit" class="fixed bottom-10 right-10 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 animate-bounce flex items-center gap-4">
      <span class="text-sm font-bold">이전에 작성하던 내용이 있습니다.</span>
      <button @click="loadDraft" class="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-black">불러오기</button>
      <button @click="clearDraft" class="text-gray-400 text-xs font-bold underline">삭제</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../../supabase'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const isSaving = ref(false)
const hasDraft = ref(false)

const form = reactive({
  name: '',
  brand: 'YONEX',
  image_url: '',
  weight: '',
  balance: '',
  flex: '',
  max_tension: '',
  grip_size: 'G5',
  colors: [],
  tags: []
})

// 폼 데이터 로드 (수정 모드)
const loadRacketData = async () => {
  if (!isEdit.value) {
    checkDraft()
    return
  }
  
  const { data, error } = await supabase
    .from('rackets')
    .select('*')
    .eq('id', route.params.id)
    .single()
  
  if (data) {
    Object.assign(form, data)
  }
}

onMounted(() => {
  loadRacketData()
})

// 임시 저장 기능 (localStorage)
const STORAGE_KEY = 'BDMT01_RACKET_FORM_DRAFT'

watch(form, (newVal) => {
  if (!isEdit.value) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
  }
}, { deep: true })

const checkDraft = () => {
  const draft = localStorage.getItem(STORAGE_KEY)
  if (draft) hasDraft.value = true
}

const loadDraft = () => {
  const draft = localStorage.getItem(STORAGE_KEY)
  if (draft) {
    Object.assign(form, JSON.parse(draft))
    hasDraft.value = false
  }
}

const clearDraft = () => {
  localStorage.removeItem(STORAGE_KEY)
  hasDraft.value = false
}

// 저장 로직
const saveRacket = async () => {
  isSaving.value = true
  try {
    let result
    if (isEdit.value) {
      result = await supabase
        .from('rackets')
        .update(form)
        .eq('id', route.params.id)
    } else {
      result = await supabase
        .from('rackets')
        .insert([form])
    }

    if (result.error) throw result.error
    
    alert(isEdit.value ? '수정되었습니다.' : '등록되었습니다.')
    if (!isEdit.value) clearDraft()
    router.push('/admin/rackets')
  } catch (err) {
    alert('저장 실패: ' + err.message)
  } finally {
    isSaving.value = false
  }
}
</script>
