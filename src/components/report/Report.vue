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
      <div id="main" style="width:800px height:600px"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  data() {
    return {};
  },
  created() {},
  //DOM prepared done then excute mounted
  mounted() {
    //initialize echarts
    var myChart = echarts.init(document.getElementById("main"));
    //prepare data and setup
    var option = {
      title: {
        text: "Echarts 数据统计"
      },
      tooltip: {},
      legend: {
        data: ["用户"]
      },
      xAxis: {
        data: ["Android", "IOS", "PC", "Ohter"]
      },
      yAxis: {},
      series: [
        {
          name: "访问量",
          type: "line",
          data: [500, 200, 360, 100]
        }
      ]
    };
    //show Data
    myChart.setOption(option)
  },
  methods: {}
};
</script>

<style lang="less" scoped>
</style>