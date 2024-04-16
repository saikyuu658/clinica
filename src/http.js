import axios from "axios"

const API_URL = "http://localhost:3200/"

const token = {
    token_acess : ""
}

function getToken(){
    const tk = localStorage.getItem('token');
    if(tk == ""){
        return false;
    }

    token.token_acess = tk;
    return true;
}

class RequestHttp {
    async login(credenciais){
        const response = await axios.post(API_URL + 'user/login', credenciais).then((resp)=>{
            return resp.data
        })
        
        return response
    }

    async getAccess(){
        try {
            if(!getToken()) {
                throw new Error('Sem token')
            }
            const response = await axios.get(API_URL + 'user/getAccess', { headers: { Authorization: `Bearer ${token.token_acess}` }}).then((resp)=>{
                return resp.data
            })
            return response
        } catch (error) {
            error.hasError = true;
            return error
        }
    }

    async listUser(){
        try {
            if(!getToken()) {
                throw new Error('Sem token')
            }
            const response = await axios.get(API_URL + 'user/list', { headers: { Authorization: `Bearer ${token.token_acess}` }}).then((resp)=>{
                return resp.data
            })
            return response
        } catch (error) {
            error.hasError = true;
            return error
        }
        
    }

    async createUser(newUser){
        try {
            if(!getToken()) {
                throw new Error('Sem token')
            }
            const response = await axios.post(API_URL + 'user/create', newUser , { headers: { Authorization: `Bearer ${token.token_acess}` }}).then((resp)=>{
                return resp;
            })
            return response
        } catch (error) {
            error.hasError = true;
            return error
        }
    }

    async updateUser(userUpdate){
        try {
            if(!getToken()) {
                throw new Error('Sem token')
            }

            const { id, ...user} = userUpdate
            const response = await axios.put(API_URL + 'user/update/' + id, user , { headers: { Authorization: `Bearer ${token.token_acess}` }}).then((resp)=>{
                return resp;
            })
            return response
        } catch (error) {
            error.hasError = true;
            return error
        }
    }

    // -------- triagem requests
    async listProcedures(){
        try {
            if(!getToken()) {
                throw new Error('Sem token')
            }
            const response = await axios.get(API_URL + 'triagem/list', { headers: { Authorization: `Bearer ${token.token_acess}` }}).then((resp)=>{
                return resp.data
            })
            return response
        } catch (error) {
            error.hasError = true;
            return error;
        }
    }

    async findByCpf(cpf){
        try {

            if(!getToken()) {
                throw new Error('Sem token')
            }

            const response = await axios.get(API_URL + 'triagem/findPatientByCpf/'+ cpf, { headers: { Authorization: `Bearer ${token.token_acess}` }}).then((resp)=>{
                return resp.data
            })
            return response
        } catch (error) {
            error.hasError = true;
            return error;
        }
    }

    async createPatient(newPatient){
        try {
            if(!getToken()) {
                throw new Error('Sem token')
            }
            const response = await axios.post(API_URL + 'triagem/create', newPatient , { headers: { Authorization: `Bearer ${token.token_acess}` }}).then((resp)=>{
                return resp;
            })
            return response
        } catch (error) {
            error.hasError = true;
            return error
        }
    }

    async updateProcedure(updateProcedure){
        try {
            if(!getToken()) {
                throw new Error('Sem token')
            }
            const response = await axios.post(API_URL + 'triagem/updateProcedure', updateProcedure , { headers: { Authorization: `Bearer ${token.token_acess}` }}).then((resp)=>{
                return resp;
            })
            return response
        } catch (error) {
            error.hasError = true;
            return error
        }
    }

    async listsCadTriagem(){
        try {
            if(!getToken()) {
                throw new Error('Sem token')
            }
            const response = await axios.get(API_URL + 'lists/listTriagem', { headers: { Authorization: `Bearer ${token.token_acess}` }}).then((resp)=>{
                return resp.data
            })
            return response
        } catch (error) {
            error.hasError = true;
            return error;
        }
    }

    //------------ Sterilize requests
    async listSterilize(){
        try {
            if(!getToken()) {
                throw new Error('Sem token')
            }
            const response = await axios.get(API_URL + 'sterilize/list', { headers: { Authorization: `Bearer ${token.token_acess}` }}).then((resp)=>{
                return resp.data
            })
            return response
        } catch (error) {
            error.hasError = true;
            return error;
        }
    }

    async createSterilize(sterilize, credential){
        try {
            if(!getToken()) {
                throw new Error('Sem token')
            }
            credential.sterilize = sterilize;
            const response = await axios.post(API_URL + 'sterilize/create', credential, { headers: { Authorization: `Bearer ${token.token_acess}` }}).then((resp)=>{
                return resp.data
            });
            return response
        } catch (error) {
            error.hasError = true;
            return error;
        }
    }

    async returnSterilize(sterilize, credential){
        try {
            if(!getToken()) {
                throw new Error('Sem token')
            }
            credential.sterilize = sterilize;
            const response = await axios.post(API_URL + 'sterilize/returned', credential, { headers: { Authorization: `Bearer ${token.token_acess}` }}).then((resp)=>{
                return resp.data
            });
            return response
        } catch (error) {
            error.hasError = true;
            return error;
        }
    }


    async sendEmail(){
        try {
            if(!getToken()) {
                throw new Error('Sem token')
            }
            const response = await axios.post(API_URL + 'sterilize/sendEmail',{email: 'david.silva@flucianofeijao.com.br'}, { headers: { Authorization: `Bearer ${token.token_acess}` }}).then((resp)=>{
                return resp.data
            });
            return response
        } catch (error) {
            error.hasError = true;
            return error;
        }
    }

    async listItensSterilize(){
        try {
            if(!getToken()) {
                throw new Error('Sem token')
            }
            const response = await axios.get(API_URL + 'lists/listSterilize', { headers: { Authorization: `Bearer ${token.token_acess}` }}).then((resp)=>{
                return resp.data
            })
            return response
        } catch (error) {
            error.hasError = true;
            return error;
        }
    }


    async listItensFromSterilize(data){
        try {
            if(!getToken()) {
                throw new Error('Sem token')
            }
            const response = await axios.post(API_URL + 'sterilize/listItems/', data, { headers: { Authorization: `Bearer ${token.token_acess}` }}).then((resp)=>{
                return resp.data
            })
            return response
        } catch (error) {
            error.hasError = true;
            return error;
        }
    }



    

}

export default new RequestHttp()