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
        this.$parentEl = options.$element.addClass('fixed-table-container');

        //需要配置的信息
        this.config = this.getConfig(options);        

        //给tr加上当前索引值，以方便hover时，样式的显示
        this.$parentEl.find('tbody tr').attr('current-index', '{{$index}}');

        //copy内容代码
        this.html = this.$parentEl.html();

        //原始列表头部行
        this.$parentEl.wrapInner('<div class="tablebox-content"></div>');
        

        //右则固定列的开始索引值
        this.colLength = $(this.html).find('tbody tr').eq(0).find('td').length;
        this.rightStartIndex = this.colLength - this.config.right;

        //头部固定行父容器
        this.$parentEl.prepend('<div class="fixed-header-box"></div>');
        this.$fixedHeaderBox = this.$parentEl.find('.fixed-header-box');

        //左右固定列父容器
        this.$parentEl.append('<div class="fixed-table"></div>');
        this.$fixedColBox = this.$parentEl.find('.fixed-table');

        //元素容器，子元素包含：数据列表、this.$fixedColBox;
        this.$tableBox = null;

        //左则固定列容器
        this.$left = null;
        
        //左右固定列容器
        this.$right= null;

        if(!this.isBuildHeader) {
          this.isBuildHeader = true;
          //this.$parentEl.prepend(this.$fixedHeaderBox);
          this.buildHeaderRow();
        }

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
          var heightOpt = options.height || '', floatHeight, height;
          if(heightOpt.match(/^\d+\.\d+$/)) {
            floatHeight = heightOpt.match(/^\d+\.\d+$/)[0];
          }
          else if(heightOpt.match(/^\-\d+$/)) {
            height = parseInt(heightOpt.match(/^\-\d+$/)[0], 10);
          }
          else {
            floatHeight = 0.8;
          }

          return {
            left: parseInt(options.left, 10) || 0,
            right: parseInt(options.right, 10) || 0,
            header:options.header ? true : false,
            floatHeight: parseFloat(floatHeight),
            height: height
          }
        },

        /*
         * 设置阴影显示
         */
        setBoxShadow: function($parentEl, scrollEl) {
          if(!scrollEl) {
            return;
          }
          //var $left = $parentEl.find('.fix-left');
          //var $rigth = $parentEl.find('.fix-right');
          if(scrollEl.scrollLeft > 0) {
            this.$parentEl.addClass('left-box-shadow');
          }
          else {
            this.$parentEl.removeClass('left-box-shadow');
          }

          if(scrollEl.scrollWidth-scrollEl.clientWidth === scrollEl.scrollLeft) {
            this.$parentEl.removeClass('right-box-shadow');
          }
          else {
            this.$parentEl.addClass('right-box-shadow');
          }
        },

        /*
         * 当tablebox左右滑动时，头部固定栏也跟个滚动
         */
        setHeaderScrollLeft: function($parentEl, scrollEl) {
          $parentEl.find('.fix-top').css({'margin-left': -scrollEl.scrollLeft+'px'})
        },

        /*
         * 生成左则固定列
         */
        buildLeftCol: function() {
          var leftCol = this.config.left;
          if(leftCol) {
            var $left = $('<div>'+this.html+'</div>');
            $left.find('thead').remove();
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
            $right.find('thead').remove();
            $right.find('tbody tr td').eq(this.rightStartIndex).prevAll().remove();
            this.$fixedColBox.append($right.addClass('fix-right'));
            $right = null;
          }
        },

        /*获取滚动条的宽，在各种设置上滚动条宽不同*/
        getScrollWidth: function() {
          return this.$tableBox && this.$tableBox[0] ? this.$tableBox[0].offsetWidth - this.$tableBox[0].clientWidth : 0;
        },

        /*获取滚动条的宽，在各种设置上滚动条宽不同*/
        getScrollHeight: function() {
          return this.$tableBox && this.$tableBox[0] ? this.$tableBox[0].offsetHeight - this.$tableBox[0].clientHeight : 0;
        },

        /*
         * 生成头部固定行
         */
        buildHeaderRow: function() {
          var _this = this,
            configLeft = parseInt(this.config.left, 10),
            configRight = parseInt(this.rightStartIndex, 10);
          var $header = $(this.html);
          $header.find('tbody').remove();
          this.$fixedHeaderBox.append($header.addClass('fix-top'));

          if(this.config.left) {
            var $headerLeft = $('<div>'+this.html+'</div>');
            $headerLeft.find('tbody').remove();
            this.$fixedHeaderBox.append($headerLeft.addClass('fix-top-left'));
            $headerLeft = null;
          }
          if(this.config.right) {
            var $headerRight = $('<div>'+this.html+'</div>');
            $headerRight.find('tbody').remove();
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

          //列表左右滚动时：左右则固定栏样式，头部不浮动的th左右位移，
          //列表上下滚动时：设置左右则固定栏容器scrollTop
          this.$tableBox.scroll(function() {           
            if(_this.preScrollTopValue !== this.scrollTop) {
              _this.$fixedColBox[0].scrollTop = this.scrollTop;
              _this.preScrollTopValue = this.scrollTop;
            }            
            
            if(_this.preScrollLeftValue !== this.scrollLeft) {
              _this.setBoxShadow(_this.$parentEl, this);
              _this.setHeaderScrollLeft(_this.$parentEl, this);
              _this.preScrollLeftValue = this.scrollLeft;
            }
            
          });

          //固定列滚动时:原始列表跟着改动
          this.$fixedColBox.scroll(function() {
            if(_this.preScrollTopValue !== this.scrollTop) {
              _this.$tableBox[0].scrollTop = this.scrollTop;
              _this.preScrollTopValue = this.scrollTop;
            }
            
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
            _this.setInitView();
            _this.setThWidth();
            _this.setBoxScrollInit();
          })
        },

        setBoxHeight: function() {
          var height;
          if(this.config.height) {
            height = ($('#container').height() || $('body').height()) + this.config.height;
          }
          else {
            height = ($('#container').height() || $('body').height()) * this.config.floatHeight;
          }
          if(height < 300) {
            height = 300;
          }

          if(this.$tableBox[0] && this.$tableBox[0].scrollHeight > height && this.config.header) {
            this.$parentEl.addClass('fixed-table-overflow-y');
            this.$tableBox.css({height: height+'px'});
            this.$fixedColBox.css({height: (height-this.getScrollHeight())+'px'});
          }
          else {
            this.$tableBox.css({height: 'auto'});
            this.$fixedColBox.css({height: 'auto'});
            this.$parentEl.removeClass('fixed-table-overflow-y');
          }
        },

        setShowSidebarCol: function() {
          if(this.$tableBox[0].scrollWidth <= this.$tableBox.width()) {
            this.$parentEl.removeClass('fixed-table-overflow-x');
            this.$left.css({'display': 'none'});
            this.$right.css({'display': 'none'});
            this.$fixedHeaderBox.find('.fix-top-left').css({'display': 'none'});
            this.$fixedHeaderBox.find('.fix-top-right').css({'display': 'none'});
          }
          else {
            this.$parentEl.addClass('fixed-table-overflow-x');
            this.$left.css({'display': ''});
            this.$right.css({'display': ''});   
            this.$fixedHeaderBox.find('.fix-top-left').css({'display': ''});
            this.$fixedHeaderBox.find('.fix-top-right').css({'display': ''});         
          } 
        },

        setInitView: function() {
          var _this = this;
          this.$tableBox = this.$parentEl.find('.tablebox-content');
          this.$fixedColBox = this.$parentEl.find('.fixed-table');
          this.$left = this.$fixedColBox.find('.fix-left');
          this.$right = this.$fixedColBox.find('.fix-right');
          this.$fixedHeaderBox = this.$parentEl.find('.fixed-header-box');

          this.setShowSidebarCol();
          this.setBoxHeight();

          if(_this.showSidebarValue) {
            clearTimeout(_this.showSidebarValue);
            _this.showSidebarValue = null;
          }
          this.showSidebarValue = setTimeout(function() {
            clearTimeout(_this.showSidebarValue);
            _this.showSidebarValue = null;
            _this.setShowSidebarCol();
          }, 1000)

          
          this.setBoxHeight();
          this.bindEvent();
          

          this.$tableBox.append(this.$parentEl.find('.error-no-data'));
        },

        setThWidthValue: function($scope, $timeout, value) {
          $timeout(function() {
            $scope.ngTableFiexedThWidth.push(value);
          })
        },

        /*
         * 设置头部th的宽度
         */
        setThWidth: function(isUpdate, $scope) {
          var _this = this;
          this.$scope = this.$scope || $scope;
          $scope = this.$scope;
          if(this.thwidthTimeout) {
            $timeout.cancel(this.thwidthTimeout);
          }
          this.thwidthTimeout = $timeout(function() {
            var $table = _this.$tableBox.find('> table'), 
              width, 
              headerColWidth, 
              scrollWidth = _this.getScrollWidth();
            _this.$parentEl.find('.fixed-header-box table').width(_this.$tableBox[0].scrollWidth - 1 + scrollWidth);
            
            //左右固定列宽度设置
            //左右固定列宽度设置
            var rightTotalWidth = 0,
            leftTotalWidth = 0,
            $tableFirstRow = $table.find('tbody tr:eq(0) td');
          
            var tableFirstRowLength = $tableFirstRow.length;
            var $rightTableFirstRow = _this.$right.find('tr:eq(0) td');
            var rightTableFirstRowLength = $rightTableFirstRow.length;
            $tableFirstRow.each(function(index, el) {
              width = this.clientWidth;
              if(index >= tableFirstRowLength - rightTableFirstRowLength) {
                rightTotalWidth += width;
                $rightTableFirstRow.eq(index - (tableFirstRowLength - rightTableFirstRowLength)).css('width', width+'px');
              }
              if(index < _this.config.left) {
                leftTotalWidth += width;
                _this.$left.find('tr:eq(0) td').eq(index).css('width', width+'px');
              }
            });

            _this.$fixedHeaderBox.find('.fix-top-left').css('width', (leftTotalWidth+1)+'px');
            _this.$fixedHeaderBox.find('.fix-top-right').css('width', (rightTotalWidth+scrollWidth+2)+'px');

            //设置头部宽度
            var rowspanByFistRow = 0;
            var thLength = $table.find('tbody tr:eq(0) td').length;
            $table.find('thead tr').each(function(thItemIndex) {
              var startIndex = thItemIndex === 0 ? 0 : rowspanByFistRow;
              $(this).find('th').each(function(thIndex) {
                var width = $(this).width();
                startIndex += parseInt($(this).attr('colspan'), 10) || 1;
                if(thItemIndex === 0 && startIndex < thLength) {
                  rowspanByFistRow += (parseInt($(this).attr('rowspan'), 10) - 1) ? 1 : 0;
                }

                if(startIndex < thLength) {
                  _this.$fixedHeaderBox.find('.fix-top-left table, > table').each(function() {
                    $(this).find('tr').eq(thItemIndex).find('th').eq(thIndex).width(width);
                  })
                }

                if(startIndex > 2) {
                  _this.$fixedHeaderBox.find('.fix-top-right table').each(function() {
                    if(startIndex === thLength) {
                      width = width + scrollWidth+2;
                    }
                    $(this).find('tr').eq(thItemIndex).find('th').eq(thIndex).width(width);
                  })
                };
                
              })
              
            });

            //设置行高
            $table.find('tbody tr').each(function(index, el) {
              var height = $(el).height();
              _this.$left.find('tbody tr').eq(index).height(height);
              _this.$right.find('tbody tr').eq(index).height(height);
              height = null;
            });

            //原始列表头部隐藏起来
            $table.css({'margin-top': '-'+$table.find('thead').height()+'px'});
            _this.$fixedColBox.css('top', _this.$fixedHeaderBox.height()+'px');
          }, 200)
        },

        setBoxScrollInit: function() {
          if(this.$tableBox && this.$tableBox[0]) {
            var scrollHeight = this.getScrollHeight();
            var scrollWidth = this.getScrollWidth();
            if(scrollHeight !== this.preScrollHeight) {
              this.$tableBox[0].scrollTop = 0;
            }
            
            if(scrollWidth !== this.preScrollWidth) {
              this.$tableBox[0].scrollLeft = 0;
            }

            this.preScrollHeight = scrollHeight;
            this.preScrollWidth = scrollWidth;
          }
        }
      };
      
      return {
        restrict: 'A',
        compile: function($element, $attrs,$scope) {
          $element.data('tableFixed', new TableFixed({
            $element: $element,
            left: $attrs.fixedLeft,
            right: $attrs.fixedRight,
            header: $attrs.fixedHeader,
            height: $attrs.fixedHeight
          }))
        },
        controller: function($scope, $element, $attrs) {
          $scope.ngTableFixed = '1';
          var tableFixed = $element.data('tableFixed');
          $scope.$watch('ngTableFixed', function(newValue, old) {
            tableFixed.setInitView();
            tableFixed.setThWidth(newValue, $scope);
            tableFixed.setBoxScrollInit();
          })
        }
      };
    },
  ]);
};
