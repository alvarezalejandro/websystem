'use strict';

angular.module('Researchers')
    .controller('researchers.new', ['$scope', '$stateParams', 'researcherService','parametricService',
        function ($scope, $stateParams, researcherService, parametricService) {
            $scope.setup = function () {
                $scope.isAddingANewResearcher = isAddingANewResearcher();
                $scope.age = '';
                if (isAddingANewResearcher()) {
                    $scope.researcherEditing = {
                        id: null,
                        profilePhoto: null,
                        formations: null,
                        positions: null
                    };
                } else {
                    researcherService.getResearcher($stateParams.id, setResearchersToEdit);
                }
                $scope.researcherSaved = false;
                $scope.cuilRegExpr = '^\\d{2}\\d{8}\\d{1}$';
                loadParametrics();
            }
            $scope.save = function () {
                if (typeof $scope.birthday !== 'string') {
                    $scope.researcherEditing.birthday = $scope.researcherEditing.birthday.toJSON();
                }
                $scope.researcherSaved = false;
                researcherService.save($scope.researcherEditing, onResearcherSaved);
            }

            $scope.secretaryshipDepartmentChanged = function()
            {
                $scope.positionEditing.career = null;
                $scope.positionEditing.subject = null;
            }

            $scope.careerChanged = function()
            {
                $scope.positionEditing.subject = null;
            }

            $scope.addNewResearcher = function () {
                $scope.researcherSaved=false;
                $stateParams.id = undefined;
                $scope.setup();
            };

            $scope.refreshAge = function(){
                var today = new Date(Date.now());
                $scope.age ='';
                if($scope.researcherEditing.birthday){
                    var age = today.getFullYear() - $scope.researcherEditing.birthday.getFullYear();
                    $scope.age = age+" años";
                }
            }

            var onResearcherSaved = function () {
                $scope.researcherSaved = true;
                if(isAddingANewResearcher())
                {
                    $stateParams.id = $scope.researcherEditing.id;
                    researcherService.getResearcher($scope.researcherEditing.id, setResearchersToEdit);
                }
                else
                {
                    $scope.$apply();
                }
            }
            var setResearchersToEdit = function (researcher) {
                $scope.researcherEditing = researcher;
                if (typeof $scope.researcherEditing.birthday === 'string') {
                    $scope.researcherEditing.birthday = new Date($scope.researcherEditing.birthday);
                }
                $scope.refreshAge();
            }

            var loadParametrics = function () {
                parametricService.getParametrics(refreshParametrics);
            }
            var refreshParametrics = function (parametrics) {
                $scope.parametrics = parametrics;
            }

            var isAddingANewResearcher=function () {
                return $stateParams.id == undefined;
            }

            $scope.setup();
        }
    ]);


angular.module('Researchers')
    .controller('researchers.personalData', ['$scope', 'researcherService',
        function ($scope,  researcherService) {
            $scope.setup = function () {
                $scope.uploadProfilePhotoIndicator = {percentageCompleted: 0, completed: true};
                $scope.researchersList = {};
                $scope.isNewDni = true;
                loadResearchers();
            }
            var loadResearchers = function () {
                    researcherService.getResearchers(refreshResearchers);
                },
                refreshResearchers = function (researchers) {
                    if (researchers == null || Object.keys(researchers).length == 0) {
                        $scope.researchersList = null;
                    } else {
                        $scope.researchersList = researchers;
                    }
                };
            $scope.dniValidation = function(dni){
                $scope.isNewDni = true;
                for (var key in $scope.researchersList) {
                    if($scope.researchersList[key].dni == dni){
                        $scope.isNewDni = false;
                    }
                }
            };
            $scope.setProfilePhoto = function (file) {
                if (file) {
                    $scope.uploadProfilePhotoIndicator.completed = false;
                    researcherService.setProfilePhoto($scope.researcherEditing, file, $scope.uploadProfilePhotoIndicator,
                        onProfilePhotoUpdated, onUploadingProfilePhotoError);
                }
            };

            var onProfilePhotoUpdated = function () {
                    $scope.uploadProfilePhotoIndicator = {percentageCompleted: 0, completed: true};
                    $scope.$apply();
                },
                onUploadingProfilePhotoError = function (error) {
                    console.log(error);
                };
        }
    ]);

