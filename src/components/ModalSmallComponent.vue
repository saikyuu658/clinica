<template>
    <div class="bg-small-modal">
        <section class="confirm-dialog">
            <slot name="header">
            </slot>
            <slot name="body">
                <h2>Default</h2>
            </slot>
            <div class="bg-small-footer">
                <slot name="footer">
                </slot>
            </div>
        </section>
    </div>
</template>
<script>
export default {
    data() {
        
    },
    methods: {
        closeSmalModal(){
            this.$emit('close');
        },
    }
    
}
</script>
<style scoped>
    .bg-small-modal{
        position: fixed;
        top: 0;
        left: 50px;
        bottom: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #0000000a;
        z-index: 11;
    }

    .bg-small-footer{
        margin-top: 25px;
        display: flex;
        gap: 10px;
    }
    .confirm-dialog{
        position: relative;
        width: 350px;
        background-color: white;
        box-shadow: 0 0 10px #00000090;
        z-index: 10;
        padding:20px;
        border-radius: 10px;
        animation: show 0.3s;

    }

    @keyframes show {
        from {
            opacity: 0;
            top: 50%;
        }
        to {
            opacity: 1;
            top: 0;
        } 
    }  

</style>