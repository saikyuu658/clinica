<template lang="">
    <section class="bg-modal">
        <div class="content-modal">
            <header class="modal-header">
                <slot name="header">
                    <h2>Default</h2>
                </slot>
                        
                <span class="icon close-modal button is-danger" v-on:click="close">
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
    
    .bg-modal{
        position: absolute;
        z-index: 10;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        background-color: #00000032;
        justify-content: center;
    }

    .modal-header{
        display: flex;
        justify-content: space-between;
        font-size: 20px;
        padding: 10px;
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
        padding: 5px;
        position: absolute;
        top: 50px;
        bottom: 40px;
        right: 20px;
        left: 20px;
        overflow: auto;
    }

    .content-modal{
        animation: animateModal 0.4s;
        width: 98%;
        height: 98%;
        background-color: white;
        position: relative;
        border-radius: 3px;
        box-shadow: 0 0 10px #00000035;
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
</style>