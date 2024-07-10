<template>
     <div>
        <div class="filter">
            <span class="title-filter">Meus Equipamentos</span>
            <div class="right-filter">
                <button class="button is-info is-small" v-on:click="()=>{
                    isModalSendList = true
                    listaParcialInstrumentos = JSON.parse(JSON.stringify(listaInstrumento.filter((e)=>e.status == 'Limpo' || e.status.toLowerCase() =='Rejeitado'.toLowerCase())))
                    }" >
                    Esterilizar Itens
                </button>
                
            </div>
        
        </div>

        <section class="content-table"> 
            <DataTable 
                scrollable 
                tableStyle="min-width: 70rem"
                scrollHeight="flex" 
                :value="listaInstrumento" 
                :sortOrder="1"
                sortField="id"
            >
                <template #empty> Nenhum registro. </template>

                <Column field="id" header="ID"></Column>
                <Column field="nome" header="Nome"></Column>
                <Column field="status" header="Status"></Column>
                <Column field="dt_sterilize" header="Ult. Esteri.">
                    <template #body="slotProps">
                        {{ formatDate(slotProps.data.dt_sterilize) }}
                    </template>
                </Column>
            </DataTable>
        </section>
        
    </div>

    <ModalLargeComponentVue
        @close="closeModalLarge"
        v-show="isModalSendList"
    >
        <template v-slot:header>
            <h3>Esterilização</h3>
        </template>

        <template v-slot:body>
            
            <div class="row-group">
                <div class="form-group">
                    <label for="">Selecionar Instrumento</label>
                    <select class="input is-small" v-model="selectedinstrumentosToSterilize" >
                        <option value='undefined' selected disabled >Selecione</option>
                        <option :value=item  v-for="(item, index) of listaParcialInstrumentos" :key="index">{{ item.id }} - {{ item.nome }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <button class="button is-info is-small" v-on:click="()=>{
                        if(selectedinstrumentosToSterilize == undefined){
                            return
                        }
                        listaToTableInstrumentos.push(selectedinstrumentosToSterilize);
                        let index = listaParcialInstrumentos.findIndex((e)=>{return e.id == selectedinstrumentosToSterilize.id})
                        if(index == -1){
                            $toast.add({ severity: 'error', summary: 'Erro', detail: 'Algo de errado aconteceu', life: 3000 })
                            return
                        }
                        selectedinstrumentosToSterilize=undefined
                        listaParcialInstrumentos.splice(index, 1)
                    }">
                        <span class="material-symbols-outlined">
                            add
                        </span>
                    </button>
                    
                </div>
            </div>
            
            
                <div class="content-list-table" style="max-height: 60%">
                    <table class="list-equip-table">
                        <tbody>
                            <tr v-for="(item, index) of listaToTableInstrumentos" :key="index">
                                <td>{{ item.id }}</td>
                                <td>{{ item.nome }}</td>
                                <td>{{ item.tipo }}</td>
                                <td>{{ item.marca }}</td>
                                <td style="width: 5%;">
                                    <div style="display: flex; " >
                                        <span class="material-symbols-outlined" v-on:click="()=>{
                                                listaParcialInstrumentos.push(item)
                                                listaToTableInstrumentos.splice(index, 1)
                                        }">
                                            delete
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
        </template>
        <template v-slot:footer>
            <button class="button is-success is-small" @click="sendAlunosInstrumentos()">
                Enviar
            </button>
        </template>

    </ModalLargeComponentVue>
</template>
<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column';
import ModalLargeComponentVue from '@/components/ModalLargeComponent.vue';
import {http} from '@/http';
export default {
    components: {
        DataTable,
        Column,
        ModalLargeComponentVue,
    },
    data() {
       return {
            isModalSendList: false,
            listaInstrumento: [{
                id: 0,
                nome: 'Broca 1',
                status: 0
            }],
            selectedinstrumentosToSterilize: undefined,
            listaParcialInstrumentos: [],
            listaToTableInstrumentos: []
       }
    },
    methods: {
        closeModalLarge(){
            this.isModalSendList = false
            this.listaParcialInstrumentos = [];
            this.listaToTableInstrumentos = [];
        },

        formatDate(val){
            const data = new Date(val);
            return data.toLocaleDateString()
        },

        async getMyInstrumentos(){
            try {
                this.isLoading = true;
                const resp = await http.get('esterilizar/findAlunosInstrumentosbyRa/');
                this.listaInstrumento = resp.data
                this.isLoading = false;

            } catch (error) {
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
            }
        },

        async sendAlunosInstrumentos(){
            try {
                this.isLoading = true;
                if(this.listaToTableInstrumentos.length == 0) {
                    this.$toast.add({ severity: 'warn', summary: 'Alerta', detail: 'Selecione um item para ser enviado', life: 3000 });
                    return

                }
                let listInstrumentos=[];
                for (const list of this.listaToTableInstrumentos) {
                    listInstrumentos.push({id_aluno_instrumento : list.id})
                }
                let temp = {
                    listInstrumentos : listInstrumentos
                };
                
                const resp = await http.post('esterilizar/enviarListaInstrumentos', temp);
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
</style>