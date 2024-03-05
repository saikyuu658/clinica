<template>
    <section class="side-nav-filter">
        <div class="nav-head">
            <slot name="head">
                Filtros
            </slot>

            <button class="button is-small close" v-on:click="close">
                <span class="material-symbols-outlined">
                    close
                </span>
            </button>
        </div>

        <div class="side-body">
            <slot name="body">
            </slot>
        </div>

        <div class="side-footer">
            <slot name="footer">
            </slot>
        </div>
    </section>
</template>
<script>
export default {
    methods:{
        close(){
            this.$emit('close')
        }
    }
}
</script>
<style lang="css">
    .close{
        float: right;
        border: none;
    }
    
    .side-nav-filter{
        background-color: white;
        box-shadow: 0 0 5px #00000032;
        position: fixed;
        top: 0;
        right: 0;
        width: 300px;
        z-index: 3;
        bottom: 0;
        animation: show ease-in-out 0.4s;
    }

    .nav-head{
        font-size: 25px;
        padding: 5px;
        font-weight: bold;
        height: 70px;
    }

    .side-footer{
        bottom: 0;
        width: 100%;
        padding: 5px;
        position: absolute;
    }

    .side-body{
        position: absolute;
        top: 70px;
        bottom: 70px;
        overflow-y: auto;
        padding: 10px;
        width: 100%;

    }


    @keyframes show {
        
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(0);
        }
    }

</style>