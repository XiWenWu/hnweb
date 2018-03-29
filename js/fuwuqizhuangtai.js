// 给市县排序
var strSort=function(x,y){
  if(x.adcd>y.adcd){
    return 1;
  }else{
    return -1;
  }

}
var leftNav=new Vue({
  el:"#topNav",
  data:{
    titles:[
    {nav:"服务器状态",url:"fuwuqizhuangtai.html",active:true},
      {nav:"站点状态",url:"zhandianzhuangtai.html"},
      {nav:"站点余额",url:"zhandianyue.html"},
      {nav:"异常数据",url:"yichangshuju.html"},
      {nav:"维护日历",url:"weihurili.html"}
    ],
    allProvince:[],
    url:"/svrapi/getAllSvrStatus"
  },
  // 
  mounted(){
    // 获取网络数据
    this.getAllServerStatus()
    // 省服务器在线饼图
    var shenMap=echarts.init(document.getElementById("shen-map"));
    shenMap.setOption({
      title: {
        text: '省山洪服务器状态',
        left: "10%",
        textStyle:{
          fontSize:14
        }
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a} {b}<br/> {c} ({d}%)"
      },
      series : [
        {
          name: '服务器',
          type: 'pie',
          radius : '60%',
          center: ['50%', '50%'],
          data:[
            {value:10, name:'正常'},
            {value:4, name:'异常'},
            {value:1, name:'闲置'}
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{b}\n{c}({d}%)",
              textStyle: {
                  color: '#ffffff',
              }
            }
          }
        }
      ],
      color: [
        '#7dccb1',
        '#d60015',
        '#9f9f9f'
      ]
  });
    // 市县服务器在线饼图
    var shiMap=echarts.init(document.getElementById("shi-map"));
    shiMap.setOption({
      title: {
        text: '市县山洪服务器状态',
        left: "10%",
        textStyle:{
          fontSize:14
        }
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a} {b}<br/> {c} ({d}%)"
      },
      series : [
        {
          name: '服务器',
          type: 'pie',
          radius : '60%',
          center: ['50%', '50%'],
          data:[
            {value:10, name:'正常'},
            {value:4, name:'异常'},
            {value:1, name:'闲置'}
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            normal: {
              show: true,
              position: "inside",
              formatter: "{b}\n{c}({d}%)",
              textStyle: {
                  color: '#ffffff',
              }
            }
          }
        }
      ],
      color: [
        '#7dccb1',
        '#d60015',
        '#9f9f9f'
      ]
  });
    // 省市县服务器在柱状图
    var barMap=echarts.init(document.getElementById("bar-map"));
    barMap.setOption({
      title : {
        text: '省市县山洪服务器状态',
        left: "10%",
        textStyle:{
          fontSize:14
        }
      },
      tooltip : {
          trigger: 'axis'
      },
      legend: {
          data:['正常','异常', '暂无数据']
      },
      xAxis : [
          {
              type : 'category',
              axisLabel: {
                  interval: 0,
                  rotate:-45
              },
              data:["地名","地名","地名","地名","地名","地名","地名","地名","地名","地名","地名","地名","地名","地名","地名"]
          }
      ],
      yAxis : [
          {
              type : 'value',
              interval: 1,
              name: "服务器数量"
          }
      ],
      series : [
          {
              name:'正常',
              type:'bar',
              barCategoryGap:'80%',
              stack: '服务器',
              data:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
          },
          {
              name:'异常',
              type:'bar',
              barCategoryGap:'80%',
              stack: '服务器',
              data:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
          },
          {
              name:'暂无数据',
              type:'bar',
              barCategoryGap:'60%',
              stack: '服务器',
              data:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
          }
      ],
      color: ['#7dccb1',
              '#d60015',
              '#9f9f9f']
    });
  },
  updated(){
    // 页面加载后执行
    window.parent.document.getElementById("rightIframe").style.height=document.body.offsetHeight+20+"px";
  },
  methods:{
    // 获取网络数据
    getAllServerStatus:function(){
      this.$http.get(this.url)
      .then((response)=>{
        this.allProvince=response.body.sort(strSort);
        // 隔行添加表格背景的class
        this.setTableBGActive()
        // 添加服务器按钮的背景颜色
        this.setTableButtonBGActive()
      })
      .catch(function(response){
        console.log(response)
      })
    },
    // 导航点击添加class
    navSelectStyle:function (item, index) {
      var _this=this;
      _this.$nextTick(function () {
        _this.titles.forEach(function (item) {
          Vue.set(item,'active',false);
        });
        Vue.set(item,'active',true);
      });
      // 页面跳转
      window.parent.document.getElementById("rightIframe").src="page/"+item.url;
    },
    // 隔行添加表格背景的class
    setTableBGActive:function(){
      var _this=this;
      _this.allProvince.forEach(function(item, index){
        if(index%2==0){
          Vue.set(item,'navActive',false);
        }else{
          Vue.set(item,'navActive',true);
        }
      })
    },
    // 添加服务器按钮的背景颜色
    setTableButtonBGActive:function(){
      var _this=this;
      _this.allProvince.forEach(function(item, index){
        item.svr.forEach(function(v,k){
          if(v.status=="异常"){
            Vue.set(v,'tableBtnActive',false);
          } else if(v.status=="正常"){
            Vue.set(v,'tableBtnActive',true);
          } else {
            Vue.set(v,'tableBtnActive',null);
          }
        })
      })
    }
  }

})