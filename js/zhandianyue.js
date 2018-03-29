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
    }
  },

})