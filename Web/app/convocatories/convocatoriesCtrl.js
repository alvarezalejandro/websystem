'use strict';

angular.module('Convocatories')
    .controller('convocatories.index', ['$scope',
        function ($scope) {
            $scope.setup = function()
            {
            }
        }
    ]);

angular.module('Convocatories')
    .controller('convocatories.list', ['$scope','$filter','convocatoryService',
        function ($scope,$filter, convocatoryService) {
            $scope.setup = function()
            {
                $scope.activoBinario = ["Si","No"];
                $scope.activosSeleccionados = [];
                $scope.searchText = '';
                $scope.searchYearText = '';
                $scope.firstTime = true;
                $scope.filteredConvocatories = [];
                $scope.pages = [];
                loadConvocatories();
                $scope.currentPage = 0;
                $scope.pageSize = 10;
                $scope.search();
            };
            $scope.search = function()
            {
                var items = $filter('toArray')($scope.convocatories);
                $scope.filteredConvocatories = $filter('filter')(items, $scope.searchText);
                if(typeof $scope.searchText == 'string' && $scope.searchText != ''){
                    $scope.filteredConvocatories = $filter('filter')($scope.filteredConvocatories, function(value) {return value.type.toLowerCase().includes($scope.searchText.toLowerCase())});
                }
                if(typeof $scope.searchYearText == 'string' && $scope.searchYearText != ''){
                    $scope.filteredConvocatories = $filter('filter')($scope.filteredConvocatories, function(value) { return value.year== $scope.searchYearText});
                }
                if($scope.activosSeleccionados.length == 1){
                    $scope.filteredConvocatories = $filter('filter')($scope.filteredConvocatories, function(value){ return $scope.activosSeleccionados.includes("Si") ? $scope.convocatoriaActiva(value) : !$scope.convocatoriaActiva(value)});
                }
                if(items.length != $scope.filteredConvocatories.length)
                {
                    configPages($scope.filteredConvocatories);
                }
            };
            $scope.convocatoriaActiva = function(convocatoria) {
                var today = new Date(Date.now());
                if(convocatoria.endDate != null || new Date(convocatoria.endDate) <= today){
                    return false;
                }
                else{
                    return true;
                }
            };
            $scope.exists = function (item, items) {
                return items.indexOf(item) > -1;
            };
            $scope.toggle = function (item, items) {
                var idx = items.indexOf(item);
                if (idx > -1) {
                    items.splice(idx, 1);
                }
                else {
                    items.push(item);
                }
            };

            var loadConvocatories = function () {
                convocatoryService.getConvocatories(refreshConvocatories);
            },
                refreshConvocatories = function (convocatories) {
                    if(convocatories == null || Object.keys(convocatories).length==0){
                        $scope.convocatories = null;
                    }else{
                        $scope.convocatories = convocatories;
                        $scope.filteredConvocatories = $filter('toArray')(convocatories);
                        convertStringToDate();
                        configPages((Object.keys($scope.convocatories)));
                    }
                    if($scope.firstTime)
                    {
                        convertStringToDate();
                        $scope.$apply();
                        $scope.firstTime = false;
                    }
                },
                convertStringToDate = function () {
                    for (var convocatory in $scope.convocatories) {
                        if (typeof $scope.convocatories[convocatory].startDate === 'string') {
                            $scope.convocatories[convocatory].startDate = new Date($scope.convocatories[convocatory].startDate);
                        }
                        if (typeof $scope.convocatories[convocatory].endDate === 'string') {
                            $scope.convocatories[convocatory].endDate = new Date($scope.convocatories[convocatory].endDate);
                        }
                    }
                },
                configPages = function(items) {
                    $scope.pages.length = 0;
                    var ini = $scope.currentPage - 4;
                    var fin = $scope.currentPage + 5;
                    if($scope.convocatories != null || $scope.convocatories != undefined){
                        if (ini < 1) {
                            ini = 1;
                            if (Math.ceil(items.length / $scope.pageSize) > 10)
                                fin = 10;
                            else
                                fin = Math.ceil(items.length  / $scope.pageSize);
                        } else {
                            if (ini >= Math.ceil(items.length  / $scope.pageSize) - 10) {
                                ini = Math.ceil(items.length / $scope.pageSize) - 10;
                                fin = Math.ceil(items.length  / $scope.pageSize);
                            }
                        }
                        if (ini < 1) ini = 1;
                        for (var i = ini; i <= fin; i++) {
                            $scope.pages.push({
                                no: i
                            });
                        }
        
                        if ($scope.currentPage >= $scope.pages.length)
                            $scope.currentPage = $scope.pages.length - 1;
                        }
                };
            $scope.setup();
        }
    ]);

angular.module('Convocatories')
    .controller('convocatories.new', ['$scope', 'convocatoryService','$stateParams',
        function ($scope, convocatoryService, $stateParams) {
            $scope.setup = function() {
                if (isAddingANewConvocatory()) {
                    $scope.convocatoryEditing = {
                        id: null,
                        startDate : null,
                        endDate: null,
                        type: null
                    };
                }else{
                    convocatoryService.getConvocatory($stateParams.id, setConcocatoriesToEdit);
                }
                $scope.convocatorySaved = false;
            };


            $scope.save = function () {
                if($scope.convocatoryEditing.startDate != undefined){
                    if (typeof $scope.convocatoryEditing.startDate != 'string') {
                        $scope.convocatoryEditing.startDate = $scope.convocatoryEditing.startDate.toJSON();
                    }
                }
                if($scope.convocatoryEditing.endDate != undefined){
                    if (typeof $scope.convocatoryEditing.endDate != 'string') {
                        $scope.convocatoryEditing.endDate = $scope.convocatoryEditing.endDate.toJSON();
                    }
                }
                $scope.convocatorySaved = false;
                convocatoryService.save($scope.convocatoryEditing, onConvocatorySaved);
            };

            var onConvocatorySaved = function () {
                $scope.convocatorySaved = true;
                $scope.$apply();
            },
                isAddingANewConvocatory=function () {
                    return $stateParams.id == undefined;
            },
                setConcocatoriesToEdit = function (convocatory) {
                    $scope.convocatoryEditing = convocatory;
                    if (typeof $scope.convocatoryEditing.startDate === 'string') {
                        $scope.convocatoryEditing.startDate = new Date($scope.convocatoryEditing.startDate);
                    }
                    if (typeof $scope.convocatoryEditing.endDate === 'string') {
                        $scope.convocatoryEditing.endDate = new Date($scope.convocatoryEditing.endDate);
                    }
                };

            $scope.setup();
        }
    ]);

angular.module('Convocatories')
    .controller('convocatories.convocatoryData', ['$scope',
        function ($scope) {
            $scope.setup = function()
            {
                $scope.binaryStates = [{name:'Si', value:true},{name:'No', value:false}];
            }

        }
    ]);

