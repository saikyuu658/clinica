<template>
    <div>
        <div class="filter">
            <span class="title-filter">Procedimentos</span>
           
            <div class="right-filter">
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
    </div>
    <section class="content-table" v-if="tablesUsed == 'procedure'"> 
        <DataTable 
            :value="listComputed" 
            sortField="name"
            :sortOrder="1"
            scrollable 
            scrollHeight="flex" 
            >
            <template #empty> Nenhum procedimento registrado. </template>
            <Column field="procedimento" header="Procedimento" style="max-width: 200px; overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;">
                <template #body="slotProps" >
                    <span v-tooltip="slotProps.data.procedimento">
                        {{ slotProps.data.procedimento }}
                    </span>
                </template>
            </Column>
            <Column 
                field="clinica" header="Clínica" 
                style="max-width: 250px; overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;"
                >
                <template #body="slotProps" >
                    <span v-tooltip="slotProps.data.clinica.toLowerCase()">
                        {{ slotProps.data.clinica.toLowerCase() }}
                    </span>
                </template>
            </Column>
            <Column field="created_at" header="Dt. cadastro">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.created_at) }}
                </template>
            </Column>
            <Column field="nome" header="Paciente">
                <template #body="slotProps">    
                    <a v-on:click="()=>{
                        isVisiblePaciente = true
                        this.newPatient.cpf = slotProps.data.cpf
                        findByCpf()
                    }">{{  slotProps.data.nome }}</a>
                </template>
            </Column>
            <Column field="telefone" header="Telefone">
                <template #body="slotProps">
                    {{ formatTel(slotProps.data.telefone) }}
                </template>
            </Column>
            <Column>
                <template #body="slotProps">
                    <div style="display: flex;">
                        <span 
                            v-tooltip.bottom="'Marcar como Agendado'"
                            v-on:click="showSmallModal(slotProps.data)"
                            class="material-symbols-outlined">
                            event_upcoming
                        </span>
                    </div>
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
            sortField="nome"
            groupRowsBy="nome"
            scrollable 
            scrollHeight="flex" 
            tableStyle="min-width: 70rem"
            v-model:expandedRowGroups="expandedRowGroups"
            >
            <template #empty> Nenhum procedimento registrado. </template>
            <template #groupheader="slotProps">
                <span class="vertical-align-middle ml-2 font-bold line-height-3">{{ slotProps.data.nome }}</span>
            </template>
            <Column field="procedimento" header="Procedimento" 
                style="max-width: 250px; overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;"
            >
                <template #body="slotProps" >
                    <span v-tooltip="slotProps.data.procedimento">
                        {{ slotProps.data.procedimento }}
                    </span>
                </template>
            </Column>
            <Column field="clinica" header="Clínica"
                style="max-width: 250px; overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;"
            >
                <template #body="slotProps" >
                    <span v-tooltip="slotProps.data.clinica.toLowerCase()">
                        {{ slotProps.data.clinica.toLowerCase() }}
                    </span>
                </template>
            </Column>
            <Column field="created_at" header="Dt. cadastro">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.created_at) }}
                </template>
            </Column>
            <Column field="nome" header="Paciente"></Column>
            <Column field="telefone" header="Telefone">
                <template #body="slotProps">
                    {{ formatTel(slotProps.data.telefone) }}
                </template>
            </Column>
            <Column>
                <template #body="slotProps">
                    <div style="display: flex;">
                        <span 
                        v-tooltip.bottom="'Marcar como Agendado'"
                        v-on:click="showSmallModal(slotProps.data)"
                        class="material-symbols-outlined">
                            event_upcoming
                        </span>
                    </div>
                </template>
            </Column>

        </DataTable>
    </section>

    <section class="content-table" v-if="tablesUsed == 'clinic'">
        <DataTable 
            expandableRowGroups 
            :value="listComputed" 
            :sortOrder="1"
            sortField="clinica"
            rowGroupMode="subheader" 
            groupRowsBy="clinica"
            scrollable 
            scrollHeight="flex" 
            tableStyle="min-width: 70rem"
            v-model:expandedRowGroups="expandedRowGroups"
            >
            <template #empty> Nenhum procedimento registrado. </template>
            <template #groupheader="slotProps">
                <span class="vertical-align-middle ml-2 font-bold line-height-3">{{ slotProps.data.clinica }}</span>
            </template>
            <Column field="clinica" header="Clínica"
                style="max-width: 250px; overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;"
            >
                <template #body="slotProps" >
                    <span v-tooltip="slotProps.data.clinica.toLowerCase()">
                        {{ slotProps.data.clinica.toLowerCase() }}
                    </span>
                </template>
            </Column>
            <Column field="procedimento" header="Procedimento"
            style="max-width: 250px; overflow-x: hidden; white-space: nowrap; text-overflow: ellipsis;"
            >
                <template #body="slotProps" >
                    <span v-tooltip="slotProps.data.procedimento">
                        {{ slotProps.data.procedimento }}
                    </span>
                </template>
            </Column>
            <Column field="nome" header="Paciente"></Column>
            <Column field="created_at" header="Dt. cadastro">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.created_at) }}
                </template>
            </Column>
            <Column field="patient.telefone" header="Telefone">
                <template #body="slotProps">
                    {{ formatTel(slotProps.data.telefone) }}
                </template>
            </Column>
            <Column>
                <template #body="slotProps">
                    <div style="display: flex;">
                        <span 
                        v-tooltip.bottom="'Marcar como Agendado'"
                        v-on:click="showSmallModal(slotProps.data)"
                        class="material-symbols-outlined">
                            event_upcoming
                        </span>
                    </div>
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
                                <label for="">CPF *</label>
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
                            <label for="">Nome Completo *</label>
                            <input type="text" :disabled="disablefields" v-model="newPatient.nome" class="input is-small" style="width: 300px;" >
                        </div>
                        <div class="form-group">
                            <label for="">Telefone *</label>
                            <input type="tel" :disabled="disablefields" v-mask="'(##) # ####-####'" v-model="newPatient.telefone" class="input is-small"  >
                        </div>
                    </div>

                    <div class="row-group">
                        
                        <div class="form-group">
                            <label for="">Data Nasc. *</label>
                            <input type="date" :disabled="disablefields" v-model="newPatient.dt_nasc" class="input is-small" >
                        </div>

                        <div class="form-group">
                            <label for="">Genero</label>
                            <select class="input is-small" :disabled="disablefields" v-model="newPatient.genero" >
                                <option value="m" >Masculino</option>
                                <option value="f" >Femenino</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="">Estado Civil</label>
                            <select class="input is-small" :disabled="disablefields" v-model="newPatient.estado_civil"  >
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
                        <input type="text" :disabled="disablefields" v-model="newPatient.nome_responsavel"  class="input is-small"  >
                    </div>

                    
                    <div class="row-group">
                        <div class="form-group">
                            <label for="">Profissão</label>
                            <input type="text" :disabled="disablefields" v-model="newPatient.profissao"  class="input is-small"  >
                        </div>
                        <div class="form-group">
                            <label for="">Local de trabalho</label>
                            <input type="text" :disabled="disablefields" class="input is-small" v-model="newPatient.local_trabalho">
                        </div>
                    </div>
                    
                    <div class="row-group">
                        <div class="form-group">
                            <label for="">Endereço</label>
                            <input type="text" style="width: 300px;" :disabled="disablefields" class="input is-small" v-model="newPatient.endereco" >
                        </div>
                        <div class="form-group">
                            <label for="">Bairro</label>
                            <input type="text" v-model="newPatient.bairro" :disabled="disablefields"  class="input is-small"  >
                        </div>
                        <div class="form-group">
                            <label for="">Cidade</label>
                            <input type="text"  class="input is-small" :disabled="disablefields"  v-model="newPatient.cidade">
                        </div>
                    </div>
                </TabPanel>

                <TabPanel header="Procedimentos">
                    <form @submit.prevent="addProcedure">
                        <div class="row-group">
                            <div class="form-group "  >
                                <label for="">Procedimento *</label>
                                <select class="input is-small" :disabled="disablefields" style="width:450px;" v-model="inputsProcedure.nome">
                                    <option :value="item" v-for="(item, index) of listOptionsProcedures" :key="index">
                                        {{ item }}
                                    </option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="">Clínica *</label>
                                <select class="input is-small" :disabled="disablefields" style="width:450px;" v-model="inputsProcedure.clinica">
                                    <option :value="item" v-for="(item, index) of listOptionsClinics" :key="index">
                                        {{ item }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="row-group">
                            <div class="form-group">
                                <label for="">Elementos Dentários</label>
                                <select class="input is-small" :disabled="disablefields" v-model="inputsProcedure.elemento_dental">
                                    <option :value="item" v-for="(item, index) of listOptionsElemetsDentr" :key="index">
                                        {{ item }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="">Regiões dos Elementos Dentários</label>
                                <select class="input is-small" :disabled="disablefields" style="width:295px;" v-model="inputsProcedure.regiao_dental">
                                    <option :value="item" v-for="(item, index) of listOptionsRegions" :key="index">
                                        {{ item }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="">Regiões da Cavidade Bucal</label>
                                <select class="input is-small" :disabled="disablefields" style="width:295px;" v-model="inputsProcedure.cavidade_bucal">
                                    <option :value="item" v-for="(item, index) of listOptionsCavBucal" :key="index">
                                        {{ item }}
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
                                    <td>{{ item.nome }}</td>
                                    <td>{{ `${item.elemento_dental}  ${item.regiao_dental!=""? '-'  + item.regiao_dental : ''  } ${item.cavidade_bucal!=""? '-'  + item.cavidade_bucal : ''}` }}</td>
                                    <td>{{ item.clinica }}</td>
                                    <td>
                                        <div style="display: flex;">
                                            <span class="material-symbols-outlined" v-on:click="removeProcedure(index)">
                                                delete
                                            </span>
                                        </div>
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

    <ModalComponente
        v-show="isVisiblePaciente"
        @close="()=>{
            clearInputs()
            isVisiblePaciente = false;
        }"
    >
        <template v-slot:header>
            <h3>{{ newPatient.nome }}</h3>
        </template>
        <template v-slot:body>
            <div class="row-group" style="gap: 25px;">
                <div class="form-group">
                    <label for=""><b>CPF</b></label>
                    <div>{{ newPatient.cpf }}</div>
                </div>
            </div>
            <div class="row-group" style="gap: 25px;">
               
                <div class="form-group">
                    <label for=""><b>Telefone</b></label>
                    <div>{{ newPatient.telefone }}</div>
                </div>

                <div class="form-group">
                    <label for=""><b>Data Nasc.</b></label>
                    <div>{{ new Date(newPatient.dt_nasc).toLocaleDateString() }}</div>
                </div>
              
            </div>
            <div class="row-group" style="gap: 25px;">
                <div class="form-group">
                    <label for=""><b>Estado Civil</b></label>
                    <select class="input is-small" disabled v-model="newPatient.estado_civil"  >
                        <option value="a" >Solteiro(a)</option>
                        <option value="c" >Casado(a)</option>
                        <option value="s" >Separado(a)</option>
                        <option value="d" >Divorciado(a)</option>
                        <option value="v" >Viúvo(a)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for=""><b>Genero</b></label>
                    <select class="input is-small" disabled v-model="newPatient.genero" >
                        <option value="m" >Masculino</option>
                        <option value="f" >Femenino</option>
                    </select>
                </div>
            </div>
            <div class="row-group" style="gap: 25px;">
                
                <div class="form-group">
                    <label for=""><b>Profissão</b></label>
                    <div>{{ newPatient.profissao }}</div>
                </div>
                <div class="form-group">
                    <label for=""><b>Local de trabalho</b></label>
                    <div>{{ newPatient.local_trabalho == ''?'Não declarado' : newPatient.local_trabalho }}</div>
                </div>
                
            </div>
            
            <div class="form-group">
                <label for=""><b>Nome do responsável (Se Houver)</b></label>
                <div>{{ newPatient.nome_responsavel }}</div>
            </div>

            <div class="form-group">
                <label for=""><b>Endereço</b></label>
                <div>{{ newPatient.endereco }}</div>
            </div>
            <div class="row-group" style="gap: 25px;">
                <div class="form-group">
                    <label for=""><b>Bairro</b></label>
                    <div>{{ newPatient.bairro }}</div>
                </div>
                <div class="form-group">
                    <label for=""><b>Cidade</b></label>
                    <div>{{ newPatient.cidade }}</div>
                </div>
            </div>

        </template>
    </ModalComponente>

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
    import {http} from '@/http';
    import {mask} from 'vue-the-mask'
    import ModalSmallComponentVue from '@/components/ModalSmallComponent.vue'
    import LoadingComponentVue from '@/components/LoadingComponent.vue'
    import ModalComponente from '@/components/ModalComponent.vue'

    export default {
        components: {
            ModalComponente,
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
                    nome: "",
                    telefone: "",
                    dt_nasc: "",
                    genero: "m",
                    estado_civil: "s",
                    nome_responsavel: "",
                    profissao: "",
                    local_trabalho: "",
                    endereco: "",
                    bairro: "",
                    cidade: ""
                },

                tempValuesProcedureUpdated: null,
                filterGroup: "procedure",
                newListProcedures: [],
                
                inputsProcedure: {
                    nome: "",
                    elemento_dental: "",               
                    regiao_dental: "",
                    cavidade_bucal: "",
                    clinica : ''
                },

                filters: null,

                listOptionsClinics: [
                    "CLÍNICA DE CIRURGIA I",
                    "CLÍNICA DE CIRURGIA II",
                    "CLÍNICA DE CIRURGIA III",
                    "CLÍNICA ODONTOLÓGICA I (PERIODONTIA)",
                    "CLÍNICA ODONTOLÓGICA I (DENTÍSTICA)",
                    "CLÍNICA ODONTOLÓGICA II (ENDODONTIA)",
                    "CLÍNICA ODONTOLÓGICA II (PERIODONTIA)",
                    "CLÍNICA ODONTOLÓGICA II (DENTÍSTICA)",
                    "CLÍNICA ODONTOLÓGICA III (ENDODONTIA)",
                    "CLÍNICA ODONTOLÓGICA III (PERIODONTIA)",
                    "CLÍNICA ODONTOLÓGICA III (DENTÍSTICA)",
                    "CLÍNICA DE PRÓTESE I",
                    "CLÍNICA DE PRÓTESE II",
                    "ESTOMATOLOGIA",
                    "CLÍNICA INFANTIL I",
                    "CLÍNICA INFANTIL II",
                    "CLÍNICA DE ATENÇÃO AO IDOSO E PESSOAS COM DEFICIÊNCIA",
                    "ESTÁGIO CURRICULAR SUPERVISIONADO CLÍNICA INTEGRADA I E II (PERIODONTIA)",
                    "ESTÁGIO CURRICULAR SUPERVISIONADO CLÍNICA INTEGRADA I E II (ENDODONTIA)",
                    "ESTÁGIO CURRICULAR SUPERVISIONADO CLÍNICA INTEGRADA I E II (DENTÍSTICA)",
                    "ESTÁGIO CURRICULAR SUPERVISIONADO CLÍNICA INTEGRADA I E II (PRÓTESE)",
                    "ESTÁGIO CURRICULAR SUPERVISIONADO CLÍNICA INTEGRADA I E II (CIRURGIA)"
                ],
                
                listOptionsProcedures : [
                    "Exodontia de raízes residuais sem retalho",
                    "Exodontia de raízes residuais com retalho",
                    "Exodontia de dente incluso",
                    "Exodontia de dente semi-incluso",
                    "Restauração Classe I",
                    "Restauração Classe II",
                    "Restauração Classe III",
                    "Restauração Classe VI",
                    "Restauração Classe V",
                    "PSR",
                    "Índice De Placa",
                    "Sangramento À Sondagem",
                    "Raspagem Supragengival",
                    "Raspagem Subgengival",
                    "Selante",
                    "Aplicação tópica de flúor",
                    "Profilaxia",
                    "Instrução de higiene oral",
                    "Adequação do meio",
                    "Prótese total superior",
                    "Prótese total inferior",
                    "Prótese parcial removível superior",
                    "Prótese parcial removível inferior",
                    "Prótese fixa (2 oumais elementos)",
                    "Coroa total unitária com pino intrarradicular",
                    "Coroa total unitária sem pino intrarradicular",
                    "Periograma",
                    "Tratamento endodôntico dente unirradicular ( incisivos)",
                    "Tratamento endodôntico dente unirradicular ( caninos)",
                    "Tratamento endodôntico pré-molares",
                    "Tratamento endodôntico molares",
                    "Retratamento endodôntico",
                    "Biópsia incisional",
                    "Biópsia excisional",
                    "Punção aspirativa",
                    "Marsupialização",
                    "Descompressão",
                    "Frenectomia",
                    "Exodontia técnica I",
                    "Exodontia técnica II",
                    'Exodontia técnica III',
                    "Tracionamento ortodôntico",
                    "Cirurgia pré-protética",
                    "Aumento de Coroa Clínica",
                    "Enxerto gengival",
                    "Gengivoplastia",
                ],
                
                listOptionsElemetsDentr : [
                    "11",
                    "12",
                    "13",
                    "14",
                    "15",
                    "16",
                    "17",
                    "18",
                    "21",
                    "22",
                    "23",
                    "24",
                    "25",
                    "26",
                    "27",
                    "28",
                    "31",
                    "32",
                    "33",
                    "34",
                    "35",
                    "36",
                    "37",
                    "38",
                    "41",
                    "42",
                    "43",
                    "44",
                    "45",
                    "46",
                    "47",
                    "48",
                    "Extranumerario",
                    "Desdentado"
                ],
                
                listOptionsRegions : [
                    "II sextante",
                    "III sextante",
                    "IV sextante",
                    "V sextante",
                    "VI sextante",
                    "Arco superior",
                    "Arco inferior",
                ],

                listOptionsCavBucal : [
                    "Bochecha",
                    "Mucosa jugal",
                    "Palato mole",
                    "Palato duro",
                    "Gengiva inserida",
                    "Gengiva marginal",
                    "Mucosa alveolar"
                ],

                isVisiblePaciente : false,
                

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

            closeModal(){
                this.isModalVisible = false;
                this.clearInputs()
            },

            async showModal(){
                this.disablefields = true;
                this.isModalVisible = true;
            },
            
            closeFilter(){
                this.isOverlayPanel = false
            },
            
            showFiltesr(){
                this.isOverlayPanel = true    
            },

            applyFilter(){
                this.tablesUsed = this.filterGroup;
                this.isOverlayPanel = false;
            },

            search(value){
                this.searchInput = value;
            },

            formatDate(val){
                const data = new Date(val);
                return data.toLocaleDateString()
            },

            clearInputs(){
                this.newPatient = {
                    cpf: "",
                    nome: "",
                    telefone: "",
                    dt_nasc: "",
                    genero: "m",
                    estado_civil: "s",
                    nome_responsavel: "",
                    profissao: "",
                    local_trabalho: "",
                    endereco: "",
                    bairro: "",
                    cidade: ""
                };
                this.inputsProcedure =  {
                    nome: "",
                    elemento_dental: "",               
                    regiao_dental: "",
                    cavidade_bucal: "",
                    clinica : ''
                };
                this.controlTabView = 0;
                this.newListProcedures = [];
            },

            addProcedure(){
                if(this.inputsProcedure.nome == '' || this.inputsProcedure.clinica == '' ){
                    this.$toast.add({ severity: 'warn', summary: 'Alerta', detail: 'Selecione os itens obrigatórios', life: 3000 }) 
                    return 
                }
                this.newListProcedures.push(this.inputsProcedure)
                this.inputsProcedure = {
                    nome: "",
                    elemento_dental: "",               
                    regiao_dental: "",
                    cavidade_bucal: "",
                    clinica : ''
                }
            },

            removeProcedure(index){
            this.newListProcedures.splice(index, 1)
            },

            formatTel(val) {
                return `(${val.substring(0, 2)}) ${val.substring(2, 7)} - ${val.substring(7)}`
            },
            
            async save(){
                try {

                    const regex = /\.|-|\(|\)/gi;
                    this.newPatient.cpf = this.newPatient.cpf.replaceAll(regex, '').replaceAll(' ', '');
                    this.newPatient.telefone = this.newPatient.telefone.replaceAll(regex, '').replaceAll(' ', '');
                    if(this.newListProcedures.cpf == '' || this.newPatient.telefone == '' || this.newPatient.nome == ''){
                        this.$toast.add({ severity: 'warn', summary: 'Alerta', detail: 'Preencha os campos obrigatórios', life: 3000 }) 
                    }
                    if(this.newListProcedures.length == 0 ){
                        this.$toast.add({ severity: 'warn', summary: 'Alerta', detail: "Nenhum procedimento registrado", life: 3000 })
                        return
                    }
                    if(this.newPatient.cpf.length < 11) {
                        this.$toast.add({ severity: 'warn', summary: 'Alerta', detail: 'CPF inválido', life: 3000 }) 
                        return
                    }
                    if(this.newPatient.telefone.length < 11) {
                        this.$toast.add({ severity: 'warn', summary: 'Alerta', detail: 'Telefone inválido', life: 3000 }) 
                        return
                    }
                    if(this.newPatient.dt_nasc == "") {
                        this.$toast.add({ severity: 'warn', summary: 'Alerta', detail: 'Data de nascimento é obrigatório', life: 3000 }) 
                        return
                    }
                    this.isLoading = true;

                    let temp = this.newPatient;
                    Object.keys(temp).forEach((k) =>{
                        if(typeof(temp[k]) == 'string') temp[k].trim();
                    });
                    temp.procedimentos = this.newListProcedures;

                    await http.post('triagem/save', temp)
                    this.isLoading = false;
                    this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: "Cadastrado com sucesso", life: 3000 });
                    this.listProcedure();
                    this.clearInputs();
                    this.isModalVisible = false

                } catch (error) {
                    this.isLoading = false;
                    this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
                    
                }

            },

            async findByCpf(){

                try {
                    const cpf = this.newPatient.cpf.replaceAll(/\.|-|/gi, '');
                    if(cpf.length < 11) {
                        this.$toast.add({ severity: 'warn', summary: 'Alerta', detail: 'CPF inválido', life: 3000 }) 
                        return
                    }
                    this.isLoading = true;
                    const resp = (await http.get('triagem/'+ cpf)).data;
                    if(resp.length == 0){
                        this.clearInputs();
                        this.newPatient.cpf = cpf;
                        this.$toast.add({ severity: 'info', summary:'Informativo', detail: "Nenhum usuário encontrado", life: 3000 });
                    }else{
                        const { procedimentos, ... paciente } = resp
                        this.newPatient = paciente;
                        this.newPatient.dt_nasc = new Date(paciente.dt_nasc).toISOString().slice(0, 10)
                        this.newListProcedures = procedimentos;
                    }
                    this.disablefields = false;
                    this.isLoading = false;
                } catch (error) {
                    this.isLoading = false;
                    this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.message, life: 3000 })
                    
                }
            },

            async updateProcedure(val){
                try {
                    this.isLoading = true;
                    await http.post('triagem/agendar', val)
                    this.isLoading = false;
                    this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: "Cadastrado com sucesso", life: 3000 });
                    this.isModalSmall = false
                    this.listProcedure();
                    this.clearInputs();
                } catch (error) {
                    this.isLoading = false;
                    this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
                }
            },

            async listProcedure(){
                try {
                    this.isLoading = true;
                    const resp = await http.get('triagem/');
                    this.listTableProcedures = resp.data
                    this.isLoading = false;
                } catch (error) {
                    this.isLoading = false;
                    this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.message, life: 3000 })
                }
            },
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
                            e.procedimento.toLowerCase().includes(this.searchInput.toLowerCase()) || 
                            e.nome.toLowerCase().includes(this.searchInput.toLowerCase()) ||
                            e.cpf.toLowerCase().includes(this.searchInput.toLowerCase()) ||
                            e.clinica.toLowerCase().includes(this.searchInput.toLowerCase()) 
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
       
        display: flex;
        padding: 10px;
        width: 100%;
        gap: 10px;
        justify-content: center; 
    }

    .content-empty-message h3{
        font-size: 18px
    }
    
    
   
</style>