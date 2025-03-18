<template>
    <h1>{{nome}}</h1>
    <p > Seja bem vindo ao sistema da Clínica Odontológica da Faculdade Luciano Feijao </p>
    <div class="content-feijao">
        
        <img src="../assets/FeiJondonto.png" alt="" width="200px">
    </div>

</template>
<script>

export default {

    data(){
        return {
            nome: ''
        }
    },
    methods: {
        getNome(){
            const temp = localStorage.getItem('nome');
            console.log(temp)
            if(temp){
                this.nome = temp
            }else{
                this.nome = 'Clinica Odontológica FLF'
            }
        }

    },

    created() {
        this.getNome()
    }
}
</script>
<style scoped>
     
    h1{
        margin: 10px;
        font-size: 23px;
        font-weight: 600;
        border-bottom: solid 1px #c2c2c2;
    }

    .content-feijao{
      
    }
    p {
        margin: 10px;
        font-size: 15px;
    }
</style>