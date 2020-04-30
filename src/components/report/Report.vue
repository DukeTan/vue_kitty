<template>
  <div>
    <!-- bread crumb Nav area -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Data Statistics</el-breadcrumb-item>
      <el-breadcrumb-item>Data Report</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Card view area -->
    <el-card>
      <!-- prepare a DOM for echarts -->
      <div id="main" style="width:800px height:400px"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
import _ from 'lodash'

export default {
  data() {
    return {
      //combine options data 
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    };
  },
  created() {},
  //DOM prepared done then excute mounted
  async mounted() {
    //initialize echarts
    var myChart = echarts.init(document.getElementById("main"));

    const { data: res } = await this.$http.get("reports/type/1");
    if (res.meta.status !== 200) {
      return this.$message.error("get data failed");
    }

    //prepare data and setup
    const result = _.merge(res.data, this.options)
    //show Data
    myChart.setOption(result);
  },
  methods: {}
};
</script>

<style lang="less" scoped>
</style>