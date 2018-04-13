/**
 * <directive>
 * @name tableFixed 列表
 * @description 可固定头部或左右侧列的列表指令，获取列表数据，展示分页，展示无数据提示等功能
 * @date 2018-02-26
 * @author 黄思飞
 * @lastBy
 * @htmlUrl scmsModules/table/tableFixed.html
 */
import html from './tableFixed.html';
import './tableFixed.css';

export default (app, elem, attrs, scope) => {
  app.directive('tableFixedDirective', [
    '$state',
    '$compile',
    '$timeout',
    function($state, $compile, $timeout) {
      return {
        template: html,
        replace: true,
        restrict: 'EA',
        scope: {
          fixedCol: '=',
        },
        link: function postLink($scope, $element, $attrs) {},
        controller($scope, $element, $attrs, $transclude) {
          const $fixedTable = $('.fixed-table');
          const $tableBox = $('.tablebox');
          const $tableBoxTable = $('.tablebox .table');
          const $fixLeft = $('.fixed-table .fix-left');
          const $fixRight = $('.fixed-table .fix-right');
          const $fixHeader = $('.fixed-table .fix-header');
          const $fixHeaderOuter = $('.fixed-table .fix-header-outer');
          const $fixRightThead = $fixRight.find('.fix-thead');
          const $fixLeftThead = $fixLeft.find('.fix-thead');
          let headerScrollLeft = 0;
          let fixLeftTheadLeft = 0;
          let fixRightTheadLeft = 0;
          let fixLeftBorderLeftWidth = 0;
          let fixRightBorderLeftWidth = 0;

          const tableBoxScroll = function() {
            let tableBoxScrollLeft = $tableBox.scrollLeft(),
            tableBoxTableWidth = $tableBox.find('table').width(),
            tableBoxWidth = $tableBox.width();

            $fixHeaderOuter.scrollLeft(tableBoxScrollLeft);
            if (tableBoxScrollLeft > 0) {
              $fixLeft.addClass('left-box-shadow');
            } else {
              $fixLeft.removeClass('left-box-shadow');
            }
            if (
              tableBoxTableWidth - tableBoxWidth >
              tableBoxScrollLeft
            ) {
              $fixRight.addClass('right-box-shadow');
            } else {
              $fixRight.removeClass('right-box-shadow');
            }
          };
          $tableBox.scroll(tableBoxScroll);

          const containerScroll = function() {
            let fixHeaderHeight = $fixHeader.height(),
            tableBoxOuterWidth = $tableBox.outerWidth(),
            offsetTop = $tableBox.offset().top,
            headerHeight = $('.container').outerHeight();

            $fixedTable.find('.outer-hide-scroll').height(fixHeaderHeight);
            $fixHeaderOuter.outerWidth(tableBoxOuterWidth);
            if (offsetTop < headerHeight) {
              if (!$fixHeaderOuter.hasClass('fixed')) {
                $fixHeaderOuter.addClass('fixed');
                $fixRightThead.addClass('fixed');
                $fixLeftThead.addClass('fixed');
                $fixLeftThead.show();
                $fixRightThead.show();
                $fixHeaderOuter.show();
              }
            } else {
              $fixHeaderOuter.removeClass('fixed');
              $fixRightThead.removeClass('fixed');
              $fixLeftThead.removeClass('fixed');
              $fixHeaderOuter.hide();
              $fixLeftThead.hide();
              $fixRightThead.hide();
            }
          };
          $('#container').scroll(containerScroll);

          const windowScroll = function() {
            let tableboxWidth = $('.tablebox').width();

            if ($('.tablebox').length > 0 && tableboxWidth < 1500) {
              const scrollLeft = $('html').scrollLeft();
              if($('.outer-hide-scroll') && $('.outer-hide-scroll')[0]) {
                $('.outer-hide-scroll')[0].style.left = `${headerScrollLeft -
                  scrollLeft}px`;
              }
              if($fixLeftThead[0]) {
                $fixLeftThead[0].style.left = `${fixLeftTheadLeft -
                  scrollLeft +
                  fixLeftBorderLeftWidth}px`;
              }
              if($fixRightThead[0]) {
                $fixRightThead[0].style.left = `${fixRightTheadLeft -
                  scrollLeft +
                  fixRightBorderLeftWidth}px`;
              }
            }
          };
          $(window).scroll(windowScroll);

          $(window).resize(() => {
            containerScroll();
            windowScroll();
          });

          function getColVolume(staticTableEl){
            let elLength = staticTableEl.find('th').length;
            let colResult = {
              staticThW: new Array(elLength),
              staticTdW: new Array(elLength),
              rightColThW: [],
              leftColThW: []
            };
            if($scope.fixedCol.left){
              let leftCol = $scope.fixedCol.left.split(' ');
              leftCol.map(function(item, index){
                colResult.staticThW[index] = item;
                colResult.staticTdW[index] = item;
                colResult.leftColThW[index] = item;
              });
            }
            if($scope.fixedCol.right){
              let rightCol = $scope.fixedCol.right.split(' ').reverse();
              rightCol.map(function(item, index){
                colResult.staticThW[elLength-index-1] = item;
                colResult.staticTdW[elLength-index-1] = item;
                colResult.rightColThW[index] = item;
              });
            }
            return colResult;
          }
          function afterReflowVolume(staticTableEl){
            let thLength = staticTableEl.find('.tablebox th').length,
                rightThFromDom = staticTableEl
                  .find('.tablebox th')
                  .slice(thLength - $scope.fixRight, thLength),
                leftThFromDom = staticTableEl
                  .find('.tablebox th')
                  .slice(0, $scope.fixLeft),
                headerThFromDom = staticTableEl.find('.tablebox thead th'),
                trDomList = staticTableEl.find('.tablebox tbody tr');
            let colResult = {
              rightThFromDomW: [],
              rightThFromDomH: [],
              leftThFromDomW: [],
              leftThFromDomH: [],
              headerThFromDomW: [],
              trDomListH: []
            };
            angular.forEach(headerThFromDom, (item, index) => {
              colResult.headerThFromDomW.push($(item).outerWidth());
            });
            angular.forEach(rightThFromDom, (item, index) => {
              colResult.rightThFromDomW.push($(item).outerWidth());
              colResult.rightThFromDomH.push($(item).outerHeight());
            });
            angular.forEach(leftThFromDom, (item, index) => {
              colResult.leftThFromDomW.push($(item).outerWidth());
              colResult.leftThFromDomH.push($(item).outerHeight());
            });
            angular.forEach(trDomList, (item, index) => {
              colResult.trDomListH.push($(item).height());
            });
            return colResult;
          }
          $scope.$on('angularDomReady', (a, tableDom) => {
            reset();
            $fixRightThead.hide();
            $fixLeftThead.hide();
            if (!tableDom) {
              const headerThFromDom = $('.tablebox thead th');
              angular.forEach(headerThFromDom, (item, index) => {
                item.style.width = 'auto';
              });
              return;
            }
            const colArray = $scope.fixedCol.position.split('');
            $scope.fixHeader =
              Number(colArray[0]) >= 1 ? Number(colArray[0]) >= 1 : false;
            $scope.fixRight =
              Number(colArray[1]) >= 1 ? Number(colArray[1]) : false;
            $scope.fixLeft =
              Number(colArray[3]) >= 1 ? Number(colArray[3]) : false;
            let headerDom,
              rightThDom,
              leftThDom,
              trDomList = tableDom.find('.tablebox tbody tr'),
              thLength = tableDom.find('.tablebox th').length;

              
            if (($scope.fixHeader || $scope.fixRight || $scope.fixLeft) && !$tableBoxTable.hasClass('fix-table')) {
              $tableBoxTable.addClass('fix-table');
            }
            const tableColVolume = getColVolume(tableDom);
            angular.forEach(tableDom.find('th'), (item, index) => {
              if(tableColVolume.staticThW[index]){
                $(item).outerWidth(tableColVolume.staticThW[index]);
              }
            });

            //DOM操作批处理分离
            const actualVolume = afterReflowVolume(tableDom);

            // 头部固定
            if ($scope.fixHeader) {
              let headerThDom = $element.find('.fix-header thead'),
                headerDom = tableDom.find('.tablebox thead tr').clone(),
                headerThFromDom = tableDom.find('.tablebox thead th'),
                headerTheadDom = tableDom.find('.tablebox thead');
              angular.forEach(headerThFromDom, (item, index) => {
                // $(headerDom.find('th')[index]).outerWidth($(item).outerWidth());
                $(headerDom.find('th')[index]).outerWidth(actualVolume.headerThFromDomW[index]);
              });
              headerThDom.append(headerDom);
            }
            // 右侧固定
            if ($scope.fixRight) {
              let rightThTrDom = $element.find('.fix-right thead tr'),
                rightTbodyDom = $element.find('.fix-right tbody'),
                rightThFromDom = tableDom
                  .find('.tablebox th')
                  .slice(thLength - $scope.fixRight, thLength);
              rightThDom = rightThFromDom.clone();
              angular.forEach(rightThFromDom, (item, index) => {
                // $(rightThDom[index]).outerWidth($(item).outerWidth());
                // $(rightThDom[index]).outerHeight($(item).outerHeight());
                $(rightThDom[index]).outerWidth(actualVolume.rightThFromDomW[index]);
                $(rightThDom[index]).outerHeight(actualVolume.rightThFromDomH[index]);
              });
              rightThTrDom.append(rightThDom);

              const tempDom = $('<tbody></tbody>');
              angular.forEach(trDomList, (tr, index) => {
                const trDom = $(tr).clone();
                trDom.empty();
                trDom.append(
                  $(tr)
                    .find('td')
                    .slice(thLength - $scope.fixRight, thLength)
                    .clone()
                );
                trDom.removeAttr('ng-init');
                tempDom.append($compile(trDom)($scope.$parent.$parent));
              });
              $timeout(() => {
                angular.forEach(tempDom.children(), (item, index) => {
                  const tens = Math.floor(index / trDomList.length);
                  const units = index % trDomList.length;
                  if (tens === units) {
                    // $(item).height($(trDomList[tens]).height());
                    $(item).height(actualVolume.trDomListH[tens]);
                    let arr = $.makeArray($(item).find('td'));
                    arr.map(function(tdItem, tdIndex){
                      $(tdItem).outerWidth(tableColVolume.rightColThW[tdIndex]);
                    });
                    rightTbodyDom.append(item);
                  }
                });
              });
              if ($fixHeaderOuter.hasClass('fixed')) {
                $fixRightThead.show();
              }
            }

            // 左侧固定
            if ($scope.fixLeft) {
              let leftThTrDom = $element.find('.fix-left thead tr'),
                leftTbodyDom = $element.find('.fix-left tbody'),
                leftThFromDom = tableDom
                  .find('.tablebox th')
                  .slice(0, $scope.fixLeft);
              leftThDom = leftThFromDom.clone();
              angular.forEach(leftThFromDom, (item, index) => {
                // $(leftThDom[index]).outerWidth($(item).outerWidth());
                // $(leftThDom[index]).outerHeight($(item).outerHeight());
                $(leftThDom[index]).outerWidth(actualVolume.leftThFromDomW[index]);
                $(leftThDom[index]).outerHeight(actualVolume.leftThFromDomH[index]);
              });
              leftThTrDom.append(leftThDom);

              const tempDom = $('<tbody></tbody>');
              angular.forEach(trDomList, (tr, index) => {
                const trDom = $(tr).clone();
                trDom.empty();
                trDom.append(
                  $(tr)
                    .find('td')
                    .slice(0, $scope.fixLeft)
                    .clone()
                );
                trDom.removeAttr('ng-init');
                tempDom.append($compile(trDom)($scope.$parent.$parent));
              });
              $timeout(() => {
                angular.forEach(tempDom.children(), (item, index) => {
                  const tens = Math.floor(index / trDomList.length);
                  const units = index % trDomList.length;
                  if (tens === units) {
                    // $(item).height($(trDomList[tens]).height());
                    $(item).height(actualVolume.trDomListH[tens]);
                    let arr = $.makeArray($(item).find('td'));
                    arr.map(function(tdItem, tdIndex){
                      $(tdItem).outerWidth(tableColVolume.leftColThW[tdIndex]);
                    });
                    leftTbodyDom.append(item);
                  }
                });
              });
              if ($fixHeaderOuter.hasClass('fixed')) {
                $fixLeftThead.show();
              }
            }

            if ($tableBox.scrollLeft() > 0) {
              $fixLeft.addClass('left-box-shadow');
            } else {
              $fixLeft.removeClass('left-box-shadow');
            }
            if (
              $tableBox.find('table').width() - $tableBox.width() >
              $tableBox.scrollLeft()
            ) {
              $fixRight.addClass('right-box-shadow');
            } else {
              $fixRight.removeClass('right-box-shadow');
            }

            function reset() {
              $element.find('.table-header thead').empty();
              $element.find('.table-body thead tr').empty();
              $element.find('.table-body tbody').empty();
            }

            const hoverStyle = function() {
              const $tableBoxTr = $('.tablebox tbody tr');
              const $fixLeftTr = $('.fixed-table .fix-left tbody tr');
              const $fixRightTr = $('.fixed-table .fix-right tbody tr');

              $tableBoxTr.hover(
                function() {
                  const hoverIndex = $tableBoxTr.index(this);
                  $fixLeftTr.eq(hoverIndex).addClass('fix-table-hover');
                  $fixRightTr.eq(hoverIndex).addClass('fix-table-hover');
                },
                function() {
                  const hoverIndex = $tableBoxTr.index(this);
                  $fixLeftTr.eq(hoverIndex).removeClass('fix-table-hover');
                  $fixRightTr.eq(hoverIndex).removeClass('fix-table-hover');
                }
              );

              $fixLeftTr.hover(
                function() {
                  const hoverIndex = $fixLeftTr.index(this);
                  $tableBoxTr.eq(hoverIndex).addClass('fix-table-hover');
                  $fixRightTr.eq(hoverIndex).addClass('fix-table-hover');
                },
                function() {
                  const hoverIndex = $fixLeftTr.index(this);
                  $tableBoxTr.eq(hoverIndex).removeClass('fix-table-hover');
                  $fixRightTr.eq(hoverIndex).removeClass('fix-table-hover');
                }
              );

              $fixRightTr.hover(
                function() {
                  const hoverIndex = $fixRightTr.index(this);
                  $fixLeftTr.eq(hoverIndex).addClass('fix-table-hover');
                  $tableBoxTr.eq(hoverIndex).addClass('fix-table-hover');
                },
                function() {
                  const hoverIndex = $fixRightTr.index(this);
                  $fixLeftTr.eq(hoverIndex).removeClass('fix-table-hover');
                  $tableBoxTr.eq(hoverIndex).removeClass('fix-table-hover');
                }
              );
            };
            $timeout(() => {
              hoverStyle();
              headerScrollLeft = $('.outer-hide-scroll').offset().left;
              fixLeftTheadLeft = $('.fixed-table .fix-left').offset().left;
              fixLeftBorderLeftWidth = Number(
                $('.fixed-table .fix-left')
                  .css('borderLeftWidth')
                  .replace('px', '')
              );
              fixRightTheadLeft = $('.fixed-table .fix-right').offset().left;
              fixRightBorderLeftWidth = Number(
                $('.fixed-table .fix-right')
                  .css('borderLeftWidth')
                  .replace('px', '')
              );
            });
          });
        },
      };
    },
  ]);
};
