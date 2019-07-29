'use strict';

angular.module('Projects')
.controller('projects.index', ['$scope',
        function ($scope) {
            $scope.setup = function()
            {
            };
        }
    ]);

angular.module('Projects')
    .controller('projects.list', ['$scope','$filter','convocatoryService','parametricService',
        function ($scope,$filter,convocatoryService, parametricService) {
            $scope.setup = function()
            {
                $scope.searchText = '';
                $scope.financiadoBinario = ["Si","No"];
                $scope.activoBinario = ["Si","No"];
                $scope.activosSeleccionados = [];
                $scope.financiadosSeleccionados = [];
                $scope.secretariasSeleccionadas = [];
                $scope.areasSeleccionadas = [];
                $scope.filteredProjects = [];
                $scope.pages = [];
                loadConvocatories();
                loadParametrics();
                $scope.convocatorySelected = null;
                $scope.currentPage = 0;
                $scope.pageSize = 10;
            };
            $scope.changeConvocatoriesToEdit = function()
            {
                setProjectsToListAndEdit();
            };
            $scope.proyectoActivo = function(proyecto) {
                var today = new Date(Date.now());
                if(proyecto.fechaDeBaja != null || new Date(proyecto.fechaDeBaja) <= today){
                    return false;
                }
                else{
                    return true;
                }
            };
            $scope.search = function()
            {
                var items = $filter('toArray')($scope.projects);
                $scope.filteredProjects = $filter('filter')(items, $scope.searchText);
                if(typeof $scope.searchText == 'string' && $scope.searchText != ''){
                    $scope.filteredProjects = $filter('filter')($scope.filteredProjects, function(value) { return value.projectName.toLowerCase().includes($scope.searchText.toLowerCase())});
                }
                if($scope.activosSeleccionados.length == 1){
                    $scope.filteredProjects = $filter('filter')($scope.filteredProjects, function(value){ return $scope.activosSeleccionados.includes("Si") ? $scope.proyectoActivo(value) : !$scope.proyectoActivo(value)});
                }
                if($scope.financiadosSeleccionados.length == 1){
                    $scope.filteredProjects = $filter('filter')($scope.filteredProjects, function(value){ return $scope.financiadosSeleccionados.includes("Si") ? value.totalAmountOfSubsidy > 0 : value.totalAmountOfSubsidy == 0});
                }
                if($scope.secretariasSeleccionadas.length > 0){
                    $scope.filteredProjects = $filter('filter')($scope.filteredProjects, function(value){
                        if(typeof value.firstSecretaryshipDepartment == 'string'){
                            for(var i = 0; i < $scope.secretariasSeleccionadas.length; i++ ){
                                if($scope.secretariasSeleccionadas[i].name == $scope.parametrics['secretaryshipDepartment'][value.firstSecretaryshipDepartment].name){
                                    return true;
                                }
                            }
                            return false;
                        }
                        return false;
                    });
                }
                if($scope.areasSeleccionadas.length > 0){
                    $scope.filteredProjects = $filter('filter')($scope.filteredProjects, function(value){
                        if(typeof value.applicationDiscipline == 'string'){
                            for(var i = 0; i < $scope.areasSeleccionadas.length; i++ ){
                                if($scope.areasSeleccionadas[i].name == $scope.parametrics['degreeArea'][value.applicationDiscipline].name){
                                    return true;
                                }
                            }
                            return false;
                        }
                        return false;
                    });
                }
                if(items.length != $scope.filteredProjects.length)
                {
                    configPages($scope.filteredProjects);
                }
            };
            $scope.exists = function (item, items) {
                return items.indexOf(item) > -1;
            };
            $scope.isCheckedSecretarias = function() {
                return $scope.secretariasSeleccionadas.length === $filter('toArray')($scope.parametrics['secretaryshipDepartment']).length;
            };
            $scope.isCheckedAreas = function() {
                return $scope.areasSeleccionadas.length === $filter('toArray')($scope.parametrics['degreeArea']).length;
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
            $scope.toggleAllSecretarias = function() {
                if ($scope.secretariasSeleccionadas.length === $filter('toArray')($scope.parametrics['secretaryshipDepartment']).length) {
                  $scope.secretariasSeleccionadas = [];
                } else if ($scope.secretariasSeleccionadas.length === 0 || $scope.secretariasSeleccionadas.length > 0) {
                    $scope.secretariasSeleccionadas = $filter('toArray')($scope.parametrics['secretaryshipDepartment']);
                }
            };
            $scope.toggleAllAreas = function() {
                if ($scope.areasSeleccionadas.length === $filter('toArray')($scope.parametrics['degreeArea']).length) {
                  $scope.areasSeleccionadas = [];
                } else if ($scope.areasSeleccionadas.length === 0 || $scope.areasSeleccionadas.length > 0) {
                    $scope.areasSeleccionadas = $filter('toArray')($scope.parametrics['degreeArea']);
                }
            };
            var configPages = function(items) {
                $scope.pages.length = 0;
                var ini = $scope.currentPage - 4;
                var fin = $scope.currentPage + 5;
                if($scope.projects != null || $scope.projects != undefined){
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
                },
                    loadParametrics = function () {
                        parametricService.getParametrics(refreshParametrics);
                    },
                    refreshParametrics = function (parametrics) {
                        $scope.parametrics = parametrics;
                    },
                    loadConvocatories = function () {
                        convocatoryService.getConvocatories(refreshConvocatories);
                    },
                    refreshConvocatories = function (convocatories) {
                        $scope.convocatories = convocatories;
                        $scope.$apply();
                    },
                    setProjectsToListAndEdit = function(){
                        $scope.projects =  isNullOrUndefined($scope.convocatories[$scope.convocatorySelected].projects) ? {} : $scope.convocatories[$scope.convocatorySelected].projects;
                        $scope.filteredProjects = $scope.projects;
                    
                };
        }
    ]);

angular.module('Projects')
    .controller('projects.projectData', ['$scope',
        function ($scope) {
            $scope.setup = function()
            {
            }
        }
    ]);

angular.module('Projects')
    .controller('projects.new', ['$scope','convocatoryService','parametricService','projectService','$stateParams',
        function ($scope, convocatoryService, parametricService,projectService, $stateParams) {
            $scope.setup = function()
            {
                if (isAddingANewProject()) {
                    $scope.projectEditing = {
                        id: null
                    };
                } else {
                    projectService.getProject($stateParams.idConvocatory, $stateParams.idProject, setProjectsToEdit);
                }
                $scope.projectSaved = false;
                loadConvocatories();
                loadParametrics();
                $scope.binarySeletions = [{name:'Si', value:true},{name:'No', value:false}];
                $scope.reports = ['Aprobado', 'En Observación', 'Desaprobado'];
            };
            $scope.save = function () {
                if (typeof $scope.projectEditing.fechaDeAlta != 'string' && $scope.projectEditing.fechaDeAlta != undefined) {
                    $scope.projectEditing.fechaDeAlta = $scope.projectEditing.fechaDeAlta.toJSON();
                }
                if (typeof $scope.projectEditing.fechaDeBaja != 'string' && $scope.projectEditing.fechaDeBaja != undefined) {
                    $scope.projectEditing.fechaDeBaja = $scope.projectEditing.fechaDeBaja.toJSON();
                }
                $scope.projectSaved  = false;
                projectService.save($stateParams.idConvocatory, $scope.projectEditing, onProjectSaved);
            };
            var loadConvocatories = function () {
                    convocatoryService.getConvocatories(refreshConvocatories);
                },
                refreshConvocatories = function (convocatories) {
                    $scope.convocatories = convocatories;
                    $scope.$apply();
                },
                loadParametrics = function () {
                parametricService.getParametrics(refreshParametrics);
                }, 
                refreshParametrics = function (parametrics) {
                $scope.parametrics = parametrics;
                },
                isAddingANewProject=function () {
                return $stateParams.idProject == undefined;
                },
                setProjectsToEdit = function (project) {
                    if (typeof project.fechaDeAlta === 'string') {
                        project.fechaDeAlta = new Date(project.fechaDeAlta);
                    }
                    if (typeof project.fechaDeBaja === 'string') {
                        project.fechaDeBaja = new Date(project.fechaDeBaja);
                    }
                    $scope.projectEditing = project;
                },
                onProjectSaved = function () {
                    $scope.projectSaved = true;
                    if(isAddingANewProject()) {
                        $stateParams.idProject = $scope.projectEditing.id;
                        projectService.getProject($stateParams.idConvocatory, $scope.projectEditing.id, setProjectsToEdit);
                    }
                    $scope.$apply();
                };
            $scope.setup();
        }
    ]);

angular.module('Projects')
    .controller('projects.otherProducts', ['$scope', 'projectService','$stateParams',
        function ($scope, projectService, $stateParams) {
            $scope.setup = function()
            {
                $scope.binaryProductSeletions = [{name:'Si', value:true},{name:'No', value:false}];
                $scope.productTypes = [{name:'Artículo', value:'article'},{name:'Ponencia', value:'lecture'}, {name:'Parte de Libro', value:'bookPart'}];
                $scope.origins = [{name:'Nacional', value:'national'},{name:'Internacional', value:'international'}];
                $scope.productType = null;
                $scope.productEditing = {};
                $scope.productEditingExisting = false;
                $scope.productSaved = false;
            };
            $scope.addNewProduct = function () {
                projectService.addProduct($stateParams.idConvocatory, $scope.projectEditing, $scope.productEditing, onProductUpdated);
            };
            $scope.deleteProduct = function (product) {
                projectService.removeProduct($stateParams.idConvocatory, $scope.projectEditing, product);
            };
            $scope.edit = function(product)
            {
                $scope.productSaved = false;
                $scope.productEditing = angular.copy(product);
                $scope.productEditingExisting = true;
            };
            
            $scope.permissionToSave = function () {
                $scope.productSaved  = false;
                $scope.$apply();
            }
            var onProductUpdated = function () {
                $scope.productSaved  = true;
                $scope.productEditingExisting = false;
                $scope.productEditing = {id: null};
                $scope.$apply();
            };

           
            $scope.setup();
        }
    ]);

    angular.module('Projects')
    .controller('projects.participantes', ['$scope','projectService','$stateParams',
        function ($scope,projectService,$stateParams) {
            $scope.setup = function()
            {
                $scope.cuilRegExpr = '^\\d{2}\\d{8}\\d{1}$';
                $scope.participanteSaved = false;
                $scope.participanteEditing = {cuilCuit: null};
                $scope.participanteEditingExisting = false;
            };
            $scope.agregarParticipante = function(){

                projectService.agregarParticipante($stateParams.idConvocatory,$scope.projectEditing, $scope.participanteEditing, onParticipanteUpdated);
            };
            $scope.eliminarParticipante = function(participante){
                projectService.eliminarParticipante($stateParams.idConvocatory,$scope.projectEditing, participante)
            };
            $scope.editParticipante = function(participante)
            {
                $scope.participanteSaved = false;
                $scope.participanteEditing = angular.copy(participante);
                $scope.participanteEditingExisting = true;
            };
            var onParticipanteUpdated = function () {
                $scope.participanteSaved = true;
                $scope.participanteEditingExisting = false;
                $scope.participanteEditing = {id: null};
                $scope.$apply();
            }
        }
    ]);