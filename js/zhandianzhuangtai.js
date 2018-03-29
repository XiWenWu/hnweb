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
    // 站点状态数据
    url:"/svrapi/getAllStCntSQL"
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
    // 获取网络数据
    getAllServerStatus:function(){
      this.$http.get(this.url)
      .then((response)=>{
        this.allStCntSQL=response.body.sort(strSort);
        // 增加在线率 总数的字段
        this.setAllStCntSQL()
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

  }

})