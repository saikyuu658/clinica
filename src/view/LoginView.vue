<script>
    import Toast from 'primevue/toast';
    import axios from 'axios';
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
                try {
                    this.isLoading = true;
                    const temp = {
                        login : this.credential.login,
                        senha : this.credential.password
                    }
                    const item = await axios.post(this.API_URL+'/user/login', temp)

                    this.isLoading = false;
                    localStorage.setItem('token_access', item.data.token_acess)
                    localStorage.setItem('nivel', item.data.nivel)
                    localStorage.setItem('nome', item.data.nome)
                    this.$router.push("/home")
                } catch (error) {
                    this.isLoading = false;
                    this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
                    
                }
            }
        }

    }
</script>
<template>
    <section class="form-side">
        <form @submit.prevent="login">
            <div class="logo">
                <img src="../assets/odonto_logo.png" width="90px" alt="" srcset="">
            </div>
            <div class="form-group">
                <label for="">Usuário:</label>
                <input class="input" type="text" placeholder="Digite seu usuário" v-model="credential.login"  style="width: 100%;">
            </div>
            <div class="form-group">
                <label for="">Senha:</label>
                <input class="input" placeholder="Digite sua senha" :type="showSenhas? 'text' : 'password'" v-model="credential.password"  style="width: 100%;">
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
    .button { 
        background-color: #26348b;
    }
    .form-side{
        position: absolute;
        background-color: #65c1d8 ;
        top: 0;
        bottom: 0;
        left: 0;
        width: 400px;
        display:flex;
        justify-content: center;
        align-items: center;
    }
    .logo{
        display: flex;
        padding-block: 10px;
        justify-content: center;
    }
    form {
        padding: 30px;
        border-radius: 30px;
        width: 90%;

    }
    form .form-group{
        margin-bottom: 20px;
    }

    form .form-group label {
        font-weight: 600;
        color: white;
        font-size: 15px;
    }

    input {
        border: none;
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
        background-image: URL('../assets/clinica_bg.png');
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

    .checkbox {
        color: white;
        font-weight: 600;
    }
</style>
