<template>
    <div>
        <div class="filter">
            <button class="button is-info is-small" v-on:click="showFiltesr">
                <span class="material-symbols-outlined">
                    filter_alt
                </span>
            </button>

            <SideFilterComponent
            @close="closeFilter"
            v-show="isOverlayPanel"
            >

                <template v-slot:body>
                    <div class="form-group">
                        <label for="">Agrupar por: </label>
                        <select class="is-small input is-fullwidth" v-model="filterGroup"  id="">
                            <option value="procedure">Procedimento</option>
                            <option value="patient">Paciente</option>
                            <option value="clinic">Clínica</option>
                        </select>
                    </div>
                </template>

                <template v-slot:footer>
                    <button class="button is-small is-fullwidth is-info" v-on:click="applyFilter">Aplicar Filtro</button>
                </template>
            </SideFilterComponent>

            <button class="button is-info is-small" v-on:click="showModal">Nova Triagem</button>
            
            <FilterComponent
                @searchValue="search"
            ></FilterComponent>
        </div>
    </div>
    <section class="content-table" v-if="tablesUsed == 'procedure'"> 
        <DataTable 
            :value="listComputed" 
            sortField="name"
            :sortOrder="1"
            paginator :rows="11" 
            >
            <template #empty> Nenhum procedimento registrado. </template>
            <Column field="id" header="Nº"></Column>
            <Column field="name" header="Procedimento"></Column>
            <Column field="clinic" header="Clínica"></Column>
            <Column field="dt_created" header="Dt. cadastro">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.dt_created) }}
                </template>
            </Column>
            <Column field="patient.name" header="Paciente"></Column>
            <Column field="patient.phone" header="Telefone">
                <template #body="slotProps">
                    {{ formatTel(slotProps.data.patient.phone) }}
                </template>
            </Column>
            <Column>
                <template #body="slotProps">
                        <span 
                        v-tooltip.bottom="'Marcar como Agendado'"
                        v-on:click="showSmallModal(slotProps.data)"
                        class="material-symbols-outlined">
                            event_upcoming
                        </span>
                </template>
            </Column>

        </DataTable>
    </section>
    <section class="content-table" v-if="tablesUsed == 'patient'">
        <DataTable 
            :sortOrder="1"
            expandableRowGroups 
            :value="listComputed" 
            rowGroupMode="subheader"
            sortField="patient.name"
            groupRowsBy="patient.name"
            paginator :rows="11" 
            v-model:expandedRowGroups="expandedRowGroups"
            >
            <template #empty> Nenhum procedimento registrado. </template>
            <template #groupheader="slotProps">
                <span class="vertical-align-middle ml-2 font-bold line-height-3">{{ slotProps.data.patient.name }}</span>
            </template>
            <Column field="id" header="Nº"></Column>
            <Column field="name" header="Procedimento"></Column>
            <Column field="clinic" header="Clínica"></Column>
            <Column field="dt_created" header="Dt. cadastro">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.dt_created) }}
                </template>
            </Column>
            <Column field="patient.name" header="Paciente"></Column>
            <Column field="patient.phone" header="Telefone">
                <template #body="slotProps">
                    {{ formatTel(slotProps.data.patient.phone) }}
                </template>
            </Column>
            <Column>
                <template #body="slotProps">
                        <span 
                        v-tooltip.bottom="'Marcar como Agendado'"
                        v-on:click="showSmallModal(slotProps.data)"
                        class="material-symbols-outlined">
                            event_upcoming
                        </span>
                </template>
            </Column>

        </DataTable>
    </section>

    <section class="content-table" v-if="tablesUsed == 'clinic'">
        <DataTable 
            expandableRowGroups 
            :value="listComputed" 
            paginator :rows="11" 
            :sortOrder="1"
            sortField="clinic"
            rowGroupMode="subheader" 
            groupRowsBy="clinic"
            v-model:expandedRowGroups="expandedRowGroups"
            >
            <template #empty> Nenhum procedimento registrado. </template>
            <template #groupheader="slotProps">
                <span class="vertical-align-middle ml-2 font-bold line-height-3">{{ slotProps.data.clinic }}</span>
            </template>
            <Column field="clinic" header="Clínica"></Column>
            <Column field="id" header="Nº"></Column>
            <Column field="name" header="Procedimento"></Column>
            <Column field="patient.name" header="Paciente"></Column>
            <Column field="dt_created" header="Dt. cadastro">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.dt_created) }}
                </template>
            </Column>
            <Column field="patient.phone" header="Telefone">
                <template #body="slotProps">
                    {{ formatTel(slotProps.data.patient.phone) }}
                </template>
            </Column>
            <Column>
                <template #body="slotProps">
                        <span 
                        v-tooltip.bottom="'Marcar como Agendado'"
                        v-on:click="showSmallModal(slotProps.data)"
                        class="material-symbols-outlined">
                            event_upcoming
                        </span>
                </template>
            </Column>

        </DataTable>
    </section>

    <ModalLargeComponentVue
    v-show="isModalVisible"
    @close="closeModal"
    >
        <template v-slot:header>
            <h3>Triagem</h3>
        </template>
        <template v-slot:body>
            <TabView v-model:activeIndex="controlTabView">
                <TabPanel header="Paciente">
                    <form @submit.prevent="findByCpf">
                        <div class="row-group">
                            <div class="form-group">
                                <label for="">CPF</label>
                                <input type="tel" v-mask="'###.###.###-##'"  class="input is-small" v-model="newPatient.cpf" placeholder="000.000.000-00" >
                            </div>

                            <div class="form-group">
                                <button class="button is-small is-info">
                                    <span class="material-symbols-outlined">
                                        search
                                    </span>
                                </button>
                            </div>
                        </div>
                    </form>
                    <div class="row-group">
                        <div class="form-group">
                            <label for="">Nome Completo</label>
                            <input type="text" :disabled="disablefields" v-model="newPatient.name" class="input is-small" style="width: 300px;" >
                        </div>
                        <div class="form-group">
                            <label for="">Telefone</label>
                            <input type="tel" :disabled="disablefields" v-mask="'(##) # ####-####'" v-model="newPatient.phone" class="input is-small"  >
                        </div>
                    </div>

                    <div class="row-group">
                        
                        <div class="form-group">
                            <label for="">Data Nasc.</label>
                            <input type="date" :disabled="disablefields" v-model="newPatient.dt_birth" class="input is-small" >
                        </div>

                        <div class="form-group">
                            <label for="">Genero</label>
                            <select class="input is-small" :disabled="disablefields" v-model="newPatient.gender" >
                                <option value="m" >Masculino</option>
                                <option value="f" >Femenino</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="">Estado Civil</label>
                            <select class="input is-small" :disabled="disablefields" v-model="newPatient.civil_state"  >
                                <option value="a" >Solteiro(a)</option>
                                <option value="c" >Casado(a)</option>
                                <option value="s" >Separado(a)</option>
                                <option value="d" >Divorciado(a)</option>
                                <option value="v" >Viúvo(a)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="">Nome do responsável (Se Houver)</label>
                        <input type="text" :disabled="disablefields" v-model="newPatient.resp_name"  class="input is-small"  >
                    </div>

                    
                    <div class="row-group">
                        <div class="form-group">
                            <label for="">Profissão</label>
                            <input type="text" :disabled="disablefields" v-model="newPatient.profession"  class="input is-small"  >
                        </div>
                        <div class="form-group">
                            <label for="">Local de trabalho</label>
                            <input type="text" :disabled="disablefields" class="input is-small" v-model="newPatient.locale_work">
                        </div>
                    </div>
                    
                    <div class="row-group">
                        <div class="form-group">
                            <label for="">Endereço</label>
                            <input type="text" style="width: 300px;" :disabled="disablefields" class="input is-small" v-model="newPatient.address" >
                        </div>
                        <div class="form-group">
                            <label for="">Bairro</label>
                            <input type="text" v-model="newPatient.district" :disabled="disablefields"  class="input is-small"  >
                        </div>
                        <div class="form-group">
                            <label for="">Cidade</label>
                            <input type="text"  class="input is-small" :disabled="disablefields"  v-model="newPatient.city">
                        </div>
                        
                    </div>
                </TabPanel>

                <TabPanel header="Procedimentos">
                    <form @submit.prevent="addProcedure">
                        <div class="row-group">
                            <div class="form-group "  >
                                <label for="">Procedimento</label>
                                <select class="input is-small" :disabled="disablefields" style="width:450px;" v-model="inputsProcedure.name">
                                    <option :value="item.name" v-for="(item, index) of listOptionsProcedures" :key="index">
                                        {{ item.name }}
                                    </option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="">Clínica</label>
                                <select class="input is-small" :disabled="disablefields" style="width:450px;" v-model="inputsProcedure.clinic">
                                    <option :value="item.name" v-for="(item, index) of listOptionsClinics" :key="index">
                                        {{ item.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="row-group">
                            <div class="form-group">
                                <label for="">Elementos Dentários</label>
                                <select class="input is-small" :disabled="disablefields" v-model="inputsProcedure.element_dental">
                                    <option :value="item.name" v-for="(item, index) of listOptionsElemetsDentr" :key="index">
                                        {{ item.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="">Regiões dos Elementos Dentários</label>
                                <select class="input is-small" :disabled="disablefields" style="width:295px;" v-model="inputsProcedure.region_dental">
                                    <option :value="item.name" v-for="(item, index) of listOptionsRegions" :key="index">
                                        {{ item.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="">Regiões da Cavidade Bucal</label>
                                <select class="input is-small" :disabled="disablefields" style="width:295px;" v-model="inputsProcedure.buccal_cavity">
                                    <option :value="item.name" v-for="(item, index) of listOptionsCavBucal" :key="index">
                                        {{ item.name }}
                                    </option>
                                </select>
                            </div>
                            

                            <div class="form-group">
                                <button class="button is-small is-success" :disabled="disablefields">
                                    <span class="material-symbols-outlined">
                                        add
                                    </span>
                                </button>
                            </div>
                        </div>
                    </form>
                    <div class="table-content" v-if="newListProcedures.length > 0">
                        <table class="table is-fullwidth is-small" >
                            <thead
                                style="position: sticky;
                                    top: 0;
                                    background-color: #c9c9c9;
                                    border-collapse: collapse;
                                    z-index: 2;
                                "
                            >
                                <tr>
                                    <th>
                                        Procedimento                                        
                                    </th>
                                    <th>
                                        Região/dente
                                    </th>
                                    <th>
                                        Clinica
                                    </th>
                                    <th>
                                        Remover
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in newListProcedures" :key="index">
                                    <td>{{ item.name }}</td>
                                    <td>{{ `${item.element_dental} ${item.region_dental? '-'  + item.region_dental : ''  } ${item.buccal_cavity? '-'  + item.buccal_cavity : ''}` }}</td>
                                    <td>{{ item.clinic }}</td>
                                    <td>
                                        <button class="button is-danger" style="padding: 0px; width: 40px" v-on:click="removeProcedure(index)">
                                            <span class="material-symbols-outlined" >
                                                delete
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                    </div>
                    <div class="content-empty-message" v-else>
                        <h3>Nenhum procedimento registrado</h3>
                    </div>
                </TabPanel>
            </TabView>
        </template>
        <template v-slot:footer>
            <button class="button is-info is-small" v-on:click="save()">Salvar</button>
        </template>
    </ModalLargeComponentVue>
    
    <ModalSmallComponentVue
        v-show="isModalSmall"
    >
        <template v-slot:body>
            <p class="title-modal-small">Deseja confirmar seu agendamento?</p>
        </template>

        <template v-slot:footer>
            <div class="actions-confirm-dialog">
                <button class="button is-small is-danger" v-on:click="closeSmallModal()" >cancelar</button>
                <button class="button is-small is-info" v-on:click="updateProcedure(tempValuesProcedureUpdated)">Confirmar</button>
            </div>
        </template>
    </ModalSmallComponentVue>



    <LoadingComponentVue v-show="isLoading"></LoadingComponentVue>

</template>
<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ModalLargeComponentVue from '@/components/ModalLargeComponent.vue'
import FilterComponent from '@/components/FilterComponent.vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import SideFilterComponent from "@/components/SideFilterComponent.vue"
import RequestHttp from '@/http';
import {mask} from 'vue-the-mask'
import ModalSmallComponentVue from '@/components/ModalSmallComponent.vue'
import LoadingComponentVue from '@/components/LoadingComponent.vue'


export default {
    components: {
        FilterComponent,
        ModalLargeComponentVue,
        ModalSmallComponentVue,
        TabPanel, 
        TabView,
        DataTable,
        Column,
        SideFilterComponent,
        LoadingComponentVue
    },
    directives: {mask},
    data(){
        return {
            isModalSmallConfirmSendEmptyProcedures: false,
            controlTabView : 0,
            isLoading: false,
            isOverlayPanel: false,
            isModalVisible: false,
            isModalSmall: false,
            searchInput: "",
            listTableProcedures: [],
            expandedRowGroups: null,
            newPatient: {
                cpf: "",
                name: "",
                phone: "",
                dt_birth: "",
                gender: "m",
                civil_state: "s",
                resp_name: "",
                profession: "",
                locale_work: "",
                address: "",
                district: "",
                city: ""
            },

            tempValuesProcedureUpdated: null,
            filterGroup: "procedure",
            newListProcedures: [],
            
            inputsProcedure: {
                name: "",
                element_dental: "",               
                region_dental: "",
                buccal_cavity: "",
                clinic : ''

            },

            filters: null,

            listOptionsClinics: [],

            listOptionsProcedures : [],

            listOptionsElemetsDentr : [],
            
            listOptionsRegions : [],

            listOptionsCavBucal : [],

            tablesUsed: 'procedure',

            disablefields: true
        }
    },
    methods: {

        closeSmallModal(){
            this.tempValuesProcedureUpdated = null;
            this.isModalSmall = false;
        },
        
        showSmallModal(val){
            this.isModalSmall = true;
            this.tempValuesProcedureUpdated = val;
        },

        applyFilter(){
            this.tablesUsed = this.filterGroup;
            this.isOverlayPanel = false;
        },

        closeFilter(){
            this.isOverlayPanel = false
        },
        
        showFiltesr(){
            this.isOverlayPanel = true    
        },
        
        closeModal(){
            this.isModalVisible = false;
            this.clearInputs()
        },

        async showModal(){
            this.isLoading = true
            const resp =await RequestHttp.listsCadTriagem();
            if(resp.hasError){
                this.isLoading = false
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })
            }else{
                this.isLoading = false
                this.disablefields = true;
                this.isModalVisible = true;
                this.listOptionsClinics = resp.filter(e=> e.type == 'c')
                this.listOptionsProcedures = resp.filter(e=> e.type == 'p')
                this.listOptionsElemetsDentr = resp.filter(e=> e.type == 'd')
                this.listOptionsRegions = resp.filter(e=> e.type == 'r');
                this.listOptionsCavBucal = resp.filter(e=> e.type == 'b');

            }
        },
        
        search(value){
            this.searchInput = value;
        },

        async listProcedure(){
            this.isLoading = true;
            const resp =await RequestHttp.listProcedures();

            if(resp.hasError){
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })
                this.isModalVisible = false;
                
            }else{
                this.listTableProcedures = resp
                 this.isLoading = false;
            }
        },

        formatDate(val){
            const data = new Date(val);
            return data.toLocaleDateString()
        },


        async save(){
            const regex = /\.|-|\(|\)/gi
            this.newPatient.cpf = this.newPatient.cpf.replaceAll(regex, '').replaceAll(' ', '');
            this.newPatient.phone = this.newPatient.phone.replaceAll(regex, '').replaceAll(' ', '');
            
            if(this.newListProcedures.length == 0 ){
                this.$toast.add({ severity: 'warn', summary: 'Alerta', detail: "Nenhum procedimento registrado", life: 3000 })
                return
            }
            if(this.newPatient.cpf.length < 11) {
                this.$toast.add({ severity: 'warn', summary: 'Alerta', detail: 'CPF inválido', life: 3000 }) 
                return
            }
            if(this.newPatient.phone.length < 11) {
                this.$toast.add({ severity: 'warn', summary: 'Alerta', detail: 'Telefone inválido', life: 3000 }) 
                return
            }
            this.isLoading = true;
            let temp = this.newPatient;
            console.log(temp)
            Object.keys(temp).forEach((k) =>{
                if(typeof(temp[k]) == 'string') temp[k].trim();
            } );

            temp.procedures = this.newListProcedures;
            const resp = await RequestHttp.createPatient(temp)
            if(resp.hasError){
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })
                this.isModalVisible = false;
                if(resp.response.status == 401){
                    await new Promise(()=>{
                        setTimeout(() => {
                            this.$router.replace('/');
                            localStorage.clear();
                        }, 2000);
                    })
                } 
                this.isModalVisible = false;
            }else{
                this.isLoading = false;
                this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: "Cadastrado com sucesso", life: 3000 });
                this.listProcedure();
                this.clearInputs();
                this.isModalVisible = false
                
            }


        },

        clearInputs(){
            this.newPatient = {
                cpf: "",
                name: "",
                phone: "",
                dt_birth: "",
                gender: "m",
                civil_state: "s",
                resp_name: "",
                profession: "",
                locale_work: "",
                address: "",
                district: "",
                city: ""
            };
            this.inputsProcedure =  {
                name: '',
                locale: "",
                clinic: ""
            };
            this.controlTabView = 0;
            this.newListProcedures = [];
        },

        async findByCpf(){

            const regex = /\.|-|/gi
            this.newPatient.cpf = this.newPatient.cpf.replaceAll(regex, '');
            if(this.newPatient.cpf.length < 11) {
                this.$toast.add({ severity: 'warn', summary: 'Alerta', detail: 'CPF inválido', life: 3000 }) 
                return
            }
            this.isLoading = true;
            const resp = await RequestHttp.findByCpf(this.newPatient.cpf)

            if(resp.hasError){
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })
                this.isModalVisible = false;
                if(resp.response.status == 401){
                    await new Promise(()=>{
                        setTimeout(() => {
                            this.$router.replace('/');
                            localStorage.clear();
                        }, 2000);
                    })
                } 
                this.isModalVisible = false;
            }else{
                this.isLoading = false;
                this.disablefields = false;

                if(resp.length == 0){
                    let temp = this.newPatient.cpf;
                    this.clearInputs();
                    this.newPatient.cpf = temp;
                    this.$toast.add({ severity: 'info', summary:'Informativo', detail: "Nenhum Usuário encontrado", life: 3000 });
                }else{
                    this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: "Usuário encontrado", life: 3000 });
                    const { procedures, ... patients } = resp
                    this.newPatient = patients;
                    this.newPatient.dt_birth = new Date(patients.dt_birth).toISOString().slice(0, 10)
                    this.newListProcedures = procedures.filter(e=> e.status != 'a');
                }
            }
        },

        async updateProcedure(val){
            let temp = {
                name: val.name,
                id: val.id,
                locale: val.id,
                dt_created : val.dt_created,
                clinic : val.clinic,
                status : 'a'
            }
            this.isLoading = true;

            const resp =await RequestHttp.updateProcedure(temp)
            if(resp.hasError){
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })
                this.closeSmallModal()

            }else{
                this.isLoading = false;
                this.closeSmallModal()
                this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: "Atualizado com sucesso", life: 3000 })
                this.listProcedure()
            }
        },

        searchClinic(event) {
            setTimeout(() => {
                if (!event.query.trim().length) {
                    this.filters = [...this.clinics];
                } else {
                    this.filters = this.clinics.filter((country) => {
                        return country.toLowerCase().startsWith(event.query.toLowerCase());
                    });
                }
            }, 250);
        },

        searchProcedure(event) {
            setTimeout(() => {
                if (!event.query.trim().length) {
                    this.filters = [...this.clinics];
                } else {
                    this.filters = this.procedures.filter((country) => {
                        return country.toLowerCase().startsWith(event.query.toLowerCase());
                    });
                }
            }, 250);
        },

        addProcedure(){
            this.newListProcedures.push(this.inputsProcedure)
            this.inputsProcedure = {
                name : '',
                clinic : '',
                buccal_cavity: '',
                element_dental: '',
            }
        },

        removeProcedure(index){
           this.newListProcedures.splice(index, 1)
        },

        formatTel(val) {
            return `(${val.substring(0, 2)}) ${val.substring(2, 7)} - ${val.substring(7)}`
        }
    },

    mounted(){
        this.listProcedure()
    },
    
    computed: {
        listComputed(){
            if(this.searchInput == ""){
                return this.listTableProcedures;
            }else{
                return this.listTableProcedures.filter((e)=> {
                    if(
                        e.name.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                        e.patient.name.toLowerCase().includes(this.searchInput.toLowerCase()) ||
                        e.patient.cpf.toLowerCase().includes(this.searchInput.toLowerCase()) ||
                        e.clinic.toLowerCase().includes(this.searchInput.toLowerCase()) 
                        ){
                        return e;
                    }
                })
            }
        }
    },
   
}
</script>
<style scoped>

    .title-modal-small{
        font-size: 18px;
        font-weight: 600;
    }

    .material-symbols-outlined{
        cursor: pointer;
    }

    .content-empty-message{
        margin-block: 20px;
    }

    .actions-confirm-dialog{
        position: absolute;
        bottom: 0;
        display: flex;
        padding: 10px;
        width: 100%;
        gap: 10px;
        left: 0;
        justify-content: center; 
    }

    .content-empty-message h3{
        font-size: 18px
    }
    
    .filter{
        position: absolute;
        top: 5px;
        height: 50px;
        right: 10px;
        gap: 10px;
        display: flex;
        align-items: center;
        justify-content: end;
    }
    .table-content{
        min-height: 270px;
        max-height: 270px;
        overflow: auto;
        border: solid 1px #00000020;
    }

    .content-table{
        border: solid 1px #00000035;
        background-color: white;
        font-size: 13px;
        position: absolute;
        top: 60px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        box-shadow: 0 0 10px #00000020;
        border-radius: 3px;
        margin: 5px;
        padding: 15px;
        overflow: auto;
    }
   
</style>