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
    datas:[],
    // 市县信息
    allProvince:[
      {adnm:"海口市"},{adnm:"三亚市"},{adnm:"五指山"},{adnm:"琼海市"},{adnm:"儋州市"},{adnm:"文昌市"},
      {adnm:"万宁市"},{adnm:"东方市"},{adnm:"定安县"},{adnm:"屯昌县"},{adnm:"澄迈县"},{adnm:"临高县"},
      {adnm:"白沙县"},{adnm:"昌江县"},{adnm:"乐东县"},{adnm:"陵水县"},{adnm:"保亭县"},{adnm:"琼中县"}
    ],
    tableDatas:[],
    url:"/svrapi/getAllStStatusSQL"
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
        console.log("当前状态 数据请求成功!");
        this.datas=response.body.sort(strSort);
      })
      .catch(function(response){
        console.log("当前状态数据请求失败!");
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
    
  }

})