// 给市县排序
var strSort=function(x,y){
  if(x.adcd>y.adcd){
    return 1;
  }else{
    return -1;
  }
}
// 站点余额
var zdye=new Vue({
  el:"#zdye",
  data:{
    // 导航栏数据
    titles:[
      {nav:"服务器状态",url:"fuwuqizhuangtai.html"},
      {nav:"站点状态",url:"zhandianzhuangtai.html"},
      {nav:"站点余额",url:"zhandianyue.html",active:true},
      {nav:"异常数据",url:"yichangshuju.html"},
      {nav:"维护日历",url:"weihurili.html"}
    ],
    allStYe:[],
    // 饼图按钮
    siteBtn:[
      {name:"水位", active:true},
      {name:"图像", active:false},
      {name:"雨量", active:false},
      {name:"预警", active:false},
    ],
    // 饼图水位数据
    siteDataSW:[],
    // 饼图图像数据
    siteDataTX:[],
    // 饼图雨量数据
    siteDataYL:[],
    // 饼图预警数据
    siteDataYJ:[],
    allProvince:[],
    yueColumn:[[],[],[],[]],
    url:"/svrapi/stmgr/getAllStYe"
  },
  // 
  mounted(){
    // 获取网络数据
    this.getAllServerStatus();
  },
  updated(){
    // 页面加载后执行
    window.parent.document.getElementById("rightIframe").style.height=document.body.offsetHeight+20+"px";
  },
  methods:{
    getAllServerStatus:function(){
      this.$http.get(this.url)
      .then((response)=>{
        this.allStYe=response.body.sort(strSort);
        // 增加总数
        this.setAllStYeTotal();
        // 设置饼图的数据
        this.setPieSiteDatas();
        // 根据数据绘出饼图
        this.drawSitePie(this.siteDataSW);
        // 设置柱状图数据
        this.setColumnDates();
        // 
        this.drawColumnPie();
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
    // 增加总数
    setAllStYeTotal:function(){
      var _this=this;
      _this.allStYe.forEach(function(item, index){
        var totalS=item["水位站"]["超50"]+item["水位站"]["超20"]+item["水位站"]["不足20"]+item["水位站"]["欠20"]+item["水位站"]["欠超20"];
        Vue.set(item["水位站"],"total",totalS);

        var totalT=item["图像站"]["超50"]+item["图像站"]["超20"]+item["图像站"]["不足20"]+item["图像站"]["欠20"]+item["图像站"]["欠超20"];
        Vue.set(item["图像站"],"total",totalT);

        var totalY=item["雨量站"]["超50"]+item["雨量站"]["超20"]+item["雨量站"]["不足20"]+item["雨量站"]["欠20"]+item["雨量站"]["欠超20"];
        Vue.set(item["雨量站"],"total",totalY);

        var totalJ=item["预警站"]["超50"]+item["预警站"]["超20"]+item["预警站"]["不足20"]+item["预警站"]["欠20"]+item["预警站"]["欠超20"];
        Vue.set(item["预警站"],"total",totalJ);
      })
    },
    // 改变站点的显示
    setPieSiteDatas:function(){
      var sw=[{value:0, name:'欠费数'},{value:0, name:'缴费数'}];
      var tx=[{value:0, name:'欠费数'},{value:0, name:'缴费数'}];
      var yl=[{value:0, name:'欠费数'},{value:0, name:'缴费数'}];
      var yj=[{value:0, name:'欠费数'},{value:0, name:'缴费数'}];
      var _this=this;
      _this.allStYe.forEach(function(item, index){
        sw[0].value+=(item["水位站"]["欠20"]+item["水位站"]["欠超20"]);
        sw[1].value+=(item["水位站"]["超50"]+item["水位站"]["超20"]+item["水位站"]["不足20"]);
        tx[0].value+=(item["图像站"]["欠20"]+item["图像站"]["欠超20"]);
        tx[1].value+=(item["图像站"]["超50"]+item["图像站"]["超20"]+item["图像站"]["不足20"]);
        yl[0].value+=(item["雨量站"]["欠20"]+item["雨量站"]["欠超20"]);
        yl[1].value+=(item["雨量站"]["超50"]+item["雨量站"]["超20"]+item["雨量站"]["不足20"]);
        yj[0].value+=(item["预警站"]["欠20"]+item["水位站"]["欠超20"]);
        yj[1].value+=(item["预警站"]["超50"]+item["预警站"]["超20"]+item["预警站"]["不足20"]);
      });
      _this.siteDataSW=sw;
      _this.siteDataTX=tx;
      _this.siteDataYL=yl;
      _this.siteDataYJ=yj;
    },
    // 点击后改变饼图信息
    changeSiteData:function(index){
      var _this=this;
      switch(index){
        case 0:
          _this.drawSitePie(_this.siteDataSW);
          _this.siteBtn.forEach(function(item){item.active=false})
          _this.siteBtn[0].active=true;
          break;
        case 1:
          _this.drawSitePie(_this.siteDataTX);
          _this.siteBtn.forEach(function(item){item.active=false})
          _this.siteBtn[1].active=true;
          break;
        case 2:
          _this.drawSitePie(_this.siteDataYL);
          _this.siteBtn.forEach(function(item){item.active=false})
          _this.siteBtn[2].active=true;
          break;
        case 3:
          _this.drawSitePie(_this.siteDataYJ);  
          _this.siteBtn.forEach(function(item){item.active=false})
          _this.siteBtn[3].active=true;
          break;
      }
    },
    // 绘制饼图
    drawSitePie:function(data){
      // 生成echarts图像  余额站点
      var yueSite=echarts.init(document.getElementById("yue-site"));
      yueSite.setOption({
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
            data:data,
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
          '#d60015',
          '#7dccb1'
        ]
      })
    },
    // 设置柱状图数据
    setColumnDates:function(){
      var _this=this;
      _this.allStYe.forEach(function(item, index){
        _this.allProvince.push(item.adnm);
        _this.yueColumn[0].push(item["水位站"]["欠20"]+item["水位站"]["欠超20"]);
        _this.yueColumn[1].push(item["图像站"]["欠20"]+item["图像站"]["欠超20"]);
        _this.yueColumn[2].push(item["雨量站"]["欠20"]+item["雨量站"]["欠超20"]);
        _this.yueColumn[3].push(item["预警站"]["欠20"]+item["预警站"]["欠超20"]);
      })
    },
    // 绘制柱状图
    drawColumnPie:function(){
      var yueColumn=echarts.init(document.getElementById("yue-column"));
      yueColumn.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
            data:['水位站','图像站','雨量站','预警站']
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
            data : this.allProvince,
            axisLabel: {
              interval: 0,
              rotate:-45
            },
          }
        ],
        yAxis : {
          type : 'value',
          minInterval : 1,
          min: 0,
          name: "次数"
        },
        series : [
          {
            name:'水位站',
            type:'bar',
            data:this.yueColumn[0]
          },
          {
            name:'图像站',
            type:'bar',
            data:this.yueColumn[1]
          },
          {
            name:'雨量站',
            type:'bar',
            data:this.yueColumn[2]
          },
          {
            name:'预警站',
            type:'bar',
            data:this.yueColumn[3]
          }
        ]
      })
    }
  },

})