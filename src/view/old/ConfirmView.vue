<template>
    <section class="bg">
        <div class="card">
            <img src="../assets/FeiJondonto.png" alt="" width="100px">
            <div>
                <p style="
                    font-weight: bold;
                    font-size: 18px;
                    "
                    >
                    Olá {{ $route.params.ra }}. <br>
                    {{ $route.params.accept=="true" ? "Obrigado pela sua confirmação!!" : "Por favor, retorne a instituição para esclarecimentos"}}
                </p>
            </div>
        </div>
    </section>
</template>

<script>
import {http} from '@/http'
export default {

    methods: {
        async justAccept(){
            try {
                let temp = {
                    id: this.$route.params.id,
                    status: this.$route.params.accept == 'true' ? 'aceita' : 'rejeitada',
                    justificativa: this.$route.params.accept == 'true' ? '': 'Aluno rejeitou a solicitação de alteração'
                }
                await http.post('esterilizar/confirmMovimento', temp)
            } catch (error) {
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
            }
        }
    },

    created() {
        this.justAccept();
    },
}
</script>

<style scoped>
    .bg {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f1f1f1;

    }

    .card{
        background-color: white;
        display: flex;
        width: fit-content;
        max-width: 80%;
        align-items: center;
        padding: 10px;
    }

</style>