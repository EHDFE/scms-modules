define([
	'angular',
	'./paginationMini.html'
], function(
	angular,
	html) {
	return function(app, elem, attrs, scope) {
		app.directive('paginationMiniDirective', [function() {
			return {
				template: html,
				restrict: 'EA',
				replace: true,
				scope: {
                    currentPage:'=',	//number 当前页码
                    totalCount: '=',	//number 列表数据总数
                    pageSize: '='
                },
				link: function postLink($scope, $element, $attrs) {
					
				},

				controller: function($scope,$element,$attrs,$transclude,$log,$http,G){
					$scope.eachCount = $attrs.eachcount || $attrs.eachCount || $scope.pageSize || 20;
					$scope.pages = [];

					$scope.$watch("totalCount", function(newValue, oldValue) {
						if(!newValue && newValue !== 0) {
							return;
						}
						$scope.eachCount = $attrs.eachcount || $attrs.eachCount || $scope.pageSize || 20;
						$scope.maxPage = newValue % $scope.eachCount > 0 ? 
									parseInt(newValue/$scope.eachCount, 10) + 1 : newValue/$scope.eachCount;
						$scope.pages = pushPages($scope.currentPage, $scope.maxPage);
						$scope.isShowAfEllipsis = $scope.currentPage < ($scope.maxPage - 2) && $scope.maxPage > 5 ? true : false;
						$scope.isShowBeEllipsis = $scope.currentPage > 3 && $scope.maxPage > 5 ? true : false;
					});

					var pushPages = function(centerPage, maxPage) {
						var pages = [];
						if(centerPage < 3) {
							centerPage = 3;
						}
						if(centerPage > maxPage - 2) {
							centerPage = maxPage - 2;
						}
						if(maxPage >= centerPage - 1) {
							pages.push(centerPage - 1);
						}
						if(maxPage >= centerPage) {
							pages.push(centerPage);
						}
						if(maxPage >= centerPage + 1) {
							pages.push(centerPage + 1);
						}
						var newPages = [];
						angular.forEach(pages, function(item) {
							if(item > 1 && item < maxPage) {
								newPages.push(item);
							}
							
						})
						return newPages;
					};

					$scope.goPage = function(page) {
						if(!page || page < 1 || page > $scope.maxPage) {
							return;
						}
						$scope.currentPage = page;
					};

					$scope.$watch("currentPage", function(newValue, oldValue) {
						if(!newValue || !$scope.maxPage) {
							return;
						}
						$scope.pages = pushPages(newValue, $scope.maxPage);
						$scope.isShowAfEllipsis = newValue < ($scope.maxPage - 2) && $scope.maxPage > 5 ? true : false;
						$scope.isShowBeEllipsis = newValue > 3 && $scope.maxPage > 5 ? true : false;
					});
					
					$scope.$watch("number", function(newValue, oldValue) {
						if(newValue < 1) {
							$scope.number = 1;
						}
						else if(newValue > $scope.maxPage) {
							$scope.number = $scope.maxPage;
						}
					});

				}
			};
		}]);
	}
});