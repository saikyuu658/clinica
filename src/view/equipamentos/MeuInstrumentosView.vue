<template>
     <div>
        <div class="filter">
            <span class="title-filter">Meus Equipamentos</span>
            <div class="right-filter">
                <Button v-on:click="openModal()" >
                    Esterilizar Itens
                </Button>
            </div>
        </div>

        <section class="content-table"> 
            <DataTable 
                expandableRowGroups 
                scrollable 
                tableStyle="min-width: 70rem"
                scrollHeight="flex" 
                sortField="dt_sterilize"
                :value="listaInstrumento" 
                :sortOrder="1"
                rowGroupMode="subheader"
                groupRowsBy="created_at"
                v-model:expandedRowGroups="expandedRowGroups"

            >
                <template #empty> 
                        Nenhum equipamento enviado.
                </template> 
                <template #groupheader="slotProps">
                    <b>{{ formatDate(slotProps.data.created_at) }}</b>
                </template>
                 
                <Column field="nome" header="Nome"></Column>
                <Column field="status" header="Status">
                    <template #body="slotProps">
                        <span :style="{
                        'padding': '5px 10px',
                        'color' : 'white',
                        'border-radius': '30px',
                        'backgroundColor' :  slotProps.data.status=='solicitada'? '#ffc107' : 
                            slotProps.data.status=='aceita'? '#198754' : 
                            slotProps.data.status=='rejeitada'? '#dc3545' : '#0d6efd'
                        }"
                        >
                            {{ formateStatus(slotProps.data.status) }}
                        </span>
                    </template>
                </Column>
                <Column field="data_utilizar" header="Data da Utilização">
                    <template #body="slotProps">
                        {{ slotProps.data.data_utilizar? new Date(slotProps.data.data_utilizar).toLocaleDateString('pt-BR') : '-' }}
                    </template>
                </Column>
                <Column field="created_at" header="Data do Envio">
                    <template #body="slotProps">
                        {{ formatDate(slotProps.data.created_at) }}
                    </template>
                </Column>
               
            </DataTable>
        </section>
        
    </div>

    <ModalComponent
        @close="closeModalLarge"
        v-show="isModalSendList"
    >
        <template v-slot:header>
            <h3 style="font-size: large;">Esterilização</h3>
        </template>

        <template v-slot:body>
            
                <form @submit.prevent="()=>{
                    if(selectedinstrumentosToSterilize == undefined || quantidade <= 0){
                        this.$toast.add({ severity: 'warn', summary: 'Alerta', detail: 'Selecione um valor', life: 3000 });
                        return
                    }
                    for (let i = 0; i < quantidade; i++) {
                        instrumentosTemporario.push(selectedinstrumentosToSterilize);
                    }
                    selectedinstrumentosToSterilize=undefined
                    quantidade = 1;}">
                    <div class="row-actions">
                        <dropdown  v-model="selectedinstrumentosToSterilize" :options="instrumentos" optionLabel="nome" placeholder="Selecione os instrumentos"  style="width: 100%; max-width:500px ;" />
                        <InputText type="number" v-model="quantidade" placeholder="Quantidade"  style="width: 60px;"/>
                        <Button type="submit" style="display: flex; justify-items: center;"> 
                            <span class="material-symbols-outlined">
                                add
                            </span>
                        </Button>
                    </div>
                </form>
                    
                <div class="content-list-table" style="max-height: 75%">
                    <table class="list-equip-table">
                        <tbody>
                            <tr v-for="(item, index) of instrumentosTemporario" :key="index">
                                <td>{{ item.nome }}</td>
                                <td style="width: 5%;">
                                    <span class="material-symbols-outlined" style="cursor: pointer;" v-on:click="()=>{instrumentosTemporario.splice(index, 1)}">
                                        delete
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="total-tabela">
                    <label for="">Data da Utilização: </label>
                    <InputText type="date" 
                        v-model="diaUtilizacao"  style="max-width: 200px;"/>
                </div>
        </template>
        <template v-slot:footer>
            <div class="footer-modal">
                <p class="total-tabela">Total: {{ instrumentosTemporario.length }}</p>
                <Button label="Enviar" @click="enviarInstrumentos()"></Button>
            </div>
        </template>

    </ModalComponent>

    <LoadingComponent v-show="isLoading"></LoadingComponent>
