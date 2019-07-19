'use strict';

angular.module('Parametrics')
    .controller('parametrics.index', ['$scope', 'parametricService',
        function ($scope, parametricService) {
            $scope.setup = function()
            {
                $scope.parametricEditing = {};
                $scope.parametricTypeSelected = null;
                $scope.parametricsSelectedToEdit = {};
                $scope.parametricTypes = parametricService.getParametricTypes();
                $scope.secretaryshipDepartmentSelected=null;
                $scope.degreeAreaSelected=null;
                $scope.undavCareerSelected=null;
                $scope.tipoDeFormacionSelected=null;
                $scope.parametricsSelectedToEditReady = false;
                parametricService.getParametrics(refreshParametrics);
            }
            
            $scope.changeParametricsToEdit = function()
            {
                cleanFirstChildOfParametricType();
                setSelectedParametricsToListAndEdit();
                $scope.parametricEditing.name = null;
            }

            $scope.secretaryshipDepartmentChanged=function()
            {
                if($scope.parametricTypeSelected == 'undavCareer' )
                {
                    $scope.parametricsSelectedToEdit = $scope.parametrics['secretaryshipDepartment'][$scope.secretaryshipDepartmentSelected].careers;
                    $scope.parametricsSelectedToEditReady = true;
                }

                if($scope.parametricTypeSelected == 'subject')
                {
                    $scope.parametricsSelectedToEditReady = false;
                }
            }

            $scope.careerChanged=function()
            {
                $scope.parametricsSelectedToEdit = $scope.parametrics['secretaryshipDepartment'][$scope.secretaryshipDepartmentSelected].careers[$scope.undavCareerSelected].subjects;
                $scope.parametricsSelectedToEditReady = true;
            }
            $scope.degreeAreaChanged = function(){
                if($scope.parametricTypeSelected == 'career')
                {
                    $scope.parametricsSelectedToEdit = $scope.parametrics['degreeArea'][$scope.degreeAreaSelected].careers;
                    $scope.parametricsSelectedToEditReady = true;
                }
            }

            $scope.tipoDeFormacionChanged = function(){
                if($scope.parametricTypeSelected == 'gradoDeTitulacion')
                {
                    $scope.parametricsSelectedToEdit = $scope.parametrics['tipoDeFormacion'][$scope.tipoDeFormacionSelected].gradoDeTitulacion;
                    $scope.parametricsSelectedToEditReady = true;
                }
            }

            $scope.organismoDeCategorizacionChanged = function(){
                if($scope.parametricTypeSelected == 'categoria')
                {
                    $scope.parametricsSelectedToEdit = $scope.parametrics['organismoDeCategorizacion'][$scope.organismoDeCategorizacionSelected].categoria;
                    $scope.parametricsSelectedToEditReady = true;
                }
            }

            $scope.getParametricPathReference = function(){
                var pathReference = $scope.parametricTypeSelected;
                if($scope.parametricTypeSelected == 'undavCareer')
                {
                    pathReference = 'secretaryshipDepartment/'+$scope.secretaryshipDepartmentSelected+'/careers';
                }
                if($scope.parametricTypeSelected == 'subject')
                {
                    pathReference = 'secretaryshipDepartment/'+$scope.secretaryshipDepartmentSelected+'/careers/'+$scope.undavCareerSelected+'/subjects';
                }
                if($scope.parametricTypeSelected == 'career')
                {
                    pathReference = 'degreeArea/'+$scope.degreeAreaSelected+'/careers';
                }
                if($scope.parametricTypeSelected == 'gradoDeTitulacion')
                {
                    pathReference = 'tipoDeFormacion/'+$scope.tipoDeFormacionSelected+'/gradoDeTitulacion';
                }
                if($scope.parametricTypeSelected == 'categoria')
                {
                    pathReference = 'organismoDeCategorizacion/'+$scope.organismoDeCategorizacionSelected+'/categoria';
                }
                return pathReference;
            }
            var refreshParametrics = function(parametrics)
            {
                $scope.parametrics = parametrics;
                var flag = true;

                if($scope.parametricTypeSelected == 'undavCareer' && $scope.secretaryshipDepartmentSelected != null)
                {
                    $scope.parametricsSelectedToEdit = $scope.parametrics['secretaryshipDepartment'][$scope.secretaryshipDepartmentSelected].careers
                    flag = false;
                }

                if($scope.parametricTypeSelected == 'subject' && $scope.secretaryshipDepartmentSelected != null && $scope.undavCareerSelected!= null)
                {
                    $scope.parametricsSelectedToEdit = $scope.parametrics['secretaryshipDepartment'][$scope.secretaryshipDepartmentSelected].careers[$scope.undavCareerSelected].subjects;
                    flag = false;
                }

                if($scope.parametricTypeSelected == 'career' && $scope.degreeAreaSelected != null)
                {
                    $scope.parametricsSelectedToEdit = $scope.parametrics['degreeArea'][$scope.degreeAreaSelected].careers;
                    flag = false;
                }

                if($scope.parametricTypeSelected == 'gradoDeTitulacion' && $scope.tipoDeFormacionSelected != null)
                {
                    $scope.parametricsSelectedToEdit = $scope.parametrics['tipoDeFormacion'][$scope.tipoDeFormacionSelected].gradoDeTitulacion;
                    flag = false;
                }

                if($scope.parametricTypeSelected == 'categoria' && $scope.organismoDeCategorizacionSelected != null)
                {
                    $scope.parametricsSelectedToEdit = $scope.parametrics['organismoDeCategorizacion'][$scope.organismoDeCategorizacionSelected].categoria;
                    flag = false;
                }

                if(flag && $scope.parametricTypeSelected !=null)
                {
                    $scope.parametricsSelectedToEdit = isNullOrUndefined($scope.parametrics) ? {} : $scope.parametrics[$scope.parametricTypeSelected];
                }
            }

            var cleanFirstChildOfParametricType = function()
            {
                $scope.secretaryshipDepartmentSelected = null;
                $scope.undavCareerSelected = null;
                $scope.degreeAreaSelected = null;
            }

            var setSelectedParametricsToListAndEdit = function()
            {
                if ($scope.parametricTypeSelected == null || $scope.parametricTypeSelected == 'undavCareer' || $scope.parametricTypeSelected == 'subject' || $scope.parametricTypeSelected == 'career' || $scope.parametricTypeSelected == 'gradoDeTitulacion' || $scope.parametricTypeSelected == 'categoria')
                {
                    $scope.parametricsSelectedToEdit = {};
                    $scope.parametricsSelectedToEditReady = false;
                }else
                {
                    $scope.parametricsSelectedToEdit = isNullOrUndefined($scope.parametrics) ? {} : $scope.parametrics[$scope.parametricTypeSelected];
                    $scope.parametricsSelectedToEditReady = true;
                }
            }

            $scope.setup();
        }
    ]);