angular.module('Researchers')
    .controller('researchers.formation', ['$scope','researcherService',
        function ($scope, researcherService) {
            $scope.setup = function()
            {
                $scope.formationSaved = false;
                $scope.studiesStates = [{name:'En curso', value:false},{name:'Terminado', value:true}];
                $scope.categorizationUniversities=["I","II","III","IV","V"];
                $scope.formationEditing = {id: null};
                $scope.formationEditingExisting = false;
            }
            $scope.addNewFormation = function () {
                researcherService.addFormation($scope.researcherEditing, $scope.formationEditing, onFormationUpdated);
            };
            $scope.cancelEdition = function () {
                $scope.formationEditingExisting = false;
                $scope.formationEditing = {id: null};
            };
            $scope.edit = function(formation)
            {
                $scope.formationSaved = false;
                $scope.formationEditing = angular.copy(formation);
                $scope.formationEditingExisting = true;
            }
            $scope.deleteFormation = function (formation) {
                researcherService.removeFormation($scope.researcherEditing, formation);
            }
            $scope.degreeAreaChanged = function () {
                $scope.formationEditing.career = null;
            }
            $scope.tipoDeFormacionChanged = function () {
                $scope.formationEditing.gradoDeTitulacion = null
            }
            var onFormationUpdated = function () {
                    $scope.formationSaved = true;
                    $scope.formationEditingExisting = false;
                    $scope.formationEditing = {id: null};
                    $scope.$apply();
                }
        }
    ]);

angular.module('Researchers')
    .controller('researchers.idUndav', ['$scope', 'researcherService', 'parametricService',
        function ($scope, researcherService, parametricService) {
            $scope.setup = function()
            {
                parametricService.getParametrics(refreshEducationParametrics);
                $scope.fechaRegExpr = '^\\d{1,2}-\\d{1,2}-\\d{4}$';
                $scope.positionEditing = {id: null};
                $scope.positionSaved = false;
                $scope.licenses = [{name:'Si', value:true},{name:'No', value:false}];
                $scope.positionEditingExisting = false;
                prepareDatePositionsToShow();
            }
            $scope.cancelEdition = function () {
                $scope.positionEditingExisting = false;
                $scope.positionEditing = {id: null};
            };
            $scope.addNewPosition = function () {
                if($scope.positionEditing.highInTheInstitution!= undefined) {
                    if (typeof $scope.positionEditing.highInTheInstitution !== 'string') {
                        $scope.positionEditing.highInTheInstitution = $scope.positionEditing.highInTheInstitution.toJSON();
                    }
                }
                if($scope.positionEditing.terminationDate!= undefined) {
                    if (typeof $scope.positionEditing.terminationDate !== 'string') {
                        $scope.positionEditing.terminationDate = $scope.positionEditing.terminationDate.toJSON();
                    }
                }
                if($scope.positionEditing.license == 'false')
                {
                    $scope.positionEditing.licenseDate = null;
                    $scope.positionEditing.resolution = null;
                }
                researcherService.addPosition($scope.researcherEditing, $scope.positionEditing, onPositionUpdated);
            };

            $scope.permissionToSave = function (position, flag) {
                var isDisabled=false;
                $scope.positionSaved = false;
                if(flag!='3'){
                    if(position.secretaryshipDepartment==null
                        || position.career ==null
                        || position.subject==null
                        || position.positionType==null
                        || position.idDedication ==null
                        || position.typeOfRecruitment ==null){
                        isDisabled = true;
                    }
                }
                if(flag=='3'){
                    if(position.positionType==null
                        || position.idDedication ==null
                        || position.typeOfRecruitment ==null){
                        isDisabled = true;
                    }
                }
                return isDisabled;
            };

            $scope.edit = function(position)
            {
                $scope.positionSaved = false;
                $scope.positionEditing = angular.copy(position);
                $scope.positionEditingExisting = true;
                if (typeof $scope.positionEditing.highInTheInstitution === 'string') {
                    $scope.positionEditing.highInTheInstitution = new Date($scope.positionEditing.highInTheInstitution);
                }
                if (typeof $scope.positionEditing.terminationDate === 'string') {
                    $scope.positionEditing.terminationDate = new Date($scope.positionEditing.terminationDate);
                }
            }
            
            $scope.deletePosition = function (position) {
                researcherService.removePosition($scope.researcherEditing, position);
            }
            var onPositionUpdated = function () {
                    $scope.positionSaved = true;
                    $scope.positionEditingExisting = false;
                    $scope.positionEditing = {id: null};
                    prepareDatePositionsToShow();
                    $scope.$apply();
                },
                refreshEducationParametrics = function(parametrics)
                {
                    $scope.positionTypes = parametrics.positionType;
                    $scope.modalities = parametrics.modality;
                    $scope.idDedications = parametrics.idDedication;
                },
                prepareDatePositionsToShow = function () {
                    for(var position in $scope.researcherEditing.positions){
                        if (typeof $scope.researcherEditing.positions[position].highInTheInstitution === 'string') {
                            $scope.researcherEditing.positions[position].highInTheInstitution = new Date($scope.researcherEditing.positions[position].highInTheInstitution);
                        }
                        if (typeof $scope.researcherEditing.positions[position].terminationDate === 'string') {
                            $scope.researcherEditing.positions[position].terminationDate = new Date($scope.researcherEditing.positions[position].terminationDate);
                        }
                    }
                }
            $scope.setup();
        }
    ]);

