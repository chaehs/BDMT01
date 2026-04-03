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
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">라켓 명칭 <span v-if="!isEdit">*</span></label>
            <input v-model="form.name" type="text" :required="!isEdit" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" :placeholder="isEdit && originalName ? `기존: ${originalName}` : '예: ASTROX 100 ZZ'">
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
              <p class="mt-1 text-xs text-gray-500">PNG, JPG, GIF 등 이미지 파일을 선택하세요. 동일 모델이 있다면 자동 완성됩니다.</p>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-black text-gray-400 uppercase tracking-wider">대표 색상 (쉼표로 구분)</label>
          <input v-model="form.colors" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" :placeholder="isEdit && originalColors ? `기존: ${originalColors}` : '예: Red, Blue, Black'">
        </div>
      </section>

      <!-- 상세 스펙 섹션 -->
      <section class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <h3 class="text-lg font-black text-gray-800 border-b pb-4">상세 스펙</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">무게</label>
            <input v-model="form.weight" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" :placeholder="isEdit && originalWeight ? `기존: ${originalWeight}` : '예: 4U'">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">밸런스</label>
            <input v-model="form.balance" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" :placeholder="isEdit && originalBalance ? `기존: ${originalBalance}` : '예: HEAD HEAVY'">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">밸런스 포인트 (mm)</label>
            <input v-model.number="form.bal_point" type="number" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" :placeholder="isEdit && originalBalPoint ? `기존: ${originalBalPoint}` : '예: 305'">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">탄성</label>
            <input v-model="form.flex" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" :placeholder="isEdit && originalFlex ? `기존: ${originalFlex}` : '예: STIFF'">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">최대장력 (lbs)</label>
            <input v-model="form.max_tension" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" :placeholder="isEdit && originalMaxTension ? `기존: ${originalMaxTension}` : '예: 28'">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">그립 두께</label>
            <input v-model="form.grip_size" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" :placeholder="isEdit && originalGripSize ? `기존: ${originalGripSize}` : '예: G5'">
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
import useRackets from '../../composables/useRackets'
import { useRacketStore } from '../../stores/racket'

const route = useRoute()
const router = useRouter()
const racketStore = useRacketStore()

const isEdit = computed(() => !!route.params.id)
const isSaving = ref(false)
const hasDraft = ref(false)
const imageFile = ref(null)
const originalName = ref('')
const originalColors = ref('')
const originalWeight = ref('')
const originalBalance = ref('')
const originalBalPoint = ref('')
const originalFlex = ref('')
const originalMaxTension = ref('')
const originalGripSize = ref('')

const BUCKET_NAME = 'BDMT01';
const IMAGE_FOLDER = 'racket_storage';

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
    return racketStore.getRacketImage(form.image_url)
  }
  return 'https://placehold.co/300x300/F3F4F6/9CA3AF?text=NO+IMAGE'
})

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    imageFile.value = file
  }
}

