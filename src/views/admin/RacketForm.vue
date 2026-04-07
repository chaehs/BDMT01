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

        <!-- 태그 입력 섹션 -->
        <div class="space-y-3">
          <label class="text-xs font-black text-gray-400 uppercase tracking-wider">태그 (엔터 혹은 자동완성 선택)</label>
          <div class="relative">
            <input 
              v-model="tagInput" 
              type="text" 
              @keydown.enter.prevent="handleEnterKey"
              @keydown.down.prevent="highlightNext"
              @keydown.up.prevent="highlightPrev"
              @input="highlightIndex = -1"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" 
              placeholder="예: 공격형, 초심자추천, 올라운드 등"
            >
            
            <ul v-if="filteredTags.length > 0" class="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto">
              <li 
                v-for="(tag, idx) in filteredTags" 
                :key="tag.id"
                @click="addTag(tag.name)"
                :class="{'bg-blue-50 text-blue-600': idx === highlightIndex}"
                class="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm font-bold border-b border-gray-50 last:border-0"
              >
                {{ tag.name }}
              </li>
            </ul>
          </div>

          <div v-if="form.tags.length > 0" class="flex flex-wrap gap-2">
            <span 
              v-for="(tag, idx) in form.tags" 
              :key="idx"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-black rounded-lg group"
            >
              #{{ tag }}
              <button 
                type="button" 
                @click="removeTag(idx)"
                class="hover:text-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </span>
          </div>
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

// 태그 관련 상태
const allTags = ref([])
const tagInput = ref('')
const highlightIndex = ref(-1)
const filteredTags = computed(() => {
  if (!tagInput.value) return []
  return allTags.value.filter(tag => 
    tag.name.toLowerCase().includes(tagInput.value.toLowerCase()) && 
    !form.tags.includes(tag.name)
  )
})

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
  tags: [],
})

const imagePreviewUrl = computed(() => {
  if (imageFile.value) return URL.createObjectURL(imageFile.value)
  if (form.image_url) return racketStore.getRacketImage(form.image_url)
  return 'https://placehold.co/300x300/F3F4F6/9CA3AF?text=NO+IMAGE'
})

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) imageFile.value = file
}

const colorFiles = ref({});
const parsedColors = computed(() => {
  const c = form.colors;
  if (!c || !String(c).trim()) return [];
  return String(c).split(',').map(x => x.trim().toUpperCase()).filter(Boolean);
});

const onColorFileChange = (color, e) => {
  const file = e.target.files[0];
  if (file) colorFiles.value[color] = file;
  else delete colorFiles.value[color];
};

// 태그 관련 함수
const fetchAllTags = async () => {
  const { data, error } = await supabase.from('tags').select('id, name');
  if (error) console.error('Error fetching tags:', error);
  else allTags.value = data;
};

const addTag = (tagName) => {
  const trimmed = tagName.trim().toUpperCase();
  if (trimmed && !form.tags.includes(trimmed)) {
    form.tags.push(trimmed);
  }
  tagInput.value = '';
  highlightIndex.value = -1;
};

const removeTag = (idx) => {
  form.tags.splice(idx, 1);
};

const highlightNext = () => {
  if (filteredTags.value.length === 0) return;
  highlightIndex.value = (highlightIndex.value + 1) % filteredTags.value.length;
};

const highlightPrev = () => {
  if (filteredTags.value.length === 0) return;
  highlightIndex.value = (highlightIndex.value - 1 + filteredTags.value.length) % filteredTags.value.length;
};

const handleEnterKey = () => {
  if (highlightIndex.value >= 0 && filteredTags.value[highlightIndex.value]) {
    addTag(filteredTags.value[highlightIndex.value].name);
  } else if (tagInput.value) {
    addTag(tagInput.value);
  }
};

