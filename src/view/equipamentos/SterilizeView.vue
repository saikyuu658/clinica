<template>
    <div>
        <div class="filter">
            <button class="button is-small is-info" v-on:click="showModal()">Receber</button>
            <FilterComponent
                @searchValue="search"
            ></FilterComponent>
        </div>
    </div>
    <section class="content-table"> 
        <DataTable 
            :value="listComputed" 
            paginator :rows="11" 
            :sortOrder="1"
            sortField="id"
        >
            <template #empty> Nenhum registro. </template>

            <Column field="boxStudent" header="Nº caixa"></Column>
            <Column field="codStudent" header="Cod. Aluno"></Column>
            <Column field="createdAt" sortable header="Dt. Recebido">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.createdAt) }}
                </template>
            </Column>
            <Column field="qtd" header="Qtd"></Column>
            
            <Column >
                <template #body="slotProps">
                    <span 
                        v-on:click="showModalReturn(slotProps.data)"
                        v-tooltip.bottom="'Devolver'"
                        class="material-symbols-outlined">
                        keyboard_return
                    </span>
                </template>
            </Column>
        </DataTable>
    </section>
    <ModalComponent
        v-show="isReciveModal"
        @close="closeReciveModal"
    >
        <template v-slot:header>
            <h3>Receber</h3>
        </template>

        <template v-slot:body>
            <div class="row-group">
                <div class="form-group">
                    <label for="">Selecionar aluno</label>
                    <select class="input is-small" style="width: 350px;" id="selectStudent" :disabled="newItem.codStudent != 0" >
                        <option value="" selected disabled>Selecione</option>
                        <option :value="item.id" v-for="(item, index) of listUser" :key="index">{{ item.name }}</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="">Nº Caixa</label>
                    <input type="tel" style="width: 70px;" autocomplete="off" :disabled="newItem.boxStudent != ''" class="input is-small" id="setBoxStudent"  >
                </div>
                <button class="button is-small is-info form-group" 
                    v-show="newItem.codStudent == 0 && newItem.boxStudent == ''" @click="confirmSelectionStudent"
                >
                    Confirmar
                </button>

                <button class="button is-small is-info form-group" @click="AlterSelectionStudent" v-show="newItem.codStudent != 0 && newItem.boxStudent != ''">
                    Alterar
                </button>

            </div>

            <div class="content-body" v-show="newItem.codStudent != 0">
                <form @submit.prevent="addItemList">
                    <div class="row-group">
                        <div class="form-group">
                            <label for="">Qtd</label>
                            <input type="number" v-model="newItem.qtd" style="width: 100px;" class="input is-small">
                        </div>
                        <div class="form-group">
                            <label for="">Lista de Itens</label>
                            <select class="input is-small" style="width: 300px;" id="" v-model="newItem.name">
                                <option value="" disabled>Selecione</option>
                                <option :value="item.name" v-for="(item, index) of listItemSterilize" :key="index">{{ item.name }}</option>
                            </select>
                        </div>

                        <button class="button is-small is-primary form-group">
                            <span class="material-symbols-outlined">
                                add
                            </span>
                        </button>
                    </div>
                </form>
                
            </div>

            <div class="content-list-table">
                <table class="list-equip-table">
                    <thead>
                        <tr>
                            <th style="width: 100px; padding-left: 5px;">Qtd</th>
                            <th>Nome</th>
                            <th style="width: 100px;">Remover</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) of listItem" :key="index">
                            <td>{{ item.qtd }}</td>
                            <td>{{ item.name }}</td>
                            <td>
                                <button class="button is-danger is-small" @click="rmItemList(index)">
                                    <span class="material-symbols-outlined">
                                        delete
                                    </span>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            
            </div>

        </template>

        <template v-slot:footer>
            <button class="button is-info is-small" :disabled="newItem.codStudent == 0" @click="showSmallModal('create')">
                Salvar
            </button>
        </template>
    </ModalComponent>
    
    <ModalSmallComponentVue
        @close="closeSmallModal"
        v-show="isVisibleModalSmall"
    >
        <template v-slot:body>
            <TabView>
                <TabPanel header="E-mail">
                    <p class="text">
                        Um email foi enviado para o <b>email institucional</b> do aluno selecionado contendo a chave de confirmação. 
                        A chave tem inspiração de <b>2 minutos</b>. 
                    </p>
                    <div class="form-group" >
                        <label for="">Confirmação de segurança</label>
                        <input type="text" style="width: 100%; text-align: center;" class="input is-small" v-model="credential.email">
                    </div>
                </TabPanel>
                <TabPanel header="CPF/Nascimento">
                    <div class="form-group" >
                        <label for="">CPF</label>
                        <input placeholder="000.000.000-00" type="tel" v-mask="'###.###.###-##'" style="width: 100%; text-align: center;" class="input is-small" v-model="credential.cpf">
                    </div>
                    <div class="form-group" >
                        <label for="">Data Nascimento</label>
                        <input type="date" placeholder="Data de Nascimento" style="width: 100%; text-align: center;" class="input is-small" v-model="credential.dtNasc">
                    </div>
                </TabPanel>
            </TabView>
        </template>

        <template v-slot:footer>
            <button class="button is-danger is-small" @click="closeSmallModal()">
                Cancelar
            </button>
            <button class="button is-info is-small" @click="createSterilize()" v-if="openSmallModal == 'create'">
                Confirmar 
            </button>
            <button class="button is-info is-small"  @click="returnedSterlize()" v-else>
                Confirmar devolução
            </button>
            
        </template>

    </ModalSmallComponentVue>
   
    <LoadingComponentVue
        v-show="isLoading"
    ></LoadingComponentVue>

    <ModalComponent 
    @close="closeModalReturn"
    v-show="isVisibleModalReturn">
        <template v-slot:header>
            <h3>Devolver</h3>
        </template>
        <template v-slot:body>
            <div class="row-group">
                <div class="form-group" style="margin-right: 50px; margin-left: 10px;">
                    <label for=""><b>Aluno</b></label>
                    <p >{{ returnSterlize[0].codStudent }}</p>
                </div>
                <div class="form-group">
                    <label for=""><b>Nº Caixa</b></label>
                    <p >{{ returnSterlize[0].boxStudent }}</p>
                </div>
            </div>
            <div class="content-list-table" style="top: 50px; bottom: 30px;">
                <table class="list-equip-table">
                    <thead>
                        <tr>
                            <th style="width: 50px" ></th>
                            <th style="width: 50px;" >ID</th>
                            <th>Nome</th>
                            <th>Data. Recebida</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) of returnSterlize" :key="index">
                            <td > <label class="checkbox">
                                <input type="checkbox" v-on:change="(event)=>{ selectItemsToReturned(item, event.target.checked, index)}"/>
                                </label> 
                            </td>
                          
                            <td>{{ index+1 }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ formatDate(item.createdAt) }}</td>
                        </tr>
                    </tbody>
                </table>
            
            </div>
            <p style="position: absolute; bottom: 0;">Itens selecionados : <b>{{ returnedListToSend.length }}</b></p>
        </template>

        <template v-slot:footer>
            <button class="button is-info is-small" @click="showSmallModal('return')">
                Devolver
            </button>
        </template>
    </ModalComponent>


    <div id="print" >
        <div class="print-header">
            <div class="logo">
                <img src="../../assets/odonto_logo.png" >
                Faculdade Luciano feijao
            </div>
        </div>
        <div class="info">
            <p> <b>Atendente:</b> Santander</p>
            <p> <b>Aluno:</b> João cleber</p>
            <p> <b>Dt recebimento:</b> 15/04/2024at14:30</p>
        </div>
        <div class="lista-items">
            <p>Listagem de itens</p>
            <ul>
                <li v-for="(item, index) in listItem" :key="index">
                   {{ item.qtd }}x - {{ item.name }}
                </li>
            </ul>
        </div>
        <div class="ass">
            <p> <b>Ass. Atendente:</b> </p>
            <p> <b>Ass. Aluno:</b></p>
        </div>
    </div>
    