const populateFormData = (data) => {
  if (Array.isArray(data.colors)) {
    data.colors = data.colors.join(', ');
  } else if (typeof data.colors === 'string') {
    try {
      const parsed = JSON.parse(data.colors);
      if (Array.isArray(parsed)) {
        data.colors = parsed.join(', ');
      } else {
        data.colors = data.colors.replace(/[{}"[\]]/g, ''); 
      }
    } catch (e) {
      data.colors = data.colors.replace(/[{}"[\]]/g, ''); 
    }
  }
  originalName.value = data.name || ''
  originalColors.value = data.colors || ''
  originalWeight.value = data.weight || ''
  originalBalance.value = data.balance || ''
  originalBalPoint.value = data.bal_point || ''
  originalFlex.value = data.flex || ''
  originalMaxTension.value = data.max_tension || ''
  originalGripSize.value = data.grip_size || ''
  
  form.name = data.name || ''
  if (data.brand) form.brand = data.brand
  form.image_url = data.image_url || ''
  form.weight = data.weight || ''
  form.balance = data.balance || ''
  form.bal_point = data.bal_point || null
  form.flex = data.flex || ''
  form.max_tension = data.max_tension || ''
  form.grip_size = data.grip_size || ''
  form.colors = data.colors || ''
}

const loadRacketData = async () => {
  if (!isEdit.value) {
    checkDraft()
    return
  }
  
  try {
    // 2. 스토어에 데이터가 없으면 DB에서 최신 데이터 불러오기
    const { data: fetchedData, error } = await supabase
      .from('rackets')
      .select('*')
      .eq('id', route.params.id)
      .single()
    
    if (error) throw error
    if (fetchedData) {
      populateFormData(fetchedData)
    }
  } catch (err) {
    console.error('Error loading racket data:', err)
  }
}

// 1. 처음 컴포넌트 셋업 시 피니아 스토어에서 데이터가 있다면 즉시 로딩 (깜빡임과 렌더링 지연 해결)
let loadedFromStore = false
if (isEdit.value && racketStore.rackets && racketStore.rackets.length > 0) {
  const foundItem = racketStore.rackets.find(r => String(r.id) === String(route.params.id));
  if (foundItem) {
    populateFormData(JSON.parse(JSON.stringify(foundItem)))
    loadedFromStore = true
  }
}

onMounted(() => {
  if (!isEdit.value) {
    checkDraft()
  } else if (!loadedFromStore) {
    // 피니아 스토어에서 데이터를 가져오지 못했을 때(새로고침 등) onMounted에서 안전하게 불러옴
    loadRacketData()
  }
})

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

const saveRacket = async () => {
  if (isSaving.value) return
  isSaving.value = true
  
  try {
    let imagePath = form.image_url;

    // 1. Handle Image: Use existing, find existing, or upload new
    if (imageFile.value) {
      // 1a. New image is uploaded: upload it and get the path.
      const file = imageFile.value;
      
      // Sanitize and prepare parts for the filename
      const finalNameForImage = form.name || originalName.value;
      const baseName = finalNameForImage.toLowerCase().replace(/\s+/g, '_');
      const weight = form.weight?.toLowerCase().replace(/\s+/g, '') || '';
      const gripSize = form.grip_size?.toLowerCase().replace(/\s+/g, '') || '';
      const fileExtension = file.name.split('.').pop();

      // Build the final filename
      const fileNameParts = [baseName];
      if (weight) fileNameParts.push(weight);
      if (gripSize) fileNameParts.push(gripSize);
      
      const fileName = `${fileNameParts.join('_')}.${fileExtension}`;
      const filePath = `${IMAGE_FOLDER}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, { upsert: true }); // Use upsert to overwrite

      if (uploadError) {
        throw new Error(`[이미지 업로드 실패] ${uploadError.message}`);
      }
      imagePath = fileName; // DB stores only the file name
    } else if (!isEdit.value && form.name) {
      // 1b. No new image, creating new racket: Try to find an existing image from the same model.
      const { data: existingRacket, error: findError } = await supabase
        .from('rackets')
        .select('image_url')
        .ilike('name', form.name.trim())
        .not('image_url', 'is', null)
        .limit(1)
        .single();

      if (findError && findError.code !== 'PGRST116') { // Ignore 'single row not found' error
        console.warn('Error while searching for existing racket image:', findError.message);
      } else if (existingRacket?.image_url) {
        imagePath = existingRacket.image_url;
      }
    }

    // 2. Prepare Racket Data
    const finalName = form.name ? form.name.trim().toUpperCase() : originalName.value;
    const racketData = {
      name: finalName,
      brand: form.brand?.toUpperCase(),
      image_url: imagePath, // This will be the new, found, or existing path
      weight: form.weight?.toLowerCase() || null,
      balance: form.balance?.toUpperCase() || null,
      bal_point: form.bal_point ? parseInt(form.bal_point, 10) : null,
      flex: form.flex?.toUpperCase() || null,
      max_tension: form.max_tension?.toString() || null,
      grip_size: form.grip_size?.toLowerCase() || null,
      colors: null,
    };

    const finalColorsToSave = form.colors ? form.colors : (isEdit.value ? originalColors.value : '');
    if (finalColorsToSave && String(finalColorsToSave).trim()) {
      const colorsStr = Array.isArray(finalColorsToSave) ? finalColorsToSave.join(',') : String(finalColorsToSave);
      const parsedArray = colorsStr.split(',').map(c => c.trim().toUpperCase()).filter(Boolean);
      
      // DB 컬럼이 text[] 타입일 경우 JS Array가 무시되거나 에러가 날 수 있으므로
      // PostgreSQL의 순수 문자열 배열 형태인 '{"RED", "BLUE"}' 형식으로 만들어 전달합니다.
      racketData.colors = `{${parsedArray.map(c => `"${c}"`).join(',')}}`;
    }

    // 3. Insert or Update Database
    const { data: savedData, error } = isEdit.value
      ? await supabase.from('rackets').update(racketData).eq('id', route.params.id).select()
      : await supabase.from('rackets').insert([racketData]).select();

    if (error) {
       console.error('Full Error Object:', error);
       throw new Error(`[DB 저장 실패] ${error.message} (${error.code})`);
    }
    
    if (!savedData || savedData.length === 0) {
       throw new Error(`권한 부족: DB 업데이트가 무시되었습니다.\nSupabase 대시보드에서 rackets 테이블의 UPDATE 정책(Policy)이 켜져 있는지 확인해주세요.`);
    }
    
    // 4. Finalize
    alert(isEdit.value ? '수정되었습니다.' : '등록되었습니다.');
    if (!isEdit.value) clearDraft();
    router.push('/admin/rackets');

  } catch (err) {
    console.error('Final Save Error:', err);
    alert(`오류 발생\n\n${err.message}`);
  } finally {
    isSaving.value = false;
  }
}
</script>