</template>
<script lang="js">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column';
import Button from 'primevue/button';
import LoadingComponent from '@/components/LoadingComponent.vue';
import InputText from 'primevue/inputtext';
import dropdown from 'primevue/dropdown';
import {http} from '@/http';
import ModalComponent from '@/components/ModalComponent.vue';
export default {
    components: {
        LoadingComponent,
        DataTable,
        Column,
        dropdown,
        Button,
        ModalComponent,
        InputText
    },
    data() {
       return {
            isModalSendList: false,
            listaInstrumento: [],
            selectedinstrumentosToSterilize: undefined,
            expandedRowGroups: null,

            instrumentos: [{
                nome: '',
                staus: '',
                created_at: ''
            }],

            instrumentosTemporario: [],
            diaUtilizacao: '',
            quantidade: 1,
            isLoading: false
       }
    },
    methods: {
        closeModalLarge(){
            this.isModalSendList = false
            this.instrumentos = [];
            this.instrumentosTemporario = [];
        },

        formateStatus(val){
            switch (val) {
                case 'aceita':
                    return 'Limpando';
                case 'solicitada':
                    return 'Aguardando aprovação';
                default:
                    break;
            }
        },


        async openModal(){
            try {
                this.isLoading = true
                const resp = await http.get('esterilizar/instrumentos');
                if(resp){
                    this.instrumentos = resp.data
                    this.isModalSendList = true
                }
                this.isLoading = false
            } catch (error) {
                this.isLoading = false
            }
        },

        formatDate(val){
            const data = new Date(val);
            return `${data.toLocaleDateString()} - ${data.toLocaleTimeString()}`
        },

        async getMyInstrumentos(){
            try {
                this.isLoading = true;
                const resp = await http.get('esterilizar/alunosInstrumentos/');
                this.listaInstrumento = resp.data
                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
            }
        },

        async enviarInstrumentos(){
            try {
                this.isLoading = true;
                if(this.instrumentosTemporario.length == 0) {
                    this.$toast.add({ severity: 'warn', summary: 'Alerta', detail: 'Nenhum item foi enviado', life: 3000 });
                    return
                }
                let listInstrumentos=[];
                for (const instrumentos of this.instrumentosTemporario) {
                    listInstrumentos.push({id_instrumento : instrumentos.id})
                }
                let temp = {
                    data_utilizacao: this.diaUtilizacao?? null,
                    listInstrumentos : listInstrumentos
                };

                const resp = await http.post('esterilizar/movimento', temp);
                this.isLoading = false;
                this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: resp.data, life: 3000 })
                this.closeModalLarge()
                this.getMyInstrumentos()
            } catch (error) {
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
            }
        },
    },

    created() {
        this.getMyInstrumentos();
    },
    
}
</script>
<style scoped>
    .footer-modal{
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
    }
    .total-tabela{
        display: flex;
        flex-direction: column;
        font-weight: 600;
        font-size: 14px;
        color: black;
        font-family: 'Poppins';
    }   
    .content-list-table{
        min-height: 75%;
        border-radius: 8px;
        border: solid 1px #00000035;
        padding: 12px 8px;
    }

    .list-equip-table{
        width: 100%;
        border-bottom: solid 1px #00000035;
    }

    .list-equip-table tbody td{
        border-collapse: collapse;
        border-bottom: solid 1px #00000035;
    }

    .material-symbols-outlined{
        cursor: pointer;
    }

    .row-actions{
        margin-bottom: 10px;
        display: flex;
        gap: 8px;
    }
</style>