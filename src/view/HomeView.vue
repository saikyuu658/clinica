<script>
   import SideBarComponent from "@/components/SideBarComponent.vue"
   import RequestHttp from "../http"
    export default {
        components: {
           SideBarComponent
        },

        data(){
            return {
                valuesSideNav : ''
            }
        },

        methods: {
            async getAccess(){
                const resp = await RequestHttp.getAccess()
                if(resp.hasError){
                    this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })
                    if(resp.response.status == 401){
                        await new Promise(()=>{
                            setTimeout(() => {
                                this.$router.replace('/');
                                localStorage.clear();
                            }, 2000);
                        })
                    } 
                }else{
                    this.valuesSideNav = resp
                    
                }
            }
        },

        beforeMount() {
            this.getAccess()
        },
    }
</script>
<template>
    <SideBarComponent :access="valuesSideNav.access"></SideBarComponent>
    <div class="body">
        <router-view></router-view>
    </div>
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

