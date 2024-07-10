<template>
    <div>
        <div class="filter">
            <span class="title-filter">CME</span>
            <div class="right-filter">
                <button class="button is-info is-small" v-on:click="showModalAlunosInstrumentos" >
                    Cadastrar Materiais
                </button>
                <button class="button is-info is-small" v-on:click="()=>{
                    filterSidebar = true;
                }">
                    <span class="material-symbols-outlined">
                        filter_alt
                    </span>
                </button>
                <FilterComponent
                    @searchValue="search"
                ></FilterComponent>
            </div>
        </div>
    </div>


    <h3 style="
        font-size: 15px;
        margin-left: 10px;
        border: solid 1px #2b2b2b67;
        width: fit-content;
        color: #323232cb;
        padding: 5px 10px;
        gap: 5px;
        border-radius: 30px;
        display: flex;
        align-items: center;
    ">
    <span class="material-symbols-outlined" style="color: #323232;"
        v-show="showFilterSelected != 'Todas'"
        v-on:click="()=>{
            filterSelected = ''
            showFilterSelected = 'Todas'
            findAllSterilize();
        }"
    >
        close
    </span>
        Filtro: <span style="
            font-weight: bold;
            font-size: 15px;
        "
        >{{`   ${showFilterSelected}` }}</span>
    </h3>
    <section class="content-table"> 
        <DataTable 
            :value="listComputed" 
            scrollable 
            scrollHeight="flex" 
            tableStyle="min-width: 70rem"
            :sortOrder="0"
            sortField="id"
        >
            <template #empty> Nenhum registro. </template>
            <Column field="status" header="Status" >
                <template #body="slotProps">
                    <span :style="{
                     'padding': '5px 10px',
                     'color' : 'white',
                     'border-radius': '30px',
                     'backgroundColor' :  slotProps.data.status=='pendente'? '#ffc107' : 
                        slotProps.data.status=='aceita'? '#198754' : 
                        slotProps.data.status=='rejeitada'? '#dc3545' : '#0d6efd'
                     }"
                             
                    >
                        {{ slotProps.data.status }}
                    </span>
                </template>
            </Column>
            <Column field="ra" header="Ra"></Column>
            <Column field="nome" header="Aluno"></Column>
            <Column field="box" header="Caixa"></Column>
            <Column field="created_at" sortable header="Dt. Recebido">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.created_at) }}
                </template>
            </Column>
            <Column field="updated_at" sortable header="Dt. Atualização">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.updated_at) }}
                </template>
            </Column>
            <Column field="qtd" header="Qtd. Instru."></Column>
            <Column >
                <template #body="slotProps">
                    <div style="display: flex;">
                        <span 
                            v-show="slotProps.data.status == 'aceita'"
                            v-on:click="()=>{showModalDetals(slotProps.data)}"
                            v-tooltip.bottom="'Detalhar'"
                            class="material-symbols-outlined">
                                open_in_new
                        </span>

                        <span 
                            v-show="slotProps.data.status == 'rejeitada'"
                            v-on:click="()=>{showModalDetals(slotProps.data)}"
                            v-tooltip.bottom="'Detalhar'"
                            class="material-symbols-outlined">
                                open_in_new
                        </span>
                        <span 
                            v-show="slotProps.data.status == 'solicitada'"
                            v-on:click="showModal(slotProps.data)"
                            v-tooltip.bottom="'Validar'"
                            class="material-symbols-outlined">
                                receipt_long
                        </span>
                        <span 
                            class="material-symbols-outlined"
                            v-tooltip.bottom="'Aguardando retorno do aluno'"
                            v-show="slotProps.data.status == 'pendente'"
                            >
                                device_reset
                        </span>
                    </div>
                </template>
            </Column>
        </DataTable>
    </section>
