<template>
    
    <nav>
        <router-link :to="'/home'">
            <div class="logo">
                <img src="../assets/odonto_logo.png" alt="">
            </div>
        </router-link>
        <ul>
            <router-link :to="'/home/myInstrumentos/'"  v-slot="{ isActive}" v-show="access == 'e' || access == 'a'">
                <li v-bind:class="isActive? 'actived' : ''" v-tooltip="'Meus Instrumentos'">
                    <span class="material-symbols-outlined">
                        service_toolbox
                    </span>
                </li>
            </router-link>
            <router-link :to="'/home/triagem'"  v-slot="{ isActive} " v-show="access != 'e'">
                <li v-bind:class="isActive? 'actived' : ''" v-tooltip="'Lista de atendimento'">
                    <span class="material-symbols-outlined">
                        list
                    </span>
                </li>
            </router-link>
            <router-link :to="'/home/usuario'"  v-slot="{ isActive}" v-show="access == 's'">
                <li v-bind:class="isActive? 'actived' : ''" v-tooltip="'Usuário'">
                    <span class="material-symbols-outlined">
                        groups
                    </span>
                </li>
            </router-link>
            <router-link :to="'/home/cme/'"  v-slot="{ isActive}" v-show="access != 'a' && access != 'e'">
                <li v-bind:class="isActive? 'actived' : ''" v-tooltip="'CME'">
                    <span class="material-symbols-outlined">
                        reset_wrench
                    </span>
                </li>
            </router-link>
            
            <li v-on:click="logout()">
                <span class="material-symbols-outlined">
                    logout
                </span>
            </li>
        </ul>
    </nav>    
</template>

<script>
  export default {

    props: ['access'],

    methods: {
        logout (){
            localStorage.clear();
            this.$router.replace('/');
        },
    },
    
   
  }
</script>

<style scoped>
    
    .logo{
        /* background-color: white; */
    }
    #check_control_equip:checked + .content-submenu{
        height: 180px;
    }

    i{
        transition: all 0.3s;
    }

    #check_control_equip:checked + .content-submenu  label div i{
        transform: rotate(-90deg);
    }
    .content-submenu:hover, .actived{
        background-color: aliceblue;
        color: #000;
    }

    .content-submenu{
        position: relative;
        background-color: aliceblue;
        height: 38px;
        overflow: hidden;
        transition: all 0.5s;
    }
    .submenu{
        padding: 0;
        margin-top: 10px;
    }
    nav{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 56px;
        background-color:var(--blue);
        overflow-y: auto;
        z-index: 3;
    }

    nav ul{
        margin: 0;
        padding: 0;
    }

  

    nav ul a{
        text-decoration: none;
        color: #313131;

    }

    nav ul li{
        margin: 3px;
        padding: 10px;
        border-radius: 3px;
        border: solid 1px transparent;
        list-style: none !important;
        font-size: 15px;
        color: azure;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
    }


    nav ul li:hover{
        background-color: aliceblue;
        color: rgb(0, 0, 0);
        cursor: pointer;
    }

    nav .profile{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 60px;
        border-bottom: solid 1px #00000040;
    }

    

   
</style>