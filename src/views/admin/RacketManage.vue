<template>
  <div class="space-y-6">
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-3xl font-black text-gray-900">라켓 관리</h2>
        <p class="text-gray-500 font-medium mt-1">등록된 모든 라켓을 관리합니다.</p>
      </div>
      <router-link 
        to="/admin/racket/new" 
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
      >
        <span>+</span> 신규 라켓 등록
      </router-link>
    </div>

    <!-- Racket List Table -->
    <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mt-8">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-100">
            <th class="p-5 text-xs font-black text-gray-400 uppercase tracking-wider">라켓</th>
            <th class="p-5 text-xs font-black text-gray-400 uppercase tracking-wider">브랜드</th>
            <th class="p-5 text-xs font-black text-gray-400 uppercase tracking-wider">스펙 (무게/밸런스)</th>
            <th class="p-5 text-xs font-black text-gray-400 uppercase tracking-wider">리뷰</th>
            <th class="p-5 text-xs font-black text-gray-400 uppercase tracking-wider text-right">관리</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-if="isLoading" class="text-center py-20">
            <td colspan="5" class="p-10 text-gray-400 font-bold">데이터를 불러오는 중...</td>
          </tr>
          <tr v-else-if="rackets.length === 0" class="text-center py-20">
            <td colspan="5" class="p-10 text-gray-400 font-bold">등록된 라켓이 없습니다.</td>
          </tr>
          <tr v-for="racket in rackets" :key="racket.id" class="hover:bg-blue-50/30 transition-colors">
            <td class="p-5">
              <div class="flex items-center gap-4">
                <div class="w-10 h-12 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center p-1 border border-gray-100">
                  <img :src="getRacketImage(racket.image_url)" class="w-full h-full object-contain" :alt="racket.name">
                </div>
                <span class="font-black text-gray-900">{{ racket.name }}</span>
              </div>
            </td>
            <td class="p-5 font-bold text-gray-500 uppercase text-xs">{{ racket.brand }}</td>
            <td class="p-5 font-bold text-gray-800 text-sm">
              {{ racket.weight }} / {{ racket.balance }}
            </td>
            <td class="p-5">
              <div class="flex items-center gap-1">
                <span class="text-yellow-400">★</span>
                <span class="font-bold text-gray-800">{{ racket.rating || 0 }}</span>
                <span class="text-gray-400 text-xs">({{ racket.review_count || 0 }})</span>
              </div>
            </td>
            <td class="p-5 text-right space-x-2">
              <button @click="editRacket(racket.id)" class="text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-xl font-bold transition-all text-xs">수정</button>
              <button @click="confirmDelete(racket)" class="text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-xl font-bold transition-all text-xs">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { rackets, isLoading, fetchRackets, getRacketImage, deleteRacket } = inject('rackets')

onMounted(() => {
  fetchRackets()
})

const editRacket = (id) => {
  router.push(`/admin/racket/edit/${id}`)
}

const confirmDelete = async (racket) => {
  if (confirm(`정말로 '${racket.name}' 라켓을 삭제하시겠습니까? 데이터베이스 기록과 함께 스토리지의 이미지 파일도 영구적으로 삭제됩니다.`)) {
    try {
      await deleteRacket(racket)
      alert('삭제되었습니다.');
    } catch (err) {
      console.error('Delete operation failed:', err);
      alert(`삭제 과정에서 오류가 발생했습니다: ${err.message}`);
    }
  }
}
</script>
