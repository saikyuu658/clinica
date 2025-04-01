<template>
  <div class="filter">
    <span class="title-filter">Prontuários</span>
    <div class="right-filter">
      <Button v-on:click="showModal" label="Novo Prontuário"></Button>
      <Button
      v-on:click="
          () => {
            filterSidebar = true;
          }
          "
        icon="pi pi-filter"
        ></Button>
      <Paginator :rows="10" :totalRecords="120" :rowsPerPageOptions="[10, 20, 30]"></Paginator>

      <SideFilterComponentVue @close="closeFilter" v-show="filterSidebar">
        <template v-slot:body>
          <div class="form-group">
            <label for="">Mostrar listas </label>
            <select
              class="is-small input is-fullwidth"
              v-model="filterSelected"
            >
              <option value="finalizado">Tratamento finalizado</option>
              <option value="tratamento">Em tratamento</option>
            </select>
          </div>
        </template>

        <template v-slot:footer>
          <Button
            style="width: 100%"
            v-on:click="applyFilter()"
            label="Aplicar Filtro"
          />
        </template>
      </SideFilterComponentVue>
      <FilterComponent @searchValue="search"></FilterComponent>
    </div>
  </div>
  <div
    style="
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
      "
  >
  Filtro:
  <span style="font-weight: bold; font-size: 15px">{{
    `   ${showFilterSelected}`
  }}</span>
  </div>
  <section class="content-table">
    <DataTable
    :value="listComputed"
    sortField="status"
    :sortOrder="(sortDirection = 'Em tratamento' ? 1 : -1)"
    scrollable
    scrollHeight="flex"
    tableStyle="min-width: 70rem"
    >
    <template #empty> Nenhum procedimento registrado. </template>
    <Column field="prontuario" header="Prontuário"></Column>
    <Column field="paciente" header="Paciente"></Column>
    <Column field="created_at" header="Dt. cadastro">
      <template #body="slotProps">
        {{ formatDate(slotProps.data.created_at) }}
      </template>
    </Column>
    <Column field="updated_at" header="Dt. Finalizado">
      <template #body="slotProps">
        {{ formatDate(slotProps.data.updated_at) }}
      </template>
    </Column>
    <Column field="id" header="editar">
      <template #body="slotProps">
        <div style="display: flex">
          <span
          v-if="slotProps.data.status != 'Tratamento finalizado'"
          v-on:click="showModalConfirm(slotProps.data)"
          v-tooltip.bottom="'finalizar tratamento'"
          class="material-symbols-outlined btn"
          >
          check_circle
        </span>
      </div>
    </template>
  </Column>
</DataTable>
</section>

<LoadingComponentVue v-show="isLoading"></LoadingComponentVue>
<ModalComponentVue @close="closeModalNovo" v-show="isVisibleModalNovo">
  <template v-slot:header>
    <div class="header-top-modal">
      <h2 class="is-size-5">Novo prontuário</h2>
      <span class="material-symbols-outlined btn" v-on:click="closeModalNovo">
        close
      </span>
    </div>
    <hr />
  </template>
  
  <template v-slot:body>
    <div class="row-group">
      <div class="form-group">
        <label for="">Nº do prontuário</label>
        <input
          type="text"
          autocomplete="off"
          style="width: 300px"
          v-model="novoProntuario.prontuario"
          class="input is-small is-full"
          id="setBoxStudent"
          />
          </div>
          <div class="form-group">
            <label for="">Paciente</label>
            <select
            autocomplete="off"
            style="width: 300px"
            v-model="novoProntuario.paciente"
            class="input is-small is-full"
            >
            <option :value="0">Selecione</option>
            <option
            :value="item.id"
            v-for="(item, index) in listPaciente"
            :key="index"
            >
            {{ item.nome }}
          </option>
        </select>
      </div>
    </div>
  </template>
  
  <template v-slot:footer>
    <button
    class="button is-info is-small"
    @click="createNewProntuario(true)"
    >
    salvar e Novo
  </button>
  <button
  class="button is-success is-small"
  @click="createNewProntuario(false)"
  >
  salvar
</button>
</template>
</ModalComponentVue>

<ModalComponentVue @close="closeConfirmModal" v-show="isVisibleModalConfirm">
  <template v-slot:header>
    <div class="header-top-modal">
      <h2 class="is-size-5">Confirmar fim do tratamento</h2>
      <span
      class="material-symbols-outlined btn"
      v-on:click="closeConfirmModal"
        >
          close
        </span>
      </div>
      <hr />
    </template>

    <template v-slot:body>
      <div class="form-group">
        <label for=""><strong>Nº do prontuário</strong></label>
        <span>{{ inputConfirmModalProntuario.prontuario }}</span>
      </div>
      <div class="form-group">
        <label for=""><strong>Paciente</strong> </label>
        <span>{{ inputConfirmModalProntuario.paciente }}</span>
      </div>
    </template>

    <template v-slot:footer>
      <button
        class="button is-success is-small"
        @click="updateProntuario(false)"
      >
        Finalizar tratamento
      </button>
    </template>
  </ModalComponentVue>
