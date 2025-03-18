<template lang="">
    <section class="bg-modal">
        <div class="content-modal">
            <header class="side-header">
                <slot name="header">
                    <h2>Default</h2>
                </slot>
                        
                <span class="icon close-modal" v-on:click="close">
                    <span class="material-symbols-outlined">
                        close
                    </span>
                </span>
                
            </header>
            <div class="body-modal">
                <slot name="body">
                </slot>
            </div>
            <div class="footer-modal">
                <slot name="footer">
             </slot>
            </div>
        </div>
    </section>
</template>
<script>
export default {
    methods: {
        close(){
            this.$emit('close')
        }
    }
}
</script>
<style scoped>

    .icon{
        cursor: pointer;
    }
    
    .bg-modal{
        position: absolute;
        z-index: 10;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        background-color: #00000067;
        justify-content: center;
    }

    .side-header{
        display: flex;
        justify-content: space-between;
        font-size: 20px;
        padding: 10px;
        border-bottom: solid 1px #00000035;
    }
    
    @keyframes animateModal {
        from {
            transform: translateY(30%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    
    .body-modal{
        padding: 15px 5px;
        position: absolute;
        top: 50px;
        bottom: 50px;
        right: 20px;
        left: 20px;
        overflow: auto;
    }

    .content-modal{
        animation: animateModal 0.4s;
        width:  50%;
        height: 90%;
        background-color: white;
        border-radius: 3px;
        box-shadow: 0 0 10px #00000067;
        position: relative;
    }

    .footer-modal{
        position: absolute;
        bottom: 15px;
        left: 15px;
        display: flex;
        justify-content: end;
        gap: 10px;
        right: 25px;
    }

    @media (max-width: 1000px) {
        .content-modal{
            width:  80%;
        }  
    }
</style>