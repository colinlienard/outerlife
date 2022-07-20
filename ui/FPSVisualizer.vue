<script setup lang="ts">
// eslint-disable-next-line import/no-extraneous-dependencies
import { Ref } from 'vue';
import { Game } from '~~/game';

const game = inject<Ref<Game>>('game');
const fps = ref<number[]>([]);
const interval = ref<NodeJS.Timer | null>(null);
const plotNumber = 20;

const getCurrentFPS = () => fps.value[fps.value.length - 1];

const getPlotColor = (number: number): string => {
  switch (true) {
    case number > 50:
      return '#5EFB14';
    case number > 40:
      return '#E5FE4A';
    default:
      return '#FF7246';
  }
};

onMounted(() => {
  interval.value = setInterval(() => {
    fps.value.push(game?.value.fps || 0);
    if (fps.value.length > plotNumber) {
      fps.value.shift();
    }
  }, 200);
});

onUnmounted(() => {
  clearInterval(interval.value as NodeJS.Timer);
});
</script>

<template>
  <div class="counter">
    <p class="fps">{{ getCurrentFPS() }} fps</p>
    <ul class="chart">
      <li
        v-for="(previous, index) in fps"
        :key="index"
        class="plot"
        :style="{
          height: `${(previous * 100) / 60}%`,
          backgroundColor: getPlotColor(previous),
        }"
      />
    </ul>
  </div>
</template>

<style scoped lang="scss">
.counter {
  position: absolute;
  inset: 0 auto auto 0;
  font-size: initial;
  background-color: rgba(#000, 0.8);
  color: #0f0;
  text-align: right;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chart {
  display: grid;
  grid-template-columns: repeat(v-bind(plotNumber), 5px);
  align-items: end;
  height: 3rem;
  border-bottom: 1px solid #fff;
}
</style>
