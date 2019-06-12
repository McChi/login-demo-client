<template>
    <div class="chartRoot">
        <div id="sexChart" class="sexChart"></div>
        <div id="increaseChart" class="increaseChart"></div>
    </div>
</template>

<script>
import echarts from 'echarts';
import axios from 'axios';

let sexChart;

export default {
    name: 'userstatistic',
    data(){
        return {
            memberRawSexData: [],
            memberRawIncreaseData: []
        }
    },
    computed:{
        sexChartOption(){
            let data = this.memberRawSexData.map(function(item){
                let tempItem = {}
                tempItem.value = item.total
                tempItem.name = item.sex
                if(tempItem.name == '女')
                    tempItem.selected = true;
                return tempItem
            })
            return  {
                title: {
                    text: '会员性别分布',
                    textStyle: {
                        align: 'center',
                        color: '#fff',
                        fontSize: 18,
                    },
                    top: '6%',
                    left: 'center',
                },
                backgroundColor:'#BDB76B',
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                color: ['#47dfae', '#4ac7f5'],
                series: [
                    {
                        name: '会员性别分布',
                        type:'pie',
                        selectedMode: 'single',
                        radius: [0, '70%'], // 这是里和外的半径大小
                        center: ['50%', '55%'],// 这是偏移量
                        label: {
                            normal: {
                                position: 'inner'
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: data
                    }
                ]
            }
        },
        increaseChartOption(){
            let datedata = this.memberRawIncreaseData.map(function(item){
                return item.date;
            })
            let increasedata = this.memberRawIncreaseData.map(function(item){
                return item.increaseNum
            })
            return {
                backgroundColor: '#394056',
                title: {
                    text: '会员新增趋势',
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 28,
                        color: '#F1F1F3'
                    },
                    left: '6%'
                },
                tooltip: {
                    trigger: 'axis', //触发类型。[ default: 'item' ] :数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用;'axis'坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
                    axisPointer: {
                        lineStyle: {
                            color: '#57617B'
                        }
                    }
                },
                // legend: {
                //     icon: 'rect', //设置图例的图形形状，circle为圆，rect为矩形
                //     itemWidth: 14, //图例标记的图形宽度[ default: 25 ] 
                //     itemHeight: 5, //图例标记的图形高度。[ default: 14 ] 
                //     itemGap: 13, //图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。[ default: 10 ] 
                //     data: ['移动', '电信', '联通'],
                //     right: '4%', //图例组件离容器右侧的距离
                //     textStyle: {
                //         fontSize: 12,
                //         color: '#F1F1F3'
                //     }
                // },
                grid: {
                    left: '3%', //grid 组件离容器左侧的距离。
                    right: '4%', //grid 组件离容器右侧的距离。
                    bottom: '3%', //grid 组件离容器下侧的距离。
                    containLabel: true //grid 区域是否包含坐标轴的刻度标签[ default: false ] 
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样
                    axisLine: {
                        lineStyle: {
                            color: '#F1F1F3' //坐标轴线线的颜色。
                        }
                    },
                    data: datedata
                }],
                yAxis: [{
                    type: 'value', //坐标轴类型。'value' 数值轴，适用于连续数据;'category' 类目轴，适用于离散的类目数据，为该类型时必须通过 data 设置类目数据;'time' 时间轴;'log' 对数轴.
                    // name: '人', //坐标轴名称。
                    axisTick: {
                        show: false //是否显示坐标轴刻度
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#F1F1F3' //坐标轴线线的颜色
                        }
                    },
                    axisLabel: {
                        margin: 10, //刻度标签与轴线之间的距离
                        textStyle: {
                            fontSize: 14 //文字的字体大小
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#57617B' //分隔线颜色设置
                        }
                    }
                }],
                series: [ {
                    name: '新增数量',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            width: 1
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(0, 136, 212, 0.3)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(0, 136, 212, 0)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 10
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'rgb(0,136,212)',
                            borderColor: 'rgba(0,136,212,0.2)',
                            borderWidth: 12

                        }
                    },
                    data: increasedata
                    }
                ]
            };;
        }
    },
    methods:{
        loadMemberSexData(){
            let sexChart = echarts.init(document.getElementById('sexChart'));
            sexChart.showLoading();
            axios.get('/api/memberstats/sex')
            .then(response => {
                return response.data;
            })
            .then(result => {
                if(result.status == 1){
                    this.memberRawSexData = result.sexData;
                }
            })
            .then(() => {
                sexChart.setOption(this.sexChartOption);  
            })
            .catch(err => {
                console.log(err)
                console.log("程序出现错误，请检查错误")
            })
            .finally(() => {
                sexChart.hideLoading();
            });
        },
        loadMemberIncreaseData(){
            let increaseChart = echarts.init(document.getElementById('increaseChart'));
            increaseChart.showLoading();
            axios.get('/api/memberstats/increasedata')
            .then(response => {
                return response.data;
            })
            .then(result => {
                if(result.status == 1){
                    this.memberRawIncreaseData = result.increaseData;
                    increaseChart.setOption(this.increaseChartOption);
                }
            })
            .catch(err => {
                console.log(err)
                console.log("程序出现错误，请检查错误")
            })
            .finally(() => {
                increaseChart.hideLoading();
            });
            
        }
    },
    created(){
        // this.loadMemberSexData()
    },
    mounted(){
        this.loadMemberSexData()
        this.loadMemberIncreaseData()
    }
}
</script>

<style scoped>
    .chartRoot{
        height: 100%;
        display:flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }

    .sexChart{
        width:100%; 
        height: 45%;
    }

    .increaseChart{
        width:100%; 
        height: 45%;
    }


</style>

