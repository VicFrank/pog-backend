<template>
  <div class="main-layout__content">
    <div class="content">
      <h1 class="page-title">Videos</h1>
      <div class="media-container mx-auto">
        <h3 v-t="'media.vid1'"></h3>
        <div class="mb-4">
          <b-embed type="iframe" src="https://www.youtube.com/embed/9pG5Vx9B21Y" allowfullscreen></b-embed>
        </div>
        <h3 v-t="'media.vid2'"></h3>
        <div class="mb-4">
          <b-embed type="iframe" src="https://www.youtube.com/embed/twkWKkZzBEM" allowfullscreen></b-embed>
        </div>
        <h3 v-t="'media.vid3'"></h3>
        <div class="mb-4">
          <b-embed type="iframe" src="https://www.youtube.com/embed/B_4l8eNIno8" allowfullscreen></b-embed>
        </div>
        <h3 v-t="'media.vid4'"></h3>
        <div class="mb-4">
          <b-embed type="iframe" src="https://www.youtube.com/embed/XkFGurRfD0A" allowfullscreen></b-embed>
        </div>
        <h3 v-t="'media.vid5'"></h3>
        <div class="mb-4">
          <b-embed type="iframe" src="https://www.youtube.com/embed/2b6lAcxA2AM" allowfullscreen></b-embed>
        </div>
        <h3 v-t="'media.vid6'"></h3>
        <div class="mb-4">
          <b-embed type="iframe" src="https://www.youtube.com/embed/oQVyjQiJ65s" allowfullscreen></b-embed>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.media-container {
  width: 600px;
}
</style>
