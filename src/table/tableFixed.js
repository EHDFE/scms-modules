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
            function(G, $state) {
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

                        $tableBox.scroll(function() {
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
                        });
                        $('#container').scroll(function() {
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
                        });

                        $scope.$on('angularDomReady', function(a, tableDom) {
                            reset();
                            $fixRightThead.hide();
                            $fixLeftThead.hide();
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
                                });
                                rightThTrDom.append(rightThDom);
                                let tdDomList = [];
                                angular.forEach(trDomList, function(tr) {
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
                                    trDom.height($(tr).height());
                                    rightTbodyDom.append(trDom);
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
                                });
                                leftThTrDom.append(leftThDom);
                                let tdDomList = [];
                                angular.forEach(trDomList, function(tr) {
                                    let trDom = $(tr).clone();
                                    trDom.empty();
                                    trDom.append(
                                        $(tr)
                                            .find('td')
                                            .slice(0, $scope.fixLeft)
                                            .clone()
                                    );
                                    trDom.height($(tr).height());
                                    leftTbodyDom.append(trDom);
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
                        });
                    }
                };
            }
        ]);
    };
});
