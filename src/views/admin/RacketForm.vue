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
          <label class="text-xs font-black text-gray-400 uppercase tracking-wider">대표 이미지 (리스트 기본 노출)</label>
          <div class="flex items-center gap-4">
            <img :src="imagePreviewUrl" alt="Racket image preview" class="w-32 h-32 object-cover rounded-xl bg-gray-100 border border-gray-200">
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <input 
                  type="file" 
                  @change="onFileChange" 
                  accept="image/*" 
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                >
                <button v-if="isEdit && form.image_url" @click.prevent="deleteMainImage" class="whitespace-nowrap px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors">
                  대표이미지 삭제
                </button>
              </div>
              <p class="text-xs text-gray-500">라켓 목록에서 기본으로 보여지는 메인 이미지입니다. (색상이 여러 개일 경우 가장 대표적인 색상 사진을 올려주세요)</p>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-xs font-black text-gray-400 uppercase tracking-wider">대표 색상 (쉼표로 구분)</label>
          <input v-model="form.colors" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold uppercase" :placeholder="isEdit && originalColors ? `기존: ${originalColors}` : '예: Red, Blue, Black'">
        </div>

        <!-- Dynamic Color Image Upload Section -->
        <div v-if="parsedColors.length > 0" class="space-y-3 pt-4 border-t border-gray-100">
          <label class="text-xs font-black text-blue-500 uppercase tracking-wider">색상별 추가 라켓 이미지 (선택 영역)</label>
          <p class="text-xs text-gray-400 mb-2">대표 이미지 외에 유저가 특정 색상을 눌렀을 때 이미지가 변하길 원한다면 해당하는 색상 파일만 추가해 주세요.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="color in parsedColors" :key="color" class="flex flex-col gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div class="flex items-center justify-between">
                <span class="text-sm font-black text-gray-700 truncate" :title="color">{{ color }}</span>
                <button v-if="isEdit" @click.prevent="deleteColorImage(color)" class="px-2 py-1 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-[10px] font-bold transition-colors">스토리지 삭제</button>
              </div>
              <input 
                type="file" 
                @change="(e) => onColorFileChange(color, e)" 
                accept="image/*" 
                class="block w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white file:text-blue-600 hover:file:bg-blue-50 cursor-pointer shadow-sm"
              >
            </div>
          </div>
        </div>
      </section>

      <!-- 상세 스펙 섹션 -->
      <section class="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <h3 class="text-lg font-black text-gray-800 border-b pb-4">상세 스펙</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">무게</label>
            <input v-model="form.weight" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold uppercase" :placeholder="isEdit && originalWeight ? `기존: ${originalWeight}` : '예: 4U'">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">밸런스</label>
            <input v-model="form.balance" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold uppercase" :placeholder="isEdit && originalBalance ? `기존: ${originalBalance}` : '예: HEAD HEAVY'">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">밸런스 포인트 (mm)</label>
            <input v-model.number="form.bal_point" type="number" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold uppercase" :placeholder="isEdit && originalBalPoint ? `기존: ${originalBalPoint}` : '예: 305'">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">탄성</label>
            <input v-model="form.flex" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold uppercase" :placeholder="isEdit && originalFlex ? `기존: ${originalFlex}` : '예: STIFF'">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">최대장력 (lbs)</label>
            <input v-model="form.max_tension" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold uppercase" :placeholder="isEdit && originalMaxTension ? `기존: ${originalMaxTension}` : '예: 28'">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-black text-gray-400 uppercase tracking-wider">그립 두께</label>
            <input v-model="form.grip_size" type="text" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold uppercase" :placeholder="isEdit && originalGripSize ? `기존: ${originalGripSize}` : '예: G5'">
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

const colorFiles = ref({});
const parsedColors = computed(() => {
  const c = form.colors;
  if (!c || !String(c).trim()) return [];
  return String(c).split(',').map(x => x.trim().toUpperCase()).filter(Boolean);
});
const onColorFileChange = (color, e) => {
  const file = e.target.files[0];
  if (file) {
    colorFiles.value[color] = file;
  } else {
    delete colorFiles.value[color];
  }
};