const deleteColorImage = async (color) => {
  if (!isEdit.value || !form.image_url) return alert('이미지가 없습니다.');
  if (confirm(`'${color}' 색상의 이미지를 영구 삭제하시겠습니까?`)) {
    try {
      const extIdx = form.image_url.lastIndexOf('.');
      let basePart = form.image_url;
      let ext = 'png';
      if (extIdx !== -1) {
        basePart = form.image_url.substring(0, extIdx);
        ext = form.image_url.substring(extIdx + 1);
      }
      const targetFileName = `${basePart}_${color.replace(/\s+/g, '').toLowerCase()}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET_NAME).remove([`${IMAGE_FOLDER}/${targetFileName}`]);
      if (error) throw error;
      alert('삭제되었습니다.');
    } catch(e) {
      alert('삭제 실패: ' + e.message);
    }
  }
};

const deleteMainImage = async () => {
  if (!isEdit.value || !form.image_url) return;
  if (confirm('메인 이미지를삭제하시겠습니까?')) {
    try {
      await supabase.storage.from(BUCKET_NAME).remove([`${IMAGE_FOLDER}/${form.image_url}`]);
      await supabase.from('rackets').update({ image_url: null }).eq('id', route.params.id);
      form.image_url = '';
      imageFile.value = null;
      alert('삭제되었습니다.');
    } catch(e) {
      alert('삭제 실패: ' + e.message);
    }
  }
};

const populateFormData = (data) => {
  if (typeof data.colors === 'string') {
    data.colors = data.colors.replace(/[{}"[\]]/g, '').split(',').join(', ');
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
  form.brand = data.brand || 'YONEX'
  form.image_url = data.image_url || ''
  form.weight = data.weight || ''
  form.balance = data.balance || ''
  form.bal_point = data.bal_point || null
  form.flex = data.flex || ''
  form.max_tension = data.max_tension || ''
  form.grip_size = data.grip_size || ''
  form.colors = data.colors || ''
  form.tags = data.tags ? data.tags.map(t => t.name) : []
}

const loadRacketData = async () => {
  if (!isEdit.value) return checkDraft();
  try {
    const { data, error } = await supabase
      .from('rackets')
      .select('*, tags(name)')
      .eq('id', route.params.id)
      .single()
    if (error) throw error
    if (data) populateFormData(data)
  } catch (err) {
    console.error('Error loading racket data:', err)
  }
}

let loadedFromStore = false
if (isEdit.value && racketStore.rackets?.length > 0) {
  const found = racketStore.rackets.find(r => String(r.id) === String(route.params.id));
  if (found) {
    populateFormData(JSON.parse(JSON.stringify(found)))
    loadedFromStore = true
  }
}

onMounted(() => {
  fetchAllTags()
  if (!isEdit.value) checkDraft()
  else if (!loadedFromStore) loadRacketData()
})

const STORAGE_KEY = 'BDMT01_RACKET_FORM_DRAFT'
watch(form, (newVal) => {
  if (!isEdit.value) localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

const checkDraft = () => {
  if (localStorage.getItem(STORAGE_KEY)) hasDraft.value = true
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

    if (imageFile.value) {
      const file = imageFile.value;
      const baseName = (form.name || originalName.value).toLowerCase().replace(/\s+/g, '_');
      const ext = file.name.split('.').pop();
      const fileName = `${baseName}_${Date.now()}.${ext}`;
      const filePath = `${IMAGE_FOLDER}/${fileName}`;
      
      const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, { upsert: true });
      if (error) throw error;
      imagePath = fileName;
    }

    const racketData = {
      name: (form.name || originalName.value).trim().toUpperCase(),
      brand: form.brand?.toUpperCase(),
      image_url: imagePath,
      weight: form.weight?.toUpperCase() || null,
      balance: form.balance?.toUpperCase() || null,
      bal_point: form.bal_point || null,
      flex: form.flex?.toUpperCase() || null,
      max_tension: form.max_tension?.toString() || null,
      grip_size: form.grip_size?.toUpperCase() || null,
    };

    if (form.colors || originalColors.value) {
      const c = form.colors || originalColors.value;
      const arr = String(c).split(',').map(x => x.trim().toUpperCase()).filter(Boolean);
      racketData.colors = `{${arr.map(x => `"${x}"`).join(',')}}`;
    }

    const { data, error } = isEdit.value
      ? await supabase.from('rackets').update(racketData).eq('id', route.params.id).select()
      : await supabase.from('rackets').insert([racketData]).select();

    if (error) throw error;
    if (!data?.[0]) throw new Error('저장 실패');

    const racketId = data[0].id;

    // 태그 저장
    const tagIds = await Promise.all(form.tags.map(async (name) => {
      let t = allTags.value.find(x => x.name.toUpperCase() === name.toUpperCase());
      if (t) return t.id;
      const { data: nt, error: ne } = await supabase.from('tags').insert({ name: name.toUpperCase() }).select().single();
      if (ne) throw ne;
      return nt.id;
    }));

    await supabase.from('racket_tag_map').delete().eq('racket_id', racketId);
    if (tagIds.length > 0) {
      await supabase.from('racket_tag_map').insert(tagIds.map(tid => ({ racket_id: racketId, tag_id: tid })));
    }

    alert(isEdit.value ? '수정되었습니다.' : '등록되었습니다.');
    if (!isEdit.value) clearDraft();
    router.push('/admin/rackets');
  } catch (err) {
    console.error(err);
    alert('저장 실패: ' + err.message);
  } finally {
    isSaving.value = false;
  }
}
</script>

<style scoped>
/* 필요한 스타일이 있다면 추가 */
</style>
