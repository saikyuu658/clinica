<template>
    <h1>Lista de clínica por perfil de paciente</h1>
    <section class="table-dash">
        <div class="content-table">
            <table class="table is-bordered">
                <thead>
                    <tr>
                        <th>Semestre</th>
                        <th>Clínica</th>
                        <th>Perfil de Paciente</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) of patientProfile" :key="index">
                        <td>{{ item.semestre }}</td>
                        <td>{{  item.clinic }}</td>
                        <td>{{ item.profile }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>
<script>

export default {

    data(){
        return {
            patientProfile: [
                {
                    semestre: 5,
                    clinic: 'CLÍNICA DE CIRURGIA I',
                    profile: 'raízes resisduais sem retalho pacientes ASA I/II'
                },
                {
                    semestre: 5,
                    clinic: 'CLÍNICA I (PERIODONTIA)',
                    profile: 'Cálculo Supragengival'
                },
                {
                    semestre: 5,
                    clinic: 'CLÍNICA I (DENTÍSTICA)',
                    profile: 'Classe I, classe V (totalmente supragengival) e classe II (se não houver dente adjacente para permitir visualização direta). ⁠Cavidade rasas e médias ⁠Lesões de cárie primária'
                },

                {
                    semestre: 6,
                    clinic: 'CLÍNICA DE PRÓTESE I (PT E PPR)',
                    profile: ''
                },

                {
                    semestre: 6,
                    clinic: 'CLÍNICA II (PERIODONTIA)',
                    profile: `Cálculo Supragengival Cálculo Subgengival`
                },
                {
                    semestre: 6,
                    clinic: 'CLÍNICA II (DENTÍSTICA)',
                    profile: ``
                },
                {
                    semestre: 6,
                    clinic: 'Dentes unirradiculares',
                    profile: ``
                },
                {
                    semestre: 6,
                    clinic: 'ESTOMATOLOGIA',
                    profile: ``
                },
                {
                    semestre: 7,
                    clinic: 'CLÍNICA DE CIRURGIA II',
                    profile: `raízes residuais com retalho
                        - freios mal posicionados
                        - lesões orais
                        - ASA II/III
                        `
                },
                {
                    semestre: 7,
                    clinic: 'CLÍNICA DE PRÓTESE II',
                    profile: ``
                },
                {
                    semestre: 7,
                    clinic: 'CLÍNICA INFANTIL I',
                    profile: ``
                },
                {
                    semestre: 8,
                    clinic: 'CLÍNICA DE ATENÇÃO AO IDOSO E PESSOAS COM DEFICIÊNCIA',
                    profile: ``
                },
                {
                    semestre: 8,
                    clinic: 'CLÍNICA DE CIRURGIA III',
                    profile: `- dente semi-incluso
                        -Rebordos com necessidade de regularização
                        `
                },
                {
                    semestre: 8,
                    clinic: 'CLÍNICA III (PERIODONTIA)',
                    profile: `Cálculo Supragengival
                        Cálculo Subgengival
                        Cirurgias periodontais (a avaliar)
                        `
                },
                {
                    semestre: 8,
                    clinic: 'CLÍNICA III (DENTÍSTICA)',
                    profile: ``
                },
                {
                    semestre: 8,
                    clinic: 'CLÍNICA III (ENDODONTIA)',
                    profile: `Dentes unirradiculares
                                Dentes birradiculares
                                `
                },
                {
                    semestre: 8,
                    clinic: 'CLÍNICA INFANTIL II',
                    profile: ``
                },
                {
                    semestre: 9,
                    clinic: 'ESTÁGIO CURRICULAR SUPERVISIONADO CLÍNICA INTEGRADA I (PERIODONTIA)',
                    profile: `Cálculo Supragengival
                        Cálculo Subgengival
                        Cirurgias periodontais (a avaliar)
                        `
                },
                {
                    semestre: 9,
                    clinic: 'ESTÁGIO CURRICULAR SUPERVISIONADO CLÍNICA INTEGRADA I (ENDODONTIA)',
                    profile: `Endododontia de uni e birradiculares.
                            Retratamento de uni e birradiculares.
                            *Atendimento de urgência (molares)`
                },

                {
                    semestre: 9,
                    clinic: 'ESTÁGIO CURRICULAR SUPERVISIONADO CLÍNICA INTEGRADA I (DENTÍSTICA)',
                    profile: ``
                },
                {
                    semestre: 9,
                    clinic: 'ESTÁGIO CURRICULAR SUPERVISIONADO CLÍNICA INTEGRADA I (PRÓTESE)',
                    profile: ``
                },
                {
                    semestre: 9,
                    clinic: 'ESTÁGIO CURRICULAR SUPERVISIONADO CLÍNICA INTEGRADA I (CIRURGIA)',
                    profile: `dentes inclusos e impactados
                    - dentes com necessidade de tracionamento
                        `
                },

                {
                    semestre: 10,
                    clinic: 'ESTÁGIO CURRICULAR SUPERVISIONADO EM CLÍNICA INTEGRADA II (PERIODONTIA)',
                    profile: `Cálculo Supragengival
                        Cálculo Subgengival
                        Cirurgias periodontais (a avaliar)
                        `
                },
                {
                    semestre: 10,
                    clinic: 'ESTÁGIO CURRICULAR SUPERVISIONADO EM CLÍNICA INTEGRADA II (ENDODONTIA)',
                    profile: `Dentes unirradiculares e birradiculares
                    Retratamento unirradicular e birradiculares`
                },
            ]
        }
    }
}
</script>
<style scoped>
    .table-dash{
        display: flex;
        justify-content: center;
        height: 100vh;
        position: absolute;
        left: 10px;
        right: 10px;
        top: 50px;
        bottom: 0;
    }
    
    h1{
        margin: 10px;
        font-size: 23px;
        font-weight: 600;
    }
</style>