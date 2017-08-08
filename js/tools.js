//渲染文件夹
function renderView(data){
      elements.list.innerHTML="";
      data.forEach(function(item){

            var li=document.createElement("li");
               // li.setAttribute("class","origin");
                li.className="origin";

            var div=document.createElement("div");
            div.className="folder";
            div.setAttribute("data-file-id",item.id);

            var p=document.createElement("p");
            p.innerHTML=item.name;

            var label=document.createElement("label");
            label.setAttribute("onoff",false);

            var input=document.createElement("input");
            input.type="text";
            input.style.cssText="margin:8px 0 0 30px";

           //点击文件夹渲染子集
           div.onclick=function(e){
              curPid=item.id;
              let curData = Model.getChildren(curPid);
              renderView(curData);  //更新数据渲染文件夹
              rendeCrumbs(curPid)   //同时渲染面包屑导航
              e.stopPropagation()
           }
           //点击label切换样式
           label.onclick=function(e){
               this.onoff=!this.onoff;
               if(this.onoff){
                   this.className="checkbox";
                   li.className="checked"
                   item.checked=true
                   // console.log(item)
               }else{
                   this.className="";
                   li.className=""
                   item.checked=false
                   //console.log(item)
               }
              //检测是否全选
              var newData=Model.getChildren(curPid);
              var len=newData.length;
               //获取当前选中元素的个数
              var checkedLen= newData.filter(function(item){
                 return item.checked;
              }).length;
              //当前选中元素的个数和当前所有元素的个数一致，说明全选
              if(len==checkedLen){
                elements.checkAllBtn.checked=true
              }else{
                elements.checkAllBtn.checked=false
              }
               e.stopPropagation()
           }

           p.addEventListener("dblclick",function(e){
                 input.style.display="block";
                 this.style.display="none";
                 input.select();
                 e.stopPropagation()
                // item.name=inputVal;

           });
           input.addEventListener("blur",function(){
                  p.style.display="block";
                  this.style.display="none";
                  p.innerHTML=this.value;
                  inputVal=this.value;
                  item.name=inputVal;
           })
           //添加鼠标滑过离开效果
            li.addEventListener("mouseover",function(){
               li.className="checked";
               item.checked=true  //注意此处要同步更新item的状态，没有此行代码会导致款选无法删除的问题
            })
            li.addEventListener("mouseout",function(){
                 if(label.className!="checkbox"){
                     li.className="";
                     item.checked=false   //注意此处要同步更新item的状态，//注意此处要同步更新item的状态，没有此行代码会导致款选无法删除的问题
                 }
            })
            elements.list.appendChild(li);
            li.appendChild(div);
            li.appendChild(label);
            li.appendChild(p);
            li.appendChild(input);

            //根据item的checked属性对应li的样式
            if(item.checked){
                 li.className="checked";
                 label.className="checkbox";
            }else{
                 li.className="";
                 label.className="";
            }
            checkCrash(data)  //在渲染的时候进行框选

    })
}

//渲染左侧树形菜单
function treeHtml(treeId){
  var childs=Model.getChildren(treeId);
  var html="<ul>";
  childs.forEach(function(item){
    //获取当前id下所有的父级，也就是当前id下的层级。
     var level=Model.getParents(item.id).length;
      html+=`<li>
             <div class="treeTitle" style="padding-left:${level*15}px;background:url('./imgs/folder-tree.png') ${level*15}px  7px  no-repeat;text-indent:25px;"
                  data-file-id=${item.id}
                  onclick='renderTree(${item.id})' >
                  <span>
                     <strong>${item.name}</strong>
                     <i></i>
                  </span>
              </div>
              ${treeHtml(item.id)}
        </li>`;
    });
    html+="</ul>";
    return html
}

function renderTree(id){  //传入当前元素的id获取到其子集
   renderView(Model.getChildren(id))  //根据子集渲染视图结构
   rendeCrumbs(id)         //根据当前元素的id同步更新curPid的值同时渲染面包屑
}


function rendeCrumbs(id){
    elements.crumbs.innerHTML="";
    //渲染面包屑导航
    curPid=id;
    crumbsArr=Model.getParents(curPid);
     if(curPid!=0){
        crumbsArr.push(Model.get(curPid))
     }
    var zIndex=1; //渲染导航层级
    crumbsArr.forEach(function(item,index){
      var a=document.createElement("a");;
      a.innerHTML=item.name
      a.href="javascript:"
      a.className="CrumbsBg1";

      a.onclick=function(){
         curPid=item.id;
         renderView(Model.getChildren(curPid))
      };
      elements.crumbs.appendChild(a)

    })
}
//碰撞检测
function crash (ele1,ele2){
        var ele1Rt=ele1.offsetLeft+ele1.offsetWidth;
        var ele2Rt=ele2.offsetLeft+ele2.offsetWidth;
        var ele1Lt=ele1.offsetLeft
        var ele2Lt=ele2.offsetLeft;

        var ele2Top=ele2.offsetTop;
        var ele2Btm=ele2.offsetTop+ele2.offsetHeight;
        var ele1Top=ele1.offsetTop;
        var ele1Btm=ele1.offsetTop+ele1.offsetHeight;

       if(ele1Rt>ele2Lt && ele1Lt<ele2Rt && ele1Btm>ele2Top && ele1Top<ele2Btm  )
       {
              return true
       }else{
             return false
       }
  }

//获取当前所有文件夹
function getAllFiles(){
    var fList=elements.list.getElementsByTagName("li");  //注意动态获取
    return fList
    console.log(fList.length)
}

//碰撞检测函数
function checkCrash(data){
    data.forEach(function(item){
        var fList=getAllFiles() //获取当前所有文件夹对象
        document.onmousedown=function(e){
               var disx=e.clientX;
               var disy=e.clientY;
               var box=document.createElement("div"); //box是拖拽生成的层
               box.style.position="absolute";
               box.style.left=e.clientX+"px";
               box.style.top=e.clientY+"px";
               box.style.background="rgba(0,0,0,.2)"
               document.body.appendChild(box)
               document.onmousemove=function(e){
                   box.style.left=Math.min(e.clientX,disx)+"px";
                   box.style.top=Math.min(e.clientY,disy)+"px";+"px";
                   box.style.width=Math.abs(e.clientX-disx)+"px";
                   box.style.height=Math.abs(e.clientY-disy)+"px";

                   for(var i=0;i<fList.length;i++){
                        var curLabel=fList[i].getElementsByTagName("label")[0] //拖层
                        if(crash(box,fList[i])){
                             fList[i].className="checked";
                             curLabel.className="checkbox";
                             item.checked=true
                        }else{
                             fList[i].className="";
                             curLabel.className="";
                             item.checked=false
                        }
                   }
               }
               document.onmouseup=function(e){
                  document.body.removeChild(box);
                  box.style.display="none"
                  document.onmousemove=null;

            }

           if(e.target.tagName.toUpperCase()=="HTML"){

               renderView(Model.getChildren(curPid))
           }

         //   return false  //return false会和双击编辑文件名冲突产生bug

        }
    })
}

