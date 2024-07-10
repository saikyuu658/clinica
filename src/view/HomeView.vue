<script>
    import SideBarComponent from "@/components/SideBarComponent.vue"
    import Toast from "primevue/toast"
    import {setHeader} from '../http'
    export default {
        components: {
            Toast,
           SideBarComponent
        },

        data(){
            return {
                valuesSideNav : ''
            }
        },

        methods: {
            async getAccess(){
                this.valuesSideNav = localStorage.getItem('nivel')
                setHeader(localStorage.getItem('token_access'))
            }
        },

        beforeMount() {
            this.getAccess()
        },
    }
</script>
<template>
    <SideBarComponent :access="valuesSideNav"></SideBarComponent>
    <div class="body">
        <router-view></router-view>
    </div>
    <Toast></Toast>
</template>

<style>
    .body{
        position: absolute;
        top: 0;    
        right: 0;
        bottom: 0;
        left: 60px;
        overflow-y: hidden;
    }

</style>

