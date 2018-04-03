// 给市县排序
var strSort=function(x,y){
  if(x.adcd>y.adcd){
    return 1;
  }else{
    return -1;
  }
}
// 站点余额
var whrl=new Vue({
  el:"#whrl",
  data:{
    // 导航栏数据
    titles:[
      {nav:"服务器状态",url:"fuwuqizhuangtai.html"},
      {nav:"站点状态",url:"zhandianzhuangtai.html"},
      {nav:"站点余额",url:"zhandianyue.html"},
      {nav:"异常数据",url:"yichangshuju.html"},
      {nav:"维护日历",url:"weihurili.html",active:true}
    ],
    datas:[],
    items:[
      {pic:"../res/pingtaixunjian.png",name:"平台巡检",station:2,num:4},
      {pic:"../res/shuzixunjian.png",name:"数据巡检",station:2,num:4},
      {pic:"../res/zhandiananzhuang.png",name:"站点安装",station:2,num:4},
      {pic:"../res/zhandianweihu.png",name:"站点维护",station:2,num:4},
      {pic:"../res/qitajiancha.png",name:"其他检查",station:2,num:4},
    ],
    // 市县信息
    allProvince:[
      {adnm:"海口市"},{adnm:"三亚市"},{adnm:"五指山"},{adnm:"琼海市"},{adnm:"儋州市"},{adnm:"文昌市"},
      {adnm:"万宁市"},{adnm:"东方市"},{adnm:"定安县"},{adnm:"屯昌县"},{adnm:"澄迈县"},{adnm:"临高县"},
      {adnm:"白沙县"},{adnm:"昌江县"},{adnm:"乐东县"},{adnm:"陵水县"},{adnm:"保亭县"},{adnm:"琼中县"}
    ],
    // 图表信息
    weihuColumn:[[],[],[],[],[]],
    // 图表市县
    weihuProvince:[],
    // 文字内容
    weihuTitle:[],
    url:"/svrapi/preserveRecord"
  },
  // 计算属性
  computed:{
    // 平台巡检次数
    cntPtxj:function(){
      var cnt=0;
      cnt=this.datas.forEach(function(item,index){
        cnt+=item["平台巡检"].cnt;
      })
      return cnt;
    },
    // 数据巡检次数
    cntSjxj:function(){
      var cnt=0;
      cnt=this.datas.forEach(function(item,index){
        cnt+=item["数据巡检"].cnt;
      })
      return cnt;
    },
    // 站点安装次数
    cntZdaz:function(){
      var cnt=0;
      cnt=this.datas.forEach(function(item,index){
        cnt+=item["站点安装"].cnt;
      })
      return cnt;
    },
    // 站点安装站数
    stcntZdaz:function(){
      var cnt=0;
      cnt=this.datas.forEach(function(item,index){
        cnt+=item["站点安装"].stcnt;
      })
      return cnt;
    },
    // 站点维护次数
    cntZdwh:function(){
      var cnt=0;
      cnt=this.datas.forEach(function(item,index){
        cnt+=item["站点维护"].cnt;
      })
      return cnt;
    },
    // 站点维护站数
    stcntZdwh:function(){
      var cnt=0;
      cnt=this.datas.forEach(function(item,index){
        cnt+=item["站点维护"].stcnt;
      })
      return cnt;
    },
    // 其他检查次数
    cntQtjc:function(){
      var cnt=0;
      cnt=this.datas.forEach(function(item,index){
        cnt+=item["其他检查"].cnt;
      })
      return cnt;
    },
    // 其他检查站数
    stcntQtjc:function(){
      var cnt=0;
      cnt=this.datas.forEach(function(item,index){
        cnt+=item["其他检查"].stcnt;
      })
      return cnt;
    },
  },
  // 
  mounted(){
    // 获取网络数据
    this.getAllServerStatus();
  },
  updated(){
    // 页面加载后执行
    window.parent.document.getElementById("rightIframe").style.height=document.body.offsetHeight+20+"px";
    // 加载echarts
    var chartWeihu=echarts.init(document.getElementById("whrl-table"));
    var optionWeihu={
      tooltip: {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
          data:['平台巡检','数据巡检','站点安装','站点维护','其他检查']
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
          data : this.weihuProvince
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
          name:'平台巡检',
          type:'bar',
          data:this.weihuColumn[0]
        },
        {
          name:'数据巡检',
          type:'bar',
          data:this.weihuColumn[1]
        },
        {
          name:'站点安装',
          type:'bar',
          data:this.weihuColumn[2]
        },
        {
          name:'站点维护',
          type:'bar',
          data:this.weihuColumn[3]
        },
        {
          name:'其他检查',
          type:'bar',
          data:this.weihuColumn[4]
        }
      ]
    }
    chartWeihu.setOption(optionWeihu)
  },
  methods:{
    getAllServerStatus:function(){
      this.$http.get(this.url)
      .then((response)=>{
        console.log("维护日历站点数据请求成功!");
        this.datas=response.body.sort(strSort);
        // 设置市县数据和图表的数据
        this.setEchartsTableData();
      })
      .catch(function(response){
        console.log("维护日历站点数据请求失败!");
        console.log(response);
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
    // 
    setDataForAdnm:function(data, obj){
      var _data=data;
      _data.forEach(function(item, index){
        if(item.adnm==obj.adnm){
          if(obj["平台巡检"]){
            _data[index]["平台巡检"]=obj["平台巡检"];
          }
          if(obj["数据巡检"]){
            _data[index]["数据巡检"]=obj["数据巡检"];
          }
          if(obj["站点安装"]){
            _data[index]["站点安装"]=obj["站点安装"];
          }
          if(obj["站点维护"]){
            _data[index]["站点维护"]=obj["站点维护"];
          }
          if(obj["其他检查"]){
            _data[index]["其他检查"]=obj["其他检查"];
          }
        }
      });
      return _data;
    },
    // 设置图表的数据
    setEchartsTableData:function(){
      var _this=this;
      var tableData=[];
      // 弄一个假数据 默认值都为0
      _this.allProvince.forEach(function(item, index){
        var subData={};
        subData.adnm=item.adnm;
        subData["平台巡检"]={cnt:0};
        subData["数据巡检"]={cnt:0};
        subData["站点安装"]={cnt:0, stcnt:0};
        subData["站点维护"]={cnt:0, stcnt:0};
        subData["其他检查"]={cnt:0, stcnt:0};
        tableData.push(subData);
        _this.weihuProvince.push(item.adnm);
      });
      // 遍历真数据 将真数据有的部分替换掉相对应假数据的值。
      _this.datas.forEach(function(item, index){
        if(item.adnm){
          tableData=_this.setDataForAdnm(tableData,item);
        }
      });
      _this.datas=tableData;
      // tableData 是初始化完整的数据
      var cntPtxj=0,cntSjxj=0,cntZdaz=0,stcntZdaz=0;
      var cntZdwh=0,stcntZdwh=0,cntQtjc=0,stcntQtjc=0;
      _this.datas.forEach(function(item,index){
        _this.weihuColumn[0].push(item["平台巡检"].cnt);
        _this.weihuColumn[1].push(item["数据巡检"].cnt);
        _this.weihuColumn[2].push(item["站点安装"].cnt);
        _this.weihuColumn[3].push(item["站点维护"].cnt);
        _this.weihuColumn[4].push(item["其他检查"].cnt);
        cntPtxj+=item["平台巡检"].cnt;
        cntSjxj+=item["数据巡检"].cnt;
        cntZdaz+=item["站点安装"].cnt;
        stcntZdaz+=item["站点安装"].stcnt;
        cntZdwh+=item["站点维护"].cnt;
        stcntZdwh+=item["站点维护"].stcnt;
        cntQtjc+=item["其他检查"].cnt;
        stcntQtjc+=item["其他检查"].stcnt;
      });
      _this.weihuTitle=[cntPtxj+"次",cntSjxj+"次",stcntZdaz+"站"+cntZdaz+"次",stcntZdwh+"站"+cntZdwh+"次",stcntQtjc+"站"+cntQtjc+"次"]
    },
    // 下载平台模板
    loadPingTaiModel:function(){
      window.location.href="../file/山洪灾害平台巡检表.docx";
    },
    // 下载数据模板
    loadShuJuModel:function(){
      window.location.href="../file/站点巡检记录表.docx";
    },
  }
})