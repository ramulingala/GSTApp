 (function(module) {
	 gst.controllers = _.extend(module, {
    InterestRateChartController: function(scope, routeParams, resourceFactory, location,$modal) {
        scope.edit = function(id){
            location.path('/editinterestratechart/' + id);
        };
        scope.productName = routeParams.productName;
        scope.productId = routeParams.productId;
        scope.productsLink = '';
        scope.viewProductLink = '';
        scope.productType = routeParams.productType;
        if ( routeParams.productType === 'fixeddepositproduct'){
          scope.productsLink = 'fixeddepositproducts';
          scope.viewProductLink = 'viewfixeddepositproduct';
        }else if ( routeParams.productType === 'recurringdepositproduct'){
          scope.productsLink = 'recurringdepositproducts';
          scope.viewProductLink = 'viewrecurringdepositproduct';
        }

        resourceFactory.interestRateChartResource.getAllInterestRateCharts({productId: routeParams.productId}, function(data) {
            scope.charts = data;
            _.each(scope.charts,function(chart){
                scope.chartSlabs = chart.chartSlabs;
            });

        });

        scope.incentives = function(index,parent){
            $modal.open({
                templateUrl: 'incentive.html',
                controller: IncentiveCtrl,
                resolve: {
                    chartSlab: function () {
                        return scope.charts[parent].chartSlabs[index];
                    }
                }
            });
        }

        var IncentiveCtrl = function ($scope, $modalInstance, chartSlab) {
            $scope.chartSlab = chartSlab;
            _.each($scope.chartSlab.incentives, function (incentive) {
                if(!incentive.attributeValueDesc){
                    incentive.attributeValueDesc = incentive.attributeValue;
                }
            });
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };


    }
  });
	 gst.ng.application.controller('InterestRateChartController', ['$scope', '$routeParams', 'ResourceFactory','$location','$modal', gst.controllers.InterestRateChartController]).run(function($log) {
    $log.info("InterestRateChartController initialized");
  });
}(gst.controllers || {}));
