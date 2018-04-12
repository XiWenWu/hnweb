// 给市县排序
var strSort=function(x,y){
  if(x.adcd>y.adcd){
    return 1;
  }else{
    return -1;
  }

}
var dqzt=new Vue({
  el:"#dqzt",
  data:{
    titles:[
      {nav:"服务器状态",url:"fuwuqizhuangtai.html"},
      {nav:"站点状态",url:"zhandianzhuangtai.html", active:true},
      {nav:"站点余额",url:"zhandianyue.html"},
      {nav:"异常数据",url:"yichangshuju.html"},
      {nav:"维护日历",url:"weihurili.html"}
    ],
    // 站点类型选择
    typeStation:[
      {type:"全部",active:true},
      {type:"雨量站",active:false},
      {type:"图像站",active:false},
      {type:"水位站",active:false},
      {type:"广播站",active:false}
    ],
    // 站点状态选择
    typeStatus:[
      {type:"全部",active:true},
      {type:"在线",active:false},
      {type:"离线",active:false}
    ],
    // 当前状态切换
    dangqianActive:true,
    // 站点在线率切换
    zaixianlvActive:false,
    // 当前状态 所有的信息
    DQdatas:[],
    // 在线率 所有的信息
    ZXLdatas:[],
    //
    selected:"海南省",
    // 翻页插件显示状态信息 
    // index 默认进入后的显示页面  
    index:1,
    // limit 显示可点击的页面数（必须是单数）
    limit:9, 
    // 当前页面的信息显示条数
    value:10,
    // size 总的信息条数
    size:200,
    // 上一页是否显示
    showPrevMore : false,
    // 下一页是否显示
    showNextMore : false,
    // 当前市县的信息
    shenData:[],
    // 需要显示的信息
    tableData:[],
    // 显示
    tableDataShow:[],
    // 当前状态的默认adcd
    DQadcd:46,
    // 在线率状态的默认adcd
    ZXLadcd:46,
    zxlTableData:[[],[],[],[]],
    allProvince:JSON.parse(localStorage.getItem("allProvinceAdnm")),
    // svrrt/getStRateSQL?etm="+nowDate+"&stm="+lastDate+"&adcd="+adcdData
    DQurl:"/svrapi/getAllStStatusSQL",
    ZXLurl:"/svrrt/getStRateSQL?"
  },
  // 计算属性
  computed:{
    //计算总页码
    pages(){
      return Math.ceil(this.size / this.value)
    },
    //计算页码，当count等变化时自动计算
    pagers(){
      const array = []
      // 显示可以点击的页数个数，多余的用 ... 代替  必须是单数
      const perPages = this.limit
      // 计算显示的总页数
      const pageCount = this.pages
      // 当前选中的页数
      let current = this.index
      const _offset = (perPages - 1) / 2


      const offset = {
        start : current - _offset,
        end   : current + _offset
      }

      //-1, 3
      if (offset.start < 1) {
        offset.end = offset.end + (1 - offset.start)
        offset.start = 1
      }
      if (offset.end > pageCount) {
        offset.start = offset.start - (offset.end - pageCount)
        offset.end = pageCount
      }
      if (offset.start < 1) offset.start = 1

      this.showPrevMore = (offset.start > 1)
      this.showNextMore = (offset.end < pageCount)

      for (let i = offset.start; i <= offset.end; i++) {
        array.push(i)
      }
      return array
    },
    zxlTableTh(){
      var array=[];
      for(var i=0; i<30; i++){
        array.push(new Date(new Date().getTime()-i*24*60*60*1000).toJSON().slice(0,10))
      }
      return array;
    }
  },
  // 
  mounted(){
    // 获取网络数据
    this.getDangQianZhuangTaiData()
    this.getZaiXianLvData()
  },
  updated(){
    // 绘制图像
    this.drawZxlmap();
    // 页面加载后执行
    window.parent.document.getElementById("rightIframe").style.height=document.body.offsetHeight+20+"px";
  },
  methods:{
    // 获取网络数据
    getDangQianZhuangTaiData:function(){
      this.$http.get(this.DQurl)
      .then((response)=>{
        console.log("当前状态 数据请求成功!");
        this.DQdatas=response.body.sort(strSort);
        // 设置需要显示的信息
        this.setTableData();
      })
      .catch(function(response){
        console.log("当前状态 数据请求失败!");
        console.log(response)
      })
    },
    // 站点在线率数据请求
    getZaiXianLvData:function(){
      // 当前时间 格式 2018-04-08
      var nowDate=new Date(new Date().getTime()).toJSON().slice(0,10);
      // 三十天前
      var lastDate=new Date(new Date().getTime()-29*24*60*60*1000).toJSON().slice(0,10);
      var url=this.ZXLurl+"etm="+nowDate+"&stm="+lastDate+"&adcd="+this.ZXLadcd;

      this.$http.get(url)
      .then((response)=>{
        console.log("在线率 数据请求成功!");
        this.ZXLdatas=response.body.sort(strSort);
        // 设置图表数据
        this.setZxlmapData();
      })
      .catch(function(response){
        console.log("在线率 数据请求失败!");
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
      // 添加active
      _this.setTableBG(_this.DQdatas)
    },
    // 翻页插件方法
    prev(){
      if (this.index > 1) {
        this.go(this.index - 1)
        console.log("上一页");
      }
    },
    next(){
      if (this.index < this.pages) {
        this.go(this.index + 1)
        console.log("下一页");
      }
    },
    first(){
      if (this.index !== 1) {
        this.go(1)
        console.log("首页");
      }
    },
    last(){
      if (this.index != this.pages) {
        this.go(this.pages)
        console.log("尾页");
      }
    },
    go (page) {
      if (this.index !== page) {
        this.index = page
        //父组件通过change方法来接受当前的页码
        this.$emit('change', this.index)
        console.log("第"+page+"页");
        this.setTableDataShowData(page,this.value);
      }
    },
    // 设置表格显示的当前数据
    setTableDataShowData:function(page,value){
      var _this=this;
      var data=[];
      var min=value*(page-1);
      // 计算最大值 不能超出数组范围
      var max=value*page<_this.tableData.length?value*page:_this.tableData.length;
      for(var i=min; i<max; i++){
        data.push(_this.tableData[i]);
      }
      _this.tableDataShow=_this.setTableBG(data);
    },
    // 设置需要显示的信息
    setTableData:function(){
      var _this=this;
      //获取页面URL中附带的adcd
      var url=document.location.href;
      var adcd="";
      var subData=[];
      // 如果url中带有adcd字段
      if(url.indexOf("adcd")>0){
        adcd=url.substring(url.length-6,url.length)
        _this.DQdatas.forEach(function(item, index){
          if(item.adcd.substring(0,6)==adcd){
            subData.push(item);
          }
        })
        // 设置select
        _this.allProvince.forEach(function(item,index){
          if(item.adcd.substring(0,6)==adcd){
            _this.selected=item.adnm;
          }
        })
        _this.shenData=subData;
        _this.tableData=_this.shenData;
      }else{
        _this.shenData=_this.DQdatas;
        _this.tableData=_this.shenData;
      }
      
      _this.index=1;
      _this.setTableDataShowData(1,_this.value);
      
      // 添加active
      // _this.setTableBG(_this.tableData)
    },
    // 站点状态/站点在线率 页面切换
    tabZhanDian:function(tab){
      if(tab){
        this.dangqianActive=true;
        this.zaixianlvActive=false;
      }else {
        this.dangqianActive=false;
        this.zaixianlvActive=true;
      }
    },
    backToZhanDianZhuangTai:function(){
      document.location.href="zhandianzhuangtai.html";
    },
    // 设置在线率数据
    setZxlmapData:function(){
      var _this=this;
      _this.zxlTableData=[[],[],[],[]]
      for(var i=0; i<30; i++){
        _this.zxlTableData[0].push(Math.ceil((_this.ZXLdatas[0]["雨量"][i].on/_this.ZXLdatas[0]["雨量"][i].cnt)*100))
        _this.zxlTableData[1].push(Math.ceil((_this.ZXLdatas[1]["水位"][i].on/_this.ZXLdatas[1]["水位"][i].cnt)*100))
        _this.zxlTableData[2].push(Math.ceil((_this.ZXLdatas[2]["图像"][i].on/_this.ZXLdatas[2]["图像"][i].cnt)*100))
        if(_this.ZXLdatas[3]["广播"][i]){
          _this.zxlTableData[3].push(Math.ceil((_this.ZXLdatas[3]["广播"][i].on/_this.ZXLdatas[3]["广播"][i].cnt)*100))
        }else{
          _this.zxlTableData[3].push(0)
        }
      }
    },
    // 绘制在线率
    drawZxlmap:function(){
      var zxlEcharts=echarts.init(document.getElementById("zxl-map"))
      zxlEcharts.setOption({
        title: {
          text: '在线率变化',
          textStyle:{
            fontSize:14
          },
          subtext: '海南省'
        },
        tooltip: {
          trigger: 'axis',
          formatter: "{a0}:{c0}%<br/>{a1}:{c1}%<br/>{a2}:{c2}%<br/>{a3}:{c3}%"
          // formatter: function(params){
          //   var str0=params[0].seriesName;
          //   var str1=params[1].seriesName;
          //   var str2=params[2].seriesName;
          //   var str3=params[3].seriesName;
          //   var rate0=params[0].value;
          //   var rate1=params[1].value;
          //   var rate2=params[2].value;
          //   if(params[3].value){
          //       return str0+":在线率"+rate0+"%<br/>"+str1+":在线率"+rate1+"%<br/>"+str2+":在线率"+rate2+"%<br/>"+str3+":在线率"+params[3].value+"%";
          //   } else {
          //       return str0+":在线率"+rate0+"%<br/>"+str1+":在线率"+rate1+"%<br/>"+str2+":在线率"+rate2+"%";
          //   }
          // }
        },
        legend: {
          data:['降雨站','水位站','图像站','广播站']
        },
        xAxis:  {
          type: 'category',
          axisLabel: {
              interval: 0,
              rotate:-30
          },
          boundaryGap: false,
          data:this.zxlTableTh
        },
        yAxis: {
          type: 'value',
          axisLabel: {
              formatter: '{value} %'
          }
        },
        series: [
          {
            name:'降雨站',
            type:'line',
            data:this.zxlTableData[0]
          },
          {
            name:'水位站',
            type:'line',
            data:this.zxlTableData[1]
          },
          {
            name:'图像站',
            type:'line',
            data:this.zxlTableData[2]
          },
          {
            name:'广播站',
            type:'line',
            data:this.zxlTableData[3]
          }
        ]
      })
    },
    changeTableData:function(adnm){
      return adnm
    },
    // 更改类型选择状态
    changeTypeStation:function(index){
      this.typeStation.forEach(function(item){
        item.active=false
      })
      this.typeStation[index].active=true;
    },
    // 更改状态选择状态
    changeTypeStatus:function(index){
      this.typeStatus.forEach(function(item){
        item.active=false
      })
      this.typeStatus[index].active=true;
    },
    // 根据条件筛选数据
    searchTableData:function(){
      var station="";
      var status="";
      var _this=this;
      // 获取筛选的条件
      _this.typeStation.forEach(function(item,index){
        if(item.active){
          station=item.type.substring(0,2);
        }
      })
      _this.typeStatus.forEach(function(item,index){
        if(item.active){
          status=item.type;
        }
      })
      console.log(station+"-"+status);
      var subData=[];
      if(station=="全部"&&status=="全部"){
        subData=_this.shenData;
      }else if(station=="全部"){
        _this.shenData.forEach(function(item, index){
          if(item.status==status){
            subData.push(item);
          }
        })
      }else if(status=="全部"){
        _this.shenData.forEach(function(item, index){
          if(item.sttp==station){
            subData.push(item);
          }
        })
      }else{
        _this.shenData.forEach(function(item, index){
          if(item.status==status&&item.sttp==station){
            subData.push(item);
          }
        })
      }
      // _this.setTableBG(subData);
      _this.tableData=subData;
      _this.index=1;
      _this.setTableDataShowData(1,_this.value);
      
    },
    // 设置表格TR背景色
    setTableBG:function(data){
      if(data){
        data.forEach(function(item, index){
          if(index%2==0){
            Vue.set(item,'navActive',false);
          }else{
            Vue.set(item,'navActive',true);
          }
        })
      }
      return data;
    },
    // 
    download:function(){
      document.location.href="http://hnyw.cloudowr.cn/svr/exp/allStStatusSQL"
    },
  
  },
  watch:{
    // 市县数据改变
    selected:function(){
      console.log(this.selected)
      var _this=this;
      // 获取当前市县的编码前6位 adcd 如果是海南省则是 前2位
      if(_this.selected=="海南省"){
        _this.DQadcd=46;
        // 保存当前页面的数据
        _this.shenData=_this.DQdatas;
      }else{
        _this.allProvince.forEach(function(item, index){
          if(item.adnm==_this.selected){
            // 保存市县编码
            _this.DQadcd=item.adcd.substring(0,6);
          }
        })
        // 筛选市县数据
        _this.shenData=[];
        _this.DQdatas.forEach(function(item, index){
          if(item.adcd.substring(0,6)==_this.DQadcd){
            _this.shenData.push(item)
          }
        })
      }
      // 添加active
      // _this.setTableBG(_this.shenData)
      // 保存当前页面需要显示的数据
      _this.tableData=_this.shenData;
      _this.index=1;
      _this.setTableDataShowData(1,_this.value);
      // 恢复筛选按钮状态
      _this.changeTypeStation(0);
      _this.changeTypeStatus(0);
      
    },
    //当tableData数据变动后调整翻页插件
    tableData:function(){
      var _this=this;
      _this.size=_this.tableData.length;
    },
    // 页面显示的信息条数
    value:function(){
      var _this=this;
      _this.index=1;
      _this.setTableDataShowData(1,_this.value);
    },
  }

})