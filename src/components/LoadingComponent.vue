<template>
    <div class="bg-loading">
        <div class="loding">
            <canvas ref="canvas" width="500" height="500"></canvas>
        </div>
    </div>
</template>
<script>
import { Rive } from '@rive-app/canvas'
export default {

    mounted() {
        this.animationRive = new Rive({
            canvas: this.$refs.canvas,
            src: "/rive/odonto.riv",
            autoplay: true
        })
  }
}
</script>
<style scoped>
    .bg-loading{
        position: fixed;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 20;
        background-color: #00000035;
    }

    .loding{
        width: 200px;
        height: 200px;
        border-radius: 30px;
        transform: translate(-50%, -70%);
    }

   
</style>