angular.module('Parametrics')
    .controller('parametrics.new', ['$scope', 'parametricService',
        function ($scope, parametricService) {
            $scope.setup = function()
            {
                $scope.composedParametricEditing = {};
                $scope.parametricSaved = false;
                $scope.isNewParametric = true;
            }
            $scope.save = function()
            {
                $scope.parametricSaved = false;
                parametricService.saveParametric($scope.getParametricPathReference(),$scope.parametricEditing, onParametricSaved);
            }
            $scope.parametricValidation = function(parametricType){
                $scope.isNewParametric = true;

                if(parametricType == 'career'){
                    setIsNewParametric($scope.parametrics['degreeArea'][$scope.degreeAreaSelected].careers);
                }
                if(parametricType == 'undavCareer'){
                    setIsNewParametric($scope.parametrics['secretaryshipDepartment'][$scope.secretaryshipDepartmentSelected].careers);
                }
                if(parametricType == 'subject'){
                    setIsNewParametric($scope.parametrics['secretaryshipDepartment'][$scope.secretaryshipDepartmentSelected].careers[$scope.undavCareerSelected].subjects);
                }
                if(parametricType == 'gradoDeTitulacion'){
                    setIsNewParametric($scope.parametrics['tipoDeFormacion'][$scope.tipoDeFormacionSelected].gradoDeTitulacion);
                }
                if(parametricType == 'categoria'){
                    setIsNewParametric($scope.parametrics['organismoDeCategorizacion'][$scope.organismoDeCategorizacionSelected].categoria);
                }
                else{
                    setIsNewParametric($scope.parametrics[parametricType]);
                }
            }
            var setIsNewParametric = function(parametricList){
                for (var parametricItem in parametricList) {
                    if(parametricList[parametricItem].name == $scope.parametricEditing.name)
                    {
                        $scope.isNewParametric = false;
                    }
                }
            },
                onParametricSaved = function()
            {
                $scope.parametricSaved = true;
                setNewParametric();
                $scope.$apply();
            },
                setNewParametric = function(){
                    $scope.parametricEditing = {};
                }
            $scope.setup();
        }
    ]);

