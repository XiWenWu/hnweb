// 给市县排序
var strSort=function(x,y){
  if(x.adcd>y.adcd){
    return 1;
  }else{
    return -1;
  }
}
var zdzt=new Vue({
  el:"#zdzt",
  data:{
    titles:[
      {nav:"服务器状态",url:"fuwuqizhuangtai.html"},
      {nav:"站点状态",url:"zhandianzhuangtai.html",active:true},
      {nav:"站点余额",url:"zhandianyue.html"},
      {nav:"异常数据",url:"yichangshuju.html"},
      {nav:"维护日历",url:"weihurili.html"}
    ],
    allStCntSQL:[],
    shenData:[
      {cnt:0,on:0,rate:0},
      {cnt:0,on:0,rate:0},
      {cnt:0,on:0,rate:0},
      {cnt:0,on:0,rate:0},
      {cnt:0,on:0,rate:0}
    ],
    // 饼图按钮
    siteBtn:[
      {name:"水位", active:true},
      {name:"图像", active:false},
      {name:"雨量", active:false},
      {name:"预警", active:false}
    ],
    // 市县
    allProvince:[],
    // 雨量站
    DataYL:[],
    // 水位
    DataSW:[],
    // 图像
    DataTX:[],
    // 广播站
    DataGB:[],
    // 
    typeColumn:[[],[],[],[]],
    // 站点状态数据
    url:"/svrapi/getAllStCntSQL",

  },
  // 
  mounted(){
    // 获取网络数据
    this.getAllServerStatus();
  },
  updated(){
    this.drawTypePie(this.DataYL);
    this.drawTypeColumn();
    // 页面加载后执行
    window.parent.document.getElementById("rightIframe").style.height=document.body.offsetHeight+20+"px";
  },
  methods:{
    // 获取网络数据
    getAllServerStatus:function(){
      var _this=this;
      this.$http.get(this.url)
      .then((response)=>{
        console.log("站点状态 获取网络数据 成功")
        _this.allStCntSQL=response.body.sort(strSort);
        // 计算省的站点总数
        _this.setShenData();
        // 增加在线率 总数的字段
        _this.setAllStCntSQL();
        // 设置饼图的数据
        _this.setPieTypeDatas();
        // 设置柱状图的数据
        _this.setTypeColumnDatas();
      })
      .catch(function(response){
        console.log("站点状态 获取网络数据 失败")
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
    // 页面跳转
    jumpHtmlForAdcd:function(data){
      document.location.href="dangqianzhuangtai.html?adcd="+data.adcd;
    },
    // 隔行添加表格背景的class
    setAllStCntSQL:function(){
      var _this=this;
      _this.allStCntSQL.forEach(function(item, index){
        var rateY=Math.ceil((item["雨量"].on/item["雨量"].cnt)*100)
        Vue.set(item["雨量"],"rate",rateY?rateY:0);

        var rateS=Math.ceil((item["水位"].on/item["水位"].cnt)*100)
        Vue.set(item["水位"],"rate",rateS?rateS:0);

        var rateT=Math.ceil((item["图像"].on/item["图像"].cnt)*100)
        Vue.set(item["图像"],"rate",rateT?rateT:0);

        var rateG=Math.ceil((item["广播"].on/item["广播"].cnt)*100)
        Vue.set(item["广播"],"rate",rateG?rateG:0);

        var allCnt=item["雨量"].cnt+item["水位"].cnt+item["图像"].cnt+item["广播"].cnt;
        var allOn=item["雨量"].on+item["水位"].on+item["图像"].on+item["广播"].on;
        var allRate=Math.ceil((allOn/allCnt)*100);
        Vue.set(item,"allCnt",allCnt);
        Vue.set(item,"allOn",allOn);
        Vue.set(item,"allRate",allRate);
      })
    },
    // 点击后改变饼图信息
    changeTpyeData:function(index){
      var _this=this;
      switch(index){
        case 0:
          _this.drawTypePie(_this.DataYL);
          _this.siteBtn.forEach(function(item){item.active=false})
          _this.siteBtn[0].active=true;
          break;
        case 1:
          _this.drawTypePie(_this.DataSW);
          _this.siteBtn.forEach(function(item){item.active=false})
          _this.siteBtn[1].active=true;
          break;
        case 2:
          _this.drawTypePie(_this.DataTX);
          _this.siteBtn.forEach(function(item){item.active=false})
          _this.siteBtn[2].active=true;
          break;
        case 3:
          _this.drawTypePie(_this.DataGB);  
          _this.siteBtn.forEach(function(item){item.active=false})
          _this.siteBtn[3].active=true;
          break;
      }
    },
    // 设置饼图的数据
    setPieTypeDatas:function(){
      var _this=this;
      var yl=[{value:0, name:'在线数'},{value:0, name:'离线数'}];
      var sw=[{value:0, name:'在线数'},{value:0, name:'离线数'}];
      var tx=[{value:0, name:'在线数'},{value:0, name:'离线数'}];
      var gb=[{value:0, name:'在线数'},{value:0, name:'离线数'}];
      _this.allStCntSQL.forEach(function(item, index){
        yl[0].value+=item["雨量"].on;
        yl[1].value+=(item["雨量"].cnt-item["雨量"].on);
        sw[0].value+=item["水位"].on;
        sw[1].value+=(item["水位"].cnt-item["水位"].on);
        tx[0].value+=item["图像"].on;
        tx[1].value+=(item["图像"].cnt-item["图像"].on);
        gb[0].value+=item["广播"].on;
        gb[1].value+=(item["广播"].cnt-item["广播"].on);
      })
      _this.DataYL=yl;
      _this.DataSW=sw;
      _this.DataTX=tx;
      _this.DataGB=gb;
    },
    // 绘制饼图
    drawTypePie:function(data){
      var typePie=echarts.init(document.getElementById("type-pie"));
      typePie.setOption({
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
          '#7dccb1',
          '#d60015'
        ]
      })
    },
    // 设置柱状图数据
    setTypeColumnDatas:function(){
      var _this=this;
      _this.allStCntSQL.forEach(function(item, index){
        _this.allProvince.push(item.adnm);
        _this.typeColumn[0].push(Math.ceil((item["雨量"].on/item["雨量"].cnt)*100));
        _this.typeColumn[1].push(Math.ceil((item["水位"].on/item["水位"].cnt)*100));
        _this.typeColumn[2].push(Math.ceil((item["图像"].on/item["图像"].cnt)*100));
        _this.typeColumn[3].push(Math.ceil((item["广播"].on/item["广播"].cnt)*100));
      })
    },
    // 绘制柱状图
    drawTypeColumn:function(){
      var typeBar=echarts.init(document.getElementById("type-bar"));
      typeBar.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
            data:['雨量站','水位站','图像站','广播站']
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
              rotate:-30
            },
          }
        ],
        yAxis : [
          {
            type : 'value',
            axisLabel: {
              show: true,
              interval: "auto",
              formatter:"{value} %"
            },
            show: true,
            name:"在线率"
          }
        ],
        series : [
          {
            name:'雨量站',
            type:'bar',
            data:this.typeColumn[0]
          },
          {
            name:'水位站',
            type:'bar',
            data:this.typeColumn[1]
          },
          {
            name:'图像站',
            type:'bar',
            data:this.typeColumn[2]
          },
          {
            name:'广播站',
            type:'bar',
            data:this.typeColumn[3]
          }
        ]
      })
    },
    setShenData:function(){
      var _this=this;
      var data=[
        {cnt:0,on:0,rate:0},
        {cnt:0,on:0,rate:0},
        {cnt:0,on:0,rate:0},
        {cnt:0,on:0,rate:0},
        {cnt:0,on:0,rate:0}
      ]
      _this.allStCntSQL.forEach(function(item, index){
        data[0].cnt+=item["雨量"].cnt;
        data[0].on+=item["雨量"].on;
        data[1].cnt+=item["水位"].cnt;
        data[1].on+=item["水位"].on;
        data[2].cnt+=item["图像"].cnt;
        data[2].on+=item["图像"].on;
        data[3].cnt+=item["广播"].cnt;
        data[3].on+=item["广播"].on;
      })
      data[0].rate=Math.ceil((data[0].on/data[0].cnt)*100);
      data[1].rate=Math.ceil((data[1].on/data[1].cnt)*100);
      data[2].rate=Math.ceil((data[2].on/data[2].cnt)*100);
      data[3].rate=Math.ceil((data[3].on/data[3].cnt)*100);
      data[4].cnt=data[0].cnt+data[1].cnt+data[2].cnt+data[3].cnt;
      data[4].on=data[0].on+data[1].on+data[2].on+data[3].on;
      data[4].rate=Math.ceil((data[4].on/data[4].cnt)*100);
      _this.shenData=data;
    },

  },

}) // vue尾部