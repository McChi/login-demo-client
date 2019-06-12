import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import echarts from 'echarts'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        memberData: [],
        totalMemberCount: 0,
        isLoadingData: false,
        editDialogVis: false,
        addDialogVis: false
    },
    getters: {
    },
    mutations: {
        updateMemberData(state, payload){
            state.memberData = payload.memeberdata;
            state.totalMemberCount = payload.count;
        },
        changeLoadingStatus(state){
            state.isLoadingData = !state.isLoadingData;
        },
        changeEditMemberDialogVis(state){
            state.editDialogVis = !state.editDialogVis;
        },
        changeAddMemberDialogVis(state){
            state.addDialogVis = !state.addDialogVis;
        }
    },
    actions: {
        obtainMemberData(context, argus){
            // 异步获取会员数据
            context.commit('changeLoadingStatus')
            axios.get('/api/getMemberData', {
                params: {
                    pageNumber: argus.pageNumber
                }
            })
            .then(response => {
                return response.data
            })
            .then(result => {
                if(result.status == 1){
                    // 刷新数据
                    context.commit('updateMemberData',{
                            memeberdata: result.memeberdata,
                            count: result.count
                        }
                    )
                }
            })
            .catch(err => {
                console.log(err)
                console.log("程序出现错误，请检查代码")
            })
            .finally(() => 
                // 无论是否请求成功都需要取消加载状态
                new Promise(resovle => {
                    setTimeout(function(){
                        context.commit('changeLoadingStatus')
                    }, 300)
                }) 
            );
        },

        changeEditMemberDialogVis({ commit }){
            commit('changeEditMemberDialogVis');
        },

        changeAddMemberDialogVis({ commit }){
            commit('changeAddMemberDialogVis');
        },

        loadMemberSexData({ commit }){
            axios.get('/api/memberstats/sex')
            .then(response => {
                return response.data;
            })
            .then(result => {
                if(result.status == 1){
                    commit('updateMemberSexRawData', {
                        sexData: result.sexData
                    });
                }
            })
            // .then(() => {
            //     // 刷新UI
            //     let sexChart = echarts.init(document.getElementById('sexChart'));
            //     sexChart.setOption(this.state.sexChartOption);
            // })
            .catch(err => {
                console.log(err)
                console.log("程序出现错误，请检查错误")
            });

            return Promise.resolve();
        }

    }
   
  });