angular.module('Parametrics')
    .controller('parametrics.editInLine', ['$scope', '$mdDialog', '$filter', 'parametricService', 'researcherService',
        function ($scope, $mdDialog,$filter, parametricService, researcherService) {
            $scope.setup = function ()
            {
                $scope.parametricEditing = {id:null};
                cleanParametricEditingForm();
                $scope.firstTime = true;
                loadResearchers();
                $scope.status= null;
            }
            $scope.saveEditing = function()
            {
                parametricService.saveParametric($scope.getParametricPathReference(),$scope.parametricEditingForm.parametricEditing, onParametricEditUpdated);
            }
            $scope.cancelEditing = function()
            {
                cleanParametricEditingForm();
            }

            $scope.edit = function(parametric)
            {
                $scope.parametricEditingForm.parametricEditing = angular.copy(parametric);
            }

            $scope.deleteParametric = function (parametric) {
                var pathReference = getPathReferenceFor($scope.parametricTypeSelected);
                var researchersWithParametric = getResearchersWithParametric(parametric);
                if(researchersWithParametric.length == 0){
                    parametricService.removeParametric(pathReference, parametric);
                }else{
                    console.log('hay researchers')
                    showConfirm(parametric, pathReference, researchersWithParametric);
                }
            }

            var loadResearchers = function () {
                    researcherService.getResearchers(refreshResearchers);
                },
                refreshResearchers = function(researchers){
                    if(researchers == null || Object.keys(researchers).length==0){
                        $scope.researchers = null;
                    }else{
                        $scope.researchers = researchers;
                    }
                    if($scope.firstTime)
                    {
                        $scope.$apply();
                        $scope.firstTime = false;
                    }
                },

                onParametricEditUpdated = function()
                {
                    cleanParametricEditingForm();
                    $scope.$apply();
                },

                cleanParametricEditingForm = function(){
                    $scope.parametricEditingForm = {parametricEditing : {id :null}};
                },
                getResearchersWithParametric = function (parametric) {
                    var items = $filter('toArray')($scope.researchers);
                    var filteredItems = $filter('filter')(items, parametric.id);
                    return filteredItems;
                },
                showConfirm = function(parametric, pathReference, reserchersWithParametric) {
                    var confirm = $mdDialog.confirm()
                        .title('Algunos investigadores tienen asociada esta paramétrica')
                        .textContent('¿Desea quitarla de los investigadores y eliminar esta paramétrica?')
                        .ok('Si')
                        .cancel('No');
    
                    $mdDialog.show(confirm).then(function() {
                        for(var researcher in reserchersWithParametric){
                            deleteParametricInResearcher(parametric, reserchersWithParametric[researcher]);
                        }
                        parametricService.removeParametric(pathReference, parametric);
                    }, function() {
                    });
                },

                deleteParametricInResearcher = function (parametric, researcher) {
                    var path = '/';
                    if($scope.parametricTypes[$scope.parametricTypeSelected].page=='formation'){
                        for (var formation in researcher.formations) {
                            if(researcher.formations[formation][$scope.parametricTypes[$scope.parametricTypeSelected].type] == parametric.id){
                                path = 'formations/'+ formation+ '/'+$scope.parametricTypes[$scope.parametricTypeSelected].type ;
                                    researcherService.removeParametric(researcher, parametric, path);
                                }
                            }
                    }
                    if($scope.parametricTypes[$scope.parametricTypeSelected].page=='position'){
                        for (var position in researcher.positions) {
                            if($scope.parametricTypeSelected == 'undavCareer'){
                                path = 'positions/'+ position +'/career';
                                if(researcher.positions[position][$scope.parametricTypes['career'].type] == parametric.id){
                                    researcherService.removeParametric(researcher, parametric, path);
                                }
                            }else{
                                path = 'positions/'+ position+ '/'+$scope.parametricTypes[$scope.parametricTypeSelected].type;
                                if(researcher.positions[position][$scope.parametricTypes[$scope.parametricTypeSelected].type] == parametric.id){
                                    researcherService.removeParametric(researcher, parametric, path);
                                }
                            }
                        }
                    }
                },
                getPathReferenceFor = function (parametricTypeSelected) {
                    if(parametricTypeSelected == 'undavCareer')
                    {
                        return 'secretaryshipDepartment/'+$scope.secretaryshipDepartmentSelected+'/careers';
                    }
                    if(parametricTypeSelected == 'subject')
                    {
                        return 'secretaryshipDepartment/'+$scope.secretaryshipDepartmentSelected+'/careers/'+$scope.undavCareerSelected+'/subjects';
                    }
                    if(parametricTypeSelected == 'career')
                    {
                        return 'degreeArea/'+$scope.degreeAreaSelected+'/careers';
                    }
                    if(parametricTypeSelected == 'gradoDeTitulacion')
                    {
                        return 'tipoDeFormacion/'+$scope.tipoDeFormacionSelected+'/gradoDeTitulacion';
                    }
                    if(parametricTypeSelected == 'categoria')
                    {
                        return 'organismoDeCategorizacion/'+$scope.organismoDeCategorizacionSelected+'/categoria';
                    }

                    return  parametricTypeSelected;
                };


            $scope.setup();
        }]);