</template>
<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column';
import FilterComponent from '@/components/FilterComponent.vue';
import RequestHttp from '@/http';
import LoadingComponentVue from '@/components/LoadingComponent.vue';
import ModalSmallComponentVue from '@/components/ModalSmallComponent.vue';
import ModalComponent from '@/components/ModalComponent.vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import {mask} from 'vue-the-mask'
export default {
    directives: {mask},
    components: {
        ModalSmallComponentVue,
        // ModalLargeComponent,
        DataTable,
        Column,
        FilterComponent,
        LoadingComponentVue,
        ModalComponent,
        TabView,
        TabPanel
    },
    data(){
        return {
 
            searchInput: "",
            listSterilize: [],
            isVisibleModalReturn: false,
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
            listItem: [],
            credential: {},
            /**lista de itens para selecionar*/
            listItemSterilize: [],
            isLoading: false,
            listUser: [],
            isReciveModal: false,

            isVisibleModalSmall: false
        }
    },
    methods: {

        selectItemsToReturned(data, value){
            if(value){
                this.returnedListToSend.push(data)
            }else{
                this.returnedListToSend.splice(this.returnedListToSend.findIndex((e)=>e.id == data.id), 1)
            }
        },

        async returnedSterlize() {

            if(this.credential.cpf){
                const regex = /\.|-|\(|\)/gi
                this.credential.cpf = this.credential.cpf.replaceAll(regex, '').replaceAll(' ', '');
            }
            const resp = await RequestHttp.returnSterilize(this.returnedListToSend, this.credential);

            if(resp.hasError){
                this.isLoading = false
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })
            }else{
                this.isLoading = false
                this.isVisibleModalReturn = false;
                this.isVisibleModalSmall = false
                this.returnedListToSend = []
                this.returnSterlize = [{ boxStudent: '', codStudent: ''}]
                this.$toast.add({ severity: 'success', summary: '', detail: "Itens devolvidos com sucesso!", life: 3000 })
                this.credential={};
                this.findAllSterilize()
            } 
        },

        async showModalReturn(data){
            this.isLoading = true
            const resp = await RequestHttp.listItensFromSterilize(data);
            if(resp.hasError){
                this.isLoading = false
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })
            }else{
                console.log(resp)
                this.returnSterlize = resp
                this.isLoading = false
                this.isVisibleModalReturn = true;
            }
        },

        closeModalReturn(){
          this.isVisibleModalReturn = false;  
        },
       
        async showSmallModal(val){
           
            this.openSmallModal = val
            if(this.listItem.length == 0 && this.openSmallModal=='create'){
                this.$toast.add({ severity: 'warn', summary: 'Alerta', detail: "É necessario ter algum equipamento para registrar", life: 3000 })
                return
            }
            const resp = await RequestHttp.sendEmail();
            if(resp.hasError){
                this.isLoading = false
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })
            }else{
                this.isLoading = false
                this.isVisibleModalSmall = true;
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

        AlterSelectionStudent(){
            this.newItem.codStudent = 0;
            this.newItem.boxStudent = '';
        },

        confirmSelectionStudent(){
            let box = document.querySelector('#setBoxStudent').value;
            let stud = document.querySelector('#selectStudent').value
            if( box == '' || stud == 0){
                this.$toast.add({ severity: 'warn', summary: 'Alerta', detail: "Preencha as informações corretamente", life: 3000 })
                return
            }
            this.newItem.codStudent = stud;
            this.newItem.boxStudent = box;
            
        },
        
        closeReciveModal(){
            this.isReciveModal = false;
          
            this.cleanFields();
        },

        cleanFields(){
            this.listItem = [];
           
            this.newItem = { name : '', qtd: 1, codStudent : 0, boxStudent : ''}
            document.querySelector('#selectStudent').value = ""
            document.querySelector('#setBoxStudent').value = ""
        },

        async showModal(){
            this.isReciveModal = true;
            const resp = await RequestHttp.listUser();
            if(resp.hasError){
                this.isLoading = false
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })
            }else{
                this.isLoading = false
                this.listUser = resp;
            }
        },
        
        search(value){
            this.searchInput = value;
        },

        addItemList(){
            if(this.newItem.qtd == 0 || this.newItem.name == ''){
                this.$toast.add({ severity: 'warn', summary: 'Alerta', detail: "Preencha as informações corretamente", life: 3000 })
                return 
            }
            this.listItem.push(JSON.parse(JSON.stringify(this.newItem)))
            this.newItem.name='';
            this.newItem.qtd = 1
        },
        
        rmItemList(index){
            this.listItem.splice(index, 1);
        },

        async findAllSterilize(){
            this.isLoading = true
            const resp =await RequestHttp.listSterilize();
            console.log(resp)
            if(resp.hasError){
                this.isLoading = false
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })
            }else{
                this.isLoading = false
                this.listSterilize = resp;
            }
        },

        async toListItemSterilize(){
            this.isLoading = true
            const resp =await RequestHttp.listItensSterilize();
            if(resp.hasError){
                this.isLoading = false
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })

            }else{
                this.isLoading = false
                this.listItemSterilize = resp;
            }
        },

        async createSterilize(){
            this.isLoading = true
            if(this.credential.cpf){
                const regex = /\.|-|\(|\)/gi
                this.credential.cpf = this.credential.cpf.replaceAll(regex, '').replaceAll(' ', '');
            }
            let createdListFull = [];
            this.listItem.forEach((e)=>{
                const {qtd, ...rest} = e;
                for (let i = 0; i < qtd; i++) {
                   createdListFull.push(rest);
                }
            })
            const resp = await RequestHttp.createSterilize(createdListFull, this.credential);
            if(resp.hasError){
                this.isLoading = false
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })
            }else{
                this.isLoading = false;
                print()
                this.$toast.add({ severity: 'success', summary: '', detail: "Registrado com sucesso!", life: 3000 })
                this.isReciveModal = false;
                this.isVisibleModalSmall = false;
                this.listItem = [];
                this.listItemSterilize = [];
                this.userSelected = 0;
                this.credential = {}
                this.findAllSterilize()
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
                        e.codStudent.toString().toLowerCase().includes(this.searchInput.toLowerCase())
                        ){
                        return e;
                    }
                })
            }
        }
    },

    created(){
        this.findAllSterilize();
        this.toListItemSterilize();
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
        position: absolute;
        left: 7px;
        bottom: 0;
        top: 130px;
        overflow-y: auto;
        overflow-x: hidden;
        width: 600px;
        border: solid 1px #00000020;
    }

    .list-equip-table{
        width: 100%;
        border: solid 1px #00000035;
    }
    .list-equip-table thead{
        position: sticky;
        padding: 5px;
        top: -1px;
        left: -1px;
        background-color: #c9c9c9;
        border-collapse: collapse;
        z-index: 2;
        border: solid 1px #00000035;

    }

    .list-equip-table tbody td{
        padding: 5px;
        border-bottom: solid 1px #00000035;
    }

    .material-symbols-outlined{
        cursor: pointer;
    }
    .filter{
        position: absolute;
        top: 5px;
        height: 50px;
        left: 0;
        right: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        justify-content: end;
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