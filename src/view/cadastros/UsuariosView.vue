<template>
    <div>
        <div class="filter">
            <span class="title-filter">Usuários</span>
           
            <div class="right-filter">
                <button class="button is-info is-small" v-on:click="showModal">Novo Usuário</button>

                <FilterComponent
                    @searchValue="search"
                ></FilterComponent>
            </div>
        </div>
    </div>
    <section class="content-table"> 
        <DataTable 
            :value="listComputed" 
            scrollable 
            scrollHeight="flex" 
            tableStyle="min-width: 70rem"
        >
            <template #empty> Lista vazia. </template>
            <Column field="nome" header="Nome"></Column>
            <Column field="nivel" header="Nível">
                <template #body="slotProps">
                    {{  convertNivel(slotProps.data.nivel) }}
                </template>
            </Column>
            <Column field="email" header="Email"></Column>
            <Column field="phone" header="Telefone"> 
                <template #body="slotProps"> 
                    {{ formatTel(slotProps.data.telefone) }}
                </template>
            </Column>
            <Column field="active" header="Status">
                <template #body="slotProps">
                    {{  convertStatus(slotProps.data.ativo) }}
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
            <h3>Novo Usussos</h3>
        </template>
        <template v-slot:body>
            <div class="row-group">
                <div class="form-group">
                    <label for="">Nome</label>
                    <input class="input is-small" v-model="usuario.nome" placeholder="Nome completo" style="width: 300px;">
                </div>
                <div class="form-group">
                    <label for="">Telefone</label>
                    <input class="input is-small" v-model="usuario.telefone" type="tel" v-mask="'(##) # ####-####'" placeholder="(00) 00000-0000">
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
                        <option value="p">Professor</option>
                    </select>
                </div>
            </div>
            <div class="row-group">
                <div class="form-group">
                    <label for="">Senha</label>
                    <input class="input is-small" v-model="usuario.senha" type="password" placeholder="Digite a senha de acesso">
                </div>
                
            </div>
           
            <div class="form-group">
                <label for="">Email</label>
                <input class="input is-small" type:email v-model="usuario.email" placeholder="exemple@exemple.com" style="width: 300px;">
            </div>

            
        </template>
        <template v-slot:footer>
            <button class="button is-info is-small" v-on:click="save()">Salvar</button>
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
                    <input class="input is-small" v-model="usuario.nome" placeholder="Nome completo" style="width: 300px;">
                </div>
                <div class="form-group">
                    <label for="">Telefone</label>
                    <input class="input is-small" type="tel" v-mask="'(##) # ####-####'" v-model="usuario.telefone" placeholder="(00) 00000-0000">
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
                    <input class="input is-small" type="password" v-model="usuario.senha" placeholder="Digite a senha de acesso">
                </div>
           
        </template>
        <template v-slot:footer>
            <button class="button is-info is-small" v-on:click="updateUser" >Salvar Alterações</button>
        </template>
    </ModalComponentVue>

    <LoadingComponentVue v-show="isLoading"></LoadingComponentVue>
</template>
<script>
    import ModalComponentVue from '@/components/ModalComponent.vue'
    import FilterComponent from '@/components/FilterComponent.vue';
    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
    import {http} from '../../http';
    import {mask} from 'vue-the-mask'
    import LoadingComponentVue from '@/components/LoadingComponent.vue';

    export default {
        components: {
            FilterComponent,
            ModalComponentVue,
            DataTable,
            Column,
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
                    nome: "",
                    telefone: "",
                    login: "",
                    senha: "",
                    nivel: "",
                    email: "" 
                },

                confirPass :"",
                searchInput: "",
                list: [
                    {
                        id: "",
                        login: "",
                        nome: "",
                        nivel: "",
                        telefone: "",
                        email: "",
                    }
                ],

                
            }
        },
        
        methods: {
            closeModalEdit(){
                this.isModalEditVisible = false;
                this.usuario = {
                    nome: "",
                    email: "",
                    login: "",
                    nivel: "",
                    senha: "",
                    telefone: ""
                }
            },

            showModalEdit(val){
                this.usuario = JSON.parse(JSON.stringify(val));
                this.usuario.senha = "";
                this.isModalEditVisible = true;
            },

            closeModal(){
                this.isModalVisible = false;
                this.usuario = {
                    nome: "",
                    email: "",
                    login: "",
                    nivel: "",
                    senha: "",
                    telefone: ""
                }
            },

            showModal(){
                this.isModalVisible = true;
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

            async save(){

                try {
                    this.isLoading = true;
                    const regex = /\(|\)|-/gi;
                    this.usuario.telefone = this.usuario.telefone.replaceAll(regex, '').replaceAll(' ', '');
                    await http.post('user/create', this.usuario);
                    this.isLoading = false;
                    this.$toast.add({ severity: 'success', summary: 'Success Message', detail: 'Adicionado com sucesso', life: 3000 })
                    this.isModalVisible = false;
                    this.listUsers()

                } catch (error) {
                    this.isLoading = false;
                    this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.message, life: 3000 })
                }
            },

            async listUsers(){
                try {
                    this.isLoading = true;
                    const resp = await http.get('user/');
                    this.list = resp.data
                    this.isLoading = false;
                } catch (error) {
                    this.isLoading = false;
                    this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.message, life: 3000 })
                }
            },

           

            async updateUser(){
                try {
                    this.isLoading = true;
                    const regex = /\(|\)|-/gi;
                    this.usuario.telefone = this.usuario.telefone.replaceAll(regex, '').replaceAll(' ', '');
                    const resp = await http.post('user/update', this.usuario);
                    this.$toast.add({ severity: 'success', summary: 'Success Message', detail: resp.data, life: 3000 })
                    this.isLoading = false;
                    this.closeModalEdit();
                    this.listUsers();            
                } catch (error) {
                    this.isLoading = false;
                    this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.message, life: 3000 })
                    
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
                            e.nome.toLowerCase().includes(this.searchInput.toLowerCase()) ||
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
   
</style>