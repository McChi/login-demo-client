<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadscrumd-style">
            <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>会员管理</el-breadcrumb-item>
            <el-button @click="handleAddMember" type="primary" class="addbtn-style">添加 <i class="el-icon-plus"></i></el-button>
        </el-breadcrumb>

        <el-table
        v-loading="isLoadingData"
        :stripe="true"
        :data="memberData"
        style="width: 100%">
            <el-table-column
                prop="username"
                label="用户名"
                width="120px">
            </el-table-column>
            <el-table-column
                prop="sex"
                label="性别"
                width="80px">
            </el-table-column>
            <el-table-column
                prop="password"
                label="密码">
            </el-table-column>
            <el-table-column
                prop="birthday"
                label="出生日期">
            </el-table-column>
             <el-table-column
                prop="address"
                label="住址">
            </el-table-column>
             <el-table-column
                prop="telephone"
                label="电话">
            </el-table-column>
             <el-table-column
                prop="certificatetype"
                label="证件类型">
            </el-table-column>
             <el-table-column
                prop="certificatenumber"
                label="证件号码">
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" 
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button slot="reference" 
                        @click="openConfirm(scope.$index, scope.row)" type="danger" size="mini">删除</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <el-pagination
            :page-size="10"
            :pager-count="7"
            layout="prev, pager, next"
            :total="totalMemberCount"
            class="pagination"
            @current-change="handlePageChange"
            >
        </el-pagination>

        <!-- 下面定义的是弹出的对话框，是不是因为我将它内嵌在子组件里面导致无法出现在屏幕前面 -->
        <el-dialog :visible.sync="editDialogVis" :close-on-click-modal="false"
             :close-on-press-escape="false" :show-close="false">
            <PopupWindow :key="currentMemberData._id" actionType="edit" :currentPage="currentPage"
            :memberData="currentMemberData" :isSecretDisable="true"></PopupWindow>
        </el-dialog>

        <el-dialog :visible.sync="addDialogVis" :close-on-click-modal="false"
             :close-on-press-escape="false"  :show-close="false">
            <PopupWindow :key="currentMemberData._id" actionType="add" :currentPage="currentPage"
            :memberData="currentMemberData" :isSecretDisable="false"></PopupWindow>
        </el-dialog>
    </div>    
</template>

<script>
import {mapState} from 'vuex'
import PopupWindow from './PopupWindow'
import axios from 'axios'

export default {
    name: 'manage',
    created(){
        //  获取会员数据显示
        const argu = { pageNumber: 1 };
        this.grabMemeberData(argu);
    },
    components:{
        PopupWindow
    },
    methods:{
        // 更新会员数据
        grabMemeberData(argus){
            this.$store.dispatch('obtainMemberData', argus);
        },
        handlePageChange(index){
            // 默认从1开始
            // console.log("当前页码:" + index)
            this.grabMemeberData({
                pageNumber: index
            });
            this.currentPage = index;
        },
        openConfirm(index, row){
            this.$confirm('确认要删除这条记录吗?', '警告', {
                cancelButtonClass: 'btn-custom-cancel',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.post('/api/deleteMember', row)
                .then(response => {
                    if(response.data.status == 1){
                        this.openMessage('success', '删除成功')
                        this.grabMemeberData({
                            pageNumber: this.currentPage
                        })
                    }else {
                        this.openMessage('error', '删除失败')
                    }
                });
            })
            .catch((err) => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });          
            });

            // console.log(index, row)
            
        },
        handleEdit(index, row){
            console.log(index, row)
            this.currentMemberData = this.clone(row)
            this.$store.dispatch('changeEditMemberDialogVis');
        },
        handleAddMember(){
            this.currentMemberData = {};
            this.$store.dispatch('changeAddMemberDialogVis');
        },
        // 处理编辑框消失
        handleEditClose(done){
           done();
        },


        clone(obj){
            let temp = null;
            if(obj instanceof Array){
                temp = obj.concat();
            }else if(obj instanceof Function){
                //函数是共享的是无所谓的，js也没有什么办法可以在定义后再修改函数内容
                temp = obj;
            }else{
                temp = new Object();
                for(let item in obj){
                    let val = obj[item];
                    temp[item] = typeof val == 'object'?clone(val):val; //这里也没有判断是否为函数，因为对于函数，我们将它和一般值一样处理
                }
            }
            return temp;
        },

        openMessage(typ,msg){
            this.$message({
            showClose: true,
            message: msg,
            center: true,
            type: typ
            });
        }
        
        
    },
    data(){
        return {
            currentMemberData: {},
            currentPage: 1
        }
    },
    computed:mapState({
            memberData(state) {
                return state.memberData;
            },

            totalMemberCount(state){
                return state.totalMemberCount;
            },

            isLoadingData(state){
                return state.isLoadingData;
            },

            editDialogVis(state){
                return state.editDialogVis;
            },

            addDialogVis(state){
                return state.addDialogVis;
            }
    })
    
}
</script>

<style scoped>
    .breadscrumd-style{
        margin-bottom: 18px;
        padding: 12px;
        line-height: 40px;
    }

    .pagination{
        text-align: center;
        padding: 12px;
        margin: 6px;
    }

    .addbtn-style{
        float: right;    
    }

</style>
