<template>
    <div class="bg-loading">
        <span class="loader"></span>
    </div>
</template>
<script>
export default {

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

    .loader {
        width: 48px;
        height: 48px;
        border: 5px solid #FFF;
        border-bottom-color: #3e8ed0;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
    } 

   
</style>