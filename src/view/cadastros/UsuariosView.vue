<template>
    <div>
        <div class="filter">
            <button class="button is-info is-small" v-on:click="showModal">Novo Usuário</button>

            <FilterComponent
                @searchValue="search"
            ></FilterComponent>
        </div>
    </div>
    <section class="content-table"> 
        <DataTable 
           
            :value="listComputed" 
            paginator :rows="12" 
        >
            <template #empty> Lista vazia. </template>
            <Column field="name" header="Nome"></Column>
            <Column field="nivel" header="Nível">
                <template #body="slotProps">
                    {{  convertNivel(slotProps.data.nivel) }}
                </template>
            </Column>
            <Column field="email" header="Email"></Column>
            <Column field="phone" header="Telefone"> 
                <template #body="slotProps"> 
                    {{ formatTel(slotProps.data.phone) }}
                </template>
            </Column>
            <Column field="active" header="Status">
                <template #body="slotProps">
                    {{  convertStatus(slotProps.data.active) }}
                </template>
            </Column>

            <Column header="">
                <template #body="slotProps">
                       <span 
                        class="btn material-symbols-outlined" 
                        v-tooltip="'Editar'"
                        v-on:click="showModalEdit(slotProps.data)">
                            edit
                       </span>
                </template>
            </Column>

        </DataTable>


    </section>


    <ModalComponentVue
    v-show="isModalVisible"
    @close="closeModal"
    >
        <template v-slot:header>
            <h3>Novo Usuários</h3>
        </template>
        <template v-slot:body>
            <div class="row-group">
                <div class="form-group">
                    <label for="">Nome</label>
                    <input class="input is-small" v-model="usuario.name" placeholder="Nome completo" style="width: 300px;">
                </div>
                <div class="form-group">
                    <label for="">Telefone</label>
                    <input class="input is-small" v-model="usuario.phone" type="tel" v-mask="'(##) # ####-####'" placeholder="(00) 00000-0000">
                </div>
                
            </div>
            <div class="row-group">
                <div class="form-group">
                    <label for="">Login</label>
                    <input class="input is-small" v-model="usuario.login" placeholder="Digite o login de acesso">
                </div>
                <div class="form-group">
                    <label for="">Nível</label>
                    <select class="input is-small" id="" v-model="usuario.nivel">
                        <option value="" selected disabled>Selecione</option>
                        <option value="f">Funcionário</option>
                        <option value="a">Aluno</option>
                        <option value="p">Professor</option>
                    </select>
                </div>
            </div>
            <div class="row-group">
                <div class="form-group">
                    <label for="">Senha</label>
                    <input class="input is-small" v-model="usuario.password" type="password" placeholder="Digite a senha de acesso">
                </div>
                
            </div>
           
            <div class="form-group">
                <label for="">Email</label>
                <input class="input is-small" type:email v-model="usuario.email" placeholder="exemple@exemple.com" style="width: 300px;">
            </div>

            
        </template>
        <template v-slot:footer>
            <button class="button is-link is-small" v-on:click="save(true)">Salvar e Novo</button>
            <button class="button is-info is-small" v-on:click="save(false)">Salvar</button>
        </template>
    </ModalComponentVue>

    <ModalComponentVue
    v-show="isModalEditVisible"
    @close="closeModalEdit"
    >
        <template v-slot:header>
            <h3>Atualizar Usuário</h3>
        </template>
        <template v-slot:body>
            <div class="row-group">
                <div class="form-group">
                    <label for="">Nome</label>
                    <input class="input is-small" v-model="usuario.name" placeholder="Nome completo" style="width: 300px;">
                </div>
                <div class="form-group">
                    <label for="">Telefone</label>
                    <input class="input is-small" type="tel" v-mask="'(##) # ####-####'" v-model="usuario.phone" placeholder="(00) 00000-0000">
                </div>
                
            </div>
            <div class="row-group">
                <div class="form-group">
                    <label for="">Login</label>
                    <input class="input is-small"  v-model="usuario.login" placeholder="Digite o login de acesso">
                </div>
                <div class="form-group">
                    <label for="">Nível</label>
                    <select class="input is-small" v-model="usuario.nivel" id="">
                        <option value="f">Funcionário</option>
                        <option value="a">Aluno</option>
                        <option value="p">Professor</option>
                    </select>
                </div>
               
            </div>
            <div class="form-group">
                <label for="">Email</label>
                <input class="input is-small" type:email v-model="usuario.email" placeholder="exemple@exemple.com" style="width: 300px;">
            </div>

            <div class="form-group">
                    <label for="">Nova Senha</label>
                    <input class="input is-small" type="password" v-model="usuario.password" placeholder="Digite a senha de acesso">
                </div>
           
        </template>
        <template v-slot:footer>
            <button class="button is-info is-small" v-on:click="updateUser" >Salvar Alterações</button>
        </template>
    </ModalComponentVue>

    <LoadingComponentVue v-show="isLoading"></LoadingComponentVue>
    <Toast/>