const deleteColorImage = async (color) => {
  if (!isEdit.value || !form.image_url) {
      alert('저장된 라켓 이미지 기준이 없거나 신규 등록 중입니다.');
      return;
  }
  
  if (confirm(`'${color}' 색상의 개별 이미지를 스토리지에서 즉시 영구 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      try {
          const extIdx = form.image_url.lastIndexOf('.');
          let basePart = form.image_url;
          let ext = 'png';
          if (extIdx !== -1) {
            basePart = form.image_url.substring(0, extIdx);
            ext = form.image_url.substring(extIdx + 1);
          }
          const colorSuffix = color.replace(/\s+/g, '').toLowerCase();
          const targetFileName = `${basePart}_${colorSuffix}.${ext}`;
          const targetFilePath = `${IMAGE_FOLDER}/${targetFileName}`;
          
          const { error } = await supabase.storage.from(BUCKET_NAME).remove([targetFilePath]);
          if (error) throw error;
          
          alert(`${color} 색상 이미지가 성공적으로 삭제되었습니다! (주의: 변경 사항을 눈으로 확인하려면 강력 새로고침이 필요할 수 있습니다)`);
          
          if (colorFiles.value[color]) {
            delete colorFiles.value[color];
          }
      } catch(e) {
          console.error(e);
          alert('삭제 실패: ' + e.message);
      }
  }
};

const deleteMainImage = async () => {
  if (!isEdit.value || !form.image_url) {
      alert('삭제할 대표 이미지가 없습니다.');
      return;
  }
  
  if (confirm('라켓의 메인 대표 이미지를 즉시 완전히 삭제하시겠습니까?\n\n이 작업은 스토리지에서 즉시 삭제되며 번복할 수 없습니다.\n주의: 대표 이미지가 지워지면 임시로 유저 화면에서 빈 사진으로 노출됩니다.')) {
      try {
          // 스토리지에서 삭제
          const filePath = `${IMAGE_FOLDER}/${form.image_url}`;
          const { error: storageError } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);
          if (storageError) throw storageError;
          
          // 곧바로 DB에서도 null 처리하여 끊어줌
          const { error: dbError } = await supabase.from('rackets').update({ image_url: null }).eq('id', route.params.id);
          if (dbError) throw dbError;
          
          // 화면 상태 초기화
          form.image_url = '';
          imageFile.value = null;
          
          alert('대표 이미지가 성공적으로 완전 삭제되었습니다.');
      } catch(e) {
          console.error(e);
          alert('대표 이미지 삭제 실패: ' + e.message);
      }
  }
};

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
      weight: form.weight?.toUpperCase() || null,
      balance: form.balance?.toUpperCase() || null,
      bal_point: form.bal_point ? parseInt(form.bal_point, 10) : null,
      flex: form.flex?.toUpperCase() || null,
      max_tension: form.max_tension?.toString() || null,
      grip_size: form.grip_size?.toUpperCase() || null,
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

    // 4. Upload Color Variant Images (if any array items exist)
    if (imagePath && Object.keys(colorFiles.value).length > 0) {
      const extIdx = imagePath.lastIndexOf('.');
      let basePart = imagePath;
      if (extIdx !== -1) {
        basePart = imagePath.substring(0, extIdx);
      }

      const uploadPromises = Object.entries(colorFiles.value).map(async ([color, file]) => {
         // 프론트엔드가 메인 이미지의 확장자를 기준으로 파일을 찾으므로, 무조건 메인 이미지 확장자를 따르도록 통일합니다.
         const mainExt = imagePath.includes('.') ? imagePath.split('.').pop() : 'png';
         const colorSuffix = color.replace(/\s+/g, '').toLowerCase();
         const colorFileName = `${basePart}_${colorSuffix}.${mainExt}`;
         const colorFilePath = `${IMAGE_FOLDER}/${colorFileName}`;
         
         const { error } = await supabase.storage.from(BUCKET_NAME).upload(colorFilePath, file, { upsert: true, cacheControl: '0' });
         if (error) console.error("Failed to upload color image:", colorFileName, error);
      });
      await Promise.all(uploadPromises);
    }
    
    // 5. Finalize
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
