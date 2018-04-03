// 给市县排序
var strSort=function(x,y){
  if(x.adcd>y.adcd){
    return 1;
  }else{
    return -1;
  }
}
// 站点余额
var ycsj=new Vue({
  el:"#ycsj",
  data:{
    // 导航栏数据
    titles:[
      {nav:"服务器状态",url:"fuwuqizhuangtai.html"},
      {nav:"站点状态",url:"zhandianzhuangtai.html"},
      {nav:"站点余额",url:"zhandianyue.html"},
      {nav:"异常数据",url:"yichangshuju.html",active:true},
      {nav:"维护日历",url:"weihurili.html"}
    ],
    items:[
      {pic:"../res/shuiweizhan.png",name:"水位突变",station:"",num:""},
      {pic:"../res/celiangzhan.png",name:"水位长期不变",station:"",num:""},
      {pic:"../res/ganhan.png",     name:"雨量长期为0",station:"",num:""},
      {pic:"../res/dayu.png",       name:"雨量冒大数",station:"",num:""},
      {pic:"../res/dianyadi12.png", name:"电压低于12V",station:"",num:""},
      {pic:"../res/dianyadi.png",   name:"电压走低",station:"",num:""},
      {pic:"../res/gps.png",        name:"GPRS数据不全",station:"",num:""},
      {pic:"../res/weixing.png",    name:"卫星数据不全",station:"",num:""},
    ],
    datas:[],
    // 市县信息
    allProvince:[],
    // 异常数据
    yichangColumn:[[],[],[],[],[],[],[],[]],
    url:"/svrapi/alnormal/getAlnormalTotal"
  },
  // 
  mounted(){
    // 异常数据=>基础数据
    // http://hnyw.cloudowr.cn/svrapi/alnormal/getAlnormalTotal
    // 获取网络数据
    this.getAlnormalTotal(); 
  },
  updated(){
    // 页面加载后执行
    window.parent.document.getElementById("rightIframe").style.height=document.body.offsetHeight+20+"px";
    // yichang-column 数据初始化
    var myChartYiChang = echarts.init(document.getElementById("yichang-column"));
    var optionYiChang = {
      tooltip: {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
          data:['水位突变站数','水位长期不变站数','雨量长期为0站数','雨量冒大站数','电压低于12V站数','电压走低站数','GPRS数据不全站数','卫星数据不全站数']
      },
      grid:{
        top:50,
        right:40,
        bottom:30,
        left:40
      },
      xAxis :[
        {
          type : 'category',
          data : this.allProvince
        }
      ],
      yAxis : {
        type : 'value',
        minInterval : 1,
        min: 0,
        name: "异常站数"
      },
      series : [
        {
          name:'水位突变站数',
          type:'bar',
          data:this.yichangColumn[0]
        },
        {
          name:'水位长期不变站数',
          type:'bar',
          data:this.yichangColumn[1]
        },
        {
          name:'雨量长期为0站数',
          type:'bar',
          data:this.yichangColumn[2]
        },
        {
          name:'雨量冒大站数',
          type:'bar',
          data:this.yichangColumn[3]
        },
        {
          name:'电压低于12V站数',
          type:'bar',
          data:this.yichangColumn[4]
        },
        {
          name:'电压走低站数',
          type:'bar',
          data:this.yichangColumn[5]
        },
        {
          name:'GPRS数据不全站数',
          type:'bar',
          data:this.yichangColumn[6]
        },
        {
          name:'卫星数据不全站数',
          type:'bar',
          data:this.yichangColumn[7]
        }
      ]
    };
    myChartYiChang.setOption(optionYiChang);
  },
  methods:{
    getAlnormalTotal:function(){
      this.$http.get(this.url)
      .then((response)=>{
        console.log("异常数据首页数据请求成功!");
        this.datas=response.body.sort(strSort);
        // 增加站点总数
        this.setStationTotal();
        // 设置市县
        this.setAllProvince();
      })
      .catch(function(response){
        console.log("异常数据首页数据请求失败!");
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
    setStationTotal:function(){
      _this=this;
      _this.datas.forEach(function(item, index){
        var total=item["水位突变"].cnt["站"]+item["水位长期不变"].cnt["站"]+item["雨量长期不变"].cnt["站"]+item["雨量冒大数"].cnt["站"]+item["电压低于12"].cnt["站"]+item["电压走低"].cnt["站"]+item["GPRS数据不全"].cnt["站"]+item["卫星数据不全"].cnt["站"];
        Vue.set(item,"total",total);
      })
    },
    // 设定市县
    setAllProvince:function(){
      var _this=this;
      _this.datas.forEach(function(item,index){
        _this.allProvince.push(item.adnm);
        _this.yichangColumn[0].push(item["水位突变"].cnt["站"]);
        _this.yichangColumn[1].push(item["水位长期不变"].cnt["站"]);
        _this.yichangColumn[2].push(item["雨量长期不变"].cnt["站"]);
        _this.yichangColumn[3].push(item["雨量冒大数"].cnt["站"]);
        _this.yichangColumn[4].push(item["电压低于12"].cnt["站"]);
        _this.yichangColumn[5].push(item["电压走低"].cnt["站"]);
        _this.yichangColumn[6].push(item["GPRS数据不全"].cnt["站"]);
        _this.yichangColumn[7].push(item["卫星数据不全"].cnt["站"]);
      })
    },
    
  }
})