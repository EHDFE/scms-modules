/**
 * <directive>
 * @name tableFixed 列表
 * @description 可固定头部或左右侧列的列表指令，获取列表数据，展示分页，展示无数据提示等功能
 * @date 2018-02-26
 * @author 黄思飞
 * @lastBy
 * @htmlUrl scmsModules/table/tableFixed.html
 */
define(['angular', './tableFixed.css', './tableFixed.html'], function(
    angular,
    css,
    html
) {
    return function(app, elem, attrs, scope) {
        app.directive('tableFixedDirective', [
            'G',
            '$state',
            '$compile',
            '$timeout',
            function(G, $state, $compile, $timeout) {
                return {
                    template: html,
                    replace: true,
                    restrict: 'EA',
                    scope: {
                        fixedCol: '='
                    },
                    link: function postLink($scope, $element, $attrs) {},

                    controller: function(
                        $scope,
                        $element,
                        $attrs,
                        $transclude,
                        $log,
                        $http,
                        G
                    ) {
                        const $fixedTable = $('.fixed-table');
                        const $tableBox = $('.tablebox');
                        const $tableBoxTable = $('.tablebox .table');
                        const $fixLeft = $('.fix-left');
                        const $fixRight = $('.fix-right');
                        const $fixHeader = $('.fix-header');
                        const $fixHeaderOuter = $('.fix-header-outer');
                        const $fixRightThead = $fixRight.find('.fix-thead');
                        const $fixLeftThead = $fixLeft.find('.fix-thead');
                        let headerScrollLeft = 0;
                        let fixLeftTheadLeft = 0;
                        let fixRightTheadLeft = 0;
                        let fixLeftBorderLeftWidth = 0;
                        let fixRightBorderLeftWidth = 0;

                        let tableBoxScroll = function() {
                            $fixHeaderOuter.scrollLeft($tableBox.scrollLeft());
                            if ($tableBox.scrollLeft() > 0) {
                                $fixLeft.addClass('left-box-shadow');
                            } else {
                                $fixLeft.removeClass('left-box-shadow');
                            }
                            if (
                                $tableBox.find('table').width() -
                                    $tableBox.width() >
                                $tableBox.scrollLeft()
                            ) {
                                $fixRight.addClass('right-box-shadow');
                            } else {
                                $fixRight.removeClass('right-box-shadow');
                            }
                        };
                        $tableBox.scroll(tableBoxScroll);

                        let containerScroll = function() {
                            $fixedTable
                                .find('.outer-hide-scroll')
                                .height($fixHeader.height());
                            $fixHeaderOuter.outerWidth($tableBox.outerWidth());
                            let offsetTop = $tableBox.offset().top,
                                headerHeight = $('.container').outerHeight();
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

                        let windowScroll = function(){
                            if($('.tablebox').width()<1500){
                                let scrollLeft = $('html').scrollLeft();
                                $('.outer-hide-scroll')[0].style.left = headerScrollLeft - scrollLeft + 'px';
                                $fixLeftThead[0].style.left = fixLeftTheadLeft -  scrollLeft + fixLeftBorderLeftWidth + 'px';
                                $fixRightThead[0].style.left = fixRightTheadLeft -  scrollLeft + fixRightBorderLeftWidth + 'px';
                            }
                        };
                        $(window).scroll(windowScroll);

                        $(window).resize(function(){
                            containerScroll();
                            windowScroll();
                        });
                        $scope.$on('angularDomReady', function(a, tableDom) {
                            reset();
                            $fixRightThead.hide();
                            $fixLeftThead.hide();
                            if(!tableDom){
                                let headerThFromDom = $('.tablebox thead th');
                                angular.forEach(headerThFromDom, function(
                                    item,
                                    index
                                ) {
                                    item.style.width = 'auto';
                                });
                                return;
                            }
                            angular.forEach(tableDom.find('th'), function(
                                item
                            ) {
                                $(item).outerWidth($(item).outerWidth());
                            });
                            angular.forEach(tableDom.find('td'), function(
                                item
                            ) {
                                $(item).outerWidth($(item).outerWidth());
                            });
                            let colArray = $scope.fixedCol.split(' ');
                            $scope.fixHeader =
                                Number(colArray[0]) >= 1
                                    ? Number(colArray[0]) >= 1
                                    : false;
                            $scope.fixRight =
                                Number(colArray[1]) >= 1
                                    ? Number(colArray[1])
                                    : false;
                            $scope.fixLeft =
                                Number(colArray[3]) >= 1
                                    ? Number(colArray[3])
                                    : false;
                            let headerDom,
                                rightTdDom,
                                rightThDom,
                                leftThDom,
                                leftTdDom,
                                trDomList = tableDom.find('.tablebox tbody tr'),
                                thLength = tableDom.find('.tablebox th').length;

                            //头部固定
                            if ($scope.fixHeader) {
                                let headerThDom = $element.find(
                                        '.fix-header thead'
                                    ),
                                    headerDom = tableDom
                                        .find('.tablebox thead tr')
                                        .clone(),
                                    headerThFromDom = tableDom.find(
                                        '.tablebox thead th'
                                    ),
                                    headerTheadDom = tableDom.find(
                                        '.tablebox thead'
                                    );
                                angular.forEach(headerThFromDom, function(
                                    item,
                                    index
                                ) {
                                    $(headerDom.find('th')[index]).width(
                                        $(item).outerWidth()
                                    );
                                });
                                headerThDom.append(headerDom);
                            }
                            //右侧固定
                            if ($scope.fixRight) {
                                if (!$tableBoxTable.hasClass('fix-table')) {
                                    $tableBoxTable.addClass('fix-table');
                                }
                                let rightThTrDom = $element.find(
                                        '.fix-right thead tr'
                                    ),
                                    rightTbodyDom = $element.find(
                                        '.fix-right tbody'
                                    ),
                                    rightThFromDom = tableDom
                                        .find('.tablebox th')
                                        .slice(
                                            thLength - $scope.fixRight,
                                            thLength
                                        );
                                rightThDom = rightThFromDom.clone();
                                angular.forEach(rightThFromDom, function(
                                    item,
                                    index
                                ) {
                                    $(rightThDom[index]).width(
                                        $(item).outerWidth()
                                    );
                                    $(rightThDom[index]).height(
                                        $(item).outerHeight()
                                    );
                                });
                                rightThTrDom.append(rightThDom);

                                let tempDom = $('<tbody></tbody>');
                                angular.forEach(trDomList, function(tr, index){
                                    let trDom = $(tr).clone();
                                    trDom.empty();
                                    trDom.append(
                                        $(tr)
                                            .find('td')
                                            .slice(
                                                thLength - $scope.fixRight,
                                                thLength
                                            )
                                            .clone()
                                    );
                                    trDom.removeAttr('ng-init');
                                    tempDom.append($compile(trDom)($scope.$parent.$parent));
                                });
                                $timeout(function(){
                                    angular.forEach(tempDom.children(), function(item, index){
                                        let tens = Math.floor(index/trDomList.length);
                                        let units = index%trDomList.length;
                                        if(tens===units){
                                            $(item).height($(trDomList[tens]).height())
                                            rightTbodyDom.append(item);
                                        }
                                    });
                                });
                            }
                            //底部固定TODO
                            
                            //左侧固定
                            if ($scope.fixLeft) {
                                if (!$tableBoxTable.hasClass('fix-table')) {
                                    $tableBoxTable.addClass('fix-table');
                                }
                                let leftThTrDom = $element.find(
                                        '.fix-left thead tr'
                                    ),
                                    leftTbodyDom = $element.find(
                                        '.fix-left tbody'
                                    ),
                                    leftThFromDom = tableDom
                                        .find('.tablebox th')
                                        .slice(0, $scope.fixLeft);
                                leftThDom = leftThFromDom.clone();
                                angular.forEach(leftThFromDom, function(
                                    item,
                                    index
                                ) {
                                    $(leftThDom[index]).width(
                                        $(item).outerWidth()
                                    );
                                    $(leftThDom[index]).height(
                                        $(item).outerHeight()
                                    );
                                });
                                leftThTrDom.append(leftThDom);

                                let tempDom = $('<tbody></tbody>');
                                angular.forEach(trDomList, function(tr, index){
                                    let trDom = $(tr).clone();
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
                                $timeout(function(){
                                    angular.forEach(tempDom.children(), function(item, index){
                                        let tens = Math.floor(index/trDomList.length);
                                        let units = index%trDomList.length;
                                        if(tens===units){
                                            $(item).height($(trDomList[tens]).height())
                                            leftTbodyDom.append(item);
                                        }
                                    });
                                });
                            }

                            if ($tableBox.scrollLeft() > 0) {
                                $fixLeft.addClass('left-box-shadow');
                            } else {
                                $fixLeft.removeClass('left-box-shadow');
                            }
                            if (
                                $tableBox.find('table').width() -
                                    $tableBox.width() >
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

                            let hoverStyle = function(){
                                let $tableBoxTr = $('.tablebox tbody tr');
                                let $fixLeftTr = $('.fixed-table .fix-left tbody tr');
                                let $fixRightTr = $('.fixed-table .fix-right tbody tr');

                                $tableBoxTr.hover(function(){
                                    let hoverIndex = $tableBoxTr.index(this);
                                    $fixLeftTr.eq(hoverIndex).addClass('fix-table-hover');
                                    $fixRightTr.eq(hoverIndex).addClass('fix-table-hover');
                                },function(){
                                    let hoverIndex = $tableBoxTr.index(this);
                                    $fixLeftTr.eq(hoverIndex).removeClass('fix-table-hover');
                                    $fixRightTr.eq(hoverIndex).removeClass('fix-table-hover');
                                });

                                $fixLeftTr.hover(function(){
                                    let hoverIndex = $fixLeftTr.index(this);
                                    $tableBoxTr.eq(hoverIndex).addClass('fix-table-hover');
                                    $fixRightTr.eq(hoverIndex).addClass('fix-table-hover');
                                },function(){
                                    let hoverIndex = $fixLeftTr.index(this);
                                    $tableBoxTr.eq(hoverIndex).removeClass('fix-table-hover');
                                    $fixRightTr.eq(hoverIndex).removeClass('fix-table-hover');
                                });

                                $fixRightTr.hover(function(){
                                    let hoverIndex = $fixRightTr.index(this);
                                    $fixLeftTr.eq(hoverIndex).addClass('fix-table-hover');
                                    $tableBoxTr.eq(hoverIndex).addClass('fix-table-hover');
                                },function(){
                                    let hoverIndex = $fixRightTr.index(this);
                                    $fixLeftTr.eq(hoverIndex).removeClass('fix-table-hover');
                                    $tableBoxTr.eq(hoverIndex).removeClass('fix-table-hover');
                                });
                            }
                            $timeout(function(){
                                hoverStyle();
                                headerScrollLeft = $('.outer-hide-scroll').offset().left;
                                fixLeftTheadLeft = $('.fixed-table .fix-left').offset().left;
                                fixLeftBorderLeftWidth = Number(($('.fixed-table .fix-left').css('borderLeftWidth')).replace('px',''));
                                fixRightTheadLeft = $('.fixed-table .fix-right').offset().left;
                                fixRightBorderLeftWidth = Number(($('.fixed-table .fix-right').css('borderLeftWidth')).replace('px',''));
                            });
                            
                        });
                    }
                };
            }
        ]);
    };
});