<!-- Modal de detalhes-->
    <ModalComponentVue
        v-show="isReciveModal"
        @close="closeReciveModal"
    >
        <template v-slot:header>
            <h3>Validar </h3>
        </template>

        <template v-slot:body>
                <div class="row-group" style="justify-content: space-between;">
                    <div class="row-group" style="gap: 30px;">
                        <div class="form-group">
                            <label for=""> <b>ID</b></label>
                            <div>{{ listItemToRecive.id_moviment }}</div>
                        </div>

                        <div class="form-group">
                            <label for=""> <b>Aluno</b></label>
                            <div>{{ listItemToRecive.nomeAluno }}</div>
                        </div>
                        
                        <div class="form-group">
                            <label><b>Registro Acadêmico</b></label>
                            <div>{{ listItemToRecive.ra }}</div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="">Nº Caixa</label>
                        <input type="tel" style="width: 70px;" autocomplete="off" v-model="listItemToRecive.box" class="input is-small" id="setBoxStudent"  >
                    </div>
                </div>
                
                
                <form 
                    v-show="isVisibleFormEditList"
                    @submit.prevent="()=>{
                        if(selectedInstrumentosToAlterList){
                            listItemToRecive.listaInstrumentos.push(selectedInstrumentosToAlterList)
                            let index = listInstrumentosParcialByRaAluno.findIndex((e)=>{return e.id == selectedInstrumentosToAlterList.id})
                            selectedInstrumentosToAlterList= undefined;
                            listInstrumentosParcialByRaAluno.splice(index, 1)
                        }
                    }">
                    <div class="row-group">
                        <div class="form-group">
                            <label for="">Instrumento</label>
                            <select class="input is-small" v-model="selectedInstrumentosToAlterList">
                                <option :value=undefined selected disabled >Selecione</option>
                                <option :value="item" v-for="(item, index) of listInstrumentosParcialByRaAluno" :key="index">{{ item.nome }}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <button class="button is-info is-small">Add</button>
                        </div>
                    </div>
                </form>
            

            <label><b>Lista de equipamentos</b></label>
            <div class="content-list-table">
                <table class="list-equip-table">
                    <tbody>
                        <tr v-for="(item, index) of listItemToRecive.listaInstrumentos" :key="index">
                            <td>{{ item.nome }}</td>
                            <td v-show="isVisibleFormEditList" width="5%">
                                <div style="display: flex;">
                                    <span class="material-symbols-outlined" v-on:click="()=>{
                                        listInstrumentosParcialByRaAluno.push(item)
                                        listItemToRecive.listaInstrumentos.splice(index, 1)
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
            <button class="button is-danger is-small" 
                v-show="!isVisibleFormEditList" 
                style="align-self: flex-start;"  
                @click="()=>{
                    
                isVisibleModalSmall = true;
            }">
                Rejeitar
            </button>
            <button class="button is-warning is-small" v-show="!isVisibleFormEditList"  @click="alterListItens()">
                Alterar
            </button>
            <button class="button is-success is-small" v-show="!isVisibleFormEditList"  @click="acceptConfig()">
                Aceitar
            </button>

            <button class="button is-danger is-small" v-show="isVisibleFormEditList" style="align-self: flex-start;">
                Cancelar
            </button>
            <button class="button is-success is-small" v-show="isVisibleFormEditList"  @click="enviarListaItesnAtualizadas()">
                Enviar
            </button>
        </template>
    </ModalComponentVue>

    <!-- Modal de detalhes-->
    <ModalComponentVue
        v-show="isDetailsModalVisible"
        @close="closeModalDetails"
    >
        <template v-slot:header>
            <h3>Detalhes </h3>
        </template>

        <template v-slot:body>
            <div class="row-group" style="gap: 30px;">
               
                <div class="form-group">
                    <label for=""> <b>Aluno</b></label>
                    <div>{{ detalsInfosModal.nome }}</div>
                </div>
                <div class="form-group">
                    <label><b>Registro Acadêmico</b></label>
                    <div>{{ detalsInfosModal.ra }}</div>
                </div>
            </div>
            <div class="form-group" v-show="detalsInfosModal.status == 'rejeitada'">
                <label><b>Justificativa</b></label>
                <div>{{ detalsInfosModal.justificativa }}</div>
            </div>
            <div class="row-group" v-show="detalsInfosModal.status !='rejeitada'">
                <div class="form-group">
                    <label for="">Nº Caixa</label>
                    <input type="text" style="width: 70px;" autocomplete="off" v-model="detalsInfosModal.box" class="input is-small" id="setBoxStudent"  >
                </div>
                <div class="form-group">
                    <label for="">Status</label>
                    <select autocomplete="off" v-model="detalsInfosModal.status" class="input is-small">
                        <option value="aceita">Aceita </option>
                        <option value="retirado">Retirado </option>
                    </select>
                </div>
            </div>
            <div class="content-list-table">
                    <table class="list-equip-table">
                        <tbody>
                            <tr v-for="(item, index) of detalsInfosModal.listaInstrumentos" :key="index">
                                <td>{{ item.nome }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
        </template>

        <template v-slot:footer>
            
            <button class="button is-success is-info is-small" v-show="filterSelected !='rejeitada'"  @click="updateMovimento()">
                salvar
            </button>
            
        </template>
    </ModalComponentVue>

    <ModalLargeComponente
        v-show="isAlunoInstrumentos"
        @close="closeAlunosInstrumentosModal"
    >
        <template v-slot:header>
            <h3>Alunos Instrumentos</h3>
        </template>

        <template v-slot:body>
            <div class="row-group">
                <div class="form-group">
                    <label for="">Selecionar Aluno</label>
                    <select class="input is-small" v-model="selectedAlunoToSend" :disabled="disableOptionsAlunoSelect">
                        <option value='' selected disabled >Selecione</option>
                        <option :value="item.ra" v-for="(item, index) of listaALunosBd" :key="index">{{ item.nome }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <button class="button is-info is-small" v-show="!disableOptionsAlunoSelect" v-on:click="()=>{
                        if(selectedAlunoToSend == '' || selectedAlunoToSend == undefined){
                            return
                        }else{
                            searchListInstrumentosAlunos()
                            
                        }
                    }">Confirmar Aluno</button>
                    <button class="button is-info is-small" v-show="disableOptionsAlunoSelect" 
                        v-on:click="()=>{
                            disableOptionsAlunoSelect = !disableOptionsAlunoSelect
                            marca = { tipo: '', marca: ''}
                            listItensToSendAluno = []
                            
                        }">Alterar Aluno</button>
                </div>
            </div>
            
            <div class="row-group" v-show="disableOptionsAlunoSelect">
                <div class="form-group">
                    <label for="">Categoria</label>
                    <select class="input is-small" style="width: fit-content;" v-on:change="(e)=>{
                        listParcialInstrumentos = listFullInstrumentos.filter((a)=> a.categoria == e.target.value )
                    }">
                        <option value='' selected disabled >Selecione</option>
                        <option value="dentistica">Dentistica</option>
                        <option value="protese">Protese</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="">Equipamento</label>
                    <select class="input is-small" v-model="selectedItensToPushToList" style="width: 400px;" >
                        <option value='' selected disabled >Selecione</option>
                        <option :value="item" v-for="(item, index) of listParcialInstrumentos" :key="index">{{ item.nome }}</option>
                    </select>
                </div>
            </div>
            <div class="row-group" v-show="disableOptionsAlunoSelect">
                <div class="form-group">
                    <label for="">Tipo marcação</label>
                    <input class="input is-small" v-model="marca.tipo" >
                </div>
                <div class="form-group">
                    <label for="">Marcação</label>
                    <input class="input is-small" v-model="marca.marca" >
                </div>

                <div class="form-group">
                    <button class="button is-info is-small"  v-on:click="()=>{
                        if(selectedItensToPushToList != ''){
                            selectedItensToPushToList = {
                                tipo: marca.tipo,
                                marca : marca.marca,
                                id_instrumento : selectedItensToPushToList.id,
                                nome: selectedItensToPushToList.nome,
                                categoria: selectedItensToPushToList.categoria

                            }
                            listItensToSendAluno.push(JSON.parse(JSON.stringify(selectedItensToPushToList)))
                            selectedItensToPushToList = ''
                            marca = {
                                tipo: '',
                                marca: ''
                            }   
                        }
                    }">
                        <span class="material-symbols-outlined">
                            add
                        </span>
                    </button>
                </div>
            </div>
            <label><b>Lista de equipamentos</b></label>
                <div class="content-list-table" style="max-height: 60%">
                    <table class="list-equip-table">
                        <tbody>
                            <tr v-for="(item, index) of listItensToSendAluno" :key="index">
                                <td>{{ item.id }}</td>
                                <td>{{ item.id_instrumento }}</td>
                                <td>{{ item.nome }}</td>
                                <td>{{ item.tipo }}</td>
                                <td>{{ item.marca }}</td>
                                <td style="width: 5%;">
                                    <div style="display: flex; " >
                                        <span class="material-symbols-outlined" v-on:click="()=>{
                                                listItensToSendAluno.splice(index, 1)
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
            <button class="button is-success is-small" v-show="!isVisibleFormEditList"  @click="sendAlunosInstrumentos()">
                Salvar
            </button>
        </template>
    </ModalLargeComponente>
    
    <ModalSmallComponentVue
        @close="closeSmallModal"
        v-show="isVisibleModalSmall"
    >
        <template v-slot:body>
            <div class="form-group">
                <label for=""> Justifucativa</label>
                <input type="text" style="width: 100%;" 
                    class="input is-small" 
                    v-model="listItemToRecive.Justificativa">
            </div>
        </template>

        <template v-slot:footer>
            <button class="button is-danger is-small" @click="()=>{ isVisibleModalSmall= false}">
                Cancelar
            </button>
            <button class="button is-info is-small" @click="cancelMoviment()" >
                Confirmar 
            </button>
            
            
        </template>

    </ModalSmallComponentVue>
   
    <LoadingComponentVue v-show="isLoading"></LoadingComponentVue>

    <SideFilterComponentVue
        @close="closeFilter"
        v-show="filterSidebar"
    >

        <template v-slot:body>
            <div class="form-group">
                <label for="">Mostrar listas </label>
                <select class="is-small input is-fullwidth" v-model="filterSelected">
                    <option value="" disabled>Todas</option>
                    <option value="solicitada">Solicitadas</option>
                    <option value="pendente">Pendentes de confirmação</option>
                    <option value="aceita">Aceitas</option>
                    <option value="rejeitada">Rejeitadas</option>
                </select>
            </div>
        </template>

        <template v-slot:footer>
            <button class="button is-small is-fullwidth is-info" v-on:click="applyFilter()">Aplicar Filtro</button>
        </template>
        
    </SideFilterComponentVue>

