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
    datas:[],
    allProvince:[],
    show:true,
    secondPageName:"",
    shenPie:[],
    shiPie:[],
    shenColumn:[[],[],[]],
    url:"/svrapi/getAllSvrStatus"
  },
  // 
  mounted(){
    // 获取网络数据
    this.getAllServerStatus()
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
        console.log("服务器状态首页数据请求成功!");
        this.datas=response.body.sort(strSort);
        // 隔行添加表格背景的class
        this.setTableBGActive()
        // 添加服务器按钮的背景颜色
        this.setTableButtonBGActive()
        // 设置省饼图数据
        this.setShenPieData()
        // 绘制省饼图
        this.drowShenPie()
        // 设置省、市柱状图数据
        this.setShenColumnData()
        // 绘制省、市柱状图
        this.drowShenColumn()
        // 设置市饼图数据
        this.setShiPieData()
        // 绘制市、县饼图
        this.drowShiPie()
      })
      .catch(function(response){
        console.log("服务器状态首页数据请求失败!");
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
      _this.datas.forEach(function(item, index){
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
      _this.datas.forEach(function(item, index){
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
    },
    // 服务器详情 按钮点击后跳转
    jumpToServerPage:function(home, url, adcd, name, adnm){
      this.show=false;
      this.secondPageName=adnm+name;
      document.getElementById("serverIframe").src="http://"+home+url+"&model=show&adcd="+adcd;
    },
    // 设置省饼图数据
    setShenPieData:function(){
      var _this=this;
      var data=[
        {value:0, name:'正常'},
        {value:0, name:'异常'}
      ]
      var shenData=_this.datas[0].svr;
      shenData.forEach(function(item, index){
        if(item.status=="正常"){
          data[0].value+=1;
        }else if(item.status=="异常"){
          data[1].value+=1;
        }else{
          data[2].value+=1;
        }
      })
      _this.shenPie=data;
    },
    // 绘制饼图
    drowShenPie:function(){
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
            data:this.shenPie,
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
    },
    // 设置市饼图数据
    setShiPieData:function(){
      var _this=this;
      var data=[
        {value:0, name:'正常'},
        {value:0, name:'异常'}
      ]
      var aa=_this.shenColumn[0];
      aa=aa.splice(1,aa.length);
      aa.forEach(function(item){
        data[0].value+=item;
      })
      var bb=_this.shenColumn[1];
      bb=bb.splice(1,bb.length)
      bb.forEach(function(item){
        data[1].value+=item;
      })
      _this.shiPie=data;
    },
    // 绘制市、县饼图
    drowShiPie:function(){
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
            data:this.shiPie,
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
    },
    // 设置省、市柱状图数据
    setShenColumnData:function(){
      var _this=this;
      var a=[],b=[],c=[];
      _this.datas.forEach(function(item,index){
        _this.allProvince.push(item.adnm);
        var aa=0,bb=0,cc=0;
        // 重复的IP 
        if(!item.svr[0]){
          cc=1;
        }else if(item.svr[0].svrIp==item.svr[1].svrIp){
          item.svr.forEach(function(v,k){
            if(v.status=="正常"){
              aa=1;
            }else if(v.status=="异常"){
              bb=1;
            }
          })
        }else{
          item.svr.forEach(function(v,k){
            if(v.status=="正常"){
              aa+=1;
            }else if(v.status=="异常"){
              bb+=1;
            }else{
              cc+=1;
            }
          })
        }
        a.push(aa);
        b.push(bb);
        c.push(cc);
      })
      _this.shenColumn[0]=a;
      _this.shenColumn[1]=b;
      _this.shenColumn[2]=c;
    },
    // 绘制省、市柱状图
    drowShenColumn:function(){
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
                data:this.allProvince
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
                data:this.shenColumn[0]
            },
            {
                name:'异常',
                type:'bar',
                barCategoryGap:'80%',
                stack: '服务器',
                data:this.shenColumn[1]
            },
            {
                name:'暂无数据',
                type:'bar',
                barCategoryGap:'60%',
                stack: '服务器',
                data:this.shenColumn[2]
            }
        ],
        color: ['#7dccb1',
                '#d60015',
                '#9f9f9f']
      });
    },
    
  }

})