angular.module('Researchers')
    .controller('researchers.list', ['$scope', '$filter', 'researcherService', 'parametricService', function($scope, $filter, researcherService, parametricService) {
        $scope.setup = function () {
            $scope.firstTime = true;
            $scope.filteredResearchers = [];
            $scope.pages = [];
            loadResearchers();
            loadParametrics();
            $scope.readOnlyMode = false;
            $scope.currentPage = 0;
            $scope.pageSize = 10;
            $scope.search();
        };


        $scope.search= function(){
                var items = $filter('toArray')($scope.researchers);
                $scope.filteredResearchers = $filter('filter')(items, $scope.searchText);
                if(items.length != $scope.filteredResearchers.length)
                {
                    configPages($scope.filteredResearchers);
                }
        };

        $scope.setPage = function(index) {
            $scope.currentPage = index - 1;
        };
        $scope.exportCSVFile = function (headers, items, fileTitle) {
            var itemsFormatted = [];
            items.forEach((item) => {
                itemsFormatted.push({
                    name : item.name,
                    surname : item.surname,
                    gender : item.gender === 'male' ? 'hombre' : 'mujer',
                    titulo : item.titulo,
                    areaDeFormacion : item.areaDeFormacion
                });
            });

            var jsonObject = JSON.stringify(itemsFormatted);
        
            var csv = convertToCSV(jsonObject);
        
            var exportedFilename = fileTitle + '.csv' || 'export.csv';
        
            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, exportedFilename);
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", exportedFilename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        };
        var loadResearchers = function () {
            researcherService.getResearchers(refreshResearchers);
        },
        refreshResearchers = function(researchers){
           if(researchers == null || Object.keys(researchers).length==0){
               $scope.researchers = null;
           }else{
               $scope.researchers = researchers;
               $scope.filteredResearchers = $filter('toArray')(researchers);
               configPages((Object.keys($scope.researchers)));
           }
           if($scope.firstTime)
           {
               $scope.$apply();
               $scope.firstTime = false;
           }
        },
        loadParametrics = function () {
            parametricService.getParametrics(refreshParametrics);
        },
        refreshParametrics = function (parametrics) {
            $scope.parametrics = parametrics;
            $scope.positionTypes = parametrics.positionType;
        },
        convertToCSV = function (objArray) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';
        
            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','
        
                    line += array[i][index];
                }
        
                str += line + '\r\n';
            }
        
            return str;
        },        
        configPages = function(items) {
            $scope.pages.length = 0;
            var ini = $scope.currentPage - 4;
            var fin = $scope.currentPage + 5;
            if($scope.researchers != null || $scope.researchers != undefined){
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

angular.module('Researchers')
    .controller('researchers.view', ['$scope', '$stateParams', 'researcherService','parametricService',
        function ($scope, $stateParams, researcherService, parametricService) {
            $scope.setup = function () {
                $scope.readOnlyMode = true;
                researcherService.getResearcher($stateParams.id, setResearchersToEdit);
                loadParametrics();
            };
            var setResearchersToEdit = function (researcher) {
                $scope.researcherEditing = researcher;
                if (typeof $scope.researcherEditing.birthday === 'string') {
                    $scope.researcherEditing.birthday = new Date($scope.researcherEditing.birthday);
                }
            };
            var loadParametrics = function () {
                parametricService.getParametrics(refreshParametrics);
            };
            var refreshParametrics = function (parametrics) {
                $scope.parametrics = parametrics;
                $scope.positionTypes = parametrics.positionType;
            }
        }
    ]);