</template>
<script>
import ModalComponentVue from '@/components/ModalComponent.vue'
import FilterComponent from '@/components/FilterComponent.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import RequestHttp from '@/http'
import Toast from "primevue/toast"
import {mask} from 'vue-the-mask'
import LoadingComponentVue from '@/components/LoadingComponent.vue';

export default {
    components: {
        FilterComponent,
        ModalComponentVue,
        DataTable,
        Column,
        Toast,
        LoadingComponentVue
    },

    directives: {mask},
    data(){
        return {
            isLoading: false,
            selectedUser: {},
            isModalVisible: false,
            isModalEditVisible: false,

            usuario: {
                name: "",
                phone: "",
                login: "",
                password: "",
                nivel: "",
                email: "" 
            },

            confirPass :"",
            searchInput: "",
            list: [
                {
                    id: "",
                    login: "",
                    name: "",
                    nivel: "",
                    phone: "",
                    email: "",
                }
            ],

            
        }
    },
    methods: {
        closeModalEdit(){
            this.isModalEditVisible = false;
            this.usuario = {
                name: "",
                email: "",
                login: "",
                nivel: "",
                password: "",
                phone: ""
            }
        },

        showModalEdit(val){
            this.usuario = {
                name: "",
                email: "",
                login: "",
                nivel: "",
                password: "",
                phone: ""
            }
            this.usuario = JSON.parse(JSON.stringify(val));
            this.isModalEditVisible = true;
        },

        closeModal(){
            this.isModalVisible = false;
            this.usuario = {
                name: "",
                email: "",
                login: "",
                nivel: "",
                password: "",
                phone: ""
            }
        },

        showModal(){
            this.isModalVisible = true;
            this.usuario = {
                name: "",
                email: "",
                login: "",
                nivel: "",
                password: "",
                phone: ""
            }
        },
        
        formatTel(val) {
            return `(${val.substring(0, 2)}) ${val.substring(2, 7)} - ${val.substring(7)}`
        },

        search(value){
            this.searchInput = value;
        },

        convertStatus(val){
            return val? 'Ativo' : 'Disabilitado'
        },  
        
        convertNivel(val){
            switch (val) {
                case 'a':
                return 'Aluno'
                case 'f':
                return 'Funcionário'
                case 'p':
                return 'Professor'
                case 's':
                return 'Admin'
            
                default:
                    break;
            }
        },

        async save(val){
            this.isLoading = true;
            const regex = /\(|\)|-/gi;
            this.usuario.phone = this.usuario.phone.replaceAll(regex, '').replaceAll(' ', '');
            const resp = await RequestHttp.createUser(this.usuario)
            if(resp.hasError){
                this.isLoading = false;

                this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })
                if(resp.response.status == 401){
                    await new Promise(()=>{
                        setTimeout(() => {
                            this.$router.replace('/');
                            localStorage.clear();
                        }, 2000);
                    })
                } 
            }else{
                this.isLoading = false;
                this.$toast.add({ severity: 'success', summary: 'Success Message', detail: 'Adicionado com sucesso', life: 3000 })
                this.list.push(resp.data)

                    this.usuario = {
                    login : '',
                    name: '',
                    password: "",
                    nivel: "",
                    phone: ''
                }

                this.isModalVisible = val;
            }

            
        },

        async listUsers(){
            this.isLoading = true;
            const resp = await RequestHttp.listUser();
            if(resp.hasError){
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })
                this.isLoading = false;
                this.isModalVisible = false;
                if(resp.response.status == 401){
                    await new Promise(()=>{
                        setTimeout(() => {
                            this.$router.replace('/');
                            localStorage.clear();
                        }, 2000);
                    })
                } 
            }else{
                this.isLoading = false;
                this.list = resp;
            }
        },

        async updateUser(){
            this.isLoading = true;
            const regex = /\(|\)|-/gi;
            this.usuario.phone = this.usuario.phone.replaceAll(regex, '').replaceAll(' ', '');
            const resp = await RequestHttp.updateUser(this.usuario )
            if(resp.hasError){
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: resp.response.data.message, life: 3000 })
                if(resp.response.status == 401){
                    await new Promise(()=>{
                        setTimeout(() => {
                            this.$router.replace('/');
                            localStorage.clear();
                        }, 2000);
                    })
                } 
            }else{
                this.isLoading = false;
                this.$toast.add({ severity: 'success', summary: 'Success Message', detail: 'usuário atualizado com sucesso', life: 3000 })
                this.listUsers();            
            }

            this.isModalEditVisible = false;
        }

    },

    mounted(){
        this.listUsers();
    },
    computed: {
        listComputed(){
            if(this.searchInput == ""){
                return this.list;
            }else{
                return this.list.filter((e)=> {
                    if(
                        e.name.toLowerCase().includes(this.searchInput.toLowerCase()) ||
                        e.login.toLowerCase().includes(this.searchInput.toLowerCase()) 
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

    .btn{
        cursor: pointer
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
        min-height: 300px;
        max-height: 300px;
        overflow: auto;
    }

    tbody tr{
        cursor: pointer !important;
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