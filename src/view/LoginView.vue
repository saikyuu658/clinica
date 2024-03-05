<script>
    import RequestHttp from '@/http'
    import Toast from 'primevue/toast';
    export default{
        components: {
            Toast,
        },
        data() {
            return {
                showSenhas : false,
                credential: {
                    login: '',
                    password: ''
                }, 
                isLoading : false

            }
        }, 
        methods : {
            async login(){
                this.isLoading = true;
                const item = await RequestHttp.login(this.credential)
                this.isLoading = false;
                if(item.token_acess){
                    localStorage.setItem('token', item.token_acess)
                    this.$router.push("/home")
                }else{
                    this.$toast.add({ severity: 'error', summary: 'Erro', detail: item.message, life: 3000 })
                }
            }
        }

    }
</script>
<template>
    <section class="form-side">
        <form @submit.prevent="login">
            <div class="form-group">
                <label for="">Usuário</label>
                <input class="input" type="text" placeholder="Usuário" v-model="credential.login"  style="width: 100%;">
            </div>
            <div class="form-group">
                <label for="">Senha</label>
                <input class="input" :type="showSenhas? 'text' : 'password'" v-model="credential.password" placeholder="" style="width: 100%;">
            </div>
            <div class="form-group">
                <label class="checkbox">
                    <input type="checkbox"  v-model="showSenhas"  >
                    Mostrar Senha
                </label>
               
            </div>
            <button class="button is-info" :class="isLoading ? `is-loading` : '' ">Entrar</button>
        </form>
    </section>
    <section class="img-side"></section>
    <Toast />
</template>

<style scoped>

    .form-side{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 400px;
        display:flex;
        justify-content: center;
        align-items: center;
    }
    form .form-group{
        margin-bottom: 20px;
        width: 300px;
    }
    form .form-group .input-text{
        display: block;
        width: 100%;
        border-radius:7px;
        padding: 5px;
        border: solid 1px #00000020
    }
    form .form-group .input-text:focus{
        outline: none;
    }
    .img-side{
        background-image: URL('../assets/LOGO\ HORIZONTAL\ 02.png');
        background-repeat: no-repeat;
        background-size: cover;
        top: 0;
        bottom: 0;
        right: 0;
        left: 400px;
        position: absolute;
    }
    .btn-login{
        width: 100px;
    }
</style>
