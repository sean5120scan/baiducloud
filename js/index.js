var curPid=0;
var crumbsArr=[];

let elements = {
    list: document.getElementById('list'),
    lis:document.querySelectorAll('.treeTitle'),
    createFolder: document.getElementById('createFolderBtn'),
    treeList: document.querySelector('.treeList'),
    back: document.querySelector('#nav .back'),
    topLever: document.querySelector('#nav .topLever'),
    crumbs: document.querySelector('.crumbs'),
    treeTitles: document.querySelectorAll('.treeTitle'),
    checkAllBtn:document.querySelector("#checkAll"),
    delFolderBtn:document.querySelector("#delFolderBtn"),
    cloFolderBtn:document.querySelector("#cloFolderBtn"),
    inputVal:"新建文件夹",  //设值改变的置一个全局变量。用来记录每次
    contMenu:document.querySelector("#contMenu"),
    changeViewBtn:document.querySelector("#changeViewBtn"),  //查看方式--切换布局按钮;
    avatar:document.querySelector("#avatar"), //获取头像;
    upload:document.querySelector("#upload") //获取头像按钮;
}


//初始化渲染数据,获取到pid=0的数据
 //特别注意：此处不能直接改变全局的data也就是如下写法
 //data=Model.getChildren( curPid )
 //renderView( data )
renderView( Model.getChildren( curPid ) )

//初始化渲染左侧树形导航,获取到pid=0的数据
elements.treeList.innerHTML=treeHtml(curPid);

//返回上一层
elements.back.addEventListener("click",function(){

    var parentId=Model.getParentId(curPid);//获取当前curPid的父级id
    curPid=parentId   //重新赋值curPid
    renderView(Model.getChildren(curPid))  //根据重新赋值curPid的值更新视图
    rendeCrumbs(curPid)  //更新面包屑导航
})
//返回顶层
elements.topLever.addEventListener("click",function(){
    renderView(Model.getChildren(0))
    rendeCrumbs(0)  //更新面包屑导航
})

elements.checkAllBtn.onclick=function(){
 var curData=Model.getChildren(curPid)
     curData.forEach(function(item){
        item.checked=this.checked
     })
}
//新建文件夹
elements.createFolder.onclick=function(){
     data.push({
            id:data.length+1,
            pid:curPid,
            name: elements.inputVal,
            checked: false
     })
     console.log(data)
     data=data.filter(function(item){   //过滤选中的元素特别注意
          return !item.checked
     });
    renderView(Model.getChildren(curPid))
}
//删除文件夹
elements.delFolderBtn.onclick=function(){
   // var curData=Model.getChildren(curPid);
    for(var i=0;i<data.length;i++){
        if(data[i].checked){
             data.splice(i,1);
             i--
        }
    }
    console.log(data)
/*    var newData=curData.filter(function(item,index){
          return !item.checked
     })*/
    renderView(Model.getChildren(curPid))
}
//复制文件夹
elements.cloFolderBtn.onclick=function(){
/*    var curData=Model.getChildren(curPid);
    //得到选中的元素
    var newData=curData.filter(function(item){
        return item.checked
    })
    newData.forEach(function(item){
       curData.push({
            id: data.length+1,
            pid:Model.getParentId(item.id),
            name: item.name+"副本",
            checked: false
       })
     })*/
  data.forEach(function(item){
    if(item.checked){
        data.push({
              id: data.length+1,
              pid:Model.getParentId(item.id),
              name: item.name+"副本",
              checked: false
         })
    }
  })
    console.log(data)
   var curData=Model.getChildren(curPid)
   renderView(curData);
}

//点击全选按钮设置所有文件全选
elements.checkAllBtn.onclick=function(){
     var curData=Model.getChildren(curPid);
     var checkedVal=this.checked
     curData.forEach(function(item){
       item.checked=checkedVal;
    })
    renderView(curData)
}

//点击查看按钮切换缩略图
elements.changeViewBtn.onclick=function(){
   //切换图标样式
   if(this.className=="smallView"){
    this.className="showView"
   }else if(this.className=="showView"){
    this.className="smallView"
   }
   //切换文件夹样式
  var fileLis=elements.list.getElementsByTagName("li");

    var curData=Model.getChildren(curPid);
     curData.forEach(function(item){
        for(var i=0;i<fileLis.length;i++){
          if(fileLis[i].className==""){
            fileLis[i].className="thumbnail"
            item.className="thumbnail"
          }else if(fileLis[i].className=="thumbnail"){
           fileLis[i].className=""
           item.className=""
          }
        }
     })


    renderView(curData)

   /*}*/



};


//点击头像更换头像
elements.upload.onchange=function(e){
  var file=e.target.files[0]
  var fd=new FileReader();
  fd.readAsDataURL(file)
  fd.onload=function(){
       elements.avatar.src=this.result;
}

  //给每条数据提交新的class，
/*   data.map(function(item){
      item.className="smallView"
   })
   renderView(data)*/
}

/*//右键点击菜单
document.oncontextmenu=function(e){
    console.log(e.clientX)
  elements.contMenu.style.display="block";
  elements.contMenu.style.left=e.clientX+"px";
  elements.contMenu.style.top=e.clientY+"px";
  return false
}
document.onclick=function(e){
    console.log(e.clientX)
    elements.contMenu.style.display="none";

    return false
}
*/











