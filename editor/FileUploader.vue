<script setup lang="ts">
const emit = defineEmits<{
  (e: 'upload', data: string): void;
}>();

const handleUpload = async (file: File) => {
  if (file.type !== 'application/json') {
    // eslint-disable-next-line no-alert
    alert('Only json file allowed.');
    return;
  }

  const data = await file.text();
  emit('upload', data);
};

const handleDrop = async (event: DragEvent) => {
  const files = event.dataTransfer?.items as DataTransferItemList;
  const file = files[0].getAsFile();
  if (file) {
    handleUpload(file);
  }
};

const handleInput = (event: Event) => {
  const files = (event.target as HTMLInputElement).files as FileList;
  const file = files[0];
  if (file) {
    handleUpload(file);
  }
};

const events = ['dragenter', 'dragover', 'dragleave', 'drop'];

const preventDefaults = (event: Event) => event.preventDefault();

onMounted(() => {
  events.forEach((eventName) => {
    window.addEventListener(eventName, preventDefaults);
  });
});

onUnmounted(() => {
  events.forEach((eventName) => {
    window.removeEventListener(eventName, preventDefaults);
  });
});
</script>

<template>
  <div class="drop-area" @drop.prevent="handleDrop">
    <input type="file" @change="handleInput" />
  </div>
</template>

<style scoped lang="scss">
.drop-area {
  width: 10rem;
  height: 10rem;
  border: 1px solid red;
}
</style>