</template>

<script lang="js">
import {http} from '@/http';
import DataTable from 'primevue/datatable';
import Button from 'primevue/button';
import FilterComponent from '@/components/FilterComponent.vue';
import Column from 'primevue/column';
import SideFilterComponentVue from '@/components/SideFilterComponent.vue';
import LoadingComponentVue from '@/components/LoadingComponent.vue'
import ModalComponentVue from '@/components/ModalSmallComponent.vue'
export default {
  
    components: {
            DataTable,
            LoadingComponentVue,
            Column,
            Button,
            FilterComponent,
            ModalComponentVue,
            SideFilterComponentVue
        },
    data() {
        return {
            inputConfirmModalProntuario:{},
            novoProntuario : {
                prontuario: "",
                paciente: 0
            },
            isLoading: false,
            listPaciente: [],

            listTableProntuarios : [],
            searchInput : "",
            isVisibleModalConfirm : false,
            isVisibleModalNovo: false,

            filterSidebar : false,
            filterSelected : 'tratamento',
            showFilterSelected: 'tratamento',

        }
    },

    methods: {

        async applyFilter(){
            try {
                this.isLoading = true;
                const resp = await http.get('prontuario/'+this.filterSelected);
                this.listTableProntuarios = resp.data;

                this.showFilterSelected = resp.data[0].status;
                this.statusOrdem = resp.data[0].status;
                this.isLoading = false;
                this.filterSidebar = false;
                this.searchInput = ''
            } catch (error) {
                this.isLoading = false;
                console.log(error)
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.message, life: 3000 })
            }
        },

        async updateProntuario(){
            try {
                this.isLoading = true;
                const resp = await http.post('prontuario/update', this.inputConfirmModalProntuario);
                this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: resp.data, life: 3000 })
                this.isLoading = false;
                this.isVisibleModalConfirm = false;
                this.applyFilter();
            } catch (error) {
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.message, life: 3000 })
            }
        },


        closeFilter(){
            this.filterSidebar = false;
        },

        closeConfirmModal(){
            this.isVisibleModalConfirm = false
        },

        closeModalNovo(){
            this.isVisibleModalNovo= false;
            this.novoProntuario = {
                prontuario: "",
                paciente: 0
            }
        },

        showModalConfirm(val){
            this.isVisibleModalConfirm = true;
            this.inputConfirmModalProntuario = val
        },

        async findAllProntuario(){
            try {
                this.isLoading = true;
                const resp = await http.get('prontuario/'+this.filterSelected);
                this.listTableProntuarios = resp.data;
                console.log(this.listTableProntuarios)
                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data, life: 3000 })
            }
        },

        async showModal(){
            try {
                this.isLoading = true;
                const resp = await http.get('triagem/paciente');
                this.listPaciente = resp.data;
                this.isVisibleModalNovo = true;
                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.message, life: 3000 })
            }
        },

        async createNewProntuario(val){
            try {
                if(this.novoProntuario.paciente == 0 || this.novoProntuario.prontuario == ""){
                    this.$toast.add({ severity: 'warn', summary: 'Alerta', detail: 'Todos os campos devem está preenchidos', life: 3000 })
                    return;
                }
                this.isLoading = true;
                const resp = await http.post('prontuario/create', this.novoProntuario);
                this.$toast.add({ severity: 'success', summary: 'Sucesso!', detail: resp.data, life: 3000 })
                this.isLoading = false;
                this.isVisibleModalNovo = val;
                this.findAllProntuario()
                this.novoProntuario = {
                    paciente: 0,
                    prontuario: ''
                }
            } catch (error) {
                this.isLoading = false;
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: error.response.data.message, life: 3000 })
            }
        },


        search(value){
                this.searchInput = value;
        },

        formatDate(val){
            if(val == "" || val == null){
                return '-'
            }
            const data = new Date(val);
            return data.toLocaleDateString()
        },

    },
    computed: {

        listComputed(){
            if(this.searchInput == ""){
                return this.listTableProntuarios;
            }else{
                return this.listTableProntuarios.filter((e)=> {
                    if(
                        e.paciente.toLowerCase().includes(this.searchInput.toLowerCase()) ||
                        e.prontuario.toLowerCase().includes(this.searchInput.toLowerCase()) ||
                        e.status.toLowerCase().includes(this.searchInput.toLowerCase())
                    ){
                        return e;
                    }
                })
            }
        }
    },
    created(){
        this.findAllProntuario();
    },
}
</script>
<style scoped>
.btn {
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.header-top-modal {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
