<template>
  <div class="grid grid-cols-2 gap-x-8 gap-y-10">
    <RacketCard v-for="racket in rackets" :key="racket.id" :racket="racket" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import RacketCard from './RacketCard.vue';

const rackets = ref([
  {
    id: 1,
    name: 'ArcSaber 11 Pro',
    brand: 'Yonex',
    imageUrl: 'https://placehold.co/400x300/EBF4FF/333333?text=ArcSaber+11',
    weight: '3U (85-89g)',
    balance: 'Even Balance',
    shaftFlex: 'Stiff',
    maxTension: '28 lbs',
    gripSize: 'G5',
    tags: ['Control', 'All-around']
  },
  {
    id: 2,
    name: 'Astrox 99 Pro',
    brand: 'Yonex',
    imageUrl: 'https://placehold.co/400x300/FFF5E6/333333?text=Astrox+99',
    weight: '4U (80-84g)',
    balance: 'Head-Heavy',
    shaftFlex: 'Extra Stiff',
    maxTension: '29 lbs',
    gripSize: 'G5',
    tags: ['Power', 'Speed']
  },
  {
    id: 3,
    name: 'Brave Sword 12',
    brand: 'Victor',
    imageUrl: 'https://placehold.co/400x300/E6FFF5/333333?text=Brave+Sword',
    weight: '4U (80-84g)',
    balance: 'Even Balance',
    shaftFlex: 'Medium',
    maxTension: '28 lbs',
    gripSize: 'G5',
    tags: ['Speed', 'Control']
  },
  {
    id: 4,
    name: 'Thruster F',
    brand: 'Victor',
    imageUrl: 'https://placehold.co/400x300/FFF0F0/333333?text=Thruster+F',
    weight: '4U (80-84g)',
    balance: 'Head-Heavy',
    shaftFlex: 'Stiff',
    maxTension: '30 lbs',
    gripSize: 'G5',
    tags: ['Power']
  },
  {
    id: 5,
    name: 'Nanoflare 800',
    brand: 'Yonex',
    imageUrl: 'https://placehold.co/400x300/F0F5FF/333333?text=Nanoflare',
    weight: '4U (80-84g)',
    balance: 'Head-Light',
    shaftFlex: 'Stiff',
    maxTension: '28 lbs',
    gripSize: 'G5',
    tags: ['Speed', 'Control']
  },
  {
    id: 6,
    name: 'Auraspeed 90K',
    brand: 'Victor',
    imageUrl: 'https://placehold.co/400x300/F5E6FF/333333?text=Auraspeed',
    weight: '4U (80-84g)',
    balance: 'Even Balance',
    shaftFlex: 'Stiff',
    maxTension: '29 lbs',
    gripSize: 'G5',
    tags: ['Speed', 'All-around']
  }
]);
</script>

<style scoped>
/* Scoped styles for the racket list */
</style>
