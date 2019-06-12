<template>
 <!-- :model="memberData"  -->
 <!-- ref的作用是在验证表单的时候，指定对应prop属性引用的对象 -->
    <el-form label-width="80px" :rules="rules" ref="memberData" :model="memberData" >
        <el-form-item label="会员姓名" prop="username">
            <el-input v-model="memberData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input :disabled="isSecretDisable" :type="showType" v-model="memberData.password"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
            <el-radio v-model="memberData.sex" label="男">男</el-radio>
            <el-radio v-model="memberData.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
            <el-date-picker type="date" placeholder="选择日期" v-model="memberData.birthday" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="电话号码" prop="telephone">
            <el-input v-model="memberData.telephone"></el-input>
        </el-form-item>
        <el-form-item label="证件类型" prop="certificatetype">
            <el-radio-group v-model="memberData.certificatetype">
                <el-radio label="身份证">身份证</el-radio>
                <el-radio label="军人证">军人证</el-radio>
                <el-radio label="驾驶证">驾驶证</el-radio>
                <el-radio label="其它">其它</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="证件号码" prop="certificatenumber">
            <el-input v-model="memberData.certificatenumber"></el-input>
        </el-form-item>
        <el-form-item label="地址">
            <el-input type="textarea" :rows="3" v-model="memberData.address"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="openConfirm(actionType)" :loading="isSaving">保 存</el-button>
            <el-button @click="resetForm()">取 消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import axios from 'axios'
import { setTimeout } from 'timers';

export default {
    name: "popupwindow",
    props: {
        memberData: Object,
        actionType: String,
        currentPage: Number,
        isSecretDisable: Boolean
    },
    data(){
        let validateUsername = (rule, value, callback) => {
            if(this.actionType === 'edit'){
                return callback();
            }
            // 验证是否存在同样的用户名
            setTimeout(() => {
                axios.get('/api/checkUsername', {
                    params: {
                        username: value
                    }
                })
                .then(response => {
                    return response.data
                })
                .then(result => {
                    if (result.status == 0){
                        callback(new Error("该会员名已存在"));
                    } else {
                        callback();
                    }
                })
                .catch(err => {
                    console.log(err)
                    console.log("程序出现错误，请检查程序");
                    callback(new Error("系统用户名校验出现问题"))
                });
            }, 1000)
            
        };
        return {
            // 表单验证规则
            rules:{
                username: [
                    { required: true, message: "请输入会员姓名", trigger: 'blur' },
                    { validator: validateUsername, trigger: 'blur'}
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
                ],
                sex: [
                    { required: true, message: "请输入会员性别", trigger: 'blur' }
                ],
                birthday: [
                    { type: 'date', required: true, message: '请选择会员生日', trigger: 'blur' }
                ],
                telephone: [
                    { required: true, message: "请输入会员电话号码", trigger: 'blur' }
                ]
            
            },
            isSaving: false
        }
    },
    computed: {
        showType(){
            return this.isSecretDisable? 'password' : 'text'
        }
        
    },
    methods:{
        resetForm(formName){
            // this.$refs[formName].resetFields();
            if(this.actionType == 'edit')
                this.$store.dispatch('changeEditMemberDialogVis');
            else if(this.actionType == 'add'){
                this.$store.dispatch('changeAddMemberDialogVis');
                this.$refs["memberData"].resetFields();
            }
        },

        openConfirm(action) {
            let type = '';
            let msg = '';
            if(action == 'add'){
                type = 'info';
                msg = '确认要增加这条信息吗?'
            }else if(action == 'edit'){
                type = 'info';
                msg = '确认要修改这条记录吗?'
            }
            this.$confirm(msg, '提示', {
                cancelButtonClass: 'btn-custom-cancel',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: type
            })
            .then(() => {
                let validateResult;
                // 应该将验证都放在这里而不是多个then,因为这里使用的是回调
                // 由于煞笔element的日期验证有问题，不会检查类型，所以如果是date验证需要把
                // 其转化为日期对象
                // 需要注意的是，我们存入数据库的时间都是格尼尼治时间，取出来的时候是按照我们的
                // 地方时区拿出来的，这是mongo处理的
                // 包括我们使用element组件传递过去的也是格尼尼治时间
                if(this.actionType === 'edit' && typeof this.memberData.birthday === "string"){
                    this.memberData.birthday = new Date(this.memberData.birthday)
                }
                this.$refs["memberData"].validate((valid) => {
                        if (valid) {
                            validateResult = true;
                        } else {
                            validateResult = false;
                        }
                        if (validateResult){
                            if(action == 'add'){
                                // 调用add接口
                                this.submitAddForm();
                            } else if(action == 'edit'){
                                // 调用edit接口
                                this.submitEditForm();
                            }
                        } else {
                            this.openMessage('error', "请验证表格后再提交");
                        }
                });
            })
            .catch((err) => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });          
            });
        },

        submitAddForm(){
            this.isSaving = true;
            axios.post('/api/addMemberData', this.memberData)
            .then(response => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        this.isSaving = false;
                        resolve(response.data);
                    }, 300)
                })
            })
            .then(result => {
                 if(result.status == 1){
                    // 提示修改成功
                    this.openMessage('success', "添加成功");
                    this.$store.dispatch('changeAddMemberDialogVis');
                    this.$store.dispatch('obtainMemberData', { pageNumber: this.currentPage });   
                }else {
                    // 提示修改失败
                    this.openMessage('error', "添加失败");
                }
            })
            .catch(err => {
                console.log(err)
                console.log("程序出现错误，请检查程序")
            });
        },
        submitEditForm(){
            // 调用API更新数据，
            this.isSaving = true;
            axios.post('/api/updateMemberData', this.memberData)
            .then(response => {
                return response.data
            })
            .then(result => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        this.isSaving = false;
                        resolve(result);
                    }, 300)
                })
            })
            .then(result => {
                if(result.status == 1){
                    // 提示修改成功
                    this.openMessage('success', "修改成功");
                    this.$store.dispatch('changeEditMemberDialogVis');
                    this.$store.dispatch('obtainMemberData', { pageNumber: this.currentPage });   
                }else {
                    // 提示修改失败
                    this.openMessage('error', "修改失败");
                }
            })
            .catch(err => {
                console.log(err)
                console.log("程序出现错误，请检查程序")
            });

        },

        openMessage(typ,msg){
            this.$message({
            showClose: true,
            message: msg,
            center: true,
            type: typ
            });
        }
    }
}
</script>

<style>
/* 设置确认消息框在左 */
.btn-custom-cancel {
  float: right;
  margin-left: 10px;
}

</style>

