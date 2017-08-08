/**
 * Created by zmouse on 2017/4/20.
 * 数据处理
 *  封装对数据的处理
*/
  Model={
            getChildren: function(id) {

                return data.filter(function(item) {
                    return item.pid == id;
                });
            },
    /*
             * 返回指定id的数据
             *
             *
             * @param id
             * @returns {*}
    */
            get: function(id) {
                var info = null;
                data.forEach(function (item) {
                    if (item.id == id) {
                        info = item;
                    }
                });
                return info;
            },

            /**
             * 获取指定id的父级
             * @param <Number>id
             * @returns Number
             */
            getParentId: function (id) {

                let info = this.get(id);
                return info ? info.pid : 0;
            },

            /**
             * 获取指定id的父级对象
             * @param id
             * @returns {*}
             */
            getParent: function(id) {
                var parentId = this.getParentId(id);
                return this.get(parentId);
            },

            getParents: function(id) {
                let parents =[];
                var parent = this.getParent(id);
                while(parent) {
                    parents.unshift(parent);
                    parent = this.getParent(parent.id);
                }
                return parents;
            },
              /* 根据指定的id返回其对应的所有父级数据
                 * @param id
                 * @returns {Array}
                 */
               /*getAllParent: function (id) {

                    //存所有的父级数据
                    var arr = [];

                    //获取到当前id对应的数据
                    var _info = this.get(id);
                    //通过该数据的pid就可以找到他的父级的id
                    //var _parentId = _info.pid;
                    //通过pid得到对应的父级的数据
                    var _parent = this.get(_info.pid);
                    arr.push(_info)
                    while (_parent) {
                        //把当前的_parent添加到数组中

                        arr.unshift(_parent);
                        //获取_parent的父级
                        _parent = this.get(_parent.pid);
                    }

                    return arr;
                }*/
  }