</template>
<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column';
import FilterComponent from '@/components/FilterComponent.vue';
import {http} from '@/http';
import LoadingComponentVue from '@/components/LoadingComponent.vue';
import ModalSmallComponentVue from '@/components/ModalSmallComponent.vue';
import ModalLargeComponente from '@/components/ModalLargeComponent.vue'
import ModalComponentVue from '@/components/ModalComponent.vue';
import SideFilterComponentVue from '@/components/SideFilterComponent.vue';
import {mask} from 'vue-the-mask'
export default {
    props: ['nivel'],
    directives: {mask},
    components: {
        ModalSmallComponentVue,
        ModalComponentVue,
        ModalLargeComponente,
        DataTable,
        Column,
        FilterComponent,
        LoadingComponentVue,
      
        SideFilterComponentVue
    },
    data(){
        return {
            listItemToRecive: {
                id_moviment : 0,

            },
            listaCompletaMovimentacoes : [],
            isVisibleFormEditList: false,
            isAlunoInstrumentos: false,

            listInstrumentosByRaAluno: [],
            listInstrumentosParcialByRaAluno: [],

            selectedInstrumentosToAlterList:{ nome: '', id: 0},

            searchInput: "",
            listSterilize: [],
            isEditListModal: false,
            newItem:{
                qtd: 1,
                name: '',
                codStudent: 0,
                boxStudent: ''
            },
            openSmallModal : undefined,
            returnedListToSend: [],
            returnSterlize: [{
                boxStudent: '',
                codStudent: ''
            }],
            /**lista de itens para gravar*/
            credential: {},
            /**lista de itens para selecionar*/
            isLoading: false,
            listUser: [],
            isReciveModal: false,

            isVisibleModalSmall: false,
            

            //modal para configurar alunos itens
            selectedItensToPushToList: undefined,
            listaALunosBd : [],
            selectedAlunoToSend : undefined,
            listFullInstrumentos : [],
            listParcialInstrumentos : [],
            disableOptionsAlunoSelect: false,
            listItensToSendAluno: [],
            marca: { tipo: '', marca: ''},

            //filter Sidebar
            filterSidebar : false,
            filterSelected : '',
            showFilterSelected: 'Todas',

            //is Details Modal
            isDetailsModalVisible: false,
            detalsInfosModal: false

        }
    },
    methods: {
        formatFiltros(){
            // <option value="solicitadas">Solicitadas</option>
            //         <option value="alteradas">Pendentes de confirmação</option>
            //         <option value="aceitas">Aceitas</option>
            //         <option value="rejeitadas">Rejeitadas</option>
            switch (this.filterSelected) {
                case 'solicitada':
                    return 'Solicitadas'
                case 'pendente':
                    return 'Pendentes de confirmação'
                case 'aceita':
                    return 'Aceitas'
                case 'rejeitada':
                    return 'Rejeitadas'
                
                default:
                    break;
            }
        },  
        async applyFilter(){
            try {
                this.isLoading = true;
                const resp = await http.get('esterilizar/findAllMovimentos/'+this.filterSelected);
                this.listSterilize = resp.data;
                this.isLoading = false;
                this.filterSidebar = false;
                this.showFilterSelected = this.formatFiltros()
            } catch (error) {
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.message, life: 3000 })
            }
        },

        closeFilter(){
            this.filterSidebar = false;
        },

        closeModalDetails(){
            this.isDetailsModalVisible = false
        },
       
        async searchListInstrumentosAlunos(){
            try {
                this.isLoading = true;
                const resp = await http.get('esterilizar/findAlunosInstrumentosbyRa/'+this.selectedAlunoToSend);
                this.isLoading = false;
                if(resp.data.length){
                   for (const iterator of resp.data) {
                        this.listItensToSendAluno.push(
                            {
                                id: iterator.id,
                                id_instrumento: iterator.id_instrumento,
                                nome: iterator.nome,
                                marca: iterator.marca,
                                tipo: iterator.tipo_marca,
                            }
                        )
                   }
                }
                this.disableOptionsAlunoSelect = !this.disableOptionsAlunoSelect
            } catch (error) {
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.message, life: 3000 })
            }
        },
            
        async sendAlunosInstrumentos(){
            try {
                this.isLoading = true;
                let temp = {alunosInstrumentos: []};
                for (const iterator of this.listItensToSendAluno) {
                    temp.alunosInstrumentos.push(
                        {
                            id: iterator.id? iterator.id : undefined,
                            ra: this.selectedAlunoToSend,
                            id_instrumento: iterator.id_instrumento,
                            tipo_marca : iterator.tipo,
                            marca: iterator.marca
                        }
                    )
                }

                console.log(temp)
                const resp = await http.post('esterilizar/saveAlunosInstrumentos', temp);
                this.isLoading = false;
                this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: resp.data, life: 3000 })
                this.closeAlunosInstrumentosModal()

            } catch (error) {
                this.isLoading = false;
                this.closeAlunosInstrumentosModal()
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
            }
        },

        async cancelMoviment(){
            try {
                await http.post('esterilizar/rejectMovimento', this.listItemToRecive); 
                this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Atualizado com sucesso', life: 3000 })
                this.isReciveModal=false;
                this.isVisibleModalSmall=false;

                this.listItemToRecive.justificativa = '';
                this.findAllSterilize()
            } catch (error) {
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.message, life: 3000 })

            }
        },

        async acceptConfig(){
            try {
                this.isLoading = true;
                const resp = await http.post('esterilizar/acceptMovimento', this.listItemToRecive);
                this.isLoading = false;
                this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: resp.data, life: 3000 })
                this.isReciveModal= false;
                this.findAllSterilize();

            } catch (error) {
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.message, life: 3000 })
            }
        },
        
        async alterListItens(){
            try {
                this.isLoading = true;
                const resp = await http.get('esterilizar/findAlunosInstrumentosbyRa/'+this.listItemToRecive.ra);
                this.listInstrumentosByRaAluno = resp.data

                this.listInstrumentosParcialByRaAluno = this.listInstrumentosByRaAluno.filter(e=>e.status == 0)
                this.isLoading = false;
                this.isVisibleFormEditList= true;
            } catch (error) {
                console.log(error)
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
            }
        },

        async enviarListaItesnAtualizadas(){
            try {
                this.isLoading = true;
                const resp = await http.post('esterilizar/alterarMovimento', this.listItemToRecive);
                this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: resp.data, life: 3000 })
                this.isLoading = false;
                this.isReciveModal = false;
                this.findAllSterilize();
                this.isVisibleFormEditList = false;
            } catch (error) {
                this.isVisibleFormEditList = false;
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.message, life: 3000 })
            }
        },

        async updateMovimento(){
            try {
                this.isLoading = true;
                const resp = await http.post('esterilizar/updateMovimento', this.detalsInfosModal);
                this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: resp.data, life: 3000 })
                this.isLoading = false;
                this.isDetailsModalVisible = false;
                this.applyFilter();
            } catch (error) {
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
            }
        },
    
        closeSmallModal(){
            this.credential = {};
            this.isVisibleModalSmall  = false
        },

        formatDate(val){
            const data = new Date(val);
            return data.toLocaleDateString()
        },
        
        closeReciveModal(){
            this.isReciveModal = false;
            this.isVisibleFormEditList = false;
        },

        closeAlunosInstrumentosModal(){
            this.isAlunoInstrumentos = false;
            this.selectedAlunoToSend = '';
            this.marca = { tipo : '', marca: ''}
            this.listItensToSendAluno = [];
            this.disableOptionsAlunoSelect = !this.disableOptionsAlunoSelect
        },

        async showModalAlunosInstrumentos(){
            try {

                await Promise.all([http.get('esterilizar/alunos'), http.get('esterilizar/instrumentos') ])
                         .then((values)=>{
                            this.listaALunosBd = values[0].data;
                            this.listFullInstrumentos = values[1].data
                         })
                this.isAlunoInstrumentos = true;
            } catch (error) {
                this.isLoading = false
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
            }
        },

        async showModal(data){
            try {
                
                this.isReciveModal = true;
                const resp = await http.get('esterilizar/findOneMoviment/'+data.id);
                this.listItemToRecive = {
                    ra: data.ra,
                    nomeAluno: data.nome,
                    caixa : data.box,
                    id_moviment: data.id, 
                    listaInstrumentos: resp.data
                }
            } catch (error) {
                this.isLoading = false
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
            }
        },

        async showModalDetals(data){
            try {
                console.log(data);
                const resp = await http.get('esterilizar/findOneMoviment/'+data.id);
                this.detalsInfosModal = JSON.parse(JSON.stringify(data)) 
                this.detalsInfosModal.listaInstrumentos = resp.data
                this.isDetailsModalVisible = true;
            } catch (error) {
                this.isLoading = false
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
            }
        },

        search(value){
            this.searchInput = value;
        },

        async findAllSterilize(){
            try {
                this.isLoading = true;
                const resp = await http.get('esterilizar/findAllMovimentos');
                this.listSterilize = resp.data;
                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.message, life: 3000 })
            }
        },

        async showModalReturn(data){
            this.isLoading = true
            const resp = await http.listItensFromSterilize(data);
            if(resp.hasError){
                this.isLoading = false
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })
            }else{
                this.returnSterlize = resp
                this.isLoading = false
                this.isVisibleModalReturn = true;
            }
        },
        
        setValuesInListaToTable(){
            if(this.filterSelected == 'pendentes'){
                this.listSterilize = this.listaCompletaMovimentacoes.filter((e=>{return e.status =='e' || e.status == 'p'}))
            }else if(this.filterSelected == 'aceitas'){
                this.listSterilize = this.listaCompletaMovimentacoes.filter((e=>{return e.status =='a' }))
            }else{ 
                this.listSterilize = this.listaCompletaMovimentacoes.filter((e=>{return e.status =='r' }))
            }
        }
    },
    computed: {
        listComputed(){
            if(this.searchInput == ""){
                return this.listSterilize;
            }else{
                return this.listSterilize
                .filter((e)=> {
                    if(
                        e.ra.toString().toLowerCase().includes(this.searchInput.toLowerCase())||
                        e.nome.toString().toLowerCase().includes(this.searchInput.toLowerCase())
                        ){
                        return e;
                    }
                })
            }
        }
    },

    created(){
        this.findAllSterilize();
        
        // this.toListItemSterilize();
    }
   
}
</script>

