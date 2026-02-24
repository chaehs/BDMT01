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
          <label class="text-xs font-black text-gray-400 uppercase tracking-wider">라켓 이미지</label>
          <div class="flex items-center gap-4">
            <img :src="imagePreviewUrl" alt="Racket image preview" class="w-32 h-32 object-cover rounded-xl bg-gray-100 border border-gray-200">
            <div class="flex-1">
              <input 
                type="file" 
                @change="onFileChange" 
                accept="image/*" 
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              >
              <p class="mt-1 text-xs text-gray-500">PNG, JPG, GIF 등 이미지 파일을 선택하세요.</p>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-black text-gray-400 uppercase tracking-wider">대표 색상 (쉼표로 구분)</label>
          <input v-model="form.colors" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" placeholder="예: Red, Blue, Black">
        </div>
      </section>

      <!-- 상세 스펙 섹션 -->
      <section class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <h3 class="text-lg font-black text-gray-800 border-b pb-4">상세 스펙</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">무게</label>
            <input v-model="form.weight" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" placeholder="4U">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">밸런스</label>
            <input v-model="form.balance" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" placeholder="HEAD HEAVY">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">밸런스 포인트 (mm)</label>
            <input v-model.number="form.bal_point" type="number" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" placeholder="305">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">탄성</label>
            <input v-model="form.flex" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" placeholder="STIFF">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">최대장력 (lbs)</label>
            <input v-model="form.max_tension" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" placeholder="28">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">그립 두께</label>
            <input v-model="form.grip_size" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" placeholder="G5">
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
const imageFile = ref(null)

const form = reactive({
  name: '',
  brand: 'YONEX',
  image_url: '',
  weight: '',
  balance: '',
  bal_point: null,
  flex: '',
  max_tension: '',
  grip_size: '',
  colors: '',
})

const imagePreviewUrl = computed(() => {
  if (imageFile.value) {
    return URL.createObjectURL(imageFile.value)
  }
  if (form.image_url) {
    if (form.image_url.startsWith('http')) return form.image_url
    // 버킷 이름을 대문자로 수정했습니다.
    const { data } = supabase.storage.from('RACKETS').getPublicUrl(form.image_url)
    return data.publicUrl
  }
  return 'https://placehold.co/300x300/F3F4F6/9CA3AF?text=NO+IMAGE'
})

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    imageFile.value = file
  }
}

const loadRacketData = async () => {
  if (!isEdit.value) {
    checkDraft()
    return
  }
  
  try {
    const { data, error } = await supabase
      .from('rackets')
      .select('*')
      .eq('id', route.params.id)
      .single()
    
    if (error) throw error
    if (data) {
      if (Array.isArray(data.colors)) {
        data.colors = data.colors.join(', ');
      }
      Object.assign(form, data)
    }
  } catch (err) {
    console.error('Error loading racket data:', err)
  }
}

onMounted(loadRacketData)

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

// 저장 로직 (최종 수정)
const saveRacket = async () => {
  if (isSaving.value) return
  isSaving.value = true
  
  try {
    let imagePath = form.image_url;

    // 1. 이미지 업로드 단계
    if (imageFile.value) {
      const file = imageFile.value
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('RACKETS') // 버킷 이름을 대문자로 수정
        .upload(fileName, file)

      if (uploadError) {
        throw new Error(`[이미지 업로드 실패] ${uploadError.message}`);
      }
      imagePath = fileName;
    }

    // 2. 데이터 준비 단계 (사용자 테이블 스키마에 맞게 수정)
    const racketData = {
      name: form.name?.trim(),
      brand: form.brand,
      image_url: imagePath,
      weight: form.weight || null,
      balance: form.balance || null,
      bal_point: form.bal_point ? parseInt(form.bal_point, 10) : null,
      flex: form.flex || null,
      max_tension: form.max_tension?.toString() || null,
      grip_size: form.grip_size || null,
    };

    // colors는 배열로 변환
    if (typeof form.colors === 'string' && form.colors.trim()) {
      racketData.colors = form.colors.split(',').map(c => c.trim()).filter(Boolean);
    } else {
      racketData.colors = [];
    }

    // 3. DB 저장 단계
    let response;
    if (isEdit.value) {
      response = await supabase
        .from('rackets')
        .update(racketData)
        .eq('id', route.params.id);
    } else {
      // rating, review_count 등 불필요한 필드 제거
      response = await supabase
        .from('rackets')
        .insert([racketData]);
    }

    if (response.error) {
       console.error('Full Error Object:', response.error);
       throw new Error(`[DB 저장 실패] ${response.error.message} (${response.error.code})`);
    }
    
    alert(isEdit.value ? '수정되었습니다.' : '등록되었습니다.')
    if (!isEdit.value) clearDraft()
    router.push('/admin/rackets')

  } catch (err) {
    console.error('Final Save Error:', err)
    alert(`오류 발생\n\n${err.message}`)
  } finally {
    isSaving.value = false
  }
}
</script>
