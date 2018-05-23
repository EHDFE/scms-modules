/**
 * <directive>
 * @name ngTableFixed 列表
 * @description 可固定头部或左右侧列的列表指令，获取列表数据，展示分页，展示无数据提示等功能
 * @date 2018-05-22
 * @author 田艳容
 * @lastBy
 */
import './ngTableFixed.css';
export default (app, elem, attrs, scope) => {
  app.directive('ngTableFixed', [
    '$state',
    '$compile',
    '$timeout',
    function($state, $compile, $timeout) {
      var TableFixed = function(options) {
        //父元素容器
        this.$parentEl = $('[ng-table-fixed]').addClass('fixed-table-container');

        //需要配置的信息
        this.config = this.getConfig(options);        

        //给tr加上当前索引值，以方便hover时，样式的显示
        this.$parentEl.find('tbody tr').attr('current-index', '{{$index}}');

        //copy内容代码
        this.html = this.$parentEl.html();

        //右则固定列的开始索引值
        this.colLength = $(this.html).find('thead tr th').length;
        this.rightStartIndex = this.colLength - this.config.right;

        //头部固定行父容器
        this.$fixedHeaderBox = $('<div class="fixed-header-box"></div>');

        //左右固定列父容器
        this.$parentEl.append('<div class="fixed-table"></div>');
        this.$fixedColBox = this.$parentEl.find('.fixed-table');

        //元素容器，子元素包含：数据列表、this.$fixedColBox;
        this.$tableBox = null;

        //左则固定列容器
        this.$left = null;
        
        //左右固定列容器
        this.$right= null;

        this.buildLeftCol();
        this.buildRightCol();
      };
      TableFixed.prototype = {
        /*
         * 获取需要配置的信息，返回：
         * left number 左则固定列的列数
         * right number 右则固定列的列数
         * header boolear 是否固定头部栏
        */
        getConfig: function(options) {
          return {
            left: options.left || 0,
            right: options.right || 0,
            header:options.header ? true : false
          }
        },

        /*
         * 设置阴影显示
         */
        setBoxShadow: function($parentEl, scrollEl) {
          if(!scrollEl) {
            return;
          }
          var $left = $parentEl.find('.fix-left');
          var $rigth = $parentEl.find('.fix-right');
          if(scrollEl.scrollLeft > 0 && $left && $left.length) {
            $left.addClass('left-box-shadow');
          }
          else if($left && $left.length) {
            $left.removeClass('left-box-shadow');
          }

          if(scrollEl.scrollWidth-scrollEl.clientWidth === scrollEl.scrollLeft && $rigth && $rigth.length) {
            $rigth.removeClass('right-box-shadow');
          }
          else if($rigth && $rigth.length) {
            $rigth.addClass('right-box-shadow');
          }
        },

        /*
         * 当tablebox左右滑动时，头部固定栏也跟个滚动
         */
        setHeaderScrollLeft: function($parentEl, scrollEl) {
          $parentEl.find('.fix-top').css({'margin-left': -scrollEl.scrollLeft+'px'})
        },
        
        /*
         * 当tablebox左右滑动时，列固定栏也跟个滚动
         */
        setSideBarScroll: function($parentEl, scrollEl) {
          this.$fixedColBox.css({'margin-left': scrollEl.scrollLeft+'px'})
        },

        /*
         * 生成左则固定列
         */
        buildLeftCol: function() {
          var leftCol = this.config.left;
          if(leftCol) {
            var $left = $('<div>'+this.html+'</div>');
            $left.find('thead tr th').eq(leftCol - 1).nextAll().remove();
            $left.find('tbody tr td').eq(leftCol - 1).nextAll().remove();
            this.$fixedColBox.append($left.addClass('fix-left'));
            $left = null;
          }
        },

        /*
         * 生成右则固定列
         */
        buildRightCol: function() {
          var rightCol = this.config.right;
          if(rightCol) {
            var $right = $('<div>'+this.html+'</div>');
            $right.find('thead tr th').eq(this.rightStartIndex).prevAll().remove();
            $right.find('tbody tr td').eq(this.rightStartIndex).prevAll().remove();
            this.$fixedColBox.append($right.addClass('fix-right'));
            $right = null;
          }
        },

        /*
         * 生成头部固定行
         */
        buildHeaderRow: function() {
          if(!this.config.header) {
            return;
          }  
          var $header = $(this.html);
          $header.find('tbody').remove();
          this.$fixedHeaderBox.append($header.addClass('fix-top'));
          if(this.config.left) {
            var $headerLeft = $(this.html);
            $headerLeft.find('tbody').remove();
            $headerLeft.find('thead tr th').eq(this.config.left - 1).nextAll().remove();
            this.$fixedHeaderBox.append($headerLeft.addClass('fix-top-left'));
            $headerLeft = null;
          }
          if(this.config.right) {
            var $headerRight = $(this.html);
            $headerRight.find('tbody').remove();
            $headerRight.find('thead tr th').eq(this.rightStartIndex).prevAll().remove();
            this.$fixedHeaderBox.append($headerRight.addClass('fix-top-right'));
            $headerRight = null;
          }
          $header = null;
        },

        bindEvent: function() {
          if(this.isBindEvent) {
            return;
          }
          this.isBindEvent = true;

          //列表滚动时:左右则固定栏样式，与所有固定栏的位移样式
          this.$tableBox.scroll(function() {
            _this.setBoxShadow(_this.$parentEl, this);
            _this.setHeaderScrollLeft(_this.$parentEl, this);
            _this.setSideBarScroll(_this.$parentEl, this);
          });

          //hover时列表行的样式
          var $currentHoverIndex, _this = this;;
          this.$parentEl.delegate('tbody tr', 'mouseenter', function(event) {
            var index = $(event.target).parents('tr').attr('current-index');
            if($currentHoverIndex) {
              $currentHoverIndex.removeClass('hover');
            }
            $currentHoverIndex = _this.$parentEl.find('[current-index="'+index+'"]');
            $currentHoverIndex.addClass('hover');
          });

          //蓝听浏览器窗口大小变化

          $(window).resize(function() {
            
            if(_this.$tableBox && _this.$tableBox[0]) {
              _this.$tableBox[0].scrollLeft = 0;
            }
            _this.setInitView();
            _this.setThWidth();
          })
        },

        setInitView: function() {
          var _this = this;
          this.$tableBox = this.$parentEl.find('.tablebox');
          this.$fixedColBox = this.$parentEl.find('.fixed-table');
          this.$left = this.$fixedColBox.find('.fix-left');
          this.$right = this.$fixedColBox.find('.fix-right');

          if(_this.$tableBox[0].scrollWidth <= _this.$tableBox.width()) {
            _this.$left.css({'display': 'none'});
            _this.$right.css({'display': 'none'});
          }
          else {
            _this.$left.css({'display': ''});
            _this.$right.css({'display': ''});
          }
          if(_this.showSidebarValue) {
            clearTimeout(_this.showSidebarValue);
            _this.showSidebarValue = null;
          }
          this.showSidebarValue = setTimeout(function() {
            clearTimeout(_this.showSidebarValue);
            _this.showSidebarValue = null;
            if(_this.$tableBox[0].scrollWidth <= _this.$tableBox.width()) {
              _this.$left.css({'display': 'none'});
              _this.$right.css({'display': 'none'});
            }
            else {
              _this.$left.css({'display': ''});
              _this.$right.css({'display': ''});
            }
          }, 1000)
          
          
          if(this.config.header && !this.isBuildHeader) {
            this.isBuildHeader = true;
            this.$parentEl.prepend(this.$fixedHeaderBox);
            this.buildHeaderRow();
          }
          var height = ($('#container').height() || $('body').height()) * 0.8;
          if(this.$tableBox.height() > height) {
            this.$fixedHeaderBox.css({'display': ''});
            this.$tableBox.css({height: height+'px'});
          }
          else {
            this.$fixedHeaderBox.css({'display': 'none'});
            this.$tableBox.css({height: 'auto'});
          }

          this.bindEvent();
        },

        /*
         * 设置头部th的宽度
         */
        setThWidth: function() {
          var _this = this;
          setTimeout(function() {
            var $table = _this.$tableBox.children('table');
            _this.$fixedHeaderBox.find('.fix-top').width($table.width());
            $table.find('thead tr th').each(function(index, el) {
              var width = $(el).width();
              _this.$left.find('thead tr th').eq(index).width(width);
              _this.$fixedHeaderBox.find('.fix-top thead tr th').eq(index).width(width);
              _this.$fixedHeaderBox.find('.fix-top-left thead tr th').eq(index).width(width);
              if(index >= _this.rightStartIndex) {
                _this.$right.find('thead tr th').eq(index-_this.rightStartIndex).width(width);
                _this.$fixedHeaderBox.find('.fix-top-right thead tr th').eq(index-_this.rightStartIndex).width(width);
              }
            });

            _this.$fixedHeaderBox.width(_this.$fixedColBox[0].scrollWidth);
            if(_this.fixedHeaderBoxWidth) {
              clearInterval(_this.fixedHeaderBoxWidth);
              _this.fixedHeaderBoxWidth = null;
            }
            _this.fixedHeaderBoxWidth = setTimeout(function() {
              clearInterval(_this.fixedHeaderBoxWidth);
              _this.fixedHeaderBoxWidth = null;
              _this.$fixedHeaderBox.width(_this.$fixedColBox[0].scrollWidth);
            }, 0);
            
          }, 0)
        }
      };
      
      var tableFixed;
      return {
        restrict: 'A',
        compile: function($element, $attrs) {
          tableFixed = new TableFixed({
            left: $attrs.fixedLeft,
            right: $attrs.fixedRight,
            header: $attrs.fixedHeader
          });
        },
        controller: function($scope, $element, $attrs) {
          $scope.$watch('ngTableFixed', function(newValue, old) {
            tableFixed.setInitView();
            tableFixed.setThWidth();
          })
        }
      };
    },
  ]);
};