<style>
    
    @media print{
        nav{
            display: none;
        }

        #print{
            display: block !important;
        }
    }
</style>

<style scoped>

    #print{
        z-index: 25;
        height: fit-content;
        background-color: white;
        position: fixed;
        width: 100%;
        height: 100vh;
        display: none;
    }

    .print-header{
        display: flex;
        margin-bottom: 50px;
        justify-content: space-around;
    }
    #print .print-header .logo{
        width: fit-content;
        display: flex;
        flex-direction: column;
        font-size: large;
        font-weight: bold;
        white-space: nowrap;
        align-items: center;
    }

    #print .lista-items{
        padding: 3vw;
        
    }

    .ass{
        margin-top: 10px;
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        position: absolute;
        bottom: 0;
      
    }

    .ass p{
        text-decoration: overline;
    }

    #print .lista-items p{
        margin-bottom: 20px;
        font-size: 20px;
        font-weight: bold;
    }

    #print .lista-items ul {
        list-style: disc;
        margin-left: 15px;
    }
    #print .print-header .info{
        display: flex;
        flex-direction: column;
        justify-content: centerp;
    }

    #print .logo img{
        width: 70px;
    }
    .text{
        margin-bottom: 25px;
    }
    .content-list-table{
        overflow-y: auto;
        width: 100%;
        overflow-x: hidden;
        max-height: 55%
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


    
</style>