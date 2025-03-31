<template>
    <div>
        <div class="filter">
            <span class="title-filter">CME</span>
            <div class="right-filter">

                <Button v-on:click="()=>{isShowfilterSidebar = !isShowfilterSidebar}" icon="pi pi-filter"></Button>

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
        v-show="showFilterSelected != 'Solicitadas'"
        v-on:click="()=>{
            filterSelected = 'solicitada'
            showFilterSelected = 'Solicitadas'
            getAllMovimentos()
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
            <template #empty> Nenhum registro.</template>
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
                        {{ formatFiltros(slotProps.data.status )}}
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
                            v-show="slotProps.data.status == 'aceita' || slotProps.data.status == 'rejeitada' "
                            v-on:click="()=>{getDetalhesMovimento(slotProps.data, 'detalhar')}"
                            v-tooltip.bottom="'Detalhar'"
                            class="material-symbols-outlined">
                                open_in_new
                        </span>
                        <span 
                            v-show="slotProps.data.status == 'solicitada'"
                            v-on:click="getDetalhesMovimento(slotProps.data, 'validar')"
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

    <!-- Modal de validação-->
    <ModalComponentVue
        v-show="isShowValidaSolicitacaoModal"
        @close="closeModal('validar')"
    >
        <template v-slot:header>
            <h3 style="font-size: large;">{{ movimento.nome }} - {{ movimento.ra }}</h3>
        </template>

        <template v-slot:body>
            <div class="form-group">
                <label for="detalheCaixa">Identificação</label>
                <InputText type="text" id="detalheCaixa" v-model="movimento.box"></InputText>
            </div>      
            
            <div class="content-list-table">
                <table class="list-equip-table">
                    <tbody>
                        <tr v-for="(item, index) of movimento.listaInstrumentos" :key="index">
                            <td>{{ item.nome }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-slot:footer>

            <div class="actions-footer">
                <Button  @click="()=>{openModal('small')}" severity="danger"  label="Rejeitar"/>
                <Button  @click="()=>{closeModal('validar'); openModal('alterar')}" severity="warning"  label="Alterar"/>
                <Button  @click="aceitarMovimento()" label="Aceitar"/>
            </div>
            
        </template>
    </ModalComponentVue>

    <!-- Modal alterar itens -->
    <ModalComponentVue
        v-show="isShowAlterItensModal"
        @close="closeModal('alterar')"
    >
        <template v-slot:header>
            <h3 style="font-size: large;">{{ movimento.nome }} - {{ movimento.ra }}</h3>
        </template>

        <template v-slot:body>
            
            <form 
                @submit.prevent="()=>{
                    if(selectedinstrumentosToSterilize && quantidade > 0){
                        for (let i = 0; i < quantidade; i++) {
                            listaInstrumentosTemporaria.push(selectedinstrumentosToSterilize)
                        }
                        selectedinstrumentosToSterilize= undefined;
                        quantidade= 1
                    }
                }">
                <div class="row-group" style="margin-bottom: 10px; flex-wrap: nowrap;">
                    <div class="form-group" style="margin-bottom: 0; flex: 1; max-width: 75%;">
                        <label for="">Instrumentos</label>
                        <Dropdown  v-model="selectedinstrumentosToSterilize" :options="instrumentos" optionLabel="nome" placeholder="Selecione os instrumentos"  style="width: 100%; " ></Dropdown>
                    </div>
                    <div class="form-group" style="margin-bottom: 0; width: 23;">
                        <label for="">Quantidade</label>
                        <InputText type="number" v-model="quantidade" placeholder="Quantidade"  style="width: 100px;"/>
                    </div>

                    <Button icon="pi pi-plus" type="submit"></Button>
                </div>
            </form>

            <div class="content-list-table" style="min-height: 60%; max-height: 60%;">
                <table class="list-equip-table">
                    <tbody>
                        <tr v-for="(item, index) of listaInstrumentosTemporaria" :key="index">
                            <td>{{ item.nome }}</td>
                            <td style="width: 5%;">
                                <i class="pi pi-trash" style="cursor: pointer;" v-on:click="()=>{listaInstrumentosTemporaria.splice(index, 1)}"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p style="font-size: large;" class="form-group"><b style="font-size: large;">Total:</b> {{ listaInstrumentosTemporaria.length }}</p>
            <div class="form-group" style="width: 100%;" >
                <label for="">Justificativa</label>
                <Textarea style="width: 100%;" v-model="justificativaTemporaria" rows="3"></Textarea>
            </div>
        </template>

        <template v-slot:footer>
            <Button label="cancelar" severity="secondary" @click="()=>{ isShowAlterItensModal = false}"></Button>
            <Button label="Atualizar" @click="updateListaInstrumentos()" ></Button>
        </template>
    </ModalComponentVue>

    <!-- Modal de detalhes-->
    <ModalComponentVue
        v-show="isShowDetalhaAceitasModal"
        @close="closeModal('detalhar')"
    >
        <template v-slot:header>
            <h3 style="font-size: large;">{{ movimento.nome }} - {{ movimento.ra }}</h3>
        </template>

        <template v-slot:body>
            <div class="row-group" style="margin-block: 10px;" v-show="movimento.status !='rejeitada'">   
                <div class="form-group">
                    <label for="detalheCaixa">Identificação</label>
                    <InputText type="text" id="detalheCaixa" v-model="movimento.box"></InputText>
                </div>                
                
                <div class="form-group">
                    <label for="detalheStatus">Status</label>
                    <Dropdown  v-model="movimento.status" id="detalheStatus" :options="['aceita', 'retirada']" placeholder="Status"  style="width: 100%; max-width:400px ;" ></Dropdown>
                </div>
            </div>

            <div class="form-group"  v-show="movimento.status  == 'rejeitada'">
                <label for="justificativa">Justificativa</label>
                <p class="justificativa-span">{{ movimento.justificativa }}</p>
            </div>
            <div class="content-list-table">
                <table class="list-equip-table">
                    <tbody>
                        <tr v-for="(item, index) of movimento.listaInstrumentos" :key="index">
                            <td>{{ item.nome }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>

        <template v-slot:footer>
            <div class="actions-footer">
                <Button label="Altera lista" @click="closeModal('detalhar');openModal('alterar')" severity="success"  v-show="filterSelected !='rejeitada'"></Button>
                <Button label="Salvar" @click="updateMovimento()"  v-show="filterSelected !='rejeitada'"></Button>
            </div>
        </template>
    </ModalComponentVue>
    
    <LoadingComponentVue v-show="isLoading"></LoadingComponentVue>

    <ModalSmallComponent
        v-show="isShowSmallModal"
        @close="closeModal('small')"
    >
        <template v-slot:body>
            <div class="form-group" style="width: 100%;" >
                <label for="">Justificativa</label>
                <Textarea style="width: 100%;" v-model="justificativaTemporaria" rows="3"></Textarea>
            </div>
        </template>

        <template v-slot:footer>
            <div class="actions-footer">
                <Button label="Cancelar" @click="closeModal('small')" severity="secondary"></Button>
                <Button label="Salvar" @click="reijeitarMovimento()"  v-show="filterSelected !='rejeitada'"></Button>
            </div>
        </template>
    </ModalSmallComponent>

    <SideFilterComponentVue
        @close="closeModal('filtro')"
        v-show="isShowfilterSidebar"
    >

        <template v-slot:body>
            <div class="form-group">
                <label for="">Opções </label>
                <select class="is-small input is-fullwidth" v-model="filterSelected">
                    <option value="todas">Todas</option>
                    <option value="solicitada">Solicitadas</option>
                    <option value="pendente">Pendentes de confirmação</option>
                    <option value="aceita">Aceitas</option>
                    <option value="rejeitada">Rejeitadas</option>
                </select>
            </div>
        </template>

        <template v-slot:footer>
            <Button style="width: 100%;" v-on:click="applyFilter()" label="Aplicar Filtro" />
        </template>
        
    </SideFilterComponentVue>

</template>
<script lang="js">
import DataTable from 'primevue/datatable'
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Column from 'primevue/column';
import FilterComponent from '@/components/FilterComponent.vue';
import {http} from '@/http';
import LoadingComponentVue from '@/components/LoadingComponent.vue';
import ModalComponentVue from '@/components/ModalComponent.vue';
import ModalSmallComponent from '@/components/ModalSmallComponent.vue';
import SideFilterComponentVue from '@/components/SideFilterComponent.vue';
import {mask} from 'vue-the-mask'
export default {
    props: ['nivel'],
    directives: {mask},
    components: {
        Button,
        Dropdown,
        InputText,
        ModalComponentVue,
        DataTable,
        Column,
        ModalSmallComponent,
        FilterComponent,
        LoadingComponentVue,
        Textarea,
        SideFilterComponentVue
    },
    data(){
        return {
            selectedinstrumentosToSterilize: {nome: '', id: 0},
            searchInput: "",
            isLoading: false,
            filterSelected : 'solicitada',
            showFilterSelected: 'Solicitadas',
            quantidade: 1,
            movimentos: [{
                id: 0,
                status: '',
                ra: '',
                nome: '',
                caixa: '',
                qtd: 0
            }],
            instrumentos: [{
                nome: '',
                id : 0
            }],
            movimento: {
                updated_at: '',
                status: '',
                justificativa: '',
                ra: '',
                nome: '',
                caixa: '',
                listaInstrumentos: [{
                    nome: '',
                    id: 0
                }]
            },
            listaInstrumentosTemporaria: [{
                nome: '',
                id: 0
            }],
            justificativaTemporaria: '',
            //modal controllers
            isShowAlterItensModal: false,
            isShowValidaSolicitacaoModal: false,
            isShowDetalhaAceitasModal: false,
            isShowConfirmRejeita: false,
            isShowfilterSidebar : false,
            isShowSmallModal : false,
            isShowJustificativaModal: false
        }
    },

    
    methods: {
        async openModal(val){
            switch (val) {
                case 'alterar':
                    await this.getListaInstrumentos()
                    this.isShowAlterItensModal = true;
                break;
                case 'validar':
                    this.isShowValidaSolicitacaoModal = true;
                break;
                case 'detalhar':
                    this.isShowDetalhaAceitasModal = true;
                break;
                case 'small':
                    this.isShowSmallModal = true;
                    break;
                default:
                    break;
            }
        },

        closeModal(val) {
            switch (val) {
                case 'filtro':
                    this.isShowfilterSidebar = false;
                    break;
                case 'detalhar':
                    this.isShowDetalhaAceitasModal = false;
                    break;
                case 'alterar':
                    this.isShowAlterItensModal = false;
                    break;
                case 'validar':
                    this.isShowValidaSolicitacaoModal = false;
                    break;
                case 'small':
                    this.isShowSmallModal = false;
                    break;
                
            
                default:
                    break;
            }
        },

        
        formatFiltros(val){
            switch (val) {
                case 'solicitada':
                    return 'Solicitadas'
                case 'pendente':
                    return 'Pendentes'
                case 'aceita':
                    return 'Aceitas'
                case 'rejeitada':
                    return 'Rejeitadas';
                case 'retirada':
                    return 'Retirada'
                default:
                    break;
            }
        },  

        async applyFilter(){
            try {
                this.isLoading = true;
                const resp = await http.get('esterilizar/movimentos/'+this.filterSelected);
                this.movimentos = resp.data;
                this.isLoading = false;
                this.isShowfilterSidebar = false;
                this.showFilterSelected = this.formatFiltros(this.filterSelected)
            } catch (error) {
                this.isLoading = false;
                console.log(error)
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
            }
        },
       
        async reijeitarMovimento(){
            try {
                if(!this.justificativaTemporaria){
                    this.$toast.add({ severity: 'warn', summary: 'Erro', detail: 'Escreva a justificativa', life: 3000 })
                    return
                }
                this.isLoading = true;

                this.movimento.status = 'rejeitada'
                this.isLoading = true;
                const payload = JSON.parse(JSON.stringify(this.movimento))
                payload.justificativaTemporaria = this.justificativaTemporaria

                const resp = await http.post('esterilizar/deleteMovimento', payload);
                this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: resp.data, life: 3000 })
                
                this.isLoading = false;
                this.justificativaTemporaria = ''
                
                this.getAllMovimentos()
                
                this.closeModal('validar')
                this.closeModal('small')
            } catch (error) {
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
            }
        },

        async aceitarMovimento(){
            this.movimento.status = 'aceita'
            this.applyFilter()
            this.closeModal('validar')
        },
        
        async getListaInstrumentos(){
            try {
                this.isLoading = true;
                const resp = await http.get('esterilizar/instrumentos');
                this.instrumentos = resp.data
                this.isLoading = false;
                this.listaInstrumentosTemporaria = JSON.parse(JSON.stringify(this.movimento.listaInstrumentos));
            } catch (error) {
                console.log(error)
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
            }
        },

        async updateListaInstrumentos(){
            try {
                if(!this.justificativaTemporaria){
                    this.$toast.add({ severity: 'warn', summary: 'Erro', detail: 'Escreva a justificativa', life: 3000 })
                    return
                }
                this.isLoading = true;
                const payload = JSON.parse(JSON.stringify(this.movimento))
                payload.listaInstrumentos = this.listaInstrumentosTemporaria;
                payload.justificativaTemporaria = this.justificativaTemporaria
                await http.put('esterilizar/alunosInstrumentos', payload );
                this.$toast.add({ severity: 'success', summary: 'Sucesso', life: 3000 })
                this.isLoading = false;
                this.justificativaTemporaria = ''
                this.closeModal('alterar')
                this.getAllMovimentos()
            } catch (error) {
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
            }
        },

        async updateMovimento(){
            try {
                this.isLoading = true;
                const resp = await http.put('esterilizar/movimento', this.movimento);
                this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: resp.data, life: 3000 })
                this.isLoading = false;
                this.getAllMovimentos()
            } catch (error) {
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
            }
        },
    
        formatDate(val){
            const data = new Date(val);
            return data.toLocaleDateString()
        },

        async getDetalhesMovimento(data, modal){
            try {
                const resp = await http.get('esterilizar/movimento/'+data.id);
                this.movimento = resp.data
                this.movimento.nome = data.nome
                this.openModal(modal)
            } catch (error) {
                this.isLoading = false
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
            }
        },

        search(value){
            this.searchInput = value;
        },

        async getAllMovimentos(){
            try {
                this.isLoading = true;
                const resp = await http.get('esterilizar/movimentos');
                this.movimentos = resp.data;
                this.isLoading = false;
            } catch (error) {
                console.log(error)
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
            }
        },
    },
    computed: {
        listComputed(){
            if(this.searchInput == ""){
                return this.movimentos;
            }else{
                return this.movimentos
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
        this.getAllMovimentos();
        
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

    .justificativa-span{
        font-weight: 600;
        font-size: 11px;
        padding: 10px;
        background-color: #e9e9e9;
        border-radius: 12px;
    }
    .actions-footer{
        display: flex;
        justify-content: center;
        width: 100%;
        gap: 10px;
    }

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
        max-height: 80%;
        min-height: 80%;
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


    
</style>