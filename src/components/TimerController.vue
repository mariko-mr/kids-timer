<script setup>
defineProps(["timerInputSec"]);

const emit = defineEmits(["update:timerInputSec", "startTimer"]);
const clickStart = (mode) => emit("startTimer", mode);
</script>

<template>
  <div>
    <select
      name="timerInputSec"
      :value="timerInputSec"
      @input="$emit('update:timerInputSec', $event.target.value)"
    >
      <option value="" hidden>ここからえらべるよ</option>
      <option value="5">5秒</option>
      <option value="10">10秒</option>
      <option value="15">15秒</option>
      <option value="20">20秒</option>
      <option value="25">25秒</option>
      <option value="30">30秒</option>
      <option value="35">35秒</option>
      <option value="40">40秒</option>
      <option value="45">45秒</option>
      <option value="50">50秒</option>
      <option value="55">55秒</option>
      <option value="60">60秒</option>
    </select>
    <button class="btn" @click="clickStart('seconds')">すたーと</button>
  </div>

  <!-- <div>
    <select name="timerInputMin" v-model="timerInputMin">
      <option value="" hidden>ここからえらべるよ</option>
      <option value="60">1分</option>
      <option value="120">2分</option>
      <option value="180">3分</option>
      <option value="240">4分</option>
      <option value="300">5分</option>
      <option value="600">10分</option>
      <option value="900">15分</option>
      <option value="1200">20分</option>
      <option value="1500">25分</option>
      <option value="1800">30分</option>
      <option value="2100">35分</option>
      <option value="2400">40分</option>
      <option value="2700">45分</option>
      <option value="3000">50分</option>
      <option value="3300">55分</option>
      <option value="3600">60分</option>
    </select>
    <button class="btn" @click="startTimer('minutes')">すたーと</button>
  </div> -->
</template>
